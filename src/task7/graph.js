/*
https://scask.ru/c_book_s_phis1.php?id=59
https://en.wikipedia.org/wiki/Beat_(acoustics)
 */

function countFluctuationSumAmplitude(amplitude, dw, time) {
    return 2 * amplitude * Math.cos(dw * time / 2);
}

function countFluctuationSum(frequency, dw, amplitude, time) {
    return 2 * amplitude * Math.cos((frequency + dw / 2) * time) * Math.cos(dw * time / 2);
}


function countGraphData(frequency, dw, amplitude, endTime, stepCount) {
    const step = endTime / stepCount;

    let fluctuationSumData = [];
    let fluctuationSumAmplitudeData = [];
    let timeData = [];

    for (let time = 0; time <= endTime; time += step) {
        fluctuationSumData.push(countFluctuationSum(frequency, dw, amplitude, time));
        fluctuationSumAmplitudeData.push(countFluctuationSumAmplitude(amplitude, dw, time));

        timeData.push(time);
    }

    return {fluctuationSumData, fluctuationSumAmplitudeData, timeData};
}


function drawGraph(graphData) {
    const {
        fluctuationSumData,
        fluctuationSumAmplitudeData,
        timeData
    } = countGraphData(
        graphData.frequency,
        graphData.dw,
        graphData.amplitude,
        graphData.endTime,
        graphData.stepCount
    );

    const fluctuationSumAmplitudeMinusData = fluctuationSumAmplitudeData.map(ampl => -ampl);

    const fluctuationSumGraphData = {
        x: timeData,
        y: fluctuationSumData,
        mode: 'lines',
        name: "$x(t)$",
        hovertemplate: '<b>x(t)</b>: %{y}<extra></extra>',
    };

    const fluctuationSumAmplitudePlusGraphData = {
        x: timeData,
        y: fluctuationSumAmplitudeData,
        mode: 'lines',
        line: {
            color: 'blue',
        },
        hoverinfo: 'none',
    };

    const fluctuationSumAmplitudeMinusGraphData = {
        x: timeData,
        y: fluctuationSumAmplitudeMinusData,
        mode: 'lines',
        line: {
            color: 'blue',
        },
        hoverinfo: 'none',
    };

    const layout = {
        xaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$X$'
        },

        margin: {
            l: 65,
            r: 25,
            t: 25,
        },

        showlegend: false,
    };


    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot('graph',
        [fluctuationSumGraphData, ],
        layout, config);
}


function drawDefaultGraph() {
    const defaultGraphData = {
        frequency: 1,
        dw: 10,
        amplitude: 1,
        endTime: 10,
        stepCount: 10000
    };

    drawGraph(defaultGraphData);
}

drawDefaultGraph();