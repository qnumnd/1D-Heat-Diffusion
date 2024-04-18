plt = {}

plt.init_params = function (simdata) {
    // Simdata
    this.dat = {}
    this.dat.T_r = simdata.T_r
    this.dat.x_r = Float64Array.from(simdata.x_r)
    this.dat.Bi = Float64Array.from(simdata.Bi)
    this.dat.logBi = this.dat.Bi.map(x => Math.log10(x))
    this.dat.Fo = Float64Array.from(simdata.Fo)
    // Paramters
    this.x_r = parseFloat(document.getElementById('x_r_spinbox').value);
    this.Bi = parseFloat(document.getElementById('Bi_spinbox').value);
    // declare interp array
    this.T_r_len
    this.T_r_grid = Array(2).fill(null).map(() => Array(this.dat.Fo.length))
    // line
    this.line = {}
    this.line.Fo = this.dat.Fo
    this.line.logFo = this.line.Fo.map(x => Math.log10(x))
    this.line.T_r = new Float64Array(this.dat.Fo.length)
    // point (Fo with T_r)
    this.Fo = parseFloat(document.getElementById('Fo_spinbox').value)
    this.T_r = parseFloat(document.getElementById('T_r_spinbox').value)
}

plt.interp_data = function () {
    // interpolate T_r data

    this.logBi = Math.log10(this.Bi)
    // find intervals
    x_r_idx = find_interval(this.x_r, this.dat.x_r)
    Bi_idx = find_interval(this.Bi, this.dat.Bi)

    // Allocate array for result
    this.line.T_r = new Float64Array(this.dat.Fo.length)

    // interpolate T_r by Bi
    for (let i = 0; i < this.dat.Fo.length; i++) {
        for (let ii = 0; ii < 2; ii++) {
            let x0 = this.dat.logBi[Bi_idx]
            let y0 = this.dat.T_r[Bi_idx][x_r_idx + ii][i]
            let x1 = this.dat.logBi[Bi_idx + 1]
            let y1 = this.dat.T_r[Bi_idx + 1][x_r_idx + ii][i]
            this.T_r_grid[ii][i] = lin_interp(this.logBi, x0, y0, x1, y1)
        }
    }
    // interpolate T_r by x_r
    for (let i = 0; i < this.dat.Fo.length; i++) {
        let x0 = this.dat.x_r[x_r_idx]
        let y0 = this.T_r_grid[0][i]
        let x1 = this.dat.x_r[x_r_idx + 1]
        let y1 = this.T_r_grid[1][i]
        this.line.T_r[i] = lin_interp(this.x_r, x0, y0, x1, y1)
    }
}

plt.interp_T_r = function () {
    this.logFo = Math.log10(this.Fo)
    // Find interval
    Fo_idx = find_interval(this.logFo, this.line.logFo)
    this.Fo_idx = Fo_idx
    // Interpolation
    let x0 = this.line.logFo[Fo_idx]
    let y0 = this.line.T_r[Fo_idx]
    let x1 = this.line.logFo[Fo_idx + 1]
    let y1 = this.line.T_r[Fo_idx + 1]
    this.T_r = lin_interp(this.logFo, x0, y0, x1, y1)
}

plt.interp_Fo = function () {
    // Find interval
    T_r_idx = find_interval_seq_down(this.T_r, this.line.T_r)
    this.T_r_idx = T_r_idx
    // Interpolation
    let x0 = this.line.T_r[T_r_idx]
    let y0 = this.line.logFo[T_r_idx]
    let x1 = this.line.T_r[T_r_idx + 1]
    let y1 = this.line.logFo[T_r_idx + 1]
    this.logFo = lin_interp(this.T_r, x0, y0, x1, y1)
    if (isNaN(this.logFo)) this.logFo = (y0 + y1) / 2
    this.Fo = Math.pow(10, this.logFo)

}

plt.init_plot = function () {
    // Update T_r by Fo
    document.getElementById('T_r_spinbox').value = plt.T_r

    // Create a Plotly line plot
    this.plotData = [
        {
            x: this.line.Fo,
            y: this.line.T_r,
            mode: 'lines',
            // mode: 'lines+markers',
            type: 'scatter',
        },
        {
            x: [this.Fo],
            y: [this.T_r],
            mode: 'markers',
            type: 'scatter',
        }
    ];

    this.layout = {
        title: 'Relative Temperature - Fourier Number',
        xaxis: {
            title: '$F_o=\\alpha t/L^2$',
            type: 'log',
            zeroline: false,
            range: [-3, 3],
        },
        yaxis: {
            title: '$T_r=(T-T_f)/(T_i-T_f)$',
            zeroline: false,
            range: [-0.1, 1.1],
        },
        dragmode: 'pan',
        showlegend: false,
    };

    // Initial creation of the plot
    Plotly.newPlot('plot', this.plotData, this.layout);
}

model_params = {
    inf_plate: {
        simdata: simdata_plate,
        relative_x_label: "Relative x (x/R):",
        title: "Temperature response plot - Infinite Plate"
    },
    inf_cylinder: {
        simdata: simdata_cylinder,
        relative_x_label: "Relative r (r/R):",
        title: "Temperature response plot - Infinite Cylinder"
    },
}

function plot() {
    var model = document.getElementById("models").value;
    document.getElementById("label_x_r_spinbox").textContent = model_params[model].relative_x_label
    document.getElementById("title").textContent = model_params[model].title
    plt.init_params(model_params[model].simdata)
    plt.interp_data()
    plt.interp_T_r()
    // plt.interp_Fo()
    plt.init_plot()
}

plot()

