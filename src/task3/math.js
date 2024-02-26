const coeffK = (1.256637 * Math.PI * Math.pow(10, -6)) / 2 * Math.PI

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function normalizeAngle(angle) {
    while (angle >= 360) {
        angle -= 360;
    }

    while (angle < 0) {
        angle += 360;
    }

    return angle;
}

class Vector {
    constructor(degree, length) {
        this.degree = normalizeAngle(degree);
        this.length = length;
    }

    rotation90(amperage) {
        let newAngle = amperage >= 0 ? this.degree + 90 : this.degree - 90;
        this.degree = normalizeAngle(newAngle)
    }

    sumWithOtherVectors(vectors) {
        let totalX = 0;
        let totalY = 0;

        for (let vector of vectors) {
            const radians = vector.degree * (Math.PI / 180);

            totalX += Math.cos(radians) * vector.length;
            totalY += Math.sin(radians) * vector.length;
        }

        this.degree = normalizeAngle(Math.atan2(totalY, totalX) * (180 / Math.PI));
        this.length = Math.sqrt(totalX ** 2 + totalY ** 2);
    }
}

class Current {
    constructor(amperage, point) {
        this.amperage = amperage;
        this.point = point;
    }
}

function countDist(firstPoint, secondPoint) {
    return Math.sqrt((secondPoint.x - firstPoint.x) ** 2 + (secondPoint.y - firstPoint.y) ** 2);
}

function scalarB(amperage, dist) {
    if (dist === 0) {
        return 0;
    }

    return coeffK * (Math.abs(amperage) / dist);
}


function angleToLibAngle(angle) {
    return normalizeAngle(360 - (angle + 90));
}


function generatePoints(n) {
    const maximum = 100
    let step = maximum / n
    const points = [];
    for (let x = 0; x <= maximum; x += step) {
        for (let y = 0; y <= maximum; y += step) {
            points.push(new Point(x, y));
        }
    }
    return points;
}

function findMaximumAndMinimumLength(vectorData) {
    let minLength = 10000;
    let maxLength = -1;
    const lengthIndex = 2;

    for (const vector of vectorData) {
        if (vector[lengthIndex] > maxLength) {
            maxLength = vector[lengthIndex];
        } else if (vector[lengthIndex] < minLength) {
            minLength = vector[lengthIndex]
        }
    }

    return {min: minLength, max: maxLength}
}


function colorizeVectorByLength(maxMinLength, length) {
    const colors =
        ["#5d3eef", "#2f00ff", "#1d68fa",
            "#00f7ff", "#5eff00", "#faee00",
            "#ff8800", "#ff5600", "#ff0000"];

    const proportions = [0, 0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.8, 0.9];

    let colorCoeff = ((length - maxMinLength.min) / (maxMinLength.max - maxMinLength.min));

    for (let i = 0; i < proportions.length; ++i) {
        if (colorCoeff <= proportions[i]) {
            return colors[i];
        }
    }

    return colors[colors.length - 1];
}

const currents = [
    new Current(100, new Point(25, 25)),

];

const pointsArray = generatePoints(90); // maximum 100
let vectorData = []

for (let point of pointsArray) {
    let vectors = []

    for (let current of currents) { // TODO проверять координаты токов
        let vector = new Vector(
            Math.atan2(point.y - current.point.y, point.x - current.point.x) * 180 / Math.PI,
            scalarB(current.amperage, countDist(current.point, point)))

        vector.rotation90(current.amperage)
        vectors.push(vector)
    }

    let finalVector = new Vector(0, 1)
    finalVector.sumWithOtherVectors(vectors)

    if (finalVector.length > 0) {
        vectorData.push([point.x, point.y, finalVector.length, angleToLibAngle(finalVector.degree)])
    }
}

let currentData = []
for (const current of currents) {
    currentData.push([current.point.x, current.point.y, current.amperage])
}

let maxMin = findMaximumAndMinimumLength(vectorData)

for (const vector of vectorData) {
    const lengthIndex = 2;
    vector.push(colorizeVectorByLength(maxMin, vector[lengthIndex]));
    vector.push(vector[lengthIndex]);
    vector[lengthIndex] = 1;
}


Highcharts.chart('graph', {
    colorAxis: {
        min: maxMin.min,
        max: maxMin.max - maxMin.min,
        stops: [
            [0, "#5d3eef"],
            [0.05, '#0000FF'],
            [0.1, "#00f7ff"],
            [0.2, "#faee00"],
            [0.4, "#ff8800"],
            [0.9, "#ff0000"]
        ],
    },

    title: {
        text: 'Magnetic field created by several currents'
    },

    xAxis: {
        min: 0,
        max: 100,
        gridLineWidth: 1
    },

    yAxis: {
        min: 0,
        max: 100,
        gridLineWidth: 1
    },

    tooltip: {
        formatter: function () {
            if (this.series.type === 'vector') {
                return '<b>X: ' + this.point.x + '<br>Y: ' + this.point.y +
                    '<br>Direction: ' + this.point.direction + '°' +
                    '<br>Scalar: ' + this.point.scalar + ' T';
            } else if (this.series.type === 'scatter') {
                const amperageIndex = 2;
                return '<b>X: ' + this.point.x + '<br>Y: ' + this.point.y + '<br>Amperage: ' + currentData[this.point.index][amperageIndex];
            }
        }
    },

    plotOptions: {
        series: {
            turboThreshold: 10500,
            states: {
                inactive: {
                    opacity: 1
                },
            },
        },
        vector: {
            rotationOrigin: "start",
            vectorLength: 10,
        }
    },

    series: [
        {
            type: 'vector',
            name: 'Magnetic field',
            keys: ['x', 'y', 'length', 'direction', 'color', 'scalar'],
            colorKey: 'scalar',
            data: vectorData,
            showInLegend: true
        },
        {
            type: 'scatter',
            name: 'Currents',
            color: 'red',
            data: currentData,
            marker: {
                symbol: 'circle', radius: 6
            },
            showInLegend: true
        },
    ]
});

vectorData = []