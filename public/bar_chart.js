// 流动柱状图
// 热力图
var sin_data = []
for (var i = 0; i < 360; i++) {
    sin_data.push([0, i, Math.sin(i / 180 * Math.PI)])
}


var phases_arr = []
for (var i = 0; i <= 360; i++) {
    phases_arr.push(i)
}

var G_bar_z_max = 200;

var bar_option = {
    tooltip: {
        show: false
    },
    animation: false,
    visualMap: {
        show: false,
        inRange: {
            color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#3da87b',
                '#145064',
                '#c0c061',
                '#91772c',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
            ]
        }
    },
    xAxis3D: {
        name: '',
        type: 'time',
        nameTextStyle: {
            fontSize: 14
        },
        // min: 'dataMin',
        // max: 'dataMax',
        axisLabel: {
            show: true, // 不显示坐标轴上的文字
            showMaxLabel: false,
            interval: 1,
            formatter: (value, index) => {
                if (index === 0 || index === 11) {
                    return '';
                }
                return Math.round((value - G_all_first_time) / 1000) + '';
            }
        },
        splitArea: {
            show: true
        }

    },
    yAxis3D: {
        name: '',
        type: 'value',
        data: phases_arr,
        nameTextStyle: {
            fontSize: 14
        },
        min: '0',
        max: '360',
        interval: 45
    },
    zAxis3D: {
        name: '',
        type: 'value',
        nameTextStyle: {
            fontSize: 14
        },
        axisLabel: {
            show: true, // 不显示坐标轴上的文字
            showMaxLabel: false,
            formatter: (value, index) => {
                if (value == 0) {
                    return ''
                }
                return value.toFixed(0);
            }
        },
        min: 0,
        max: 'dataMax',
    },
    grid3D: {
        boxWidth: 200,//x轴
        boxDepth: 150,//y轴
        boxHeight: 90,
        viewControl: {
            // projection: 'orthographic',
            distance: 290,
            autoRotate: false,
            // rotateSensitivity: 0,
            zoomSensitivity: 0,
            panSensitivity: 0
        },
        light: {
            main: {
                intensity: 1.2,
                shadow: true
            },
            ambient: {
                intensity: 0.3
            }
        },
        axisPointer: {
            show: false
        }
    },
    series: [
        {
            type: 'bar3D',
            barSize: 3,
            data: [],
            itemStyle: {
                opacity: 0.6
            },
            label: {
                fontSize: 16,
                borderWidth: 1,
                show: false
            },
            shading: 'lambert',
            emphasis: {
                label: {
                    show: false
                }
            }
        },
        {
            type: 'line3D',
            data: [],
            lineStyle: {
                // color: ' #95d475'
                color: [1, 1, 1, 1]
            },
        },
    ]
};

var bar_echarts = echarts.init(document.getElementById('bar_chart'), null, {renderer: 'canvas'});
bar_echarts.setOption(bar_option);

var G_bar_left_t = 0 // 下一帧蕞左边的时间
var G_bar_left_idx = 0//记录每一帧最左边的下标
var G_bar_right_idx = 0

var G_bar_timeout = 200 //刷新每一帧的interval;
var G_bar_speed = 1000 //每秒向左边走多少 秒的距离  2000/(1000/100)
var G_bar_data = []//全局 的 bar data
var G_bar_x_len = 20//x轴横跨的时间范围

var G_all_first_time = 0;//每一串的蕞左边的那个时间

var G_gap_change_threshold = 2000 //超过这个阈值，就缩小差距
var G_gap_change_v = 1000;

var G_setIntevalHandle = null

// 实时最新的 phase 偏移 和  通道
function barMove() {
    // console.log("barMove(),G_bar_right_idx", G_bar_right_idx, "G_bar_data.length", G_bar_data.length)
    //计算最大的C值
    G_bar_z_max = 200;
    let c_max = 0;
    let idx_key = "c" + (window.G_selectedChannelIdx + 1)
    const all_data_list = window.G_signal_list
    for (let j = 0; j < all_data_list.length; j++) {
        let c = all_data_list[j][idx_key]
        if (c) {
            c_max = Math.max(c_max, c)
        }
    }
    let tmp_data = []
    // //如果现在在 bar_right_t 右边暂时没有数据了，咱们就是说，先不动
    // if (G_bar_right_idx >= G_bar_data.length - 1) {
    //     console.log("右边没有更多数据，停止流动")
    //     // 没有新数据的情况下仍然要刷新，因为可能选择通道变了
    // } else {
    //
    // }
    let now_ts = new Date().getTime();
    if (window.G_page_type === 'see' || now_ts >= G_bar_left_t + G_bar_x_len * 1000) {
        //只有在 当前时间超过了最右边的范围，才往右走
        G_bar_left_t = G_bar_left_t + G_bar_speed / (1000 / G_bar_timeout);//delta*(1000/100) = speed
    }
    let bar_right_t = G_bar_left_t + G_bar_x_len * 1000

    for (let i = G_bar_left_idx; i < G_bar_data.length; i++) {
        if (G_bar_data[i]['ts'] > bar_right_t) {
            break;
        }
        let item = G_bar_data[i]
        let c_v = item['c_arr'][window.G_selectedChannelIdx];
        if (G_bar_data[i]['ts'] >= G_bar_left_t) {
            let fix_c = window.fixC(c_v)
            G_bar_z_max = Math.max(G_bar_z_max, fix_c);
            tmp_data.push({
                idx: item['idx'],
                ts: item['ts'],
                value: [item['ts'], window.fixPhase(item['phase']), fix_c]
            })
            G_bar_right_idx = i;
        }
    }
    if (tmp_data.length === 0) {
        console.log("bar 无新数据")
        return
    }
    G_bar_left_idx = tmp_data[0]['idx']

    //让动画更流畅
    tmp_data.unshift({
        value: [G_bar_left_t, 0, 0]
    })
    tmp_data.push({
        value: [bar_right_t, 360, 0]
    })

    //console.log("bar_echarts.setOption", new Date(G_bar_left_t).Format("yyyy-MM-dd hh:mm:ss"))
    // console.log("tmp_data", G_bar_left_t, bar_right_t, tmp_data)
    bar_echarts.setOption({
        xAxis3D: {
            min: "'" + G_bar_left_t + "'",
            max: "'" + bar_right_t + "'",
        },
        series: [
            {
                data: tmp_data
            },
            {
                data: sin_data.map(function (item) {
                    return {
                        value: [G_bar_left_t, item[1], G_bar_z_max * item[2]]
                    };
                }),
            },
        ]
    })
}


function clear_3d_bar_chart() {
    console.log("clear_3d_bar_chart")
    // if (G_setIntevalHandle !== undefined && G_setIntevalHandle != null) {
    console.log("clearInterval(G_setIntevalHandle)")
    clearInterval(G_setIntevalHandle)
    G_setIntevalHandle = null;
    // }
    bar_echarts.setOption({
        series: [
            {
                data: []
            }, {
                data: []
            }
        ],
    })
}

/**
 * 刷新图表，调用时机：
 * 1：采集的时候，第一次采集到数据调用
 * 2：查看的时候，
 */
function refresh3DBar() {
    G_bar_z_max = 200;
    if (G_setIntevalHandle !== undefined && G_setIntevalHandle != null) {
        clearInterval(G_setIntevalHandle)
        G_setIntevalHandle = null;
    }
    let list = []
    console.log("refresh3DBar被调用,状态:", window.G_page_type)
    if (window.G_page_type === 'sample') {
        list = window.G_signal_list
    } else {//查看
        if (window.G_data_sublist.length === 0) {
            window.G_data_sublist = window.G_catfilter_sublist
        }
        list = window.G_data_sublist
    }
    if (list.length === 0) {
        return;
    }
    G_all_first_time = list[0]['ts'];
    console.log("3d bar数据的长度", list.length)
    //缩小gap的逻辑
    // let gap_arr = []
    // for (let i = 1; i < list.length; i++) {
    //     let big = list[i]['ts']
    //     let small = list[i - 1]['ts']
    //     let gap_len = big - small
    //     if (gap_len >= G_gap_change_threshold) {
    //         gap_len = G_gap_change_v;
    //     }
    //     gap_arr.push(gap_len)
    // }
    let res_data = []
    let last_ts = list[0]['ts']
    for (let i = 0; i < list.length; i++) {
        let item = list[i]
        let phase = item['phase']
        let t_value = 0
        // if (i === 0) {
        //     t_value = item['ts']
        // } else {
        //     t_value = last_ts + gap_arr[i - 1]
        // }
        // last_ts = t_value;

        t_value = item['ts'];
        res_data.push({
            idx: i,
            ts: t_value,
            phase: phase,
            c_arr: [item['c1'], item['c2'], item['c3'], item['c4']],
        })
    }
    G_bar_data = res_data
    // G_bar_left_t = res_data[0]['ts']
    G_bar_left_t = G_all_first_time - G_bar_x_len * 1000
    G_bar_left_idx = 0
    // console.log("G_idx", G_bar_left, G_bar_right)
    // console.log(res_data)
    let tmp_data = []
    let bar_right_t = G_bar_left_t + G_bar_x_len * 1000
    for (let i = G_bar_left_idx; i < G_bar_data.length; i++) {
        if (G_bar_data[i]['ts'] > bar_right_t) {
            break;
        }
        let item = G_bar_data[i]
        let c_v = item['c_arr'][window.G_selectedChannelIdx];
        tmp_data.push({
            idx: item['idx'],
            ts: item['ts'],
            value: [item['ts'], window.fixPhase(item['phase']), window.fixC(c_v)]
        })
        G_bar_right_idx = i;
    }
    //让动画更流畅
    tmp_data.push({
        value: [bar_right_t, 360, 0]
    })

    bar_echarts.setOption({
        xAxis3D: {
            min: "'" + G_bar_left_t + "'",
            max: "'" + bar_right_t + "'",
        },
        visualMap: {
            min: 0,
            max: 2000
        },
        series: [
            {
                data: tmp_data
            }, {
                data: []
            }
        ],
    })
    G_setIntevalHandle = setInterval("barMove()", G_bar_timeout)
}

/**
 * 第一次添加数据的时候不能调
 * @param newData
 */
function addNewData2BarChart(newData) {
    console.log("addNewData2BarChart(newData)")
    // let gap_arr = []
    // for (let i = 1; i < newData.length; i++) {
    //     let big = newData[i]['ts']
    //     let small = newData[i - 1]['ts']
    //     let gap_len = big - small
    //     if (gap_len >= G_gap_change_threshold) {
    //         gap_len = G_gap_change_threshold
    //     }
    //     gap_arr.push(gap_len)
    // }
    // let first_ts = newData[0]['ts']
    // if (G_bar_data.length !== 0) {
    //     first_ts = G_bar_data[G_bar_data.length - 1]['ts'] + 2
    // }
    let last_ts = null;
    let old_g_bar_data_len = G_bar_data.length
    for (let i = 0; i < newData.length; i++) {
        let item = newData[i]
        let t_value = 0
        // if (i === 0) {
        //     t_value = first_ts
        // } else {
        //     t_value = last_ts + gap_arr[i - 1];
        // }
        t_value = item['ts']
        G_bar_data.push({
            idx: old_g_bar_data_len + i,
            ts: t_value,
            phase: item['phase'],
            c_arr: [item['c1'], item['c2'], item['c3'], item['c4']],
        })
        last_ts = t_value;
    }
}

