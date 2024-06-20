function parseDataTo3DArray(array, defaultArray) {
    let numberArray = []
    for (const elem of array) {
        if (isNaN(elem)) {
            return defaultArray
        }
        numberArray.push(parseFloat(elem))
    }

    return numberArray
}

function customIntegerParse(name, numberString, defaultValue) {
    if (isNaN(numberString) || numberString <= 0) {
        numberString = defaultValue
        alert(name + " have to be integer number > 0. Setting to default value: " + defaultValue)
        document.getElementById(name).value = defaultValue
    } else {
        numberString = parseInt(numberString)
    }

    return numberString
}

function getData(form) {
    let formData = new FormData(form);

    return {
        charge: parseFloat(formData.getAll("charge") ?? "1"),
        velocity: parseDataTo3DArray(formData.getAll("velocity")[0].split(" "), [1, 1, 0]),
        induction: parseDataTo3DArray(formData.getAll("induction")[0].split(" "), [1, 0, 0]),
        time: parseFloat(formData.getAll("time") ?? "50"),
        steps: customIntegerParse("steps", formData.getAll("steps"), 100000),
        mass: parseFloat(formData.getAll("mass") ?? "1")
    }
}

document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraph(getData(e.target));
});
