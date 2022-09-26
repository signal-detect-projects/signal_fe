// 流动柱状图
// 热力图
var phases_arr = []
for (var i = 0; i <= 360; i++) {
    phases_arr.push(i)
}
var bar_data_2 = []
let last_x = 0
for (var i = 0; i < 20; i++) {
    if (i > 0) {
        last_x = last_x + Math.round(Math.random() * 10)
    }
    bar_data_2.push([last_x, Math.round(Math.random() * 360), Math.round(Math.random() * 50 + 100)])
}

var sin_data = []
for (var i = 0; i < 360; i++) {
    sin_data.push([0, i, 150 * Math.sin(i / 180 * Math.PI)])
}


var bar_option = {
    tooltip: {},
    // visualMap: {
    //     max: 20,
    //     inRange: {
    //         color: [
    //             '#313695',
    //             '#4575b4',
    //             '#74add1',
    //             '#abd9e9',
    //             '#e0f3f8',
    //             '#ffffbf',
    //             '#fee090',
    //             '#fdae61',
    //             '#f46d43',
    //             '#d73027',
    //             '#a50026'
    //         ]
    //     }
    // },
    xAxis3D: {
        name: '时间',
        // type: 'category',
        type: 'time',
        nameTextStyle: {
            fontSize: 14
        },
        min: 'dataMin',
        max: 'dataMax',
        axisLabel: {
            show: false, // 不显示坐标轴上的文字
        },
        splitArea: {
            show: true
        }

    },
    yAxis3D: {
        name: '相位',
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
        name: '峰值',
        type: 'value',
        nameTextStyle: {
            fontSize: 14
        },
        min: 0,
        max: 'dataMax',
    },
    grid3D: {
        boxWidth: 200,//x轴
        boxDepth: 150,//y轴
        boxHeight: 50,
        viewControl: {
            // projection: 'orthographic',
            distance: 300,
            // autoRotate: false,
            // rotateSensitivity: 0,
            // zoomSensitivity: 0,
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
                borderWidth: 1
            },
            shading: 'lambert',
            // emphasis: {
            //     label: {
            //         fontSize: 20,
            //         color: '#900'
            //     },
            //     itemStyle: {
            //         color: '#900'
            //     }
            // }
        },
        // {
        //     type: 'line3D',
        //     data: sin_data.map(function (item) {
        //         return {
        //             value: [0, item[1], item[2]]
        //         };
        //     }),
        // },
    ]
};

var bar_echarts = echarts.init(document.getElementById('bar_chart'), null, {renderer: 'canvas'});
bar_echarts.setOption(bar_option);

var G_bar_left_t = 0 //
var G_bar_left_idx = 0//记录每一帧最左边的下标
var G_bar_timeout = 1000 //刷新每一帧的interval;
var G_bar_speed = 5 //每秒向左边走多少 秒的距离
var G_bar_data = []//全局 的 bar data
var G_bar_x_len = 60//x轴横跨的时间范围

function barMove() {
    let tmp_data = []
    G_bar_left_t = G_bar_left_t + G_bar_speed * G_bar_timeout;
    let bar_right_t = G_bar_left_t + G_bar_x_len * 1000
    // console.log('bar_right_t', bar_right_t)
    for (let i = G_bar_left_idx; i < G_bar_data.length; i++) {
        if (G_bar_data[i]['ts'] > bar_right_t) {
            break;
        }
        if (G_bar_data[i]['ts'] >= G_bar_left_t) {
            tmp_data.push(G_bar_data[i])
        }
    }
    if (tmp_data.length === 0) {
        console.log("bar 无新数据")
        return
    }
    G_bar_left_idx = tmp_data[0]['idx']
    // console.log("bar+0", G_bar_left_t, bar_right_t)
    // console.log("=====", tmp_data[0]['ts'], tmp_data[tmp_data.length - 1]['ts'])

    bar_echarts.setOption({
        xAxis3D: {
            min: "'" + G_bar_left_t + "'",
            max: "'" + bar_right_t + "'",
        },
        series: [
            {
                data: tmp_data
            }
        ]
    })
}

function refresh3DBar() {
    let list = []
    console.log("refresh3DBar,状态:", window.G_page_type)
    if (window.G_page_type === 'sample') {
        list = window.G_signal_list
    } else {//查看
        if (window.G_data_sublist.length === 0) {
            window.G_data_sublist = window.G_signal_list
        }
        list = window.G_data_sublist
    }
    if (list.length === 0) {
        return;
    }
    let channelIdx = window.G_selectedChannelIdx;
    let channel_key = 'c' + (channelIdx + 1);

    let gap_arr = []
    for (let i = 1; i < list.length; i++) {
        let big = list[i]['ts']
        let small = list[i - 1]['ts']
        let gap_len = big - small
        if (gap_len > 10) {
            gap_len = 2
        }
        gap_arr.push(gap_len)
    }
    let res_data = []
    let last_ts = list[0]['ts']
    for (let i = 0; i < list.length; i++) {
        let item = list[i]
        let phase = item['phase']
        let c_value = item[channel_key]
        let t_value = 0
        if (i === 0) {
            t_value = item['ts']
        } else {
            t_value = last_ts + gap_arr[i - 1]
        }
        last_ts = t_value;
        res_data.push({
            idx: i,
            ts: item['ts'],
            value: [t_value, phase, c_value]
        })
    }
    G_bar_data = res_data
    G_bar_left_t = res_data[0]['ts']
    G_bar_left_idx = 0
    // console.log("G_idx", G_bar_left, G_bar_right)
    // console.log(res_data)
    let bar_data = []
    let bar_right_t = G_bar_left_t + G_bar_x_len * 1000

    for (let i = G_bar_left_idx; i < G_bar_data.length; i++) {
        if (G_bar_data[i]['ts'] > bar_right_t) {
            break;
        }
        bar_data.push(res_data[i])
    }

    bar_echarts.setOption({
        xAxis3D: {
            min: "'" + G_bar_left_t + "'",
            max: "'" + bar_right_t + "'",
        },
        series: [
            {
                data: bar_data
            }
        ]
    })
    setInterval("barMove()", G_bar_timeout)
}


