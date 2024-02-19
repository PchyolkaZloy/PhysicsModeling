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
    bValues: []
}

function xsi(x) {
    return Math.pow(1 + Math.pow(x / graphData.R, 2), -1.5)
}

function magneticInduction(x) {
    return (magneticConst * graphData.turnsAmount * graphData.I) / (2 * graphData.R)
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
    graphData.turnsAmount = formGraphData.turnsAmount
    graphData.dist = formGraphData.dist
    let pointsCount = formGraphData.pointsCount

    count(pointsCount)

    const data = {
        x: graphData.xValues,
        y: graphData.bValues,
        mode: 'lines',
        type: 'scatter',
        name: 'Magnetic Induction B(x)'
    };

    const layout = {
        title: 'Magnetic Induction B(x) for Helmholtz Coils',
        autosize: true,
        yaxis: {
            title: 'Magnetic Induction B, T',
        },
        xaxis: {
            title: 'Distance X, m',
        },
        margin: {
            l: 50,
            r: 50,
        },
        /*showlegend: true,
        legend: {
            font: {
                family: 'Arial, serif',
                size: 18,
                color: 'black',
            },
            x: 1,
            y: 0.5,
        },*/
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    }

    Plotly.newPlot('graph', [data], layout, config);

    graphData.bValues = []
    graphData.xValues = []
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

