const coeffK = (1.256637 * Math.PI * Math.pow(10, -6)) / 2 * Math.PI

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vector {
    constructor(point) {
        this.point = point
        this.degree = Math.atan2(point.y, point.x) * 180 / Math.PI
    }

    normalize() {
        let length = Math.sqrt(this.point.x ** 2 + this.point.y ** 2)
        this.point.x = this.point.x / length
        this.point.y = this.point.y / length
    }

    prodByNumber(number) {
        this.point.x = this.point.x * number
        this.point.y = this.point.y * number
    }
}

class Current {
    constructor(amperage, point) {
        this.amperage = amperage
        this.point = point
    }
}


function countDist(firstPoint, secondPoint) {
    return Math.sqrt(Math.pow(secondPoint.x - firstPoint.x, 2) + Math.pow(secondPoint.y - firstPoint.y, 2))
}

function scalarB(amperage, dist) {
    if (dist === 0) {
        return 0
    }

    return coeffK * (amperage / dist)
}