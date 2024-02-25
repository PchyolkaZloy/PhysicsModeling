const coeffK = (1.256637 * Math.PI * Math.pow(10, -6)) / 2 * Math.PI

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vector {
    constructor(startPoint, degree, length) {
        this.startPoint = startPoint;
        this.degree = degree;
        this.length = length;
    }

    rotation90(amperage) {
        this.degree = amperage >= 0 ? this.degree - 90 : this.degree + 90;
    }

    sumWithOtherVectors(vectors) {
        let totalX = 0;
        let totalY = 0;

        for (let vector of vectors) {
            const radians = vector.degree * (Math.PI / 180);

            totalX += Math.cos(radians) * vector.length;
            totalY += Math.sin(radians) * vector.length;
        }

        this.degree = Math.atan2(totalY, totalX) * (180 / Math.PI);
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
    new Current(1, new Point(50, 50)),
    new Current(1, new Point(60, 60)),

]

function countDist(firstPoint, secondPoint) {
    return Math.sqrt(Math.pow(secondPoint.x - firstPoint.x, 2) + Math.pow(secondPoint.y - firstPoint.y, 2))
}

function scalarB(amperage, dist) {
    if (dist === 0) {
        return 0
    }

    return coeffK * (amperage / dist)
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
        let vector = new Vector(
            point,
            Math.atan2(point.x - current.point.x, point.y - current.point.y) * 180 / Math.PI,
            1)

        vector.rotation90(current.amperage)
        vectors.push(vector)
    }

    let finalVector = new Vector(point, 0, 1)
    finalVector.sumWithOtherVectors(vectors)

    vectorData.push([finalVector.startPoint.x, finalVector.startPoint.y, 1, finalVector.degree, '#0004ff'])
}

let currentData = []
for (const current of currents) {
    currentData.push([current.point.x, current.point.y])
}

Highcharts.chart('graph', {

    title: {
        text: 'Magnetic field'
    }, xAxis: {
        min: 0, max: 100, gridLineWidth: 1
    }, yAxis: {
        min: 0, max: 100, gridLineWidth: 1
    }, /*tooltip: {
        enabled: false // Отключаем всплывающие подсказки
    },*/
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
        }, vector: {
            rotationOrigin: "start",
            vectorLength: 10,
        }
    },

    series: [{
        type: 'vector',
        name: 'Magnetic field',
        keys: ['x', 'y', 'length', 'direction', 'color'],
        data: vectorData,
        colorKey: 'length'
    }, {
        type: 'scatter',
        name: 'Points',
        color: 'black',
        data: currentData,
        marker: {
            symbol: 'circle', radius: 4
        }
    }]
});