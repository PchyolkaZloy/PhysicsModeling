/*
Sources
https://study.physics.itmo.ru/pluginfile.php/4244/mod_resource/content/14/%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B0%D0%B1%D0%BE%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BD%D0%BE%D0%B9%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%204.03.pdf
https://en.wikipedia.org/wiki/Fresnel_equations
https://pchz.notion.site/2-9b8f874a4c784666802b4790137f81fb?pvs=4
*/


function fresnelCoeffR(n1, n2) {
    return ((n2 - n1) / (n2 + n1)) ** 2;
}

function fresnelCoeffT(n1, n2) {
    return (4 * n1 * n2) / ((n2 + n1) ** 2);
}


function opticalDifference1(lensRadius, radius, betweenRefractiveIndex, waveLength) {
    return 2 * (lensRadius - Math.sqrt(lensRadius ** 2 - radius ** 2)) * betweenRefractiveIndex + waveLength / 2;
}

function opticalDifference2(lensRadius, radius, betweenRefractiveIndex) {
    return 2 * (lensRadius - Math.sqrt(lensRadius ** 2 - radius ** 2)) * betweenRefractiveIndex;
}

function intensive(
    waveLength,
    lensRadius,
    lensRefractiveIndex,
    betweenRefractiveIndex,
    plateRefractiveIndex,
    radius,
    R12, R23, T12, T21) {
    if (betweenRefractiveIndex > plateRefractiveIndex) {
        return R12 + T12 * R23 * T21 + 2 * Math.sqrt(R12 * R23 * T12 * T21) *
            Math.cos(2 * Math.PI * opticalDifference2(lensRadius, radius, betweenRefractiveIndex) / waveLength);
    }

    // lensRefractiveIndex > betweenRefractiveIndex && plateRefractiveIndex > betweenRefractiveIndex
    return R12 + T12 * R23 * T21 + 2 * Math.sqrt(R12 * R23 * T12 * T21) *
        Math.cos(2 * Math.PI * opticalDifference1(lensRadius, radius, betweenRefractiveIndex, waveLength) / waveLength);
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

function waveLengthToRgb(wavelength, gamma) {
    const waveLen = wavelength / 1e-9;

    if (380 <= waveLen && waveLen <= 440) {
        return {r: 0.5 * gamma, g: 0, b: 0.5 * gamma};
    } else if (440 <= waveLen && waveLen <= 490) {
        return {r: 0, g: 0, b: 1.0};
    } else if (490 <= waveLen && waveLen <= 510) {
        return {r: 0.0, g: gamma, b: gamma};
    } else if (510 <= waveLen && waveLen <= 580) {
        return {r: 0, g: gamma, b: 0.0};
    } else if (580 <= waveLen && waveLen <= 645) {
        return {r: gamma, g: 0.5 * gamma, b: 0};
    } else if (645 <= waveLen && waveLen <= 770) {
        return {r: gamma, g: 0.0, b: 0.0};
    } else {
        return {r: gamma, g: gamma, b: gamma};
    }
}


function drawRings(intensiveData, radiusData, waveLength, endRadius, stepCount) {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const container = canvas.parentNode;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;


    const maxIntensity = Math.max(...intensiveData);
    const canvasRadius = canvas.height / 2;

    for (let i = 0; i < intensiveData.length; ++i) {
        const color = waveLengthToRgb(waveLength, Math.abs(intensiveData[i] / maxIntensity));
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2,
            canvasRadius * (radiusData[i] / endRadius),
            0, 2 * Math.PI);

        ctx.lineWidth = 0.1;
        ctx.strokeStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
        ctx.stroke();
    }
}

function drawGraph(intensiveData, radiusData) {
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

function drawDefaultGraphs() {
    const defaultGraphData = {
        waveLength: 500 * 1e-9,
        lensRadius: 1,
        lensRefractiveIndex: 1.5,
        betweenRefractiveIndex: 1,
        plateRefractiveIndex: 1.5,
        endRadius: 0.002,
        stepCount: 10000
    };

    const {
        intensiveData,
        radiusData
    } = countGraphData(
        defaultGraphData.waveLength,
        defaultGraphData.lensRadius,
        defaultGraphData.lensRefractiveIndex,
        defaultGraphData.betweenRefractiveIndex,
        defaultGraphData.plateRefractiveIndex,
        defaultGraphData.endRadius,
        defaultGraphData.stepCount
    );

    drawGraph(intensiveData, radiusData);
    drawRings(intensiveData, radiusData, defaultGraphData.waveLength, defaultGraphData.endRadius, defaultGraphData.stepCount);
}

drawDefaultGraphs();