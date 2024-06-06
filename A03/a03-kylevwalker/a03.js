/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Assignment: A03 2/8/24
 * Purpose: This program recreates already defined data visualizations from lecture and previous assignments using d3.js
 * in order to learn the d3 workflow and syntax. THe visualizations include the following:
 *  -Charts 1, 2, and 3 from lecture 4's iteration_8.js, which has 3 different charts representing the ukDriverFatalities.js 
 *  data set.
 *  -Scatterplot 2 from A02, which uses the calvinScores.js data set in the exact same visual style as A02 but with d3
 * Some helper functions were also copied over from both iteration_8.js and a02.js in order to preserve the exact features.
 * However, some procedural values such as score min and maxes from a02 were hardcoded as only one vis was needed, so functions
 * would not need to be repeated. Calculations and helper functions used in iteration_8.js and included here are copied from
 * J. Levine's code almost directly for accurate recreation
 * 
 */


/**
 * (Copied from iteration_8.js by J. Levine)
 * Returns RGB channel value clamped between 0 to 255 to ensure valid RGB values
 * @param {Number} v value to clamp
 * @returns clamped value between 0 and 255
 */
function clamp(v) {
  return Math.floor(Math.max(0, Math.min(255, v)));
}

/**
 * (Copied from iteration_8.js by J. Levine)
 * Returns RGB color attribute as a string for D# attribute settings
 * @param {Number} r Red value between 0 and 255
 * @param {Number} g Green value between 0 and 255
 * @param {Number} b Blue value between 0 and 255
 * @returns String for RGB color
 */
function rgb(r, g, b) {
  return "rgb(" + r + "," + g + "," + b + ")";
}

/**
 * (Copied from iteration_8.js by J. Levine)
 * Returns an RGB tuple string for the color corresponding to the value provided, specifically for
 * the UKDriverFatalities data in a teal blue gradient. (cyan = 0 count, dark cyan = max 2500 count)
 * @param {Number} count number from 0 to 2500 to represent as color in scale
 * @returns RGB string of new color
 */
function color(count) {
  // count = 2500 -> rgb(0, 127, 127) (dark cyan)
  // count = 0 -> rgb(255, 255, 255) (cyan)
  var amount = ((2500 - count) / 2500) * 255;
  var s = clamp(amount),
    s2 = clamp(amount / 2 + 127),
    s3 = clamp(amount / 2 + 127);

  return rgb(s, s2, s3);
}

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
    let factor = getFactor(min, max, val) * (500 - (32*2));
    return factor + 32;
}

// Chart 1 (Copied attributes from iteration_8.js chart1)
// Displays UK Driver Fatalities as grid of colored cells where darker color represents higher count
d3.select("#vis1")
    .append("svg")
    .attr("width", 600)
    .attr("height", 300)
    .selectAll("rect")
    .data(ukDriverFatalities)
    .enter()
    .append("rect")
    .attr("width", () => { return Math.ceil(600 / (1984 - 1969 + 1)); })
    .attr("height", () => { return Math.ceil(300 / 12);})
    .attr("x", (d) => { return Math.ceil(600 / (1984 - 1969 + 1)) * (d.year - 1969); })
    .attr("y", (d) => { return Math.ceil(300 / 12) * (11 - d.month); })
    .attr("fill", (d) => { return color(d.count); });

// Chart 2 (Copied attributes from iteration_8.js chart2)
// Displays UK Driver Fatalities as blue circles where radius represents count
d3.select("#vis2")
    .append("svg")
    .attr("width", 600)
    .attr("height", 300)
    .selectAll("circle")
    .data(ukDriverFatalities)
    .enter()
    .append("circle")
    .attr("cx", (d) => { return Math.ceil(600 / (1984 - 1969 + 1)) * (d.year - 1969 + 0.5); })
    .attr("cy", (d) => { return Math.ceil(300 / 12) * (11 - d.month + 0.5); })
    .attr("r", (d) => { return d.count / 500 * 3; })
    .attr("stroke", () => { return "white"; })
    .attr("fill", () => { return "blue"; })

// Chart 3 (Copied attributes from iteration_8.js chart3)
// Displays UK Driver Fatalities as bar graph where height represents count
d3.select("#vis3")
    .append("svg")
    .attr("width", 600)
    .attr("height", 300)
    .selectAll("rect")
    .data(ukDriverFatalities)
    .enter()
    .append("rect")
    .attr("width", () => { return Math.ceil(600 / ukDriverFatalities.length); })
    .attr("height", (d) => { return d.count / 2500 * 300; })
    .attr("x", (d, i) => { return i * 600 / ukDriverFatalities.length; })
    .attr("y", (d) => { return 300 - (d.count / 2500 * 300); })

// Chart 4 (Copied attributes from A02 chart 2)
// Displays Calvin College Senior test scores where x axis is GPA, y axis is ACT, radius is SATV, and 
// color is SATM score. Larger radius is higher score, and colors range from red(low) to green (high)
d3.select("#vis4")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500)
    .append("g")
    .attr("transform", "scale (1 -1) translate (0 -500)")
    .selectAll("circle")
    .data(scores)
    .enter()
    .append("circle")
    .attr("cx", (d) => { return getAxisPos(1.5, 4, d.GPA); })
    .attr("cy", (d) => { return getAxisPos(11, 36, d.ACT); })
    .attr("r", (d) => { return Math.max(3, getFactor(200, 800, d.SATV) * 10); })
    .attr("fill", (d) => { return rgb((1 - getFactor(300, 800, d.SATM)) * 255, getFactor(300, 800, d.SATM) * 255, 0); })
    .attr("stroke", () => { return "white"; })

