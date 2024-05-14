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
    const defaultGraphData = {
        waveLength: 500,
        lensRadius: 1,
        lensRefractiveIndex: 1.5,
        betweenRefractiveIndex: 1,
        plateRefractiveIndex: 1.5,
        endRadius: 0.002,
        stepCount: 10000
    };

    let graphData = {
        waveLength: 1e-9 * parseFloatGreaterZero(document.getElementById("waveLength"), defaultGraphData.waveLength),
        lensRadius: parseFloatGreaterZero(document.getElementById("lensRadius"), defaultGraphData.lensRadius),
        lensRefractiveIndex: parseFloatGreaterOrEqualOne(document.getElementById("lensRefractiveIndex"), defaultGraphData.lensRefractiveIndex),
        betweenRefractiveIndex: parseFloatGreaterOrEqualOne(document.getElementById("betweenRefractiveIndex"), defaultGraphData.betweenRefractiveIndex),
        plateRefractiveIndex: parseFloatGreaterOrEqualOne(document.getElementById("plateRefractiveIndex"), defaultGraphData.plateRefractiveIndex),
        endRadius: parseFloatGreaterZero(document.getElementById("endRadius"), defaultGraphData.endRadius),
        stepCount: parseInteger(document.getElementById("stepCount"), defaultGraphData.stepCount),
    };

    if (graphData.lensRefractiveIndex <= graphData.betweenRefractiveIndex ||
        graphData.plateRefractiveIndex <= graphData.betweenRefractiveIndex) {
        alert("Refractive index between plate and lens have to be less than lens refractive index" +
            " and less than plate refractive index! \n" +
            "Setting indexes to default values.");

        document.getElementById("lensRefractiveIndex").value = defaultGraphData.lensRefractiveIndex;
        document.getElementById("betweenRefractiveIndex").value = defaultGraphData.betweenRefractiveIndex;
        document.getElementById("plateRefractiveIndex").value = defaultGraphData.plateRefractiveIndex;

        graphData.lensRefractiveIndex = defaultGraphData.lensRefractiveIndex;
        graphData.betweenRefractiveIndex = defaultGraphData.betweenRefractiveIndex;
        graphData.plateRefractiveIndex = defaultGraphData.plateRefractiveIndex;
    }

    return graphData;
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const graphData = getData();
    const {
        intensiveData,
        radiusData
    } = countGraphData(
        graphData.waveLength,
        graphData.lensRadius,
        graphData.lensRefractiveIndex,
        graphData.betweenRefractiveIndex,
        graphData.plateRefractiveIndex,
        graphData.endRadius,
        graphData.stepCount
    );

    drawGraph(intensiveData, radiusData);
    drawRings(intensiveData, radiusData, graphData.waveLength, graphData.endRadius, graphData.stepCount);
});
