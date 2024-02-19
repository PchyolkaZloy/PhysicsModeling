function getData(form) {
    let formData = new FormData(form);

    return {
        R: parseFloat(formData.getAll("radius") ?? "1"),
        I: parseFloat(formData.getAll("amperage") ?? "1"),
        amount: parseFloat(formData.getAll("amount") ?? "10"),
        dist: parseFloat(formData.getAll("dist") ?? "1"),
        stepCount: parseFloat(formData.getAll("steps") ?? "10000"),
    }
}

document.getElementById("graphForm").addEventListener("submit", function (e) {
    e.preventDefault();
    drawGraph(getData(e.target));
});


var radiusInput = document.getElementById('radius');
var distInput = document.getElementById('dist');

radiusInput.addEventListener('input', function () {
    distInput.value = this.value;
});