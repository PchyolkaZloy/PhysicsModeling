function gcd(a, b) {
    if (a < b)
        return gcd(b, a);

    // base case
    if (Math.abs(b) < 0.001)
        return a;
    else
        return (gcd(b, a - Math.floor(a / b) * b));
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function countXCoord(amplitude, a, phase, time) {
    return amplitude * Math.sin(a * time + phase);
}

function countYCoord(amplitude, b, time) {
    return amplitude * Math.sin(b * time);
}

function makeSliderStepsAndFrames(xGraphData, yGraphData) {
    const drawTime = 5; // in seconds
    let frameStep = Math.trunc(xGraphData.length / (drawTime * 60));

    let sliderStepsData = [];
    let frameData = [];

    for (let i = 0; i <= xGraphData.length; i += frameStep) {
        sliderStepsData.push({
            label: xGraphData[i],
            method: 'animate',
            args: [[xGraphData[i]], {
                frame: {
                    duration: 0,
                    redraw: false
                },
                mode: 'immediate',
            }]
        });

        frameData.push({
            name: xGraphData[i],
            data: [{x: xGraphData.slice(0, i + 1), y: yGraphData.slice(0, i + 1)}]
        });
    }

    // добавление последнего кадра, если его не было
    if (sliderStepsData.length === 0 ||
        sliderStepsData[sliderStepsData.length - 1].label !== xGraphData[xGraphData.length - 1]) {
        sliderStepsData.push({
            label: xGraphData[xGraphData.length - 1],
            method: 'animate',
            args: [[xGraphData[xGraphData.length - 1]], {
                frame: {
                    duration: 0,
                    redraw: false
                },
                mode: 'immediate',
            }]
        });

        frameData.push({
            name: xGraphData[xGraphData.length - 1],
            data: [{x: xGraphData.slice(0, xGraphData.length), y: yGraphData.slice(0, yGraphData.length)}]
        });
    }

    return {xGraphData, yGraphData, sliderStepsData, frameData};
}

function countGraphData(amplitude1, amplitude2, frequency1, frequency2, phase, stepCount) {
    const endTime = 2 * Math.PI * lcm(frequency1, frequency2) / (frequency1 * frequency2);
    const step = endTime / stepCount;

    let xGraphData = [];
    let yGraphData = [];

    for (let time = 0; time <= endTime + step; time += step) {
        xGraphData.push(countXCoord(amplitude1, frequency1, phase, time));
        yGraphData.push(countYCoord(amplitude2, frequency2, time));
    }

    // добавление последнего шага, если его не было
    const endX = countXCoord(amplitude1, frequency1, phase, endTime);
    if (xGraphData.length === 0
        || xGraphData[xGraphData.length - 1] !== endX) {
        xGraphData.push(endX);
        yGraphData.push(countYCoord(amplitude2, frequency2, endTime));
    }

    return makeSliderStepsAndFrames(xGraphData, yGraphData)
}

function drawGraph(graphData) {
    const {
        xGraphData,
        yGraphData,
        sliderStepsData,
        frameData
    } = countGraphData(
        graphData.firstAmplitude,
        graphData.secondAmplitude,
        graphData.firstFrequency,
        graphData.secondFrequency,
        graphData.phase,
        graphData.stepCount
    );

    Plotly.newPlot('graph', {
        data: [{
            x: xGraphData,
            y: yGraphData,
            mode: 'lines',
            hoverinfo: 'none',
        }],

        layout: {
            title: {
                text: `$\\text{Lissajous curve}$`,
            },

            margin: {
                l: 35,
                r: 25,
                t: 25,
                b: 50,
            },

            updatemenus: [{
                type: 'buttons',
                xanchor: 'left',
                yanchor: 'top',
                direction: 'right',
                x: 0,
                y: 0,
                pad: {t: 60},
                showactive: true,

                buttons: [
                    {
                        label: 'Play',
                        method: 'animate',
                        args: [null, {
                            transition: {
                                duration: 0
                            },
                            frame: {
                                duration: 0,
                                redraw: false
                            },
                            mode: 'immediate',
                            fromcurrent: true,
                        }]
                    },
                    {
                        label: 'Pause',
                        method: 'animate',
                        args: [[null], {
                            frame: {
                                duration: 0,
                                redraw: false
                            },
                            mode: 'immediate',
                        }]
                    }]
            }],

            sliders:
                [{
                    currentvalue: {
                        prefix: 'x = ',
                        xanchor: 'right'
                    },
                    pad: {l: 130, t: 30},
                    transition: {duration: 0},
                    steps: sliderStepsData
                }]
        },

        frames: frameData,

        config: {
            scrollZoom: true,
            displayModeBar: true,
            displaylogo: false,
            responsive: true,
        }

    });
}

function drawDefaultGraph() {
    const defaultGraphData = {
        firstAmplitude: 1,
        secondAmplitude: 1,
        firstFrequency: 2,
        secondFrequency: 3,
        phase: 0,
        stepCount: 50000,
    };

    drawGraph(defaultGraphData);
}

drawDefaultGraph();