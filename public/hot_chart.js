var hot_option = {
    animation: false,
    tooltip: {},
    grid: {
        // right: 140,
        // left: 40
    },
    xAxis: {
        // type: 'value',
        min: '0',
        max: '360',
        type: 'category',
        // data: xData
    },
    yAxis: {
        // type: 'value',
        type: 'category',
        axisLabel: {
            show: false, // 不显示坐标轴上的文字
        },
        splitLine: {
            show: false
        },
    },
    visualMap: {
        show: false,
        type: 'piecewise',
        // min: 0,
        // max: 1,
        // left: 'right',
        // top: 'center',
        calculable: false,
        realtime: false,
        splitNumber: 8,
        inRange: {
            color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
            ]
        }
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
var G_Hot_chart_sig_num = 100;

// 更新热力图
function refreshHotChart() {
    let list = []
    console.log("refreshHotChart,状态:", window.G_page_type)
    if (window.G_page_type === 'sample') {
        list = window.G_signal_list
    } else {//查看
        if (window.G_data_sublist.length === 0) {
            window.G_data_sublist = window.G_signal_list
        }
        list = window.G_data_sublist
    }
    if (list === undefined || list.length === 0) {
        return
    }
    let len = G_Hot_chart_sig_num
    let c_min = 99999999;
    let c_max = 0;
    let data_list = []
    let idx_key = "c" + (window.G_selectedChannelIdx + 1)
    for (let j = 0; j < list.length; j++) {
        let p = list[j]['phase'];
        let c = list[j][idx_key]
        if (c) {
            data_list.push([p, c])
            c_min = Math.min(c_min, c)
            c_max = Math.max(c_max, c)
        }
    }
    let matrix = new Array(len)

    let x_sig = 360 / len;
    let y_sig = (c_max - c_min) / len
    for (let i = 0; i < len; i++) {
        matrix[i] = new Array(len).fill(0)
    }
    for (let i = 0; i < data_list.length; i++) {
        let p = data_list[i][0]
        let c = data_list[i][1]
        if (c === undefined || c == null || c == 0) {
            continue
        }
        let x_idx = Math.min(Math.trunc(p / x_sig), len - 1)
        let y_idx = Math.min(Math.trunc((c - c_min) / y_sig), len - 1)
        let new_c = matrix[x_idx][y_idx] + c
        matrix[x_idx][y_idx] = new_c
    }
    // console.log("cacl matrix", matrix)
    let chart_data = []
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (matrix[i][j] <= 0) {
                continue
            }
            let pha_v = i * x_sig;
            let c_v = c_min + j * y_sig
            chart_data.push([pha_v.toFixed(0), c_v.toFixed(1), matrix[i][j]])
        }
    }
    // console.log("chart_data", chart_data)
    hot_echarts.setOption({
        series: [
            {
                data: chart_data
            }
        ]
    });
}
