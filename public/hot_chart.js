var sin_data_2 = []
for (var i = 0; i <= 360; i++) {
    sin_data_2.push([i, Math.sin(i / 180 * Math.PI)])
}

var hot_option = {
    animation: false,
    tooltip: {
        show: false
    },
    grid: [{
        top: '15%',
        // right: 140,
        // left: 40
        bottom: 28
    }, {
        top: '15%',
        width: '90%',
    }],
    xAxis: [{
        min: '0',
        name: "相位(度)",
        max: '360',
        type: 'category',
        interval: 45,
        gridIndex: 0
        // data: xData
    }, {
        type: 'value',
        gridIndex: 1,

        // splitLine: {
        //     show: false
        // },
        // axisLabel: {
        //     show: false, // 不显示坐标轴上的文字
        // },
        show: false,
    }],
    yAxis: [{
        type: 'category',
        name: "幅值(mV)",
        axisLabel: {
            show: true, // 不显示坐标轴上的文字
            formatter: (value, index) => {
                var num = Number(value).toFixed(0);
                if (num > 10000) {
                    return "";
                }
                return num + "";
            }
        },
        splitLine: {
            show: false
        },

    }, {
        type: 'value',
        gridIndex: 1,
        show: false,
    }],
    visualMap: {
        show: false,
        // type: 'piecewise',
        type: 'continuous',
        // min: 0,
        // max: 10,
        // left: 'right',
        // top: 'center',
        calculable: true,
        realtime: false,
        splitNumber: 20,
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
                    borderWidth: 0
                }
            },
            xAxisIndex: 0,
            yAxisIndex: 0,
            progressive: 0
        }, {
            type: 'line',
            data: [],
            xAxisIndex: 1,
            yAxisIndex: 1,
            showSymbol: false,
            lineStyle: {
                color: 'black',
                opacity: 0.2
            }
        }
    ],
};
var hot_echarts = echarts.init(document.getElementById('hot_chart'), null, {renderer: 'canvas'});
hot_echarts.setOption(hot_option);
var G_Hot_chart_sig_num = 360;
var G_Hot_numMax = 0


function updateHotChartUnit(unit) {
    hot_echarts.setOption({
        yAxis: [{
            name: '幅值(' + unit + ')'
        }]
    });
}

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
    //构造横轴 y轴
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
    let xy_set = new Set();
    for (let i = 0; i < list.length; i++) {
        let p = window.fixPhase(list[i]['phase']);
        let c = list[i][idx_key]
        if (c === undefined || c == null || c == 0) {
            continue
        }
        c = window.fixC(c)
        let x_idx = Math.trunc(p / x_sig)
        let y_idx = Math.trunc((c - c_min) / y_sig)
        xy_set.add(x_idx + ',' + y_idx);
        matrix[x_idx][y_idx] = matrix[x_idx][y_idx] + 1
    }
    //对附近的进行加权
    let nei_factor = 0.5;
    let nei_len = 5;

    let tmp_matrix = new Array(len + 1)
    for (let i = 0; i < len + 1; i++) {
        tmp_matrix[i] = new Array(len + 1).fill(0)
    }
    xy_set.forEach((value, key) => {
        let str_arr = value.split(",")
        let x_idx = Number(str_arr[0])
        let y_idx = Number(str_arr[1])

        let x_min = Math.max(0, x_idx - nei_len);
        let x_max = Math.min(x_idx + nei_len, len);

        let y_min = Math.max(0, y_idx - nei_len);
        let y_max = Math.min(len, y_idx + nei_len);
        for (let i = x_min; i <= x_max; i++) {
            for (let j = y_min; j <= y_max; j++) {
                tmp_matrix[x_idx][y_idx] += matrix[i][j]
            }
        }
    });
    matrix = tmp_matrix;


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
        xAxis: [{
            data: x_data
        }, {
            data: x_data
        }],
        yAxis: [{
            data: y_data
        }],
        visualMap: {
            min: 0,
            max: G_Hot_numMax
        },
        series: [
            {
                data: chart_data
            },
            {
                data: sin_data_2
            }
        ]
    });
}
