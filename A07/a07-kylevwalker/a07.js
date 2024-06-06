/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Assignment: A07 3/25/24
 * Purpose: This program creates an interactable parellel coordinates chart representing a dataset on 
 *  penguins including flipper length, bill length, bill depth, and body mass. Clicking labels shifts
 * the order of the parallel axes for custom control of comparison order. Brushes can be created and
 * scaled along each of the different axes to allow selections for ranges between all qualities, singling
 * out only the data that fits into the ranges of all defined brushes. Species is denoted by color and 
 * selections are denoted by opacity as follows:
 *    - blue: Adelie
 *    - pink: Chinstrap
 *    - orange: Gentoo
 * 
 * 
 * Code built on skeleton provided by Joshua Levine credited below
    * a07.js
    * Skeleton for CSC444 Assignment 07, Fall 2021
    * Joshua A. Levine <josh@email.arizona.edu>
      // 
      // a07.js
      // Template for CSC444 Assignment 07, Spring 2024
      // Joshua A. Levine <josh@arizona.edu>
      //
      // This file provides the template code for A07, providing a skeleton
      // for how to initialize and draw the parallel coordinates plot  
      //
 */

////////////////////////////////////////////////////////////////////////

// Global variables for the dataset 
let data = penguins

// dims will store the four axes in left-to-right display order
let dims = [
  "bill_length",
  "bill_depth",
  "flipper_length",
  "body_mass"
];

// mapping from dimension id to dimension name used for text labels
let dimNames = {
  "bill_length": "Bill Length",
  "bill_depth": "Bill Depth",
  "flipper_length": "Flipper Length",
  "body_mass": "Body Mass",
};


////////////////////////////////////////////////////////////////////////

// Global variables for the svg
let width = dims.length*125;
let height = 500;
let padding = 50;

let svg = d3.select("#pcplot")
  .append("svg")
  .attr("width", width).attr("height", height);


////////////////////////////////////////////////////////////////////////
// Initialize the x and y scales, axes, and brushes.  
//  - xScale stores a mapping from dimension id to x position
//  - yScales[] stores each y scale, one per dimension id
//  - axes[] stores each axis, one per id
//  - brushes[] stores each brush, one per id
//  - brushRanges[] stores each brush's event.selection, one per id
let xScale = d3.scalePoint()
  .domain(dims)
  .range([padding, width-padding]);

let yScales = {};
let axes = {};
let brushes = {};
let brushRanges = {};

// For each dimension, we will initialize a yScale, axis, brush, and
// brushRange
dims.forEach(function(dim) {
  //create a scale for each dimension
  yScales[dim] = d3.scaleLinear()
    .domain( d3.extent(data, function(datum) { return datum[dim]; }) )
    .range( [height-padding, padding] );

  //set up a vertical axis for each dimensions
  axes[dim] = d3.axisLeft()
    .scale(yScales[dim])
    .ticks(10);
  
  //set up brushes as a 20 pixel width band
  //we will use transforms to place them in the right location
  brushes[dim] = d3.brushY()
    .extent([[-10, padding], [+10, height-padding]]);
  
  //brushes will be hooked up to their respective updateBrush functions
  brushes[dim]
    .on("brush", updateBrush(dim))
    .on("end", updateBrush(dim))

  //initial brush ranges to null
  brushRanges[dim] = null;
});


////////////////////////////////////////////////////////////////////////

// Make the parallel coordinates plots 

// Maps each of the dimensions to their scales for each data point to return a path using d3.line
function path(d) {
  return d3.line()(dims.map((p) => { return [xScale(p), yScales[p](d[p])]}))
}

// Categorical colors for species type: - blue: Adelie    - pink: Chinstrap   - orange: Gentoo
let colorScale = d3.scaleOrdinal()
  .domain(data, (d) => d.species)
  .range([d3.lab(70, 15, -100), d3.lab(70, 15, 100), d3.lab(70, 80, 0)])


// add the actual polylines for data elements, each with class "datapath"
svg.append("g")
  .selectAll(".datapath")
  .data(data)
  .enter()
  .append("path")
  .attr("class", "datapath")
  .attr("d", path)
  .attr("fill", "none")
  .attr("opacity", 0.75)
  .attr("stroke", (d) => colorScale(d.species))

// add the axis groups, each with class "axis"
svg.selectAll(".axis")
  .data(dims)
  .enter()
  .append("g")
  .attr("class", "axis")
  .attr("transform", (d) => {return "translate(" + xScale(d) + ")"})
  .each(function(d) {
    return d3.select(this).call(axes[d]);
  })

// add the axes labels, each with class "label"
svg.selectAll(".label")
  .data(dims)
  .enter()
  .append("text")
  .attr("class", "label")
  .attr("transform", (d) => {return "translate(" + xScale(d) + ")"})
  .on("click", onClick)
  .style("text-anchor", "middle")
  .attr("y", 32)
  .text((d) => {return dimNames[d]})
  .style("fill", "black")
  .style("font-size", 12)

// add the brush groups, each with class ".brush" 
svg.selectAll(".brush")
  .data(dims)
  .enter()
  .append("g")
  .attr("class", "brush")
  .attr("transform", (d) => {return "translate(" + xScale(d) + ")"})
  .each(function(d) {
    let brush = brushes[d];
      yScales[d].brush = brush;
    return d3.select(this).call(brush);
  })

////////////////////////////////////////////////////////////////////////
// Interaction Callbacks

// Callback for swapping axes when a text label is clicked.
// Swaps dims order by moving clicked label to the right, or left if it is rightmost element
// Uses 1 second transition to slide all elements in new positions after rebinding data
function onClick(event,d) {
  // Swap dims
  let i = dims.indexOf(d);
  let shift = 1;
  if (i >= dims.length - 1){shift = -1;}
  let a = dims[i];
  let b = dims[i + shift]
  dims[i + shift] = a;
  dims[i] = b;

  // Transition 1 second, swap xScale domain to new dims
  const transitionTime = 1000;
  xScale.domain(dims);

  // Slide labels over to new x dim positions
  let labels = d3.selectAll(".label");
  labels.transition().duration(transitionTime)
    .attr("transform", (d) => {return "translate(" + xScale(d) + ")"})
    .text((d) => {return dimNames[d]})

  // Slide axes to new x dim positions
  let axes = d3.selectAll(".axis");
  axes.transition().duration(transitionTime)
    .attr("transform", (d) => {return "translate(" + xScale(d) + ")"})

  // Slide brushes over to new x dims positions
  let brushes = d3.selectAll(".brush");
  brushes.transition().duration(transitionTime)
    .attr("transform", (d) => {return "translate(" + xScale(d) + ")"})

  // Slide datapath lines over based on new x dims positions
  let datapaths = d3.selectAll(".datapath");
  datapaths.transition().duration(transitionTime)
    .attr("d", path)
}

// Returns a callback function that calls onBrush() for the brush
// associated with each dimension
function updateBrush(dim) {
  return function(event) {
    brushRanges[dim] = event.selection;
    onBrush();
  };
}

// Callback when brushing to select elements in the PC plot. Filters for datapaths which
// fall inside the ranges of all brushes and makes all others less visible to denote selections
function onBrush() {
  let allLines = d3.selectAll(".datapath");
  
  // Checks if datapath values fall within ranges of all brushes of all axes, otherwise it is not selected
  function isSelected(d) {
    for (key in d){
      if (brushRanges[key] != null){
         if (!(d[key] <= yScales[key].invert(brushRanges[key][0]) && d[key] >= yScales[key].invert(brushRanges[key][1]))){
            return false;
         }
      }
    }
    return true;
  }

  // Apply filters
  let selected = allLines
    .filter(isSelected);
  let notSelected = allLines
    .filter(function(d) { return !isSelected(d); });

  // Let selected be focused while not selected are hidden with lower opacity
  selected.attr("opacity", 0.75)
  notSelected.attr("opacity", 0.1)
}

