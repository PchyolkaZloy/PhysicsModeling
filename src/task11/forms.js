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
        alert(element.id + " have to be integer number >= 1. Setting to default value: " + defaultValue)
    }

    return parseInt(element.value);
}


function getData() {
    const defaultGraphData = {
        splitsNumber: 2,
        splitWidth: 0.001,
        period: 0.005,
        waveLength: 500,
        endAngle: 0.001,
        stepCount: 100000
    };

    return {
        splitsNumber: parseInteger(document.getElementById("splitsNumber"), defaultGraphData.splitsNumber),
        splitWidth: parseFloatGreaterZero(document.getElementById("splitWidth"), defaultGraphData.splitWidth),
        period: parseFloatGreaterZero(document.getElementById("period"), defaultGraphData.period),
        waveLength: 1e-9 * parseFloatGreaterZero(document.getElementById("waveLength"), defaultGraphData.waveLength),
        endAngle: parseFloatGreaterZero(document.getElementById("endAngle"), defaultGraphData.endAngle),
        stepCount: parseInteger(document.getElementById("stepCount"), defaultGraphData.stepCount),
    };
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const graphData = getData();
    const {
        intensiveData,
        angleData
    } = countGraphData(
        graphData.splitsNumber,
        graphData.splitWidth,
        graphData.period,
        graphData.waveLength,
        graphData.endAngle,
        graphData.stepCount
    );

    drawGraph(intensiveData, angleData);
    drawLines(intensiveData, angleData, graphData.waveLength, graphData.endAngle);
});
