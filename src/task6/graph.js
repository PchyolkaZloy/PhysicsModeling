/*
https://scask.ru/c_book_s_phis2.php?id=98
 */

function countAttenuationFactor(resistance, inductance) {
    return resistance / (2 * inductance);
}

function countNaturalFrequency(inductance, capacitance) {
    return 1 / Math.sqrt(inductance * capacitance);
}

function countCyclicFrequency(naturalFrequency, attenuationFactor) {
    return Math.sqrt(naturalFrequency ** 2 - attenuationFactor ** 2);
}

function countCriticalResistance(inductance, capacitance) {
    return 2 * Math.sqrt(inductance / capacitance);
}

function checkResistanceToCriticalValue(resistance, inductance, capacitance) {
    return resistance < countCriticalResistance(inductance, capacitance);
}

function countChargeAtTime(initialCapacitanceCharge, attenuationFactor, cyclicFrequency, time) {
    return initialCapacitanceCharge * Math.exp(-attenuationFactor * time) * Math.cos(cyclicFrequency * time);
}

function countVoltageAtTime(initialCapacitanceCharge, capacitance, attenuationFactor, cyclicFrequency, time) {
    return initialCapacitanceCharge / capacitance * Math.exp(-attenuationFactor * time) * Math.cos(cyclicFrequency * time);
}

function countAmperageNative(initialCapacitanceCharge, attenuationFactor, cyclicFrequency, naturalFrequency, time) {
    return naturalFrequency * initialCapacitanceCharge * Math.exp(-attenuationFactor * time) *
        (
            -attenuationFactor / (Math.sqrt(cyclicFrequency ** 2 + attenuationFactor ** 2)) * Math.cos(cyclicFrequency * time)
            - cyclicFrequency / (Math.sqrt(cyclicFrequency ** 2 + attenuationFactor ** 2)) * Math.sin(cyclicFrequency * time)
        );
}

function countGraphData(inductance, resistance, capacitance, initialCapacitanceCharge, endTime, stepCount) {
    const step = endTime / stepCount;

    const naturalFrequency = countNaturalFrequency(inductance, capacitance);
    const attenuationFactor = countAttenuationFactor(resistance, inductance);
    const cyclicFrequency = countCyclicFrequency(naturalFrequency, attenuationFactor);

    let timeData = [];
    let chargeData = [];
    let voltageData = [];
    let amperageData = [];

    for (let time = 0; time <= endTime; time += step) {
        chargeData.push(countChargeAtTime(initialCapacitanceCharge, attenuationFactor, cyclicFrequency, time));
        voltageData.push(countVoltageAtTime(initialCapacitanceCharge, capacitance, attenuationFactor, cyclicFrequency, time));
        amperageData.push(countAmperageNative(initialCapacitanceCharge, attenuationFactor, cyclicFrequency, naturalFrequency, time));

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
        graphData.initialCapacitanceCharge,
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
            showspikes: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis: {
            exponentformat: 'e',
            showspikes: true,
            title: '$\\text{Charge } q, C$'
        },

        xaxis2: {
            showspikes: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis2: {
            exponentformat: 'e',
            showspikes: true,
            title: '$\\text{Voltage } V, volt$'
        },

        xaxis3: {
            showspikes: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis3: {
            exponentformat: 'e',
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
        initialCapacitanceCharge: 1,
        endTime: 10,
        stepCount: 10000
    };

    drawGraphs(defaultGraphData);
}

drawDefaultGraph();