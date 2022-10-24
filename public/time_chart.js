// 分时图相关

var time_echarts = echarts.init(document.getElementById('time_echarts'), null, {renderer: 'canvas'});

var last_brushed_flag = false

var G_time_chart_color = [
    ['rgba(255, 153, 0,1)', 'rgba(255, 153, 0,0.2)'],
    ['rgba(0,0,255,1)', 'rgba(0,0,255,0.2)'],
    ['rgba(255,0,0,1)', 'rgba(255,0,0,0.2)'],
    // ['rgba(0,255,0,1)', 'rgba(0,255,0,0.2)'], 四通道被禁用，只有一个颜色
    ['rgba(0,255,0,0.2)', 'rgba(0,255,0,0.2)'],
]

var selected_channel_index = 0;
var time_chart_option = {
    animation: true,
    toolbox: {
        show: false,
    },
    brush: {
        // xAxisIndex: "all",
        brushLink: "all",
        // 设置框选样式
        brushStyle: {
            borderWidth: 1,
            color: 'rgba(120,140,180,0.3)',
            borderColor: 'rgba(0,0,0,.65)'
        },
        xAxisIndex: 4,
        yAxisIndex: 4,
    },
    grid: [
        {
            top: '10%',
            height: '20%',
            width: '100%'
        }, {
            top: '30%',
            height: '20%',
            width: '100%'
        }, {
            top: '50%',
            height: '20%',
            width: '100%'
        }, {
            top: '70%',
            height: '20%',
            width: '100%'
        },
        {
            top: '10%',
            height: '80%',
            width: '100%',
            z: 10
        }
    ],
    xAxis: [
        {
            type: 'time',
            min: 'dataMin',
            show: true,
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
            },
            gridIndex: 0
        }, {
            type: 'time',
            min: 'dataMin',
            show: true,
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
            },
            gridIndex: 1
        }, {
            type: 'time',
            min: 'dataMin',
            show: true,
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
            },
            gridIndex: 2
        }, {
            type: 'time',
            min: 'dataMin',
            show: true,
            gridIndex: 3
        }, {
            type: 'time',
            min: 'dataMin',
            show: false,
            gridIndex: 4
        },
    ],
    dataZoom: [
        {
            type: 'inside',
            xAxisIndex: "all",
            minValueSpan: 1000 * 40,
        },
    ],
    yAxis: [
        {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
            },
            show: true,
            gridIndex: 0,
            max: 'dataMax',
        },
        {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
            },
            show: true,
            gridIndex: 1,
            max: 'dataMax',
        }, {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
            },
            show: true,
            gridIndex: 2,
            max: 'dataMax',
        }, {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
            },
            show: true,
            gridIndex: 3,
            max: 'dataMax',
        }, {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
            },
            show: true,
            gridIndex: 4
        },
    ],

    series: [
        {
            name: 'data1',
            type: 'line',
            showSymbol: false,
            data: [],
            xAxisIndex: 0,
            yAxisIndex: 0,
            lineStyle: {
                color: G_time_chart_color[0][0]
            }
        }, {
            name: 'data2',
            type: 'line',
            showSymbol: false,
            data: [],
            xAxisIndex: 1,
            yAxisIndex: 1,
            emphasis: {
                focus: 'series'
            },
            lineStyle: {
                color: G_time_chart_color[1][1]
            }
        }, {
            name: 'data3',
            type: 'line',
            showSymbol: false,
            data: [],
            xAxisIndex: 2,
            yAxisIndex: 2,
            lineStyle: {
                color: G_time_chart_color[2][1]
            }
        }, {
            name: 'data4',
            type: 'line',
            showSymbol: false,
            data: [],
            xAxisIndex: 3,
            yAxisIndex: 3,
            lineStyle: {
                color: G_time_chart_color[3][1]
            }
        }, {
            name: 'data5',
            type: 'line',
            showSymbol: false,
            data: [],
            xAxisIndex: 4,
            yAxisIndex: 4,
        }
    ]

};
time_echarts.setOption(time_chart_option);
// 点击通道
time_echarts.getZr().on('click', param => {
    console.log("进入click")
    if (last_brushed_flag && window.G_page_type === 'see') {
        console.log("重置下方图数据为全部")
        window.G_data_sublist = window.G_catfilter_sublist;
        window.refresh_stat_data(window.G_data_sublist);
        window.refresh3DBar();
        window.refreshHotChart();
        last_brushed_flag = false
        return
    }
    var list = [param.offsetX, param.offsetY]
    var index = 0
    console.log('有效点击', param)
    // 判断点击的坐标在不在坐标系内
    while (!time_echarts.containPixel({gridIndex: index}, list) && index < 4) {
        index++
    }
    // 如果 index > 3, 说明点击的是空白区域
    if (index > 3) {
        console.log("点击空白")
        return
    }
    console.log("点击通道", index)

    window.G_selectedChannelIdx = index;

    let series_color = []
    for (let i = 0; i < 4; i++) {
        let color = G_time_chart_color[i][1];
        if (index === i) {
            color = G_time_chart_color[i][0];
        }
        series_color.push({
            lineStyle: {
                color: color
            }
        })
    }
    time_echarts.setOption({
        series: series_color
    });
    // 点击相同通道，不处理
    if (index === selected_channel_index) {
        console.log("点击相同通道", index, "不处理")
        return;
    }
    //window.refresh3DBar()
    window.refreshHotChart()
    selected_channel_index = index
})

//这里设置鼠标指针

// 清除刷子
function clear_time_chart_brush() {
    time_echarts.dispatchAction({
        type: 'brush',
        command: 'clear',
        areas: [],
    })
}

function renderBrushed(params) {
    console.log('brushend触发', params)
    last_brushed_flag = true;
    if (params['areas'] === undefined || params['areas'].length === 0) {
        return
    }
    console.log("有效brushEnd")
    var time_arr = params['areas'][0]['coordRange']

    var start = new Date(time_arr[0]).Format('yyyy-MM-dd hh:mm:ss')
    var end = new Date(time_arr[1]).Format('yyyy-MM-dd hh:mm:ss')

    let start_ts = time_arr[0]
    let end_ts = time_arr[1]

    let new_sub_list = []
    for (let i = 0; i < window.G_catfilter_sublist.length; i++) {
        let it = window.G_catfilter_sublist[i];
        if (it['ts'] > end_ts) {
            break
        }
        if (it['ts'] >= start_ts) {
            new_sub_list.push(it)
        }
    }
    window.G_data_sublist = new_sub_list;
    window.refresh_stat_data(window.G_data_sublist);
    console.log("renderBrushed 修改 G_data_sublist,范围", start, end)
    console.log("G_catfilter_sublist 长度", window.G_catfilter_sublist.length, "G_data_sublist长度", window.G_data_sublist.length)
    window.refresh3DBar();
    window.refreshHotChart();
}

time_echarts.on('brushEnd', renderBrushed); //圈选结束后的回调


var one_duration = 10 * 1000

function refresh_time_chart() {
    console.log("refresh_time_chart()")
    let list = []
    if (window.G_page_type === 'sample') {
        list = window.G_signal_list
    } else if (window.G_page_type === 'see') {
        list = window.G_catfilter_sublist
    }
    if (list === undefined || list.length === 0) {
        time_echarts.setOption({
            series: [
                {
                    data: []
                }, {
                    data: []
                },
                {
                    data: []
                },
                {
                    data: []
                }, {
                    data: []
                },
            ]
        });
        return;
    }
    let last_time = new Date(list[0]['ts'])
    let next_ts = last_time.getTime() + one_duration
    let c_arr = [0, 0, 0, 0]
    let time_list = [[], [], [], []]
    let left_data = false;//是否有残留数据
    for (let j = 0; j < list.length; j++) {
        let item = list[j]
        if (item['ts'] > next_ts) {
            for (let i = 0; i < 4; i++) {
                time_list[i].push({
                    name: last_time.toString(),
                    value: [
                        last_time,
                        c_arr[i]
                    ]
                })
            }
            left_data = false;
            c_arr = [0, 0, 0, 0]
            last_time = new Date(next_ts)
            next_ts = last_time.getTime() + one_duration
        }
        let crr = [item['c1'], item['c2'], item['c3'], item['c4']]
        for (let i = 0; i < 4; i++) {
            if (crr[i]) {
                c_arr[i] = c_arr[i] + window.fixC(crr[i])
            }
        }
        left_data = true;
    }
    if (left_data) {
        for (let i = 0; i < 4; i++) {
            time_list[i].push({
                name: last_time.toString(),
                value: [
                    last_time,
                    c_arr[i]
                ]
            })
        }
    }
    let data_5_list = []
    for (let i = 0; i < time_list[0].length; i++) {
        let it = time_list[0][i]
        data_5_list.push({
            name: it['name'],
            value: [
                it['value'][0], null
            ]
        })
    }
    // console.log(time_list)
    time_echarts.setOption({
        series: [
            {
                data: time_list[0]
            }, {
                data: time_list[1]
            },
            {
                data: time_list[2]
            },
            {
                data: time_list[3]
            }, {
                data: data_5_list
            },
        ]
    });
}


