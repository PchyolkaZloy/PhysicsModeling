/*
Sources
https://sites.ualberta.ca/~pogosyan/teaching/PHYS_130/FALL_2010/lectures/lect36/lecture36.html
https://lampz.tugraz.at/~hadley/physikm/outline/formulas.en.php
https://en.wikipedia.org/wiki/Double-slit_experiment
https://www.youtube.com/watch?v=Wbttrnz7ft4
*/

function alpha(waveLength, slitWidth, x, refractiveIndex, lengthToScreen) {
    return (Math.PI * slitWidth / (waveLength / refractiveIndex)) * Math.sin(x / lengthToScreen);
}

function beta(waveLength, slitSpace, x, refractiveIndex, lengthToScreen) {
    return (Math.PI * slitSpace / (waveLength / refractiveIndex)) * Math.sin(x / lengthToScreen);
}

function intensive(alpha, beta) {
    return (Math.cos(beta) ** 2) * ((Math.sin(alpha)) / (alpha)) ** 2;
}

function countGraphData(waveLength, refractiveIndex, slitSpace, slitWidth, lengthToScreen, viewRadius, stepCount) {
    const step = viewRadius * 2 / stepCount;
    let intensiveData = [];
    let xData = [];

    for (let x = -viewRadius; x <= viewRadius; x += step) {
        intensiveData.push(intensive(
            alpha(waveLength, slitWidth, x, refractiveIndex, lengthToScreen),
            beta(waveLength, slitSpace, x, refractiveIndex, lengthToScreen)));
        xData.push(x);
    }

    return {intensiveData, xData};
}

function drawGraph(graphData) {
    const {
        intensiveData,
        xData
    } = countGraphData(
        graphData.waveLength,
        graphData.refractiveIndex,
        graphData.slitSpace,
        graphData.slitWidth,
        graphData.lengthToScreen,
        graphData.viewRadius,
        graphData.stepCount
    );


    const intensiveGraphData = {
        x: xData,
        y: intensiveData,
        mode: 'lines',
        hovertemplate: '<b>I(x)</b>: %{y}<extra></extra>',
    };

    const layout = {
        xaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Position }x, m$'
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
        refractiveIndex: 1,
        slitSpace: 0.005,
        slitWidth: 0.001,
        lengthToScreen: 1,
        viewRadius: 0.002,
        stepCount: 10000
    };

    drawGraph(defaultGraphData);
}

drawDefaultGraph();