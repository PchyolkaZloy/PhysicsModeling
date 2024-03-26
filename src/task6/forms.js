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
        initialCharge: 1,
        endTime: 10,
        stepCount: 10000
    };

    return {
        inductance: customParseFloatGreaterZero(document.getElementById("inductance"), defaultGraphData.inductance),
        resistance: customParseFloat(document.getElementById("resistance"), defaultGraphData.resistance),
        capacitance: customParseFloatGreaterZero(document.getElementById("capacitance"), defaultGraphData.capacitance),
        initialCharge: customParseInteger(
            document.getElementById("initialCharge"), defaultGraphData.initialCharge),
        endTime: customParseFloat(document.getElementById("endTime"), defaultGraphData.endTime),
        stepCount: customParseInteger(document.getElementById("stepCount"), defaultGraphData.stepCount),
    };
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraphs(getData());
});