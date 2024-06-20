/*
Sources
https://study.physics.itmo.ru/pluginfile.php/4260/mod_resource/content/6/%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B0%D0%B1%D0%BE%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BD%D0%BE%D0%B9%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%204.07.pdf
*/
function intensive(splitsNumber, splitWidth, period, waveLength, rad) {
    const alpha = (Math.PI * splitWidth * Math.sin(rad)) / waveLength;
    const beta = (Math.PI * period * Math.sin(rad)) / waveLength;

    return (Math.sin(splitsNumber * beta) / Math.sin(beta)) ** 2 * (Math.sin(alpha) / alpha) ** 2;
}

function countGraphData(splitsNumber, splitWidth, period, waveLength, endAngle, stepCount) {
    const step = endAngle * 2 / stepCount;
    let intensiveData = [];
    let angleData = [];

    for (let rad = -endAngle; rad <= endAngle; rad += step) {
        intensiveData.push(intensive(splitsNumber, splitWidth, period, waveLength, rad));
        angleData.push(rad);
    }

    return {intensiveData, angleData};
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


function drawLines(intensiveData, angleData, waveLength, endAngle) {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const minX = -endAngle;
    const maxX = endAngle;
    const maxIntensity = Math.max(...intensiveData);

    const container = canvas.parentNode;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    for (let i = 0; i < intensiveData.length; ++i) {
        const normalizedX = (angleData[i] - minX) / (maxX - minX);
        const lineX = normalizedX * canvas.width;
        const color = waveLengthToRgb(waveLength, Math.abs(intensiveData[i] / maxIntensity));

        ctx.beginPath();
        ctx.moveTo(lineX, 0);
        ctx.lineTo(lineX, canvas.height);

        ctx.lineWidth = 0.1;
        ctx.strokeStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
        ctx.stroke();
    }
}

function drawGraph(intensiveData, angleData) {
    const intensiveGraphData = {
        x: angleData,
        y: intensiveData,
        mode: 'lines',
        hovertemplate: '<b>I(r)</b>: %{y}<extra></extra>',
    };

    const layout = {
        xaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Angle }\\Theta, rad$'
        },
        yaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Intensity }\\frac{I}{I_0}, \\frac{W}{m^2}$'
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
        splitsNumber: 2,
        splitWidth: 0.001,
        period: 0.005,
        waveLength: 500 * 1e-9,
        endAngle: 0.001,
        stepCount: 100000
    };

    const {
        intensiveData,
        angleData
    } = countGraphData(
        defaultGraphData.splitsNumber,
        defaultGraphData.splitWidth,
        defaultGraphData.period,
        defaultGraphData.waveLength,
        defaultGraphData.endAngle,
        defaultGraphData.stepCount
    );

    drawGraph(intensiveData, angleData);
    drawLines(intensiveData, angleData, defaultGraphData.waveLength, defaultGraphData.endAngle);
}

drawDefaultGraphs();