/*
source https://scask.ru/e_book_phis.php?id=107&ysclid=ltbsk6su2i397496475
 */

function frequencyToAngleSpeed(rotationFrequency) {
    return 2 * Math.PI * rotationFrequency;
}

function countInduction(magneticField, area, angleSpeed, time) {
    return magneticField * area * angleSpeed * Math.sin(angleSpeed * time);
}

function countAmperage(emf, resistance) {
    return emf / resistance;
}


function countDataForGraphs(magneticField, area, rotationFrequency, resistance, stepCount, endTime) {
    const angleSpeed = frequencyToAngleSpeed(rotationFrequency);
    const step = endTime / stepCount;

    let emfData = [];
    let amperageData = [];
    let timeData = [];

    for (let time = 0; time <= endTime; time += step) {
        emfData.push(countInduction(magneticField, area, angleSpeed, time));
        amperageData.push(countAmperage(emfData[emfData.length - 1], resistance));
        timeData.push(time);
    }

    return {emfData, amperageData, timeData};
}


function drawTwoGraphsTogether(emfData, amperageData, timeData) {
    const emfGraphData = {
        x: timeData,
        y: emfData,
        mode: 'lines',
        type: 'scatter',
        name: '$E(t)$',
        hovertemplate: '<b>E(t)</b>: %{y}<extra></extra>'
    };

    const amperageGraphData = {
        x: timeData,
        y: amperageData,
        mode: 'lines',
        type: 'scatter',
        name: '$I(t)$',
        hovertemplate: '<b>I(t)</b>: %{y}<extra></extra>'
    };

    const layout = {
        title: {
            text: '$\\text{EMF } E(t) \\text{ and Induced current } I(t)$',
            font: {
                size: 20
            }
        },
        yaxis: {
            showspikes: true,
            title: {
                text: '$\\text{EMF } E, V;  \\text{ Induced current } \\frac{V}{\\Omega}, В$',
                font: {
                    size: 20
                }
            }
        },
        xaxis: {
            showspikes: true,
            fixedrange: true,
            title: {
                text: '$\\text{Time } t, sec$',
                font: {
                    size: 20
                }
            }
        },

        margin: {
            l: 85,
            r: 25,
            t: 85
        },

        showlegend: true,
        legend: {
            font: {
                size: 18,
            },
            x: 1,
            y: 0.5,
        },
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot('graph', [emfGraphData, amperageGraphData], layout, config);
}


function drawTwoGraphsSeparately(emfData, amperageData, timeData) {
    const emfGraphData = {
        x: timeData,
        y: emfData,
        mode: 'lines',
        type: 'scatter',
        name: '$E(t)$',
        hovertemplate: '<b>E(t)</b>: %{y}<extra></extra>'
    };

    const amperageGraphData = {
        x: timeData,
        y: amperageData,
        mode: 'lines',
        type: 'scatter',
        xaxis: 'x2',
        yaxis: 'y2',
        name: '$I(t)$',
        hovertemplate: '<b>I(t)</b>: %{y}<extra></extra>'
    };

    const layout = {
        grid: {
            rows: 2,
            columns: 1,
            pattern: 'independent',
        },

        title: {
            text: '$\\text{EMF } E(t) \\text{ and Induced current } I(t)$'
        },

        xaxis: {
            showspikes: true,
            fixedrange: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis: {
            showspikes: true,
            title: '$\\text{EMF } E, V$'
        },

        xaxis2: {
            showspikes: true,
            fixedrange: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis2: {
            showspikes: true,
            title: '$\\text{Induced current } I, A$'
        },

        margin: {
            l: 65,
            r: 25,
            t: 85
        },

        legend: {
            font: {
                family: 'Arial, serif',
                size: 20,
                color: 'black',
            },
            x: 1,
            xanchor: 'right',
            y: 0.5,
        },
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot('graph', [emfGraphData, amperageGraphData], layout, config);
}

function drawGraphs(magneticField, area, rotationFrequency, resistance, stepCount, endTime, isTogether) {
    const {
        emfData,
        amperageData,
        timeData
    } = countDataForGraphs(magneticField, area, rotationFrequency, resistance, stepCount, endTime);

    if (isTogether) {
        drawTwoGraphsTogether(emfData, amperageData, timeData);
    } else {
        drawTwoGraphsSeparately(emfData, amperageData, timeData);
    }
}

const defaultValues = {
    magneticField: 1,
    area: 1,
    rotationFrequency: 1000,
    resistance: 5,
    stepCount: 10000,
    endTime: 0.001,
    isTogether: false,
};

drawGraphs(
    defaultValues.magneticField,
    defaultValues.area,
    defaultValues.rotationFrequency,
    defaultValues.resistance,
    defaultValues.stepCount,
    defaultValues.endTime,
    defaultValues.isTogether
);