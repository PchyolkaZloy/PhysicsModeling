/**
 * position - 3d vector<int>
 * velocity - 3d vector<float>
 * charge can be negative
 * mass - const
 * @type {{charge: number, mass: number, positions: {x: *[], y: *[], z: *[]}, velocity: number[]}}
 */
let particle = {
    velocity: [1.0, 1.0, 0.0],
    charge: 1,
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


function vectorProd(vec1, vec2) {
    return [
        vec1[1] * vec2[2] - vec1[2] * vec2[1],
        vec1[2] * vec2[0] - vec1[0] * vec2[2],
        vec1[0] * vec2[1] - vec1[1] * vec2[0]
    ];
}

function vectorProdWithNum6D(vec, num) {
    return [num * vec[0], num * vec[1], num * vec[2], num * vec[3], num * vec[4], num * vec[5]]
}

function vectorSum6D(vec1, vec2) {
    return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2],
        vec1[3] + vec2[3], vec1[4] + vec2[4], vec1[5] + vec2[5]]
}

function func(vec) {
    let vel_vec = [vec[3], vec[4], vec[5]]
    let F = vectorProdWithNum6D(vectorProd(vel_vec, magneticInduction), particle.charge);

    particle.positions.x.push(vel_vec[0])
    particle.positions.y.push(vel_vec[1])
    particle.positions.z.push(vel_vec[2])

    return [vel_vec[0], vel_vec[1], vel_vec[2],
        F[0] / particle.mass, F[1] / particle.mass, F[2] / particle.mass];
}

const dt = 0.05
N = 1000

function midpoint() {
    var t = Array.from(Array(N + 1), (_, k) => k * dt);
    var y = Array(N + 1).fill(0);

    y[0] = [particle.positions.x[0], particle.positions.y[0], particle.positions.z[0],
        particle.velocity[0], particle.velocity[1], particle.velocity[2]]

    for (let i = 0; i < N; i++) {
        const k1 = func(y[i]);
        const k2 = func(vectorSum6D(y[i], vectorProdWithNum6D(k1, dt / 2)));

        y[i + 1] = vectorSum6D(y[i], vectorProdWithNum6D(k2, dt));
    }

    return y;
}

y = midpoint()

particle.positions.x = []
particle.positions.y = []
particle.positions.z = []

for (let i = 0; i < y.length; i++) {
    particle.positions.x.push(y[i][0])
    particle.positions.y.push(y[i][1])
    particle.positions.z.push(y[i][2])
}

console.log(particle.positions)

var data = [
    {
        type: 'scatter3d',
        mode: 'lines',
        x: particle.positions.x,
        y: particle.positions.y,
        z: particle.positions.z,
    },
];
var layout = {
    autosize: true,

};

Plotly.newPlot('myDiv', data, layout);

