// Limit input of spinbox
function limit_input(min_val, max_val) {
    return function () {
        const val = this.value;
        if (val < min_val || val > max_val) {
            this.value = null;
        }
    };
}

document.getElementById('x_r_spinbox').oninput = limit_input(0, 1)
document.getElementById('Bi_spinbox').oninput = limit_input(0, 1000)
document.getElementById('Fo_spinbox').oninput = limit_input(0, 1000)

// Update plot
plt.update_plot = function (line = true) {
    if (line) this.plotData[0].y = this.line.T_r;
    this.plotData[1].x = [this.Fo]
    this.plotData[1].y = [this.T_r]

    Plotly.react('plot', this.plotData, this.layout);
}

// Update x_d
update_x_r = function () {
    plt.x_r = parseFloat(document.getElementById('x_r_spinbox').value);
    plt.interp_data()
    plt.interp_T_r()
    plt.update_plot()

    // plt.plotData[0].y = plt.line.T_r;
    // Plotly.react('plot', plt.plotData, plt.layout);
}
document.getElementById('x_r_spinbox').addEventListener('input', update_x_r);

// Update Bi
update_Bi = function () {
    plt.Bi = parseFloat(document.getElementById('Bi_spinbox').value);
    plt.interp_data()
    plt.interp_T_r()
    plt.update_plot()

    // plt.plotData[0].y = plt.line.T_r;
    // Plotly.react('plot', plt.plotData, plt.layout);
}
document.getElementById('Bi_spinbox').addEventListener('input', update_Bi);

// Update Fo
update_Fo = function () {
    plt.Fo = parseFloat(document.getElementById('Fo_spinbox').value);
    plt.interp_T_r()
    document.getElementById('T_r_spinbox').value = plt.T_r
    plt.update_plot(line = false)

}
document.getElementById('Fo_spinbox').addEventListener('input', update_Fo);

// Update T_r
update_T_r = function () {
    plt.T_r = parseFloat(document.getElementById('T_r_spinbox').value);
    plt.interp_Fo()
    document.getElementById('Fo_spinbox').value = plt.Fo
    plt.update_plot(line = false)

}
document.getElementById('T_r_spinbox').addEventListener('input', update_T_r);


// Function to handle window resize event
function handleResize() {
    // Update the plot size
    var plotDiv = document.getElementById('plot');
    Plotly.Plots.resize(plotDiv);
}
// Listen for window resize event and handle it
window.addEventListener('resize', handleResize);