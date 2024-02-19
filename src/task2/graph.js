/**
 * @source https://en.wikipedia.org/wiki/Helmholtz_coil
 * @type {number}
 */
const magneticConst = 1.257 * Math.PI * Math.pow(10, -6)

let graphData = {
    R: 1,
    I: 1,
    amount: 10,
    dist: 1,
    xValues: [],
    bValues: []
}

function xsi(x) {
    return Math.pow(1 + Math.pow(x / graphData.R, 2), -1.5)
}

function magneticInduction(x) {
    return (magneticConst * graphData.amount * graphData.I) / (2 * graphData.R)
        * (xsi(x - graphData.R / 2) + xsi(x + graphData.R / 2))
}

function generateXArrayByDist(dist, stepCount) {
    return Array.from(
        {length: stepCount},
        (_, i) => -dist + 2 * dist * (i / (stepCount - 1)));
}

function count(stepCount) {
    graphData.xValues = generateXArrayByDist(graphData.dist, stepCount)
    graphData.bValues = graphData.xValues.map(x => {
        return magneticInduction(x)
    })
}

function drawGraph(formGraphData) {
    graphData.R = formGraphData.R
    graphData.I = formGraphData.I
    graphData.amount = formGraphData.amount
    graphData.dist = formGraphData.dist
    let stepCount = formGraphData.stepCount

    count(stepCount)

    const data = {
        x: graphData.xValues,
        y: graphData.bValues,
        mode: 'lines',
        type: 'scatter',
        name: 'Magnetic Induction B(x)'
    };

    const layout = {
        title: 'Magnetic Induction B(x) for Helmholtz Coils',
        yaxis: {title: 'Magnetic Induction (B)'}
    };

    Plotly.newPlot('graph', [data], layout);

    graphData.bValues = []
    graphData.xValues = []
}

let defaultGraphData = {
    R: 1,
    I: 1,
    amount: 10,
    dist: 10,
    stepCount: 10000
}

drawGraph(defaultGraphData)

/*
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
*/

