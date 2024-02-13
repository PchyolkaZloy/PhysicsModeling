/**
 * position - 3d vector<int>
 * velocity - 3d vector<float>
 * charge can be negative
 * mass - const
 * @type {{charge: number, mass: number, positions: {x: *[], y: *[], z: *[]}, velocity: number[]}}
 */
let particle = {
    velocity: [1.0, 1.0, 0.0],
    charge: -1,
    mass: 1,
    positions: {
        x: [0.0],
        y: [0.0],
        z: [0.0]
    }
};

/**
 * induction - 3d vector<float>
 * @type number[]
 */
let magneticInduction = [1.0, 0.0, 0.0]


function vectorProd(firstVec3D, secondVec3D) {
    return [
        firstVec3D[1] * secondVec3D[2] - firstVec3D[2] * secondVec3D[1],
        firstVec3D[2] * secondVec3D[0] - firstVec3D[0] * secondVec3D[2],
        firstVec3D[0] * secondVec3D[1] - firstVec3D[1] * secondVec3D[0]
    ];
}

function vectorProdWithNum6D(vec6D, num) {
    return [num * vec6D[0], num * vec6D[1], num * vec6D[2],
        num * vec6D[3], num * vec6D[4], num * vec6D[5]]
}

function vectorSum6D(firstVec6D, secondVec6D) {
    return [firstVec6D[0] + secondVec6D[0], firstVec6D[1] + secondVec6D[1], firstVec6D[2] + secondVec6D[2],
        firstVec6D[3] + secondVec6D[3], firstVec6D[4] + secondVec6D[4], firstVec6D[5] + secondVec6D[5]]
}

function func(vec6D) {
    let vel_vec = [vec6D[3], vec6D[4], vec6D[5]]
    let F = vectorProdWithNum6D(vectorProd(vel_vec, magneticInduction), particle.charge);

    return [vel_vec[0], vel_vec[1], vel_vec[2],
        F[0] / particle.mass, F[1] / particle.mass, F[2] / particle.mass];
}

const stepCount = 100000
const t0 = 0
const tEnd = 50
const dt = (tEnd - t0) / stepCount

/**
 * @source https://jurasic.dev/ode/
 * @returns {any[]}
 */
function countWithMidPoint() {
    let y_vec6D = Array(stepCount + 1).fill(0);

    y_vec6D[0] = [particle.positions.x[0], particle.positions.y[0], particle.positions.z[0],
        particle.velocity[0], particle.velocity[1], particle.velocity[2]]

    for (let i = 0; i < stepCount; i++) {
        const k1_vec6D = func(y_vec6D[i]);
        const k2_vec6D = func(vectorSum6D(y_vec6D[i], vectorProdWithNum6D(k1_vec6D, dt / 2)));

        y_vec6D[i + 1] = vectorSum6D(y_vec6D[i], vectorProdWithNum6D(k2_vec6D, dt));

        particle.positions.x.push(y_vec6D[i][0])
        particle.positions.y.push(y_vec6D[i][1])
        particle.positions.z.push(y_vec6D[i][2])
    }

    return y_vec6D;
}

countWithMidPoint()


let data = [
    {
        type: 'scatter3d',
        mode: 'lines',
        x: particle.positions.x,
        y: particle.positions.y,
        z: particle.positions.z,
    },
];
let layout = {
    autosize: true,
    width: 1200,
    height: 600,
    margin: {
        l: 0,
        r: 0,
        b: 10,
        t: 10,
    },

};

Plotly.newPlot('myDiv', data, layout);

