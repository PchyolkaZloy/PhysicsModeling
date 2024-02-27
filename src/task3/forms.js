function customParseFloat(element, defaultValue) {
    if (isNaN(element.value)) {
        element.value = defaultValue
        alert(element.value + " have to be float number => 0 && <= 100. Setting to default value: " + defaultValue)
    }

    return parseFloat(element.value);
}

function parseDataToArray(element, defaultArray) {
    let numberArray = [];
    const arr = element.value.split(" ");
    for (const elem of arr) {
        if (isNaN(elem) || (elem < 0 || elem > 100)) {
            alert(elem.name + " have to be float number => 0 && <= 100. Setting to default value: "
                + `${defaultArray[0]} ${defaultArray[1]}`);
            element.value = `${defaultArray[0]} ${defaultArray[1]}`;
            return defaultArray;
        }
        numberArray.push(parseFloat(elem));
    }

    return numberArray;
}

function customParseInteger(element, defaultValue) {
    if (element.name === "vectorsCount") {
        const minVectorCount = 10;
        const maxVectorCount = 150;

        if (isNaN(element.value) || element.value < minVectorCount || element.value > maxVectorCount) {
            element.value = defaultValue
            alert(element.name + " have to be integer number in [10; 150]. Setting to default value: " + defaultValue)
        }
    } else if (isNaN(element.value) || element.value <= 0) {
        element.value = defaultValue
        alert(element.name + " have to be integer number > 0. Setting to default value: " + defaultValue)
    }

    return parseInt(element.value);
}


const checkboxes = document.querySelectorAll('.form-check-input');

function getData() {
    const graphData = {
        currents: [],
        vectorsCount: 75,
        vectorLength: 10,
    };

    const defaultCoordinates = [
        [35, 35],
        [35, 65],
        [65, 35],
        [65, 65],
    ]

    checkboxes.forEach((checkbox, index) => {
        const amperageInput = document.getElementById(`amperage${index + 1}`);
        const coordinatesInput = document.getElementById(`coordinates${index + 1}`);

        if (!amperageInput.disabled && !coordinatesInput.disabled) {
            graphData.currents.push({
                amperage: customParseFloat(amperageInput, 1),
                coordinates: parseDataToArray(coordinatesInput, defaultCoordinates[index]),
            });
        }
    });

    graphData.vectorsCount = customParseInteger(document.getElementById("vectorsCount"), graphData.vectorsCount);
    graphData.vectorLength = customParseInteger(document.getElementById("vectorLength"), graphData.vectorLength);

    console.log(graphData)
    return graphData;
}

document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    countAndDrawMagneticField(getData());
});


checkboxes.forEach((checkbox, index) => {
    const amperageInput = document.getElementById(`amperage${index + 1}`);
    const coordinatesInput = document.getElementById(`coordinates${index + 1}`);

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            amperageInput.disabled = false;
            coordinatesInput.disabled = false;
        } else {
            amperageInput.disabled = true;
            coordinatesInput.disabled = true;
        }
    });
});