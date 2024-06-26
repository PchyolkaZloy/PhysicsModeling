/*
https://scask.ru/c_book_s_phis1.php?id=59
https://en.wikipedia.org/wiki/Beat_(acoustics)
 */

function countFluctuationSumAmplitude(firstFreq, secondFreq, amplitude, time) {
    return 2 * amplitude * Math.cos((firstFreq - secondFreq) * time / 2);
}

function countFluctuationSum(firstFreq, secondFreq, amplitude, fluctuationAmplitude, time) {
    return fluctuationAmplitude * Math.cos((firstFreq + secondFreq) * time / 2);
}

function checkDiffFrequencies(firstFrequency, secondFrequency) {
    const diff = Math.abs(firstFrequency - secondFrequency);
    return diff < firstFrequency && diff < secondFrequency;
}

function countGraphData(firstFreq, secondFreq, amplitude, endTime, stepCount) {
    const step = endTime / stepCount;

    let fluctuationSumData = [];
    let fluctuationSumAmplData = [];
    let timeData = [];

    for (let time = 0; time <= endTime; time += step) {
        fluctuationSumAmplData.push(countFluctuationSumAmplitude(firstFreq, secondFreq, amplitude, time));
        fluctuationSumData.push(countFluctuationSum(
            firstFreq, secondFreq, amplitude, fluctuationSumAmplData[fluctuationSumAmplData.length - 1], time));

        timeData.push(time);
    }

    return {fluctuationSumData, fluctuationSumAmplData, timeData};
}


function drawGraph(graphData) {
    const {
        fluctuationSumData,
        fluctuationSumAmplData,
        timeData
    } = countGraphData(
        graphData.firstFrequency,
        graphData.secondFrequency,
        graphData.amplitude,
        graphData.endTime,
        graphData.stepCount
    );

    const fluctuationSumGraphData = {
        x: timeData,
        y: fluctuationSumData,
        mode: 'lines',
        name: "$x(t)$",
        hovertemplate: '<b>x(t)</b>: %{y}<extra></extra>',
    };

    const fluctuationSumAmplitudePlusGraphData = {
        x: timeData,
        y: fluctuationSumAmplData,
        mode: 'lines',
        name: "$\\text{beat amplitude}$",
        line: {
            color: 'blue',
        },
        hoverinfo: 'none',
    };

    const fluctuationSumAmplitudeMinusGraphData = {
        x: timeData,
        y: fluctuationSumAmplData.map(ampl => -ampl),
        mode: 'lines',
        name: "$\\text{beat amplitude}$",
        line: {
            color: 'blue',
        },
        hoverinfo: 'none',
    };

    const layout = {
        title: {
            text: `$\\text{Beat (addition) of oscillations}$`,
        },

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
            l: 35,
            r: 25,
            t: 25,
            b: 50,
        },

        showlegend: true,
        legend: {
            font: {
                family: 'Arial, serif',
                size: 16,
                color: 'black',
            },
            x: 1,
            xanchor: 'right',
            y: 0,
        },

    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot('graph',
        [
            fluctuationSumGraphData,
            fluctuationSumAmplitudePlusGraphData,
            fluctuationSumAmplitudeMinusGraphData
        ],
        layout, config);
}


function drawDefaultGraph() {
    const defaultGraphData = {
        firstFrequency: 10,
        secondFrequency: 8,
        amplitude: 1,
        endTime: 10,
        stepCount: 10000
    };

    drawGraph(defaultGraphData);
}

drawDefaultGraph();