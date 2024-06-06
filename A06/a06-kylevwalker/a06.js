/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Assignment: A06 3/18/24
 * Purpose: This program creates two different scatterplots for the same Iris data set, where each data
 * element exists in both graphs with different x and y axes. To visualize the 5 different fields
 * of all data, the graphs are interactable with matching colors by species. Clicking on one element
 * will make it larger and emphasize the corresponding linked data point on the other plot so you can compare
 * all fields at once. Each plot also has a brush where you can select a group of points for each plot,
 * and any linked data will be highlighted to show comparisons in groups. The data is visualized as follows:
 *    Color: Species categorical (magenta: setosa, blue: versicolor, yellow: virginica)
 *    Plot 1 (X,Y) = (Sepal Length, Sepal Width)
 *    Plot 2 (X,Y) = (Petal Length, Petal Width)
 * 
 * Code built on skeleton provided by Joshua Levine credited below
    * a06.js
    * Skeleton for CSC444 Assignment 06, Fall 2021
    * Joshua A. Levine <josh@email.arizona.edu>
      // This file provides the skeleton code for you to write for A06.  It
      // provides partial implementations for a number of functions you will
      // implement to visualize scatteplots of the iris dataset with joint
      // interactions
 */

////////////////////////////////////////////////////////////////////////
// Global variables for the dataset and brushes

let data = iris;

// brush1 and brush2 will store the extents of the brushes,
// if brushes exist respectively on scatterplot 1 and 2.
//
// if either brush does not exist, brush1 and brush2 will
// hold the null value.

let brush1 = null;
let brush2 = null;


// Constant default radius of data points
const radius = 4;

/**
 * Generic scatterplot generator which uses an x and y data accessor with label names. Creates a new 500x500 svg
 * to plot all data points contained in the x and y accessors, and uses the label names to create rounded and labeled
 * axes. Also assigns on click listeners to all drawn plot points. Returns plot as an object with accessible fields
 * for svg, brush, and scales associated with plot. 
 * @param {*} sel selection to append SVG plot to 
 * @param {function} xAccessor x Acessor function returning the data point corresponding to chosen x axis field
 * @param {function} yAccessor y Acessor function returning the data point corresponding to chosen y axis field
 * @param {String} xLabel axis label for x axis name
 * @param {String} yLabel axis label for y axis name
 * @returns object with svg, brush, and x and y scales 
 */
function makeScatterplot(sel, xAccessor, yAccessor, xLabel, yLabel)
{
  // Sizing and formatting
  let margins = { top: 15, right: 15, bottom: 50, left: 50 }; // Margins for data leaving room for axes
  let width = 500;
  let height = 500;
  let axisTicks = 8;
  
  // Append new SVG canvas
  let svg = sel
    .append("svg")
    .attr("width", width).attr("height", height);

  // Make scatterplot area a group shifted outside of margins, and adjust height and width for scales to account for axis margins 
  let plot_g = svg
  .append("g")
  .attr("transform", "translate(" + margins.left + ", " + margins.top + ")");
  width -= margins.left + margins.right;
  height -= margins.top + margins.bottom;

  // X  Scale for x acessor with ranges rounded down to nearest 0.5
  let xScale = d3.scaleLinear()
    .domain([Math.max(Math.floor(d3.min(data, xAccessor)) - 0.5, 0), 
      Math.ceil(d3.max(data, xAccessor))])
    .range([0, width])

  // Inverted scale for y accessor with ranges rounded to lowest 0.5
  let yScale = d3.scaleLinear()
    .domain([Math.max(Math.floor(d3.min(data, yAccessor)) - 0.5 ,0),
      Math.ceil(d3.max(data, yAccessor))])
    .range([height, 0])

  // Categorical colors for species type
  let colorScale = d3.scaleOrdinal()
    .domain(data, (d) => d.species)
    .range([d3.lab(70, 100, 0), d3.lab(70, 15, -100), d3.lab(70, 15, 100)])
  
  // Brush init
  let brush = d3.brush();
  
  plot_g.append("g")
    .attr("class", "brush")    
    .attr("transform", "scale(1,-1)")
    .call(brush);
  

  // Create plot points as circles with accessor and category attributes
  let circles = plot_g.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", radius)
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("fill", (d) => colorScale(d.species))
    .on("click", onPointClick)

  // X axis in bottom margin with xLabel
  let xAxisG = plot_g
    .append("g").attr("transform", "translate(0 " + height + ")")
  
  let xAxis = xAxisG.call(d3.axisBottom(xScale).ticks(axisTicks));
  
  xAxis.append("text")
    .attr("x", width / 2)
    .attr("y", margins.bottom / 1.25)
    .attr("fill", "black")
    .attr("font-size", 16)
    .attr("text-anchor", "middle")
    .text(xLabel);

  // Y axis in left margin with  yLabel and aligned text
  let yAxisG = plot_g
    .append("g");

  let yAxis = yAxisG.call(d3.axisLeft(yScale).ticks(axisTicks));

  yAxis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margins.left / 1.5)
    .attr("fill", "black")
    .attr("font-size", 16)
    .attr("text-anchor", "middle")
    .text(yLabel);


  plot_g.append("line")
  .attr("x1", ()=>{
    return xScale.range()[0];
  })
  .attr("y1", ()=>{
    let range = yScale.range();
    return (range[0] + range[1]) / 2;
  })
  .attr("x2", ()=>{
    return xScale.range()[1];
  })
  .attr("y2", ()=>{
    let range = yScale.range();
    return (range[1] + range[0]) / 2;
  })
  .attr("stroke", "black")
  .attr("fill", "none")
  
  plot_g.append("line")
  .attr("x1", ()=>{
    let range = xScale.range();
    return (range[1] + range[0]) / 2;
  })
  .attr("y1", ()=>{
    return yScale.range()[0];
  })
  .attr("x2", ()=>{
    let range = xScale.range();
    return (range[1] + range[0]) / 2;
  })
  .attr("y2", ()=>{
    return yScale.range()[1];
  })
  .attr("stroke", "black")
  .attr("fill", "none")

  // finally, return a plot object for global use in the brushes,
  // feel free to change this interface
  return {
    svg: svg,
    brush: brush,
    xScale: xScale,
    yScale: yScale
  };
}


/**
 * On Click Callback Allows selecting specific data points with click event handling. When a plot point is clicked, the linked
 * point on the other graph is found and both are given larger radii for popout. The table is also populated
 * to give specific values to read for the selected point
 * @param {*} event Click event context
 * @param {*} d Data from event caller data point
 */
function onPointClick(event, d) {
  d3.selectAll("circle").attr("r", radius)
  .filter((data) => {return data == d}).attr("r", 12)
  d3.select(event.target).attr("r", 12)
  d3.select("#table-sepalLength").text(d.sepalLength)
  d3.select("#table-sepalWidth").text(d.sepalWidth)
  d3.select("#table-petalLength").text(d.petalLength)
  d3.select("#table-petalWidth").text(d.petalWidth)
  d3.select("#table-species").text(d.species)
}

////////////////////////////////////////////////////////////////////////
// Setup plots

plot1 = makeScatterplot(d3.select("#scatterplot_1"),
                        function(d) { return d.sepalLength; },
                        function(d) { return d.sepalWidth; },
                        "sepal length",
                        "sepal width");
plot2 = makeScatterplot(d3.select("#scatterplot_2"),
                        function(d) { return d.petalLength; },
                        function(d) { return d.petalWidth; },
                        "petal length",
                        "petal width");

////////////////////////////////////////////////////////////////////////
// Callback during brushing

/**
 * When Brush selections are made, the matching selections are found and highlighted to
 * show overlap between two selected brush regions. Points are found within each of the
 * ranges in the corresponding scales and any matches are given a stroke for popout.
 * @returns 
 */
function onBrush() {
  let allCircles = d3.select("body").selectAll("circle");

  // Reset strokes when changing brush area
  allCircles.attr("stroke", "none")
  if (brush1 === null || brush2 === null) {
    return;
  }

  // Create ranges using the current brush selection bounds by inverting pixels back to scale domain
  let x1Scale = plot1.xScale;
  let y1Scale = plot1.yScale;
  let x2Scale = plot2.xScale;
  let y2Scale = plot2.yScale;
  let x1Range = [x1Scale.invert(brush1[0][0]), x1Scale.invert(brush1[1][0])]
  let y1Range = [y1Scale.invert(brush1[1][1]), y1Scale.invert(brush1[0][1])]
  let x2Range = [x2Scale.invert(brush2[0][0]), x2Scale.invert(brush2[1][0])]
  let y2Range = [y2Scale.invert(brush2[1][1]), y2Scale.invert(brush2[0][1])]

  // Selection filter function - true if both brushes contain selections
  function isSelected(d) {
    return (d.sepalLength >= x1Range[0] && d.sepalLength <= x1Range[1] &&
            d.sepalWidth >= y1Range[0] && d.sepalWidth <= y1Range[1] &&
            d.petalLength >= x2Range[0] && d.petalLength <= x2Range[1] &&
            d.petalWidth >= y2Range[0] && d.petalWidth <= y2Range[1])
  }
  
  let selected = allCircles
    .filter(isSelected);
  let notSelected = allCircles
    .filter(function(d) { return !isSelected(d); });

  d3.selectAll(selected).attr("stroke", "black").attr("stroke-width", 2)
}

////////////////////////////////////////////////////////////////////////
//
// d3 brush selection
// NOTE: You should not have to change any of the following:

function updateBrush1(event) {
  brush1 = event.selection;
  onBrush();
}

function updateBrush2(event) {
  brush2 = event.selection;
  onBrush();
}

plot1.brush
  .on("brush", updateBrush1)
  .on("end", updateBrush1);

plot2.brush
  .on("brush", updateBrush2)
  .on("end", updateBrush2);
