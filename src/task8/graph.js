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
    // Не считаю через fft, так как сигналы простые гармоничные и, проанализировав уравнения, вывел,
    // что спектр можно найти аналитически (разложить AM сигнал, используя тригонометрические преобразования)
    // подробно: https://www.pd.isu.ru/method/rtcs/Theory/spectrumam.htm
    // https://en.wikipedia.org/wiki/Amplitude_modulation#Spectrum
    return {
        am_x: [
            [carrierFrequency - messageFrequency, carrierFrequency - messageFrequency],
            [carrierFrequency, carrierFrequency],
            [carrierFrequency + messageFrequency, carrierFrequency + messageFrequency],
        ],
        am_y: [
            [0, messageAmplitude * 0.5],
            [0, carrierAmplitude],
            [0, messageAmplitude * 0.5]
        ],
        car_x: [carrierFrequency, carrierFrequency],
        car_y: [0, carrierAmplitude],
        msg_x: [messageFrequency, messageFrequency],
        msg_y: [0, messageAmplitude],
    };
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
        line: {color: 'rgb(221,3,245)'},
        mode: 'lines',
        name: "$\\text{Message signal}$",
        hovertemplate: '<b>msg_s(f)</b>: %{y}<extra></extra>',
    };

    const carrierSpectrumGraphData = {
        x: spectrumData.car_x,
        y: spectrumData.car_y,
        mode: 'lines',
        name: "$\\text{Carrier signal}$",
        hovertemplate: '<b>car_s(f)</b>: %{y}<extra></extra>',
    };

    const amSpectrumGraphData1 = {
        x: spectrumData.am_x[0],
        y: spectrumData.am_y[0],
        line: {color: 'rgb(252,0,0)'},
        mode: 'lines',
        legendgroup: 'AM signal',
        name: "$\\text{AM signal}$",
        hovertemplate: '<b>am_s(f)</b>: %{y}<extra></extra>',
    };

    const amSpectrumGraphData2 = {
        x: spectrumData.am_x[1],
        y: spectrumData.am_y[1],
        line: {color: 'rgb(252,0,0)'},
        mode: 'lines',
        legendgroup: 'AM signal',
        name: "",
        hovertemplate: '<b>am_s(f)</b>: %{y}<extra></extra>',
    };

    const amSpectrumGraphData3 = {
        x: spectrumData.am_x[2],
        y: spectrumData.am_y[2],
        line: {color: 'rgb(252,0,0)'},
        mode: 'lines',
        legendgroup: 'AM signal',
        name: "",
        hovertemplate: '<b>am_s(f)</b>: %{y}<extra></extra>',
    };

    const layout2 = {
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
            onhover: 'none', // Отключить всплывающие подсказки
            customdata: true, // Использовать `customdata` в легенде
            title: 'AM signal',
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
        [carrierSpectrumGraphData, messageSpectrumGraphData, amSpectrumGraphData1, amSpectrumGraphData2, amSpectrumGraphData3],
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