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

    const defaultValues = [
        [-1, [35, 35]],
        [1, [35, 65]],
        [1, [65, 35]],
        [-1, [65, 65]],
    ]

    const coordinatesSet = new Set();

    checkboxes.forEach((checkbox, index) => {
        const amperageInput = document.getElementById(`amperage${index + 1}`);
        const coordinatesInput = document.getElementById(`coordinates${index + 1}`);

        if (!amperageInput.disabled && !coordinatesInput.disabled) {
            const amperage = customParseFloat(amperageInput, defaultValues[index][0]);
            const coordinates = parseDataToArray(coordinatesInput, defaultValues[index][1]);

            const coordinateString = JSON.stringify(coordinates);
            if (coordinatesSet.has(coordinateString)) {
                alert("Multiple coordinates detected! Setting to default values...");

                checkboxes.forEach((element, i) => {
                    const amperageInput = document.getElementById(`amperage${i + 1}`);
                    const coordinatesInput = document.getElementById(`coordinates${i + 1}`);
                    amperageInput.value = defaultValues[i][0];
                    coordinatesInput.value = `${defaultValues[i][1][0]} ${defaultValues[i][1][1]}`;
                });

                graphData.currents = [];
                defaultValues.forEach(row => {
                    graphData.currents.push({
                        amperage: row[0],
                        coordinates: row[1],
                    });
                });
                return;
            } else {
                coordinatesSet.add(coordinateString);
            }

            graphData.currents.push({
                amperage: amperage,
                coordinates: coordinates,
            });
        }
    });

    graphData.vectorsCount = customParseInteger(document.getElementById("vectorsCount"), graphData.vectorsCount);
    graphData.vectorLength = customParseInteger(document.getElementById("vectorLength"), graphData.vectorLength);

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