function customParseFloat(element, defaultValue) {
    if (isNaN(element.value) || element.value < 0) {
        element.value = defaultValue
        alert(element.id + " have to be float number >= 0. Setting to default value: " + defaultValue)
    }

    return parseFloat(element.value);
}

function customParseFloatGreaterZero(element, defaultValue) {
    if (isNaN(element.value) || element.value <= 0) {
        element.value = defaultValue
        alert(element.id + " have to be float number > 0. Setting to default value: " + defaultValue)
    }

    return parseFloat(element.value);
}

function customParseInteger(element, defaultValue) {
    if (isNaN(element.value) || element.value <= 0) {
        element.value = defaultValue
        alert(element.id + " have to be integer number > 0. Setting to default value: " + defaultValue)
    }

    return parseInt(element.value);
}


function getData() {
    const defaultGraphData = {
        inductance: 1,
        resistance: 1,
        capacitance: 0.001,
        initialCapacitanceCharge: 1,
        endTime: 10,
        stepCount: 10000
    };

    let graphData = {
        inductance: customParseFloatGreaterZero(document.getElementById("inductance"), defaultGraphData.inductance),
        resistance: customParseFloat(document.getElementById("resistance"), defaultGraphData.resistance),
        capacitance: customParseFloatGreaterZero(document.getElementById("capacitance"), defaultGraphData.capacitance),
        initialCapacitanceCharge: customParseInteger(
            document.getElementById("initialCapacitanceCharge"), defaultGraphData.initialCapacitanceCharge),
        endTime: customParseFloat(document.getElementById("endTime"), defaultGraphData.endTime),
        stepCount: customParseInteger(document.getElementById("stepCount"), defaultGraphData.stepCount),
    };

    if (!checkResistanceToCriticalValue(graphData.resistance, graphData.inductance, graphData.capacitance)) {
        alert("The circuit resistance is greater than the critical value. " +
            "The oscillation process passes into the aperiodic discharge of the capacitor. " +
            "Setting resistance, inductance and capacitance to default values...");

        document.getElementById("resistance").value = graphData.resistance = defaultGraphData.resistance;
        document.getElementById("inductance").value = graphData.inductance = defaultGraphData.inductance;
        document.getElementById("capacitance").value = graphData.capacitance = defaultGraphData.capacitance;
    }

    return graphData;
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraphs(getData());
});