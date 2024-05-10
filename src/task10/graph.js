/*
Sources
https://sites.ualberta.ca/~pogosyan/teaching/PHYS_130/FALL_2010/lectures/lect36/lecture36.html
https://lampz.tugraz.at/~hadley/physikm/outline/formulas.en.php
https://en.wikipedia.org/wiki/Double-slit_experiment
https://www.youtube.com/watch?v=Wbttrnz7ft4
*/


function intensive(alpha, beta) {
    return (Math.cos(beta) ** 2) * ((Math.sin(alpha)) / (alpha)) ** 2;
}

function countGraphData(
    waveLength, lensRadius, lensRefractiveIndex, betweenRefractiveIndex, plateRefractiveIndex, endRadius, stepCount
) {
    const step = endRadius / stepCount;
    let intensiveData = [];
    let radiusData = [];

    for (let radius = 0; radius <= endRadius; radius += step) {
        intensiveData.push();
        radiusData.push(radius);
    }

    return {intensiveData, radiusData};
}

function drawGraph(graphData) {
    const {
        intensiveData,
        radiusData
    } = countGraphData(
        graphData.waveLength,
        graphData.lensRadius,
        graphData.lensRefractiveIndex,
        graphData.betweenRefractiveIndex,
        graphData.plateRefractiveIndex,
        graphData.endRadius,
        graphData.stepCount
    );

    const intensiveGraphData = {
        x: radiusData,
        y: intensiveData,
        mode: 'lines',
        hovertemplate: '<b>I(r)</b>: %{y}<extra></extra>',
    };

    const layout = {
        xaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Radius }r, m$'
        },
        yaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Normalized intensity }I$'
        },
        margin: {
            l: 65,
            r: 25,
            t: 25,
        },
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot('graph', [intensiveGraphData], layout, config);
}

function drawDefaultGraph() {
    defaultGraphData = {
        waveLength: 500 * 1e-9,
        lensRadius: 1,
        lensRefractiveIndex: 1,
        betweenRefractiveIndex: 1,
        plateRefractiveIndex: 1,
        endRadius: 0.002,
        stepCount: 10000
    };

    drawGraph(defaultGraphData);
}

drawDefaultGraph();