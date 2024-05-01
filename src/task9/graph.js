/*
Sources
https://sites.ualberta.ca/~pogosyan/teaching/PHYS_130/FALL_2010/lectures/lect36/lecture36.html
https://en.wikipedia.org/wiki/Double-slit_experiment
https://www.youtube.com/watch?v=Wbttrnz7ft4
*/

function degreeToRadian(degree) {
    return degree * Math.PI / 180;
}

function alpha(waveLength, slitWidth, angle, refractiveIndex) {
    return (Math.PI * slitWidth / (waveLength / refractiveIndex)) * Math.sin(angle);
}

function beta(waveLength, slitSpace, angle, refractiveIndex) {
    return (Math.PI * slitSpace / (waveLength / refractiveIndex)) * Math.sin(angle);
}

function intensive(alpha, beta) {
    return (Math.cos(beta) ** 2) * ((Math.sin(alpha)) / (alpha)) ** 2;
}

function countGraphData(waveLength, refractiveIndex, slitSpace, slitWidth, endAngle, stepCount) {
    const step = endAngle / stepCount;
    let intensiveData = [];
    let angleData = [];

    for (let angle = -endAngle / 2; angle <= endAngle / 2; angle += step) {
        let radianAngel = degreeToRadian(angle);
        intensiveData.push(
            intensive(
                alpha(waveLength, slitWidth, radianAngel, refractiveIndex),
                beta(waveLength, slitSpace, radianAngel, refractiveIndex)));
        angleData.push(angle);
    }

    return {intensiveData, angleData};
}

function drawGraph(graphData) {
    const {
        intensiveData,
        angleData
    } = countGraphData(
        graphData.waveLength,
        graphData.refractiveIndex,
        graphData.slitSpace,
        graphData.slitWidth,
        graphData.endAngle,
        graphData.stepCount
    );


    const intensiveGraphData = {
        x: angleData,
        y: intensiveData,
        mode: 'lines',
        hovertemplate: '<b>I(Th)</b>: %{y}<extra></extra>',
    };

    const layout = {
        xaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Angle }\\Theta, deg$'
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
        slitSpace: 0.05,
        slitWidth: 0.01,
        endAngle: 0.01,
        stepCount: 10000
    };

    drawGraph(defaultGraphData);
}

drawDefaultGraph();