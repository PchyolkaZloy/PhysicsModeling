/**
 * @source https://en.wikipedia.org/wiki/Helmholtz_coil
 * @type {number}
 */
const magneticConst = 1.257 * Math.PI * Math.pow(10, -6)

let graphData = {
    R : 1,
    I : 1,
    b1: [],
    b2: [],
    b: []
}

function func(x, R, I) {
    return (magneticConst * I * Math.pow(R, 2)) / (2 * Math.pow((Math.pow(R, 2) + Math.pow(x, 2)), 1.5))
}

function count(stepCount, xMax) {

}


function drawGraph(formGraphData) {
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
        autosize: true,
        margin: {
            l: 0,
            r: 10,
            b: 10,
            t: 10,
        },
        showlegend: true,
        legend: {
            font: {
                family: 'Arial, serif',
                size: 18,
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

    Plotly.newPlot('graph', data, layout);

    particle.positions.x = [0]
    particle.positions.y = [0]
    particle.positions.z = [0]
}


drawGraph(defaultGraphData)

let graphDiv = document.getElementById('graph');

function resizePlot() {
    Plotly.relayout(graphDiv,
        {
            width: graphDiv.offsetWidth,
            height: graphDiv.offsetHeight
        });
}

window.addEventListener('DOMContentLoaded', resizePlot);
window.addEventListener('resize', resizePlot);