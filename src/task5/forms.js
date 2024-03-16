function customParseFloat(element, defaultValue) {
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
    return {
        radius: customParseFloat(document.getElementById("radius"), 0.03),
        diameter: customParseFloat(document.getElementById("diameter"), 0.005),
        voltageAmplitude: customParseFloat(document.getElementById("voltage"), 150),
        angularVelocity: customParseFloat(document.getElementById("angularVelocity"), 376.9911),
        radialCoordinate : customParseFloat(document.getElementById("radialCoordinate"), 0.02),
        endRadialCoordinate: customParseFloat(document.getElementById("endRadialCoordinate"), 0.2),
        endTime: customParseFloat(document.getElementById("endTime"), 0.1),
        stepCount: customParseInteger(document.getElementById("stepCount"), 10000),
    };
}

document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraphs(getData());
});