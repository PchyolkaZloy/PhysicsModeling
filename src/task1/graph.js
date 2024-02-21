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


/**
 * @source https://jurasic.dev/ode/
 * @returns {any[]}
 */
function countWithMidPoint(stepCount, dt) {
    var y_vec6D = Array(stepCount + 1);

    y_vec6D[0] = [particle.positions.x[0], particle.positions.y[0], particle.positions.z[0],
        particle.velocity[0], particle.velocity[1], particle.velocity[2]]

    for (let i = 0; i < stepCount; i++) {
        var k1_vec6D = func(y_vec6D[i]);
        var k2_vec6D = func(vectorSum6D(y_vec6D[i], vectorProdWithNum6D(k1_vec6D, dt / 2)));

        y_vec6D[i + 1] = vectorSum6D(y_vec6D[i], vectorProdWithNum6D(k2_vec6D, dt));

        particle.positions.x.push(y_vec6D[i][0])
        particle.positions.y.push(y_vec6D[i][1])
        particle.positions.z.push(y_vec6D[i][2])
    }

    return y_vec6D;
}

function drawGraph(formGraphData) {
    particle.charge = formGraphData.charge
    particle.velocity = formGraphData.velocity
    magneticInduction = formGraphData.induction
    particle.mass = formGraphData.mass

    const dt = formGraphData.time / formGraphData.steps

    countWithMidPoint(formGraphData.steps, dt)


    let data = [
        {
            type: 'scatter3d',
            mode: 'lines',
            name: "Movement",
            marker: {
                color: 'rgb(7,113,171)',
                size: 8
            },
            x: particle.positions.x,
            y: particle.positions.y,
            z: particle.positions.z,
        },
        {
            type: 'scatter3d',
            mode: 'lines',
            name: 'Induction',
            font: {
                family: 'Arial, serif',
                size: 18,
                color: 'black'
            },
            marker: {
                color: 'rgb(255,0,175)',
                size: 80,
            },
            x: [0, magneticInduction[0]],
            y: [0, magneticInduction[1]],
            z: [0, magneticInduction[1]],

        },
    ];
    let layout = {
        title: {
            text: '$\\text{Charge Trajectory in Magnetic Field}$',
            font: {
                size: 18
            }
        },
        margin: {
            l: 0,
            r: 0,
            b: 10,
            t: 80,
        },
        showlegend: true,
        legend: {
            font: {
                family: 'Arial, serif',
                size: 16,
                color: 'black',
            },
            x: 1,
            xanchor: 'right',
            y: 0.5,
        },
        paper_bgcolor: 'rgba(239,239,239,0.82)',
        scene: {
            xaxis: {
                title: {
                    text: '<b>X</b>',
                    font: {
                        family: 'Arial, serif',
                        size: 18,
                        color: 'black'
                    }
                },
                showgrid: true,
                zeroline: true,
                showline: true,
                gridcolor: '#bdbdbd',
                gridwidth: 2,
                zerolinecolor: '#969696',
                zerolinewidth: 4,
                linecolor: '#636363',
                linewidth: 10
            },
            yaxis: {
                title: {
                    text: '<b>Y</b>',
                    font: {
                        family: 'Arial, serif',
                        size: 18,
                        color: 'black'
                    }
                },
                showgrid: true,
                zeroline: true,
                showline: true,
                gridcolor: '#bdbdbd',
                gridwidth: 2,
                zerolinecolor: '#969696',
                zerolinewidth: 4,
                linecolor: '#636363',
                linewidth: 10
            },
            zaxis: {
                title: {
                    text: '<b>Z</b>',
                    font: {
                        family: 'Arial, serif',
                        size: 18,
                        color: 'black'
                    }
                },
                showgrid: true,
                zeroline: true,
                showline: true,
                gridcolor: '#bdbdbd',
                gridwidth: 2,
                zerolinecolor: '#969696',
                zerolinewidth: 4,
                linecolor: '#636363',
                linewidth: 10
            }
        },

    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    }

    Plotly.newPlot('graph', data, layout, config);

    particle.positions.x = [0]
    particle.positions.y = [0]
    particle.positions.z = [0]
}


const defaultGraphData = {
    charge: 1,
    induction: [1, 0, 0],
    velocity: [1, 1, 0],
    time: 50,
    steps: 100000,
    mass: 1
}

drawGraph(defaultGraphData)