/*
https://en.wikipedia.org/wiki/Amplitude_modulation
https://www.pd.isu.ru/method/rtcs/Theory/spectrumam.htm
*/

function countSignal(amplitude, frequency, time) {
    return amplitude * Math.cos(2 * Math.PI * frequency * time);
}

function countModulation(carrierAmplitude, carrierSignal, messageSignal) {
    return (1 + messageSignal / carrierAmplitude) * carrierSignal;
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
        modulationData.push(countModulation(carrierAmplitude, carrierSignalData[index], messageSignalData[index]));

        timeData.push(time);
        ++index;
    }

    spectrumData = countSpectrum(messageFrequency, carrierFrequency, messageAmplitude, carrierAmplitude);

    return {carrierSignalData, messageSignalData, modulationData, spectrumData, timeData};
}

function countSpectrum(messageFrequency, carrierFrequency, messageAmplitude, carrierAmplitude) {
    let spectrumData = {
        am_x: [],
        am_y: [],
        car_x: [],
        car_y: [],
        msg_x: [],
        msg_y: [],
        min_freq: 0,
        max_freq: 0
    };

    // Не считаю через fft, так как сигналы простые гармоничные и, проанализировав уравнения, вывел,
    // что спектр можно найти аналитически (разложить просто AM сигнал, используя тригонометрические преобразования)

    spectrumData.msg_x.push(messageFrequency);
    spectrumData.msg_y.push(messageAmplitude);

    spectrumData.car_x.push(carrierFrequency);
    spectrumData.car_y.push(carrierAmplitude);

    spectrumData.am_x.push(carrierFrequency - messageFrequency);
    spectrumData.am_y.push(messageAmplitude * 0.5);

    spectrumData.am_x.push(carrierFrequency);
    spectrumData.am_y.push(carrierAmplitude);

    spectrumData.am_x.push(carrierFrequency + messageFrequency);
    spectrumData.am_y.push(messageAmplitude * 0.5);

    // При условии, что частота msg меньшe car
    spectrumData.min_freq = Math.min(carrierFrequency - messageFrequency, messageFrequency);
    spectrumData.max_freq = carrierFrequency + messageFrequency;

    return spectrumData;
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
        xaxis: 'x2',
        yaxis: 'y2',
    };

    const messageSignalGraphData = {
        x: timeData,
        y: messageSignalData,
        mode: 'lines',
        name: "$m(t)$",
        hovertemplate: '<b>m(t)</b>: %{y}<extra></extra>',
        xaxis: 'x',
        yaxis: 'y',
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


    const layout1 = {
        grid: {
            rows: 3,
            columns: 2,
            pattern: 'independent',
        },

        xaxis: {
            domain: [0, 1],
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
            domain: [0, 1],
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
            domain: [0, 1],
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

        margin: {
            l: 65,
            r: 25,
            t: 25,
        },

        annotations: [
            {
                text: `$\\text{Message signal}, c(t)$`,
                font: {
                    size: 20,
                },
                showarrow: false,
                align: 'center',
                x: 0.5,
                y: 1,
                xref: 'paper',
                yref: 'paper',
            },
            {
                text: `$\\text{Carrier signal}, m(t)$`,
                font: {
                    size: 20,
                },
                showarrow: false,
                align: 'center',
                x: 0.5,
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
                x: 0.5,
                y: 0.26,
                xref: 'paper',
                yref: 'paper',
            }
        ],
        showlegend: false,
    };

    const messageSpectrumGraphData = {
        x: spectrumData.msg_x,
        y: spectrumData.msg_y,
        type: 'bar',
        name: "$\\text{Message signal}$",
        hovertemplate: '<b>msg_s(f)</b>: %{y}<extra></extra>',

    };

    const carrierSpectrumGraphData = {
        x: spectrumData.car_x,
        y: spectrumData.car_y,
        type: 'bar',
        name: "$\\text{Carrier signal}$",
        hovertemplate: '<b>car_s(f)</b>: %{y}<extra></extra>',

    };

    const amSpectrumGraphData = {
        x: spectrumData.am_x,
        y: spectrumData.am_y,
        type: 'bar',
        name: "$\\text{AM signal}$",
        hovertemplate: '<b>am_s(f)</b>: %{y}<extra></extra>',

    };

    const layout2 = {
        barmode: 'overlay',
        bargap: 0.9,
        title: {
            text: `$\\text{Signals spectrum}$`,
            font: {
                size: 20
            }
        },

        xaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Frequency }f, Hz$',
            autorange: true,
        },
        yaxis: {
            domain: [0, 0.97],
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Amplitude } A$'
        },

        margin: {
            l: 65,
            r: 25,
            t: 80,
        },

        legend: {
            font: {
                size: 16,
            },
            x: 0,
            y: 1,
            xanchor: 'left',
        },
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot('graph1',
        [carrierSignalGraphData, messageSignalGraphData, modulationSignalGraphData],
        layout1, config);

    Plotly.newPlot('graph2',
        [carrierSpectrumGraphData, messageSpectrumGraphData, amSpectrumGraphData],
        layout2, config);
}

function drawDefaultGraphs() {
    const defaultGraphData = {
        messageFrequency: 10,
        carrierFrequency: 100,
        messageAmplitude: 1,
        carrierAmplitude: 2,
        stepCount: 10000
    };

    drawGraphs(defaultGraphData);
}

drawDefaultGraphs();