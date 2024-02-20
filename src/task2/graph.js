/**
 * @source https://en.wikipedia.org/wiki/Helmholtz_coil
 * @source1 https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D0%B3%D0%BD%D0%B8%D1%82%D0%BD%D0%B0%D1%8F_%D0%BF%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%BD%D0%B0%D1%8F
 * @type {number}
 */
const magneticConst = 1.256637 * Math.PI * Math.pow(10, -6)

let graphData = {
    R: 0,
    I: 0,
    turnsAmount: 0,
    dist: 0,
    xValues: [],
    bValues: [],
    b1Values: [],
    b2Values: []
}

function xsi(x) {
    return Math.pow(1 + Math.pow(x / graphData.R, 2), -1.5)
}

function magneticInduction1(x) {
    return (magneticConst * graphData.turnsAmount * graphData.I) / (2 * graphData.R) * xsi(x - graphData.R / 2)
}

function magneticInduction2(x) {
    return (magneticConst * graphData.turnsAmount * graphData.I) / (2 * graphData.R) * xsi(x + graphData.R / 2)
}

function generateXArrayByDist(dist, stepCount) {
    return Array.from(
        {length: stepCount},
        (_, i) => -dist + 2 * dist * (i / (stepCount - 1)));
}

function count(stepCount) {
    graphData.xValues = generateXArrayByDist(graphData.dist, stepCount)
    for (let i = 0; i < graphData.xValues.length; i++) {
        graphData.b1Values.push(magneticInduction1(graphData.xValues[i]))
        graphData.b2Values.push(magneticInduction2(graphData.xValues[i]))
        graphData.bValues.push(graphData.b1Values[i] + graphData.b2Values[i])
    }
}

function drawGraph(formGraphData) {
    graphData.R = formGraphData.R
    graphData.I = formGraphData.I
    graphData.turnsAmount = formGraphData.turnsAmount
    graphData.dist = formGraphData.dist
    let pointsCount = formGraphData.pointsCount

    count(pointsCount)

    const dataB = {
        x: graphData.xValues,
        y: graphData.bValues,
        mode: 'lines',
        type: 'scatter',
        name: '$B(x)$'
    };

    const dataB1 = {
        x: graphData.xValues,
        y: graphData.b1Values,
        mode: 'lines',
        type: 'scatter',
        name: '$B_{1}(x)$'
    };

    const dataB2 = {
        x: graphData.xValues,
        y: graphData.b2Values,
        mode: 'lines',
        type: 'scatter',
        name: '$B_{2}(x)$'
    };

    const layout = {
        title: {
            text: '$\\text{Magnetic Induction } B(x) \\text{ for Helmholtz Coils}$',
            font: {
                size: 20
            }
        },
        yaxis: {
            title: {
                text: '$\\text{Magnetic Induction } B, T$',
                font: {
                    size: 20
                }
            }
        },
        xaxis: {
            title: {
                text: '$\\text{Distance } X, m$',
                font: {
                    size: 20
                }
            }
        },
        margin: {
            l: 85,
            r: 50,
            t: 85
        },
        showlegend: true,
        legend: {
            font: {
                size: 18,
            },
            x: 1,
            y: 0.5,
        },
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    }

    Plotly.newPlot('graph', [dataB, dataB1, dataB2], layout, config);

    graphData.bValues = []
    graphData.xValues = []
    graphData.b1Values = []
    graphData.b2Values = []
}

let defaultGraphData = {
    R: 0.5,
    I: 1,
    turnsAmount: 10,
    dist: 0.5,
    pointsCount: 10000
}

drawGraph(defaultGraphData)

let graphDiv = document.getElementById('graph');

function resizePlot() {
    Plotly.relayout(graphDiv,
        {
            width: graphDiv.offsetWidth,
            height: graphDiv.offsetHeight
        });
}

window.addEventListener('DOMContentLoaded', resizePlot);
window.addEventListener('resize', resizePlot);

