/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Assignment: A09 4/10/24
 * Purpose: This program generates isocontour visualizations for the hurricane Isabel dataset,
 *    which has been converted to a contour grid where each cardinal corner holds data instead
 *    of each pixel. This allows the marching squares algorithms of this program travel across 
 *    differences in less than and greater to corners of the cell's current contour value. The
 *    16 marching square cases are handled by lookup tables as switch cases, and the contour lines
 *    and fill areas are generated in a 49 x 49 cell display for both temperature and pressure.
 *    
 *    Temperature uses a sequential colormap where red is higher temperature and blue is lower.
 *    
 *    Pressure uses a diverging colormap with 0 pressure as white, red is high and blue is lower
 *    pressure where both diverge from 0 at even rates.
 * 
 * 
 * Case Lookup table is as follows:
 *    // 0:   - -   1:   + -   2:   - +   3:   + +  
      //      - -        - -        - -        - - 

      // 4:   - -   5:   + -   6:   - +   7:   + +
      //      + -        + -        + -        + - 

      // 8:   - -   9:   + -   10:  - +   11:  + +
      //      - +        - +        - +        - +

      // 12:  - -   13:  + -   14:  - +   15:  + +
      //      + +        + +        + +        + +

 * Code built on skeleton provided by Joshua Levine credited below:
    // 
    // a11.js
    // Template for CSC444 Assignment 11, Fall 2021
    // Joshua A. Levine <josh@email.arizona.edu>
    //
    // This file provides the template code for A11, providing a skeleton
    // for how to initialize and compute isocontours   
    //
*/


////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries, and helper functions

let svgSize = 490;
let bands = 49;

let xScale = d3.scaleLinear().domain([0, bands]).  range([0, svgSize]);
let yScale = d3.scaleLinear().domain([-1,bands-1]).range([svgSize, 0]);

function createSvg(sel)
{
  return sel
    .append("svg")
    .attr("width", svgSize)
    .attr("height", svgSize);
}

function createGroups(data) {
  return function(sel) {
    return sel
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + xScale(d.Col) + "," + yScale(d.Row) + ")";
      });
  };
}

d3.selection.prototype.callReturn = function(callable)
{
  return callable(this);
};

// This function returns the pair [min/max] for a cell d.
function gridExtent(d) {
  return [Math.min(d.NW, d.NE, d.SW, d.SE),
          Math.max(d.NW, d.NE, d.SW, d.SE)];
}

////////////////////////////////////////////////////////////////////////
// Functions for isocontouring

// Given a cell d and an isovalude value, this returns a 4-bit polarity
// signature in result.case as an integer [0,15].  Any bit that is 1
// indicates that the associate cell corner is on or above the contour.
function polarity(d, value) {
  let result = {
    NW: d.NW < value ? 0 : 1,
    NE: d.NE < value ? 0 : 1,
    SW: d.SW < value ? 0 : 1,
    SE: d.SE < value ? 0 : 1
  };
  result.case = result.NW + result.NE * 2 + result.SW * 4 + result.SE * 8;
  return result;
}

// currentContour is a global variable which stores the value
// of the contour we are currently extracting
var currentContour;

// Returns true if the current contour is within the extents of the data to draw lines 
// only within bounds
function includesOutlineContour(d) {
  let extent = gridExtent(d);
  return currentContour >= extent[0] && currentContour <= extent[1];
}

// Returns true if the current contour is at least the amount of minimum data to fill 
// underlying areas
function includesFilledContour(d) {
  let extent = gridExtent(d);
  return currentContour >= extent[0];
}

/**
  Generates the outline isocontours by Returning d3 path 'd' strings between the sides defined by the polarity.
  Uses lookup cases with switch and puts line points using d3 scale between the corners of differing
  sign. There are 16 different line arrangement cases, with each being placed in the range of 0,10
  pixels based on interpolation in domain between corners of crossed edges in cell.
 * @param {*} d data element to plot lines for
 * @returns d3 path string for lines to draw in current cell
 */
function generateOutlineContour(d) {
  // Scales between each edge of the current cell based on current data. Maps domain to each corner and 
  // range to element pixel length
  let wScale = d3.scaleLinear()
  .domain([d.SW, d.NW])
  .range([0,10]);
  let eScale = d3.scaleLinear()
  .domain([d.SE, d.NE])
  .range([0,10]);
  let nScale = d3.scaleLinear()
  .domain([d.NW, d.NE])
  .range([0,10]);
  let sScale = d3.scaleLinear()
  .domain([d.SW, d.SE])
  .range([0,10]);
  
  // shortened vars for scaled position on each edge using current contour
  let w = "0," + wScale(currentContour);
  let e = "10," + eScale(currentContour);
  let n = nScale(currentContour) + ",10";
  let s = sScale(currentContour) + ",0";

  // Switches between 16 cases for the pattern found in the polarity function for the current contour
  // Returns the corresponding path string with exact scaled positions of each line point
  switch (polarity(d, currentContour).case) {
    case 0:
      return;
    case 1:
      return "M" + w + "L" + n;
    case 2:
      return "M" + n + "L" + e;
    case 3:
      return "M" + w + "L" + e;
    case 4:
      return "M" + w + "L" + s;
    case 5:
      return "M" + n + "L" + s;
    case 6:
      return "M" + e + "L" + n + "M" + s + "L" + w;
    case 7:
      return "M" + s + "L" + e;
    case 8:
      return "M" + s + "L" + e;
    case 9:
      return "M" + n + "L" + e + "M" + w + "L" + s;
    case 10:
      return "M" + n + "L" + s;
    case 11:
      return "M" + w + "L" + s;
    case 12:
      return "M" + w + "L" + e;
    case 13:
      return "M" + n + "L" + e;
    case 14:
      return "M" + w + "L" + n;
    case 15:
      return;
  }
}

/**
  Generates the filled isocontours by Returning d3 path 'd' strings between the sides defined by the polarity,
  with extra edges added along perimeter to create closed polygon areas for everything under the contour line.
  Uses lookup cases with switch and puts line points using d3 scale between the corners of differing
  sign. There are 16 different line arrangement cases, with each being placed in the range of 0,10
  pixels based on interpolation in domain between corners of crossed edges in cell.
 * @param {*} d data element to plot contour fills for
 * @returns d3 path string for lines to draw in current cell
 */
function generateFilledContour(d) {
    // Scales between each edge of the current cell based on current data. Maps domain to each corner and 
  // range to element pixel length
  let wScale = d3.scaleLinear()
  .domain([d.SW, d.NW])
  .range([0,10]);
  let eScale = d3.scaleLinear()
  .domain([d.SE, d.NE])
  .range([0,10]);
  let nScale = d3.scaleLinear()
  .domain([d.NW, d.NE])
  .range([0,10]);
  let sScale = d3.scaleLinear()
  .domain([d.SW, d.SE])
  .range([0,10]);
  
  // shortened vars for scaled position on each edge using current contour
  let w = "0," + wScale(currentContour);
  let e = "10," + eScale(currentContour);
  let n = nScale(currentContour) + ",10";
  let s = sScale(currentContour) + ",0";

  // shortened coordinates for corner points to make edge filling simpler
  let sw = "0,0";
  let nw = "0,10";
  let se = "10,0";
  let ne = "10,10";

  // Switches between 16 cases for the pattern found in the polarity function for the current contour
  // Returns the corresponding path string with exact scaled positions of each filled line point
  switch (polarity(d, currentContour).case) {
    case 0:
      return "M0,0" + "L" + se + "L" + ne + "L" + nw + "Z";
    case 1:
      return "M" + w + "L" + n + "L" + ne + "L" + se + "L" + sw + "Z";
    case 2:
      return "M" + n + "L" + e + "L" + se + "L" + sw + "L" + nw + "Z";
    case 3:
      return "M" + w + "L" + e + "L" + se + "L" + sw + "Z";
    case 4:
      return "M" + w + "L" + s + "L" + se + "L" + ne + "L" + nw + "Z";
    case 5:
      return "M" + n + "L" + s + "L" + se + "L" + ne + "Z";
    case 6:
      return "M" + e + "L" + n + "L" + nw + "L" + w + "L" + s + "L" + se + "Z";
    case 7:
      return "M" + s + "L" + e + "L" + se + "Z"; 
    case 8:
      return "M" + s + "L" + e + "L" + ne + "L" + nw + "L" + sw + "Z";
    case 9:
      return "M" + e + "L" + n + "L" + ne + "Z" + "M" + w + "L" + s + "L" + sw + "Z";
    case 10:
      return "M" + n + "L" + s + "L" + sw + "L" + nw + "Z";
    case 11:
      return "M" + w + "L" + s + "L" + sw + "Z";
    case 12:
      return "M" + w + "L" + e + "L" + ne + "L" + nw + "Z";
    case 13:
      return "M" + n + "L" + e + "L" + ne + "Z";
    case 14:
      return "M" + w + "L" + n + "L" + nw + "Z";
    case 15:
      return "M0,0" + "L" + se + "L" + ne + "L" + nw + "Z";
  }
}



////////////////////////////////////////////////////////////////////////
// Visual Encoding portion that handles the d3 aspects


// d3 function to compute isocontours for all cells that span given a
// range of values, [minValue,maxValues], this function produces a set
// of size "steps" isocontours to be added to the selection "sel"
function createOutlinePlot(minValue, maxValue, steps, sel)
{
  let contourScale = d3.scaleLinear().domain([1, steps]).range([minValue, maxValue]);
  for (let i=1; i<=steps; ++i) {
    currentContour = contourScale(i);
    sel.filter(includesOutlineContour).append("path")
      .attr("transform", "translate(0, 10) scale(1, -1)") // ensures that positive y points up
      .attr("d", generateOutlineContour)
      .attr("fill", "none")
      .attr("stroke", "black");
  }
}

// d3 function to compute filled isocontours for all cells that span
// given a range of values, [minValue,maxValues], this function produces
// a set of size "steps" isocontours to be added to the selection "sel".
// colorScale is used to assign their fill color.
function createFilledPlot(minValue, maxValue, steps, sel, colorScale)
{
  let contourScale = d3.scaleLinear().domain([1, steps]).range([minValue, maxValue]);
  for (let i=steps; i>=1; --i) {
    currentContour = contourScale(i);
    sel.filter(includesFilledContour).append("path")
      .attr("transform", "translate(0, 10) scale(1, -1)") // ensures that positive y points up
      .attr("d", generateFilledContour)
      .attr("fill", function(d) { return colorScale(currentContour); });
  }
}

// Compute the isocontour plots
let plot1T = d3.select("#plot1-temperature")
    .callReturn(createSvg)
    .callReturn(createGroups(temperatureCells));
let plot1P = d3.select("#plot1-pressure")
    .callReturn(createSvg)
    .callReturn(createGroups(pressureCells));

createOutlinePlot(-70, -60, 10, plot1T);
createOutlinePlot(-500, 200, 10, plot1P);

// Compute the filled isocontour plots
let plot2T = d3.select("#plot2-temperature")
    .callReturn(createSvg)
    .callReturn(createGroups(temperatureCells));
let plot2P = d3.select("#plot2-pressure")
    .callReturn(createSvg)
    .callReturn(createGroups(pressureCells));

createFilledPlot(-70, -60, 10, plot2T, 
              d3.scaleLinear()
                .domain([-70, -60])
                .range(["blue", "red"]));
createFilledPlot(-500, 200, 10, plot2P, 
              d3.scaleLinear()
                .domain([-500, 0, 500])
                .range(["#ca0020", "#f7f7f7", "#0571b0"]));
