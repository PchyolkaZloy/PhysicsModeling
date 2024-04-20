/*
https://en.wikipedia.org/wiki/Amplitude_modulation
https://www.pd.isu.ru/method/rtcs/Theory/spectrumam.htm
*/

function countSignal(amplitude, frequency, time) {
    return amplitude * Math.cos(2 * Math.PI * frequency * time);
}

function countModulation(messageAmplitude, carrierSignal, messageSignal) {
    return (1 + messageSignal / messageAmplitude) * carrierSignal;
}

function countSpectrum(messageFrequency, carrierFrequency, messageAmplitude, carrierAmplitude, time) {
    return carrierAmplitude * Math.cos(2 * Math.PI * carrierFrequency * time) +
        messageAmplitude / 2 * (
            Math.cos(2 * Math.PI * time * (carrierFrequency + messageFrequency)) +
            Math.cos(2 * Math.PI * time * (carrierFrequency - messageFrequency))
        )
}

function countGraphData(messageFrequency, carrierFrequency, messageAmplitude, carrierAmplitude, stepCount) {
    const periodAmount = 5;
    const endTime = 1 / Math.min(messageFrequency, carrierFrequency) * periodAmount;
    const step = endTime / stepCount;

    let carrierSignalData = [];
    let messageSignalData = [];
    let modulationData = [];
    let spectrumData = [];

    let timeData = [];
    let index = 0;

    for (let time = 0; time < endTime; time += step) {
        carrierSignalData.push(countSignal(carrierAmplitude, carrierFrequency, time));
        messageSignalData.push(countSignal(messageAmplitude, messageFrequency, time));
        modulationData.push(countModulation(messageAmplitude, carrierSignalData[index], messageSignalData[index]));
        spectrumData.push(countSpectrum(messageFrequency, carrierFrequency, messageAmplitude, carrierAmplitude, time))
        timeData.push(time);
        ++index;
    }

    return {carrierSignalData, messageSignalData, modulationData, spectrumData, timeData};
}

function drawGraphs(graphData) {
    const {
        carrierSignalData,
        messageSignalData,
        modulationData,
        spectrumData,
        timeData
    } = countGraphData(
        graphData.messageFrequency,
        graphData.carrierFrequency,
        graphData.messageAmplitude,
        graphData.carrierAmplitude,
        graphData.stepCount
    );

    const carrierSignalGraphData = {
        x: timeData,
        y: carrierSignalData,
        mode: 'lines',
        name: "$c(t)$",
        hovertemplate: '<b>c(t)</b>: %{y}<extra></extra>',
        xaxis: 'x',
        yaxis: 'y',
    };

    const messageSignalGraphData = {
        x: timeData,
        y: messageSignalData,
        mode: 'lines',
        name: "$m(t)$",
        hovertemplate: '<b>m(t)</b>: %{y}<extra></extra>',
        xaxis: 'x2',
        yaxis: 'y2',
    };

    const modulationSignalGraphData = {
        x: timeData,
        y: modulationData,
        mode: 'lines',
        name: "$am(t)$",
        hovertemplate: '<b>am(t)</b>: %{y}<extra></extra>',
        xaxis: 'x3',
        yaxis: 'y3',
    };

    const spectrumGraphData = {
        x: timeData,
        y: spectrumData,
        mode: 'lines',
        name: "$s(t)$",
        hovertemplate: '<b>s(t)</b>: %{y}<extra></extra>',
        xaxis: 'x4',
        yaxis: 'y4',
    };

    const layout = {
        grid: {
            rows: 3,
            columns: 2,
            pattern: 'independent',
        },

        xaxis: {
            domain: [0, 0.5],
            exponentformat: 'power',
            showspikes: true,
        },
        yaxis: {
            domain: [0.7, 0.97],
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Amplitude } A$'
        },

        xaxis2: {
            domain: [0, 0.5],
            exponentformat: 'power',
            showspikes: true,
        },
        yaxis2: {
            domain: [0.35, 0.61],
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Amplitude } A$'
        },

        xaxis3: {
            domain: [0, 0.5],
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Time } t, sec$'
        },
        yaxis3: {
            domain: [0, 0.26],
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Amplitude } A$'
        },

        xaxis4: {
            domain: [0.55, 1],
            exponentformat: 'power',
            showspikes: true,
        },
        yaxis4: {
            domain: [0, 1],
            exponentformat: 'power',
            showspikes: true,
        },

        margin: {
            l: 65,
            r: 25,
            t: 25,
        },

        annotations: [
            {
                text: `$\\text{Carrier signal}, c(t)$`,
                font: {
                    size: 20,
                },
                showarrow: false,
                align: 'center',
                x: 0.2,
                y: 1,
                xref: 'paper',
                yref: 'paper',
            },
            {
                text: `$\\text{Message signal}, m(t)$`,
                font: {
                    size: 20,
                },
                showarrow: false,
                align: 'center',
                x: 0.2,
                y: 0.63,
                xref: 'paper',
                yref: 'paper',
            },
            {
                text: `$\\text{AM signal}, am(t)$`,
                font: {
                    size: 20,
                },
                showarrow: false,
                align: 'center',
                x: 0.2,
                y: 0.26,
                xref: 'paper',
                yref: 'paper',
            }
        ],
        showlegend: false,
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot('graph',
        [carrierSignalGraphData, messageSignalGraphData, modulationSignalGraphData, spectrumGraphData],
        layout, config);
}

function drawDefaultGraphs() {
    const defaultGraphData = {
        messageFrequency: 100,
        carrierFrequency: 10,
        messageAmplitude: 1,
        carrierAmplitude: 2,
        stepCount: 10000
    };

    drawGraphs(defaultGraphData);
}

drawDefaultGraphs();