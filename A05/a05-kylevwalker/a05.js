/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Assignment: A05 3/10/24
 * Purpose: This program shows 4 visualizations using different colormaps for the Hurrican Isabel
 * dataset. The code is built upon the A05 skeleton code created and provided by Joshua A. Levine.
 * The 50x50 grids of color are shown with the following color schemes:
 *      1) Temperature of hurricane using a standard sequential map between two chosen colors 
 *          (Dark blue and Pale Yellow).
 *          The colors were chosen in opposing LAB space and having varying luminance for best contrast
 *      2) Perceptually uniform temperature mapping of vis 1 using LAB interpolation. The colors are now
 *          properly interpolated so that no green mixing occurs and LAB colors are mapped uniformly
 *      3) Diverging colormap for Pressure of hurricane where negative and postive values of the same
 *          magnitude are equidistant from 0, giving uniform color gradation by pressure change. The colors
 *          are opposed in LAB space with a neutral dark grey color for 0 values. (Purple for negative pressure
 *          and Orange for positive pressure)
 *      4) This is a Bivariate colormap showing the pressure and temperature together. The pressure uses the same
 *          diverging colormap of 3 but now the L value of each color is added with the temperature scale from 
 *          dark to light so that areas with higher temperature will be lighter. 
 * The 4 color functions were written by me while the other code is included in Levine's A05 skeleton code,
 * credited below.
 * 
    * a06.js
    * Skeleton for CSC444 Assignment 06, Fall 2021
    * Joshua A. Levine <josh@email.arizona.edu>
    * This file provides the skeleton code for you to write for A06.  It
    * generates (using index.html and data.js) grids of 50x50 rectangles 
    * to visualize the Hurricane Isabel dataset.
 */

//////////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries to draw the grid of rectangles

var svgSize = 500;
var bands = 50;

var xScale = d3.scaleLinear().domain([0, bands]).  range([0, svgSize]);
var yScale = d3.scaleLinear().domain([-1,bands-1]).range([svgSize, 0]);

// LAB colors for temperature sequential scale (1)
const minTempColor = d3.lab(5, -2, -60);
const maxTempColor = d3.lab(85, -2, 60);

// Pressure LAB colors for Diverging colormaps of 3 and 4.
const minPresColor = d3.lab(100, 40, -50);
const midPresColor = d3.lab(5, 0, 0);
const maxPresColor = d3.lab(100, 40, 50);

// Pressure bounds stored to prevent repeated calculations
const minPres = d3.min(data, d=> d.P);
const maxPres = d3.max(data, d=> d.P);
// Max pressure magnitude in either negative or positive so that pressure scale approaches 0 evenly
const maxAbsPressure = Math.max(Math.abs(minPres), maxPres);


function createSvg(sel)
{
    return sel
        .append("svg")
        .attr("width", svgSize)
        .attr("height", svgSize);
}

function createRects(sel)
{
    return sel
        .append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.Col); })
        .attr("y", function(d) { return yScale(d.Row); })
        .attr("width", 10)
        .attr("height", 10)
}

d3.selection.prototype.callAndReturn = function(callable)
{
    return callable(this);
};

//////////////////////////////////////////////////////////////////////////////
// Color functions


/**
 * Returns the color of the current rect by its Temperature data, using a sequential colormap between
 * min and max temperatures from Dark blue to light yellow.
 * @param {*} d Data
 * @returns color of rect in colormap at current Temperature data
 */
function colorT1(d) {
    let colorMap = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.T))
        .range([minTempColor, maxTempColor])
    return colorMap(d.T)
}

/**
 * Returns the color of the current rect by its Temperature data, using a perceptually uniform sequential 
 * colormap between min and max temperatures from Dark blue to light yellow. Uses LAB interpolation to 
 * appear perceptually uniform for more accurate representation.
 * @param {*} d Data
 * @returns color of rect in perceptually uniform colormap range at current temperature data
 */
function colorT2(d) {
    let colorMap = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.T))
        .range([minTempColor, maxTempColor])
        .interpolate(d3.interpolateLab)
    return colorMap(d.T)
}

/**
 * Returns the color of the current rect by its Pressure data, using a perceptually uniform diverging colormap
 * between negative pressure min, zero, and max positive pressure where positive and negative magnitudes are equally
 * divergent from 0. Colors are interpolated in LAB space and are chosen to be in opposing LAB space with the same L
 * values, where each positive and negative value of the same magnitude are directly opposed in LAB space. Negative
 * pressures approach purple, zero pressure is dark grey, and positive pressure approaches orange.
 * @param {*} d Data
 * @returns color of rect in perceptually uniform diverging colormap range at current pressure data
 */
function colorP3(d) {
    let colorMap = d3   
        .scaleLinear()
        .domain([-maxAbsPressure, 0, maxAbsPressure])
        .range([minPresColor, midPresColor, maxPresColor])
        .interpolate(d3.interpolateLab)
    return colorMap(d.P)
}


/**
 * Returns the color of the current rect by its pressure and temperature data in a Bivariate perceptually uniform 
 * colormap. The pressure colors are the same as colorP3, but temperature increases the lightness of each rect
 * based on the temperature in range. Lower temperatures are darker, where higher temperatures are lighter but 
 * all rects hold the same hues as from the pressure map.
 * @param {*} d Data
 * @returns color of rect in bivariate colormap range at current pressure and temperature data.
 */
function colorPT4(d) {
    let tempMap = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.T))
        .range([d3.lab(0, 0, 0), d3.lab(75, 0, 0)])
        .interpolate(d3.interpolateLab);
    
    let pressureColor = d3.lab(colorP3(d));
    let tempColor = d3.lab(tempMap(d.T));
    console.log(pressureColor)
    console.log(tempColor)

    let newColor = d3.lab(pressureColor.l + tempColor.l, pressureColor.a, pressureColor.b);
    return newColor;
}

//////////////////////////////////////////////////////////////////////////////
// Hook up the color functions with the fill attributes for the rects

d3.select("#plot1-temperature")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorT1);

d3.select("#plot2-temperature")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorT2);

d3.select("#plot3-pressure")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorP3);

d3.select("#plot4-bivariate")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorPT4);



