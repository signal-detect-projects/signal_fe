var hot_option = {
    animation: false,
    tooltip: {},
    grid: {
        // right: 140,
        // left: 40
    },
    xAxis: {
        min: '0',
        max: '360',
        type: 'category',
        interval: 45
        // data: xData
    },
    yAxis: {
        type: 'category',
        axisLabel: {
            show: true, // 不显示坐标轴上的文字
        },
        splitLine: {
            show: false
        },
    },
    visualMap: {
        show: false,
        // type: 'piecewise',
        type: 'continuous',
        min: 0,
        max: 50,
        // left: 'right',
        // top: 'center',
        calculable: true,
        realtime: false,
        splitNumber: 8,
        // inRange: {
        //     color: [
        //         '#313695',
        //         '#4575b4',
        //         '#74add1',
        //         '#abd9e9',
        //         '#e0f3f8',
        //         '#ffffbf',
        //         '#fee090',
        //         '#fdae61',
        //         '#f46d43',
        //         '#d73027',
        //         '#a50026'
        //     ]
        // }
    },
    series: [
        {
            name: '热力图',
            type: 'heatmap',
            data: [],
            emphasis: {
                itemStyle: {
                    borderColor: '#333',
                    borderWidth: 1
                }
            },
            progressive: 0
        }
    ],
};
var hot_echarts = echarts.init(document.getElementById('hot_chart'), null, {renderer: 'canvas'});
hot_echarts.setOption(hot_option);
var G_Hot_chart_sig_num = 50;
var G_Hot_numMax = 0

// 更新热力图
function refreshHotChart() {
    let list = []
    if (window.G_page_type === 'sample') {
        list = window.G_signal_list
    } else {//查看
        if (window.G_data_sublist.length === 0) {
            window.G_data_sublist = window.G_catfilter_sublist;
        }
        list = window.G_data_sublist
    }
    console.log("refreshHotChart,状态:", window.G_page_type, "数据长度", list.length);
    if (list === undefined || list.length === 0) {
        hot_echarts.setOption({
            series: [
                {
                    data: []
                }
            ]
        });
        return
    }
    //全局 的部分开始 >>>>>>>>>>>>>>>
    let len = G_Hot_chart_sig_num
    let c_min = 99999999;
    let c_max = 0;
    let idx_key = "c" + (window.G_selectedChannelIdx + 1)
    let all_data_list = window.G_signal_list
    for (let j = 0; j < all_data_list.length; j++) {
        let c = all_data_list[j][idx_key]
        if (c) {
            c = window.fixC(c);
            c_min = Math.min(c_min, c)
            c_max = Math.max(c_max, c)
        }
    }
    let x_data = []
    let y_data = []
    let x_sig = 360 / len;
    let y_sig = (c_max - c_min) / len
    for (let i = 0; i < len + 1; i++) {
        let pha_v = i * x_sig;
        let c_v = c_min + i * y_sig
        x_data.push(pha_v.toFixed(0))
        y_data.push(c_v.toFixed(1))
    }
    //全局 的部分结束 <<<<<<<<<<

    //初始化 matrix
    let matrix = new Array(len + 1)
    for (let i = 0; i < len + 1; i++) {
        matrix[i] = new Array(len + 1).fill(0)
    }
    for (let i = 0; i < list.length; i++) {
        let p = window.fixPhase(list[i]['phase']);
        let c = list[i][idx_key]
        if (c === undefined || c == null || c == 0) {
            continue
        }
        c = window.fixC(c)
        let x_idx = Math.trunc(p / x_sig)
        let y_idx = Math.trunc((c - c_min) / y_sig)
        matrix[x_idx][y_idx] = matrix[x_idx][y_idx] + 1
    }
    let chart_data = []
    for (let i = 0; i < len + 1; i++) {
        for (let j = 0; j < len + 1; j++) {
            if (matrix[i][j] <= 0) {
                continue
            }
            chart_data.push([x_data[i], y_data[j], matrix[i][j]])
            G_Hot_numMax = Math.max(G_Hot_numMax, matrix[i][j])
        }
    }
    hot_echarts.setOption({
        xAxis: {
            data: x_data
        },
        yAxis: {
            data: y_data
        },
        visualMap: {
            min: 0,
            max: G_Hot_numMax
        },
        series: [
            {
                data: chart_data
            }
        ]
    });
}
