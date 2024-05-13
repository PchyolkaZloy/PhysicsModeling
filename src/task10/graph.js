/*
Sources
https://study.physics.itmo.ru/pluginfile.php/4244/mod_resource/content/14/%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B0%D0%B1%D0%BE%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BD%D0%BE%D0%B9%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%204.03.pdf
https://en.wikipedia.org/wiki/Fresnel_equations
*/


function fresnelCoeffR(n1, n2) {
    return ((n2 - n1) / (n2 + n1)) ** 2;
}

function fresnelCoeffT(n1, n2) {
    return (4 * n1 * n2) / ((n2 + n1) ** 2);
}


function opticalDifference(lensRadius, radius, betweenRefractiveIndex, waveLength) {
    return 2 * (lensRadius - Math.sqrt(lensRadius ** 2 - radius ** 2)) * betweenRefractiveIndex + waveLength / 2;
}

function intensive(
    waveLength,
    lensRadius,
    lensRefractiveIndex,
    betweenRefractiveIndex,
    plateRefractiveIndex,
    radius,
    R12, R23, T12, T21) {
    return R12 + T12 * R23 * T21 + 2 * Math.sqrt(R12 * R23 * T12 * T21) * Math.cos(
        2 * Math.PI * opticalDifference(lensRadius, radius, betweenRefractiveIndex, waveLength) / waveLength);
}

function countGraphData(
    waveLength,
    lensRadius,
    lensRefractiveIndex,
    betweenRefractiveIndex,
    plateRefractiveIndex,
    endRadius,
    stepCount) {
    const step = endRadius / stepCount;
    let intensiveData = [];
    let radiusData = [];

    const R12 = fresnelCoeffR(lensRefractiveIndex, betweenRefractiveIndex);
    const R23 = fresnelCoeffR(betweenRefractiveIndex, plateRefractiveIndex);

    const T12 = fresnelCoeffT(lensRefractiveIndex, betweenRefractiveIndex);
    const T21 = fresnelCoeffT(betweenRefractiveIndex, lensRefractiveIndex);

    for (let radius = 0; radius <= endRadius; radius += step) {
        intensiveData.push(intensive(
            waveLength,
            lensRadius,
            lensRefractiveIndex,
            betweenRefractiveIndex,
            plateRefractiveIndex,
            radius,
            R12, R23, T12, T21));
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
            title: '$\\text{Intensity }I, \\frac{W}{m^2}$'
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
        lensRefractiveIndex: 1.5,
        betweenRefractiveIndex: 1,
        plateRefractiveIndex: 1.5,
        endRadius: 0.002,
        stepCount: 10000
    };

    drawGraph(defaultGraphData);
}

drawDefaultGraph();