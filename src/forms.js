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

function getData(form) {
    let formData = new FormData(form);
    console.log(formData.entries())

    let formGraphData = {
        charge: parseFloat(formData.getAll("charge") ?? "1"),
        velocity: parseDataTo3DArray(formData.getAll("velocity")[0].split(" "), [1, 1, 0]),
        induction: parseDataTo3DArray(formData.getAll("induction")[0].split(" "), [1, 0, 0]),
    }

    console.log(formGraphData)

    return formGraphData
}

document.getElementById("myForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraph(getData(e.target));
});
