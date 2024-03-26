/*
https://scask.ru/c_book_s_phis2.php?id=98
https://scask.ru/r_book_otc.php?id=122
 */

// R_{cr}
let criticalResistance = 0;
// w_0
let naturalFrequency = 0;
// Beta
let attenuationFactor = 0;
// w
let cyclicFrequency = 0;

let p1 = 0;
let p2 = 0;

// Beta
function countAttenuationFactor(resistance, inductance) {
    return resistance / (2 * inductance);
}

// w_o
function countNaturalFrequency(inductance, capacitance) {
    return 1 / Math.sqrt(inductance * capacitance);
}

// R_{cr}
function countCriticalResistance(inductance, capacitance) {
    return 2 * Math.sqrt(inductance / capacitance);
}

// w
function countCyclicFrequency() {
    return Math.sqrt(naturalFrequency ** 2 - attenuationFactor ** 2);
}


function countCharge(inductance, resistance, capacitance, initialCharge, time) {
    if (resistance > criticalResistance) {
        return (initialCharge * (p2 * Math.exp(p1 * time) - p1 * Math.exp(p2 * time))) / (p2 - p1);
    } else if (resistance === criticalResistance) {
        return -(initialCharge * Math.exp(-attenuationFactor * time) * (-attenuationFactor * time - 1)) / attenuationFactor;
    }

    return initialCharge * Math.exp(-attenuationFactor * time) * Math.cos(cyclicFrequency * time);
}

function countVoltage(inductance, resistance, capacitance, initialCharge, time, chargeData) {
    if (resistance > criticalResistance) {
        return (initialCharge * (p2 * Math.exp(p1 * time) - p1 * Math.exp(p2 * time))) / (capacitance * (p2 - p1));
    } else if (resistance === criticalResistance) {
        return (initialCharge * (1 + attenuationFactor * time) * Math.exp(-attenuationFactor * time)) / capacitance;
    }

    return chargeData[chargeData.length - 1] / capacitance;
}

function countAmperage(inductance, resistance, capacitance, initialCharge, time) {
    if (resistance > criticalResistance) {
        return (p1 * p2 * initialCharge * (Math.exp(p1 * time) - Math.exp(p2 * time))) / (p2 - p1);
    } else if (resistance === criticalResistance) {
        return -initialCharge * attenuationFactor ** 2 * time * Math.exp(-attenuationFactor * time);
    }

    return initialCharge * Math.exp(-attenuationFactor * time) *
        (-attenuationFactor * Math.cos(cyclicFrequency * time) - cyclicFrequency * Math.sin(cyclicFrequency * time));
}


function countGraphData(inductance, resistance, capacitance, initialCharge, endTime, stepCount) {
    const step = endTime / stepCount;
    criticalResistance = countCriticalResistance(inductance, capacitance);
    naturalFrequency = countNaturalFrequency(inductance, capacitance);
    attenuationFactor = countAttenuationFactor(resistance, inductance);
    cyclicFrequency = countCyclicFrequency();

    if (resistance > criticalResistance) {
        p1 = -attenuationFactor + Math.sqrt(attenuationFactor ** 2 - naturalFrequency ** 2);
        p2 = -attenuationFactor - Math.sqrt(attenuationFactor ** 2 - naturalFrequency ** 2);
    }

    let timeData = [];
    let chargeData = [];
    let voltageData = [];
    let amperageData = [];

    for (let time = 0; time <= endTime; time += step) {
        chargeData.push(countCharge(inductance, resistance, capacitance, initialCharge, time));
        voltageData.push(countVoltage(inductance, resistance, capacitance, initialCharge, time, chargeData));
        amperageData.push(countAmperage(inductance, resistance, capacitance, initialCharge, time));

        timeData.push(time);
    }

    return {chargeData, voltageData, amperageData, timeData};
}


function drawGraphs(graphData) {
    const {
        chargeData,
        voltageData,
        amperageData,
        timeData
    } = countGraphData(
        graphData.inductance,
        graphData.resistance,
        graphData.capacitance,
        graphData.initialCharge,
        graphData.endTime,
        graphData.stepCount
    );

    const chargeGraphData = {
        x: timeData,
        y: chargeData,
        mode: 'lines',
        name: "$q(t)$",
        hovertemplate: '<b>q(t)</b>: %{y}<extra></extra>'
    };

    const voltageGraphData = {
        x: timeData,
        y: voltageData,
        mode: 'lines',
        name: "$V(t)$",
        hovertemplate: '<b>V(t)</b>: %{y}<extra></extra>'
    };

    voltageGraphData.xaxis = 'x2';
    voltageGraphData.yaxis = 'y2';

    const amperageGraphData = {
        x: timeData,
        y: amperageData,
        mode: 'lines',
        name: "$I(t)$",
        hovertemplate: '<b>I(t)</b>: %{y}<extra></extra>'
    };

    amperageGraphData.xaxis = 'x3';
    amperageGraphData.yaxis = 'y3';

    const layout = {
        grid: {
            rows: 3,
            columns: 1,
            pattern: 'independent',
        },

        xaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Charge } q, C$'
        },

        xaxis2: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis2: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Voltage } V, volt$'
        },

        xaxis3: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis3: {
            exponentformat: 'power',
            showspikes: true,
            title: '$\\text{Amperage } I, A$'
        },

        margin: {
            l: 65,
            r: 25,
            t: 25,
        },

        showlegend: false,
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot('graph', [chargeGraphData, voltageGraphData, amperageGraphData], layout, config);
}

function drawDefaultGraph() {
    const defaultGraphData = {
        inductance: 1,
        resistance: 1,
        capacitance: 0.001,
        initialCharge: 1,
        endTime: 10,
        stepCount: 10000
    };

    drawGraphs(defaultGraphData);
}

drawDefaultGraph();