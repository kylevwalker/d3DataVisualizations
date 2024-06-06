/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Purpose: This program uses the Dataset of Calvin College senior scores to generate 3 different scatterplots
 *      entirely through svg.js functions to learn d3 structured graphics. The three scatterplots use different
 *      variations of X and Y axes, radius, and color to represent different scores from the scores.js data set.
 *      The code is designed to be modular and avoids Hardcoded values as much as possible, relying on the data itself to 
 *      generate scatterplots and allowing the user different control over parameters to create different plots.
 *      Plot1 has constant radius and color
 */

// Sizing constants
const SVG_RES = 500; // Width and Height resoultion for Square SVG elements
const SVG_PADDING = 32; // Padding on SVG allowing room for axes
const TICK_LENGTH = 8; // Length of Tick marks extending past axis
const AXIS_INCREMENT = 6; // Default number of increments to divide each axis
const TEXT_LENGTH = 10; // Width offset in pixels of a standard text element

// Mins and maxes for upper / lower bounds of graph axes
var minSATM = 600;  // Minimum SATM Score rounded to clean floor number
var minSATV = 600; // Minimum SATV Score rounded to clean floor number
var minACT = 36; // Minimum ACT Score rounded to clean floor number
var minGPA = 4.0; // Minimum GPA Score rounded to clean floor number
const maxSATM = 800; // Max possible SATM score
const maxSATV = 800; // Max possible SATV score
const maxACT = 36; // Max possible ACT score
const maxGPA = 4.0; // Max possible GPA score

/**
 * Gets the mins for the properties of the scores to determine lower bounds
 * of each, rounded up/down to the nearest clean number
 */
function getMins(){
    // Find mins from data
    scores.forEach(element => {
        let SATM = element.SATM;
        let SATV = element.SATV;
        let ACT = element.ACT;
        let GPA = element.GPA;
        minSATM = Math.min(minSATM, SATM);
        minSATV = Math.min(minSATV, SATV);
        minACT = Math.min(minACT, ACT);
        minGPA = Math.min(minGPA, GPA);
    });
    // Rounding
    minSATM = Math.floor(minSATM / 100) * 100;  // Rounded down to nearest hundred
    minSATV = Math.floor(minSATV / 100) * 100;  // Rounded down to nearest hundred
    minACT = Math.floor(minACT / 6) * 6 -1;     // Rounded down to number divisible by 6
    minGPA = Math.floor(minGPA*10 / 5) *5 /10;  // Rounded down to nearest 0.5
}

/**
 * Gets the factor from 0 to 1 that the given value lies between the min and max
 * @param {*} min minimum value in range representing factor of 0.0
 * @param {*} max maximum value in range representing factor 1.0
 * @param {*} val value to find factor within range
 * @returns factor of value between min and max as value between 0 and 1
 */
function getFactor(min, max, val){
    let factor = (val - min)/(max - min);
    return factor;
}

/**
 * Returns X or Y axis position using the min and max of the data val, and leaves padding space for axis labels
 * @param {Number} min minimum value in range representing factor of 0.0
 * @param {Number} max maximum value in range representing factor 1.0
 * @param {Number} val value to find factor within range
 * @returns pixel position as factor between range
 */
function getAxisPos(min, max, val){
    let factor = getFactor(min, max, val) * (SVG_RES - (SVG_PADDING*2));
    return factor + SVG_PADDING;
}

/**
 * Draws both X and Y axis with labels and tick marks with values. Give X and Y labels which appear in far corners
 * of each axis, where data points are very unlikely to occur. Give X and Y mins and maxes to determine
 * ranges of each axis as well as x and y increments to divide ranges by increment amount. Rounds axis values to nearest hundredth.
 * @param {String} xlabel Label name for data represented by X axis
 * @param {String} ylabel Label name for data represented by Y axis
 * @param {Number} xmin minimum x axis data value for range
 * @param {Number} xmax maximum x axis data value for range
 * @param {Number} ymin minimum y axis data value for range
 * @param {Number} ymax maximum xyaxis data value for range
 * @param {Number} xincrements number of increments to divide x axis
 * @param {Number} yincrements number of increments to divide y axis
 * @param {Element} svg The given SVG will be the parent SVG in which the axes will be drawn
 */
function drawAxes(xlabel, ylabel, xmin, xmax, ymin, ymax, xincrements, yincrements, svg){
    //xaxis Group, line, and label
    var xaxisgroup = make("g", {transform: "translate (" + SVG_PADDING + " " + (SVG_RES - SVG_PADDING) + ")"});
    var xaxis = make("line", {x1: 0, y1: 0, x2: SVG_RES-SVG_PADDING*2, y2: 0, stroke: "black", class:"axis"});
    xaxisgroup.appendChild(xaxis);
    var xaxisLabel = make("text", {x: SVG_RES - (SVG_PADDING*3) - TEXT_LENGTH, y: -TEXT_LENGTH, text: xlabel, class:"axisLabel"});
    xaxisgroup.appendChild(xaxisLabel);

    // X axis Ticks and values 
    let xstep = (xmax - xmin) / (xincrements-1);
    let xshift = (SVG_RES - (SVG_PADDING*2)) / (xincrements-1);
    for (let i = 0; i<xincrements; i++){
        let xpos =  (xshift * i);
        let stepText = make("text", {x: xpos - TICK_LENGTH , y: SVG_PADDING -5, text: Math.round((xstep * (i) + xmin)* 100) /100, class:"axisValue"});
        let tick = make("line", {x1: xpos, y1: TICK_LENGTH, x2: xpos, y2: -SVG_RES + SVG_PADDING*2, stroke: "black", class:"axisTick"});
        xaxisgroup.appendChild(stepText);
        xaxisgroup.appendChild(tick);
    }
    svg.appendChild(xaxisgroup);

    // yaxis group, line, and label
    var yaxisgroup = make("g", {transform: "translate (" + SVG_PADDING + " " + (SVG_RES - SVG_PADDING) + ")"});
    var yaxis = make("line", {x1: 0, y1: 0, x2: 0, y2: -(SVG_RES-SVG_PADDING*2), stroke: "black", class: "axis"});
    yaxisgroup.appendChild(yaxis);
    var yaxisLabel = make("text", {x: TEXT_LENGTH , y: -(SVG_RES - (SVG_PADDING*2) -TEXT_LENGTH*2), text: ylabel, class: "axisLabel"});
    yaxisgroup.appendChild(yaxisLabel);

    // Y axis tick and values
    let ystep = (ymax - ymin) / (yincrements-1);
    let yshift = (SVG_RES - (SVG_PADDING*2)) / (yincrements-1);
    for (let i = 0; i<yincrements; i++){
        let ypos =  -(yshift * i);
        let stepText = make("text", {x: -SVG_PADDING, y: ypos + 5, text: Math.round((ystep * (i) + ymin) * 100) /100, class:"axisValue"});
        let tick = make("line", {x1: -TICK_LENGTH, y1: ypos, x2: SVG_RES - SVG_PADDING*2, y2: ypos, stroke: "black", class:"axisTick"});
        xaxisgroup.appendChild(stepText);
        xaxisgroup.appendChild(tick);
    }
    svg.appendChild(yaxisgroup);
}

/**
 * Makes the first scatterplot with given radius and color, where x axis is SATV and y axis is SATM
 * @param {Number} radius constant radius size to apply to all plot circles
 * @param {String} color constant color to apply to all plot circles
 */
function makePlot1(radius, color){
    var scatter_plot_1 = make("svg", { width: 500, height: 500, "id": "scatter_plot_1" });
    document.getElementById("chart_1").appendChild(scatter_plot_1);
    // Draw axes underneath plot points
    drawAxes("SATV", "SATM", minSATV, maxSATV, minSATM, maxSATM, AXIS_INCREMENT, AXIS_INCREMENT, scatter_plot_1);
    // Add to flipped group for easier y calculations
    var plot_1_g = make("g", {transform: "scale (1 -1)  translate (0 -" + SVG_RES + ")"});
    document.getElementById("scatter_plot_1").appendChild(plot_1_g);
    // Plot all data points using SATV for X and SATM for Y
    plotAll(plot_1_g, scores, "circle", {
        cx: (row) => {return getAxisPos(minSATV, maxSATV, row.SATV);},
        cy: (row) => {return getAxisPos(minSATM, maxSATM, row.SATM);},
        r: () => {return radius;},
        fill: () => {return color;}
    })   
}

/**
 * Plots the data where GPA corresponds to x axis, ACT is y axis, SATV is radius between the given min and max radius,
 * and fill color is SATM score between red and green 
 * @param {Number} minRadius minimum radius size for lowest SATV score
 * @param {Number} maxRadius maximum radius size for highest SATV score
 */
function makePlot2(minRadius, maxRadius){
    var scatter_plot_2 = make("svg", { width: 500, height: 500, "id": "scatter_plot_2" });
    document.getElementById("chart_2").appendChild(scatter_plot_2);
    // Draw axes underneath plot points
    drawAxes("GPA", "ACT", minGPA, maxGPA, minACT, maxACT, AXIS_INCREMENT, AXIS_INCREMENT, scatter_plot_2);
    // Add to flipped group for easier y calculations
    var plot_2_g = make("g", {transform: "scale (1 -1)  translate (0 -500)"})
    document.getElementById("scatter_plot_2").appendChild(plot_2_g);
    // Plot all points using GPA for X, ACT for Y, SATV for radius, and SATM for color
    plotAll(plot_2_g, scores, "circle", {
        cx: (row) => {return getAxisPos(minGPA, maxGPA, row.GPA);},
        cy: (row) => {return getAxisPos(minACT, maxACT, row.ACT);},
        r: (row) => {return Math.max(minRadius, getFactor(minSATV, maxSATV, row.SATV) * maxRadius)},
        stroke: function() { return "white"; },
        fill: (row) => {return rgb(1-getFactor(minSATM, maxSATM, row.SATM), getFactor(minSATM,  maxSATM, row.SATM), 0);}
    })   

}

/**
 * Plots the data with SATV and SATM sum represented on x axis, GPA for y axis, the given radius, and ACT score
 * as color gradient from red to green
 * @param {Number} radius constant radius of all plot circles
 */
function makePlot3(radius){
    var scatter_plot_3 = make("svg", { width: 500, height: 500, "id": "scatter_plot_3" });
    document.getElementById("chart_3").appendChild(scatter_plot_3);
    // Calculate sum of SATS for total SAT score
    let minSAT = minSATM + minSATV;
    let maxSAT = maxSATM + maxSATV;
    // Draw axes underneath plot points
    drawAxes("SAT", "GPA", minSAT, maxSAT, minGPA, maxGPA, AXIS_INCREMENT, AXIS_INCREMENT, scatter_plot_3);
    // Add to flipped group for easier y calculations
    var plot_3_g = make("g", {transform: "scale (1 -1)  translate (0 -500)"})
    document.getElementById("scatter_plot_3").appendChild(plot_3_g);
    // Plot all points using SAT for X, GPA for Y, the given constant radius, and ACT for Color
    plotAll(plot_3_g, scores, "circle", {
        cx: (row) => {return getAxisPos(minSAT, maxSAT, row.SATM + row.SATV);},
        cy: (row) => {return getAxisPos(minGPA, maxGPA, row.GPA);},
        r: () => {return radius;},
        stroke: function() { return "white"; },
        fill: (row) => {return rgb(1-getFactor(minACT, maxACT, row.ACT), getFactor(minACT,  maxACT, row.ACT), 0);}
    })   
}

// Start: Calls maker functions for all 3 plots with some chosen parameters
getMins();
makePlot1(4, "black");
makePlot2(3, 10);
makePlot3(4);
 


