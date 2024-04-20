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
        messageFrequency: 100,
        carrierFrequency: 10,
        messageAmplitude: 1,
        carrierAmplitude: 2,
        stepCount: 10000
    };

    let graphData = {
        messageFrequency: customParseFloatGreaterZero(document.getElementById("messageFrequency"), defaultGraphData.messageFrequency),
        carrierFrequency: customParseFloatGreaterZero(document.getElementById("carrierFrequency"), defaultGraphData.currierFrequency),
        messageAmplitude: customParseFloatGreaterZero(document.getElementById("messageAmplitude"), defaultGraphData.messageAmplitude),
        carrierAmplitude: customParseFloatGreaterZero(document.getElementById("carrierAmplitude"), defaultGraphData.carrierAmplitude),
        stepCount: customParseInteger(document.getElementById("stepCount"), defaultGraphData.stepCount),
    };

    if (graphData.messageAmplitude / graphData.carrierAmplitude > 1) {
        alert("Message amplitude / carrier amplitude > 1!\n" +
            "Overmodulation occurs and reconstruction of message signal" +
            " from the transmitted signal would lead in loss of original signal.\n" +
            "Works only when message amplitude / carrier amplitude <= 1. Setting to default values.");

        document.getElementById("messageAmplitude").value = defaultGraphData.messageAmplitude;
        graphData.messageAmplitude = defaultGraphData.messageAmplitude;

        document.getElementById("carrierAmplitude").value = defaultGraphData.carrierAmplitude;
        graphData.messageAmplitude = defaultGraphData.carrierAmplitude;
    }

    return graphData;
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraphs(getData());
});