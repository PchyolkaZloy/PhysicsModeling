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
    let minLength = 1000000000000;
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
        ["#2f00ff", "#1d68fa", "#199ca9",
            "#00f7ff", "#5eff00", "#faee00",
            "#ff8800", "#da2424", "#ff0000"];


    let colorCoeff = Math.round(((length - maxMinLength.min) / (maxMinLength.max - maxMinLength.min) * (colors.length - 1)));

    return colors[colorCoeff];
}

const currents = [
    new Current(100, new Point(25, 25)),
    new Current(-100, new Point(45, 45)),
    new Current(100, new Point(45, 25)),
    new Current(-100, new Point(25, 45)),
];

const pointsArray = generatePoints(70); // maximum 100
let vectorData = []

for (let point of pointsArray) {
    let vectors = []

    for (let current of currents) {
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
    currentData.push([current.point.x, current.point.y])
}

let maxMin = findMaximumAndMinimumLength(vectorData)

for (const vector of vectorData) {
    const lengthIndex = 2;
    vector.push(colorizeVectorByLength(maxMin, vector[lengthIndex]));
    vector[lengthIndex] = 1;
}


Highcharts.chart('graph', {
    title: {
        text: 'Magnetic field'
    },
    xAxis: {
        min: 0, max: 100, gridLineWidth: 1
    },
    yAxis: {
        min: 0, max: 100, gridLineWidth: 1
    },
    tooltip: {
        enabled: false // Отключаем всплывающие подсказки
    },
    pane: {
        startAngle: 90,
        endAngle: 450
    },
    colorAxis: {
        min: 0, // Минимальное значение цветовой шкалы
        max: 200, // Максимальное значение цветовой шкалы
        stops: [[0, '#e01010'], // Красный цвет для минимального значения
            [0.5, '#FFFF00'], // Желтый цвет для среднего значения
            [1, '#00FF00'] // Зеленый цвет для максимального значения
        ],
    }, plotOptions: {
        series: {
            turboThreshold: 10500, states: {
                hover: {
                    enabled: false // Отключаем подсветку при наведении мышью
                },
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
            keys: ['x', 'y', 'length', 'direction', 'color'],
            data: vectorData,
            colorKey: 'length'
        },
        {
            type: 'scatter',
            name: 'Points',
            color: 'black',
            data: currentData,
            marker: {
                symbol: 'circle', radius: 6
            }
        }
    ]
});