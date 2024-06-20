function customParseFloatGreaterZero(element, defaultValue) {
    if (isNaN(element.value) || element.value <= 0) {
        element.value = defaultValue
        alert(element.id + " have to be float number > 0. Setting to default value: " + defaultValue)
    }

    return parseFloat(element.value);
}

function customParseFloatGreaterOrEqualOne(element, defaultValue) {
    if (isNaN(element.value) || element.value < 1) {
        element.value = defaultValue
        alert(element.id + " have to be float number => 1. Setting to default value: " + defaultValue)
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
        waveLength: 500,
        refractiveIndex: 1,
        slitSpace: 0.005,
        slitWidth: 0.001,
        lengthToScreen: 1,
        viewRadius: 0.002,
        stepCount: 10000
    };

    return {
        waveLength: 1e-9 * customParseFloatGreaterZero(document.getElementById("waveLength"), defaultGraphData.waveLength),
        refractiveIndex: customParseFloatGreaterOrEqualOne(document.getElementById("refractiveIndex"), defaultGraphData.refractiveIndex),
        slitSpace: customParseFloatGreaterZero(document.getElementById("slitSpace"), defaultGraphData.slitSpace),
        slitWidth: customParseFloatGreaterZero(document.getElementById("slitWidth"), defaultGraphData.slitWidth),
        lengthToScreen: customParseFloatGreaterZero(document.getElementById("lengthToScreen"), defaultGraphData.lengthToScreen),
        viewRadius: customParseFloatGreaterZero(document.getElementById("viewRadius"), defaultGraphData.viewRadius),
        stepCount: customParseInteger(document.getElementById("stepCount"), defaultGraphData.stepCount),
    };
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraph(getData());
});