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
        let newAngle = amperage >= 0 ? this.degree - 90 : this.degree + 90;
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
        this.amperage = amperage
        this.point = point
    }
}

const currents = [
    new Current(-10, new Point(25, 25)),
];

function countDist(firstPoint, secondPoint) {
    return Math.sqrt(Math.pow(secondPoint.x - firstPoint.x, 2) + Math.pow(secondPoint.y - firstPoint.y, 2))
}

function scalarB(amperage, dist) {
    if (dist === 0) {
        return 0
    }

    return coeffK * (amperage / dist)
}


function angleToLibAngle(angle) {
    return (360 - (angle + 90));
    // (360 - (angle + 90)) % 360;
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

const pointsArray = generatePoints(50); // maximum 100
let vectorData = []

for (let point of pointsArray) {
    let vectors = []

    for (let current of currents) {
        if (point.x === 24 && point.y === 28) {
            console.log()
        }
        let vector = new Vector(
            Math.atan2(point.y - current.point.y, point.x - current.point.x) * 180 / Math.PI,
            scalarB(current.amperage, countDist(current.point, point)))

        vector.rotation90(current.amperage)
        vectors.push(vector)
    }

    let finalVector = new Vector(0, 1)
    finalVector.sumWithOtherVectors(vectors)

    vectorData.push([point.x, point.y, 1, angleToLibAngle(finalVector.degree), '#0004ff'])
}

vectorData.push([65, 60, 1, 315, '#ff0000'])
let currentData = []
for (const current of currents) {
    currentData.push([current.point.x, current.point.y])
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
    /*tooltip: {
        enabled: false // Отключаем всплывающие подсказки
    },*/
    pane: {
        startAngle: 90,
        endAngle: 450
    },
    colorAxis: {
        min: 0, // Минимальное значение цветовой шкалы
        max: 200, // Максимальное значение цветовой шкалы
        stops: [[0, '#FF0000'], // Красный цвет для минимального значения
            [0.5, '#FFFF00'], // Желтый цвет для среднего значения
            [1, '#00FF00'] // Зеленый цвет для максимального значения
        ],
    }, plotOptions: {
        series: {
            turboThreshold: 10500, states: {
                /*hover: {
                    enabled: false // Отключаем подсветку при наведении мышью
                },*/
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