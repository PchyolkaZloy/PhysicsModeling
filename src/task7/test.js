let stepCount = 50000;
let t = new Array(stepCount + 1).fill(0).map((d, i) => 3 * i / stepCount);
let y = t.map(t => t * t + Math.sin(t * 30));

let frames = [];
let sliderSteps = [];
let step = Math.trunc(stepCount / (5 * 60));


for (let i = 0; i <= stepCount; i += step) {
    sliderSteps.push({
        label: t[i],
        method: 'animate',
        args: [[t[i]], {
            frame: {duration: 0, redraw: false},
            mode: 'immediate',
        }]
    });

    frames.push({
        name: t[i],
        data: [{y: y.slice(0, i + 1)}]
    });
}


Plotly.newPlot('graph', {
    data: [{
        x: t,
        y: y,
        mode: 'lines',
        id: t,
    }],
    layout: {
        updatemenus: [{
            type: 'buttons',
            xanchor: 'left',
            yanchor: 'top',
            direction: 'right',
            x: 0,
            y: 0,
            pad: {t: 60},
            showactive: true,

            buttons: [
                {
                    label: 'Play',
                    method: 'animate',
                    args: [null, {
                        transition: {duration: 0},
                        frame: {duration: 0, redraw: false},
                        mode: 'immediate',
                        fromcurrent: true,
                    }]
                },
                {
                    label: 'Pause',
                    method: 'animate',
                    args: [[null], {
                        frame: {duration: 0, redraw: false},
                        mode: 'immediate',
                    }]
                }]
        }],

        sliders: [{
            currentvalue: {
                prefix: 't = ',
                xanchor: 'right'
            },
            pad: {l: 130, t: 30},
            transition: {duration: 0},
            steps: sliderSteps
        }]
    },
    frames: frames,
    config: {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    }
});

