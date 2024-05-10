function parseFloatGreaterZero(element, defaultValue) {
    if (isNaN(element.value) || element.value <= 0) {
        element.value = defaultValue
        alert(element.id + " have to be float number > 0. Setting to default value: " + defaultValue)
    }

    return parseFloat(element.value);
}

function parseInteger(element, defaultValue) {
    if (isNaN(element.value) || element.value <= 0) {
        element.value = defaultValue
        alert(element.id + " have to be integer number > 0. Setting to default value: " + defaultValue)
    }

    return parseInt(element.value);
}

function parseFloatGreaterOrEqualOne(element, defaultValue) {
    if (isNaN(element.value) || element.value < 1) {
        element.value = defaultValue
        alert(element.id + " have to be float number => 1. Setting to default value: " + defaultValue)
    }

    return parseFloat(element.value);
}

function getData() {
    defaultGraphData = {
        waveLength: 500,
        lensRadius: 1,
        lensRefractiveIndex: 1,
        betweenRefractiveIndex: 1,
        plateRefractiveIndex: 1,
        endRadius: 0.002,
        stepCount: 10000
    };

    return {
        waveLength: 1e-9 * parseFloatGreaterZero(document.getElementById("waveLength"), defaultGraphData.waveLength),
        lensRadius: parseFloatGreaterZero(document.getElementById("lensRadius"), defaultGraphData.lensRadius),
        lensRefractiveIndex: parseFloatGreaterOrEqualOne(document.getElementById("lensRefractiveIndex"), defaultGraphData.lensRefractiveIndex),
        betweenRefractiveIndex: parseFloatGreaterOrEqualOne(document.getElementById("betweenRefractiveIndex"), defaultGraphData.betweenRefractiveIndex),
        plateRefractiveIndex: parseFloatGreaterOrEqualOne(document.getElementById("plateRefractiveIndex"), defaultGraphData.plateRefractiveIndex),
        endRadius: parseFloatGreaterZero(document.getElementById("endRadius"), defaultGraphData.endRadius),
        stepCount: parseInteger(document.getElementById("stepCount"), defaultGraphData.stepCount),
    };
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraph(getData());
});