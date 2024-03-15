/*
https://ru.wikipedia.org/wiki/%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%BF%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%BD%D0%B0%D1%8F
https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D0%B3%D0%BD%D0%B8%D1%82%D0%BD%D0%B0%D1%8F_%D0%BF%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%BD%D0%B0%D1%8F
 */

const lightSpeedSquared = 299792458 ** 2;


function magneticInductionAmplitude(radialCoordinate, radius, diameter, voltageAmplitude, angularVelocity) {
    if (radialCoordinate < radius) {
        return (radialCoordinate * voltageAmplitude * angularVelocity) / (2 * lightSpeedSquared * diameter);
    } else {
        return (radius ** 2 * voltageAmplitude * angularVelocity) / (2 * radialCoordinate * lightSpeedSquared * diameter);
    }
}


function magneticInduction(magneticInductionAmplitude, angularVelocity, time) {
    return magneticInductionAmplitude * Math.cos(angularVelocity * time);
}


function countMagneticInductionAmplitudeData(radius, diameter, voltageAmplitude, angularVelocity, stepCount, endRadialCoordinate) {
    const step = endRadialCoordinate / stepCount;

    let radialCoordinatesData = [];
    let magneticInductionAmplitudeData = [];

    for (let coordinate = 0; coordinate <= endRadialCoordinate; coordinate += step) {
        magneticInductionAmplitudeData.push(
            magneticInductionAmplitude(coordinate, radius, diameter, voltageAmplitude, angularVelocity))
        radialCoordinatesData.push(coordinate);
    }

    return {magneticInductionAmplitudeData, radialCoordinatesData};
}


function countMagneticInductionDataForRadialCoordinate(radialCoordinate, radius, diameter, voltageAmplitude, angularVelocity, stepCount, endTime) {
    const step = endTime / stepCount;
    const magneticInductionAmplitudeValue = magneticInductionAmplitude(radialCoordinate, radius, diameter, voltageAmplitude, angularVelocity);

    let timeData = [];
    let magneticInductionData = [];

    for (let time = 0; time <= endTime; time += step) {
        magneticInductionData.push(magneticInduction(magneticInductionAmplitudeValue, angularVelocity, time));
        timeData.push(time);
    }

    return {magneticInductionData, timeData};
}


function drawGraphs(graphData) {
    const {
        magneticInductionAmplitudeData,
        radialCoordinatesData
    } = countMagneticInductionAmplitudeData(
        graphData.radius,
        graphData.diameter,
        graphData.voltageAmplitude,
        graphData.angularVelocity,
        graphData.stepCount,
        graphData.endRadialCoordinate
    );

    const {
        magneticInductionData,
        timeData
    } = countMagneticInductionDataForRadialCoordinate(
        graphData.radialCoordinate,
        graphData.radius,
        graphData.diameter,
        graphData.voltageAmplitude,
        graphData.angularVelocity,
        graphData.stepCount,
        graphData.endTime
    );

    const magneticInductionAmplitudeGraphData = {
        x: radialCoordinatesData,
        y: magneticInductionAmplitudeData,
        mode: 'lines',
        type: 'scatter',
        name: "$B_0(r)$",
        hovertemplate: '<b>B_0(r)</b>: %{y}<extra></extra>'
    };

    const magneticInductionGraphData = {
        x: timeData,
        y: magneticInductionData,
        mode: 'lines',
        type: 'scatter',
        name: "$B(t)$",
        hovertemplate: '<b>B(t)</b>: %{y}<extra></extra>'
    };

    magneticInductionGraphData.xaxis = 'x2';
    magneticInductionGraphData.yaxis = 'y2';

    const layout = {
        grid: {
            rows: 1,
            columns: 2,
            pattern: 'independent',
        },
        title: {
            text: `$\\text{Magnetic Induction Amplitude } B_0(r) \\text{ and Magnetic Induction } B(t) \\text{ for r = ${graphData.radialCoordinate}m }$`,
            font: {
                size: 20
            }
        },
        xaxis: {
            showspikes: true,
            fixedrange: true,
            title: '$\\text{Radial coordinate } r, m$',
        },
        yaxis: {
            showspikes: true,
            title: '$\\text{Magnetic Induction Amplitude } B_0, T$'
        },

        xaxis2: {
            showspikes: true,
            fixedrange: true,
            title: '$\\text{Time } t, sec$',
        },
        yaxis2: {
            showspikes: true,
            title: '$\\text{Magnetic Induction } B, T$'
        },

        margin: {
            l: 65,
            r: 25,
            t: 85
        },

        showlegend: false,
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot('graph', [magneticInductionAmplitudeGraphData, magneticInductionGraphData], layout, config);
}

const defaultGraphData = {
    radius: 0.03,
    diameter: 0.005,
    voltageAmplitude: 150,
    angularVelocity: 120 * Math.PI,
    radialCoordinate: 0.02,
    endRadialCoordinate: 0.2,
    endTime: 0.1,
    stepCount: 10000
};

drawGraphs(defaultGraphData);