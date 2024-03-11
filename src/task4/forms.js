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
        magneticInduction: customParseFloat(document.getElementById("induction"), 1),
        area: customParseFloat(document.getElementById("area"), 1),
        rotationFrequency: customParseFloat(document.getElementById("rotationFrequency"), 1),
        resistance: customParseFloat(document.getElementById("resistance"), 5),
        stepCount: customParseInteger(document.getElementById("stepCount"), 10000),
        endTime: customParseFloat(document.getElementById("endTime"), 10),
        isTogether: document.getElementById("checkbox").checked,
    };
}


document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraphs(getData());
});