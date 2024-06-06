/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Assignment: A11 4/26/24
 * Purpose: This program generates 4 different flow visualizations for a dataset of 3 vortices.
 *  The different flow vis created are as follows:
 *    - Color cells: Vector magnitude is represented with sequential colormap on a grid.
 *    - Line Plot: Uniform plot of lines with same length representing vector directions.
 *    - Uniformly placed glyphs: Glyphs all originate from center points of each cell,
 *      but have arrow direction and length by vector magnitude.
 *    - Random custom glyphs: glyphs are emitted from random points within each cell and
 *      vary in length and color by magnitude. Glyphs are rounded arrows where length,
 *      color, and width all represent magnitude. Rotated to face vector direction.
 * 
 *    Built on skeleton code provided by Joshua A. Levine:
*/
// 
// a11.js
// Template code for CSC444 Assignment 11, Spring 2024
// Joshua A. Levine <josh@arizona.edu>
//
// This file provides a template skeleton for visualization vector
// fields using color mapping and glyphs
//
//

////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries

let svgSize = 510;
let bands = 50;
const rectSize = svgSize / bands;

let xScale = d3.scaleLinear().domain([0,bands]).range([5, svgSize-5]);
let yScale = d3.scaleLinear().domain([0,bands]).range([svgSize-5, 5]);

// Creates the 4 SVG panes for the 4 visualizations. Returns the selection with appended svg
function createSvg(sel)
{
  return sel
    .append("svg")
    .attr("width", svgSize)
    .attr("height", svgSize);
}

// Creates a grid of Group elements acting as cells in the SVG. Returns each selection cell.
function createGroups(data) {
  return function(sel) {
    return sel
      .append("g")
      .selectAll("*")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + xScale(d.Col) + "," + yScale(d.Row) + ") scale(1, -1)";
      });
  };
}

// Returns the magnitude of any vector from the dataset as the hypotenuse of the vector coordinate tri
function magnitude(d){
  let x = d.vx;
  let y = d.vy;
  return Math.sqrt((x * x) + (y * y));
}

d3.selection.prototype.callReturn = function(callable)
{
  return callable(this);
};

////////////////////////////////////////////////////////////////////////
// PART 1
// Color grid where each rect fills cell and uses color from sequential color scale by magnitude
let magColor = d3.select("#plot-color")
        .callReturn(createSvg)
        .callReturn(createGroups(data));

let colorScale = d3.scaleLinear().interpolate(d3.interpolateLab)
  .domain([0,2])
  .range([d3.lab(0,10,-50), d3.lab(100,10,45)])

magColor.append("rect")
  .attr("width", rectSize + 1)
  .attr("height", rectSize + 1)
  .attr("fill", (d) => {return colorScale(magnitude(d)) 
  })


////////////////////////////////////////////////////////////////////////
// PART 2
// Evenly distributed uniform line glyphs representing direction as rotation
let lineGlyph = d3.select("#plot-line")
        .callReturn(createSvg)
        .callReturn(createGroups(data));

lineGlyph.append("line")
  .attr("x1", (d) => {
    let theta = Math.atan(d.vy / d.vx)
    let h = d.vx / (Math.cos(theta))
    return (5 + (d.vx / h) * 5)})
  .attr("y1", (d) => {
    let theta = Math.atan(d.vy / d.vx)
    let h = d.vy / (Math.sin(theta))
    return 5 + (d.vy / h) * 5})
  .attr("x2", (d) => {
    let theta = Math.atan(d.vy / d.vx)
    let h = d.vx / (Math.cos(theta))
    return (5 - (d.vx / h) * 5)})
  .attr("y2", (d) => {
    let theta = Math.atan(d.vy / d.vx)
    let h = d.vy / (Math.sin(theta))
    return 5 - (d.vy / h) * 5})
  .attr("fill", "none")
  .attr("stroke", "black")

////////////////////////////////////////////////////////////////////////
// PART 3

// uniformly spaced glyphs with rotation vector direction and magnitude as line length, and 
// arrow pointer glyphs
let uniformGlyph = d3.select("#plot-uniform")
        .callReturn(createSvg)
        .callReturn(createGroups(data));

uniformGlyph.append("g")
  .attr("transform", function(d) {
    let theta = Math.atan2(d.vy, d.vx) * 180 / Math.PI;
    return "translate (5 5) rotate (" + theta + " 0 0)"
  })
  .append("path")
  .attr("d", (d) => {let len = magnitude(d) * rectSize
    return "M0,0L" + len + ",0l-3,-1l0,2l3,-1"
  })
  .attr("stroke", "black")
  .attr("fill", "black")

////////////////////////////////////////////////////////////////////////
// PART 4
// Randomly positioned in cell with custom glyph. Width, length, and color reflect magnitude,
// rotation represents vector direction angle
let randomGlyph = d3.select("#plot-random")
        .callReturn(createSvg)
        .callReturn(createGroups(data));

// Width of rounded bottom radius
let widScale = d3.scaleLinear()
  .domain([0,2])
  .range([0,6])

// Randomly position within cell and rotate by vector angle
randomGlyph.append("g")
  .attr("transform", function(d) {
    let randx = Math.random() * rectSize - 4;
    let randy = Math.random() * rectSize - 4;
    let theta = Math.atan2(d.vy, d.vx) * 180 / Math.PI;
    return "translate (" + randx + " " + randy + ")" + "rotate (" + theta + " 0 0)"
  })
  .append("path")
  .attr("d", (d) => {let len = magnitude(d) * rectSize
    let wid = widScale(magnitude(d))
    return "M0,0A-" + wid + ",-" + wid + " 0 0,1 -" + wid + "," + wid + "L" + len + ",0L-2,-2"
  }) 
  .attr("fill", (d) => {return colorScale(magnitude(d))})
  .attr("stroke", (d) => {return colorScale(magnitude(d))})
