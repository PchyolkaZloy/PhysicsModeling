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
        firstFrequency: 10,
        secondFrequency: 8,
        amplitude: 1,
        endTime: 10,
        stepCount: 10000
    };

    let graphData = {
        firstFrequency: customParseFloatGreaterZero(document.getElementById("frequency1"), defaultGraphData.firstFrequency),
        secondFrequency: customParseFloatGreaterZero(document.getElementById("frequency2"), defaultGraphData.secondFrequency),
        amplitude: customParseFloatGreaterZero(document.getElementById("amplitude"), defaultGraphData.amplitude),
        endTime: customParseFloatGreaterZero(document.getElementById("endTime"), defaultGraphData.endTime),
        stepCount: customParseInteger(document.getElementById("stepCount"), defaultGraphData.stepCount),
    };

    if (!checkDiffFrequencies(graphData.firstFrequency, graphData.secondFrequency)) {
        alert("Oscillations should be with slightly different but close frequencies" +
            " (Their difference have not be more than one of them). Setting to default values.");

        document.getElementById("frequency1").value = defaultGraphData.firstFrequency;
        document.getElementById("frequency2").value = defaultGraphData.secondFrequency;

        graphData.firstFrequency = defaultGraphData.firstFrequency;
        graphData.secondFrequency = defaultGraphData.secondFrequency;
    }

    return graphData;
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraph(getData());
});