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
        firstAmplitude: 1,
        secondAmplitude: 1,
        firstFrequency: 2,
        secondFrequency: 3,
        phase: 0,
        stepCount: 50000,
    };

    let graphData = {
        firstAmplitude: customParseFloatGreaterZero(document.getElementById("amplitude1"), defaultGraphData.firstAmplitude),
        secondAmplitude: customParseFloatGreaterZero(document.getElementById("amplitude2"), defaultGraphData.secondAmplitude),
        firstFrequency: customParseFloatGreaterZero(document.getElementById("frequency1"), defaultGraphData.firstFrequency),
        secondFrequency: customParseFloatGreaterZero(document.getElementById("frequency2"), defaultGraphData.secondFrequency),
        phase: customParseFloat(document.getElementById("phase"), defaultGraphData.phase),
        stepCount: customParseInteger(document.getElementById("stepCount"), defaultGraphData.stepCount),
    };

    const maxAccuracy = 100000;
    if (graphData.stepCount > maxAccuracy) {
        alert("Max step count is 100000. Setting to default value.");

        document.getElementById("stepCount").value = defaultGraphData.stepCount;
        graphData.stepCount = defaultGraphData.stepCount;
    }

    return graphData;
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraph(getData());
});