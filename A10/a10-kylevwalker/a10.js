/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Assignment: A10 4/20/24
 * Purpose: This program allows users to control the Transfer function for 
 *    3D volume data. After loading a 3d .vti file, the transfer function will
 *    be editable using the 5 given control points. Colormaps are also available
 *    to be switched between, and the current color range is shown with color blocks
 *    corresponding to the x axis of the transfer function curve. Moving points on
 *    the curve increases the opacity of all faces in the given value range with
 *    linear interpolation between points. Transfer functions for both color and
 *    opacity which maps the color and opacity for all values using curve
 * 
 *    Colormaps:
 *      - Sequential - 3 color sequential map from yellow to blue
 *      - Diverging - Diverges to either Red or Blue with neutral light grey in middle
 *      - Categorical - 5 color Colorblind friendly Okabe-Ito palette with nearest neighbor
 *        interpolation between colors
 * 
 *    Depends on volren.js and vtk.js, used for processing and rendering 3d .vti 
 *    files in the browser view.
 * 
 *    Built on skeleton code provided by Joshua A. Levine:
    * // a10.js
      // Template code for CSC444 Assignment 10, Spring 2024
      // Joshua A. Levine <josh@arizona.edu>
      //
      // This implements an editable transfer function to be used in concert
      // with the volume renderer defined in volren.js
      //
      // It expects a div with id 'tfunc' to place the d3 transfer function
      // editor
 */

////////////////////////////////////////////////////////////////////////
// Global variables and helper functions

// colorTF and opacityTF store a list of transfer function control
// points.  Each element should be [k, val] where k is a the scalar
// position and val is either a d3.rgb or opacity in [0,1] 
let colorTF = [];
let opacityTF = [];

// D3 layout variables
let size = 500;
let margin = 32;
let svg = null;

// Variables for the scales
let xScale = null;
let yScale = null;
let colorScale = null;


////////////////////////////////////////////////////////////////////////
// Visual Encoding portion that handles the d3 aspects

// Function to create the d3 objects
function initializeTFunc() {
  svg = d3.select("#tfunc")
    .append("svg")
    .attr("width", size)
    .attr("height", size);

  updateTFunc();
  
  //Initialize the axes
  // X axis
  let xAxisG = svg.append("g")
    .attr("transform", "translate (" + margin + "," + (size - margin) + ")")
    .attr("class", "xaxis")
  
  let xAxis = d3.axisBottom(xScale);
  xAxisG.call(xAxis);
  
  // Y axis
  let yAxisG = svg.append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .attr("class", "yAxis")

  let yAxis = d3.axisLeft(yScale);

  yAxisG.call(yAxis)

  //Initialize path for the opacity TF curve
  makeOpacity(); 

  //Initialize circles for the opacity TF control points
  let drag = d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);

  svg.append("g")
    .attr("class", "points")
    .attr("transform", "translate(" + margin + "," + margin +  ")")
    .selectAll("circle")
    .data(opacityTF)
    .enter()
    .append("circle")
    .attr("index", (d,i) => i)
    .style('cursor', 'pointer')
    .attr("fill", (d,i) => {return colorScale(xScale(opacityTF[i][0]))})
    .attr("stroke", "black")
    .attr("r", 5)
    .attr("cx", (d,i) => {return xScale(opacityTF[i][0])})
    .attr("cy", (d,i) => {return yScale(opacityTF[i][1])})
    .call(drag);

  // Path for TF editor
  let pathG = svg.append("g").attr("transform", "translate(" + margin + "," + margin +  ")")
  
  pathG.append("path")
    .attr("class", "path")
    .attr("fill", "none")
    .attr("stroke", "black");
  
  //Create the color bar to show the color TF
  let colorBar = xAxisG.append("g")
    .attr("class", "colorbar")
    .attr("transform", "translate (0," + margin/2 + ")")

  //After initializing, set up anything that depends on the TF arrays
  updateTFunc();
}

// Call this function whenever a new dataset is loaded or whenever
// colorTF and opacityTF change
function updateTFunc() {
  //update scales
  xScale = d3.scaleLinear()
    .domain(dataRange)
    .range([0, size- (margin * 2)])
 
  yScale = d3.scaleLinear()
    .domain([1, 0])
    .range([0,  size - (margin * 2)])

  //hook up axes to updated scales
  let xAxisG = d3.select(".xaxis");
  let xAxis = d3.axisBottom(xScale);
  xAxisG.call(xAxis);

  //update opacity curves using event drag position 
  d3.select(".points")
    .selectAll("circle")
    .data(opacityTF)
    .attr("cx", (d,i) => {return xScale(opacityTF[i][0])})
    .attr("cy", (d,i) => {return yScale(opacityTF[i][1])})
    .attr("fill", (d,i) => {return (colorScale(opacityTF[i][0]))})

  // Regenerate path to follow new position of points
  d3.select(".path")
    .attr("d", () => {let path = "M0," + yScale(0)
    for(let i = 0; i< opacityTF.length; i++){
      path += "L" + xScale(opacityTF[i][0]) + "," + yScale(opacityTF[i][1])
    }
    path += "L" + xScale(dataRange[1]) + "," +  yScale(0);
  return path})

  //update colorbar
  let colors = colorTF.length;
  let rectWidth = (size - (margin * 2)) / colors;
  let colorbar = d3.select(".colorbar");
  colorbar.selectAll("rect")
    .exit().remove()
    .data(colorTF)
    .enter()
    .append("rect")
    .attr("x", (d, i) => {return rectWidth * i})
    .attr("y", 2)
    .attr("width", (d, i) => {return rectWidth})
    .attr("height", margin/2)
    .attr("fill", (d) => {return d[1]})
}

// To start, let's reset the TFs and then initialize the d3 SVG canvas
// to draw the default transfer function
resetTFs();
initializeTFunc();


////////////////////////////////////////////////////////////////////////
// Interaction callbacks

// Will track which point is selected
let selected = null;

// Called when mouse down
function dragstarted(event,d) {
  selected = parseInt(d3.select(this).attr("index"));
}

// Called when mouse drags. Clamps positions to inside axis and between neighboring points
function dragged(event,d) {
  if (selected != null) {
    let pos = [];
    pos[0] = xScale.invert(event.x);
    pos[1] = yScale.invert(event.y);

    // Clamp to y axis bounds for all
    if (pos[1] < 0){pos[1] = 0}
    if (pos[1] > 1){pos[1] = 1}

    // Clamp to lower x bound for first point
    if (selected == 0){
      if (pos[0] < 0){pos[0] = 0}
      if (pos[0] > opacityTF[selected+1][0]){pos[0] = opacityTF[selected+1][0]}
    }
    // Clamp last point to high x bound
    else if (selected == (opacityTF.length - 1)){
      if (pos[0] > dataRange[1]){pos[0] = dataRange[1]}
      if (pos[0] < opacityTF[selected-1][0]){pos[0] = opacityTF[selected-1][0]}
    }
    // Clamp all other points between neighbors
    else{
      if (pos[0] < opacityTF[selected-1][0]){pos[0] = opacityTF[selected-1][0]}
      if (pos[0] > opacityTF[selected+1][0]){pos[0] = opacityTF[selected+1][0]}
    }
    // Set opacity TF to the selected position
    opacityTF[selected] = pos;

    //update TF window
    updateTFunc();
    
    //update volume renderer
    updateVR(colorTF, opacityTF);
  }
}

// Called when mouse up
function dragended() {
  selected = null;
}


////////////////////////////////////////////////////////////////////////
// Function to read data

// Function to process the upload
function upload() {
  if (input.files.length > 0) {
    let file = input.files[0];
    console.log("You chose", file.name);

    let fReader = new FileReader();
    fReader.readAsArrayBuffer(file);

    fReader.onload = function(e) {
      let fileData = fReader.result;

      //load the .vti data and initialize volren
      initializeVR(fileData);

      //upon load, we'll reset the transfer functions completely
      resetTFs();

      //Update the tfunc canvas
      updateTFunc();
      
      //update the TFs with the volren
      updateVR(colorTF, opacityTF, false);
    }
  }
}

// Attach upload process to the loadData button
var input = document.getElementById("loadData");
input.addEventListener("change", upload);



////////////////////////////////////////////////////////////////////////
// Functions to respond to buttons that switch color TFs
function resetTFs() {
  makeSequential();
  makeOpacity();
}

// Make a default opacity TF, starting with linear curve upwards as values increase, with intercept
// at zero to hide bounding volume data by default
function makeOpacity() {
  //Here is a default TF
  //note that opacityTF need not have the same number of points as colorTF
  //nor do those points need to be in same positions.
  let min = dataRange[0];
  let max = dataRange[1];
  let diff = max - min;

  opacityTF = [
    [min, 0],
    [diff / 4, 0.25],
    [diff / 2, 0.5],
    [(diff / 4) * 3, 0.75],
    [max, 1]
  ];
}

// Make a sequential color TF YeGrBu
function makeSequential() {
  colorScale = d3.scaleLinear().interpolate(d3.interpolateHcl);
  
  let min = dataRange[0];
  let max = dataRange[1];
  let diff = max - min;

  colorScale.domain(dataRange)
    .range([d3.rgb(255,255,0), d3.rgb(0,255,0), d3.rgb(0,0,255)])

  colorTF = [
    [min, d3.rgb(255,255,0)],
    [diff /2, d3.rgb(0,255,0)],
    [max, d3.rgb(0,0,255)]
  ]
}

// Make a diverging color TF ReWhBu
function makeDiverging() {
  colorScale = d3.scaleLinear().interpolate(d3.interpolateHcl);;

  let min = dataRange[0];
  let max = dataRange[1];
  let diff = max - min;
  
  colorScale.domain(dataRange)
    .range([d3.rgb(0,0,255), d3.rgb(200,200,200), d3.rgb(255,0,0)])

  colorTF = [
    [min, d3.rgb(0,0,255)],
    [diff / 2, d3.rgb(200,200,200)],
    [max, d3.rgb(255,0,0)]
  ]
}

// Make categorical colormap using Okabe Ito Colorblind-friendly palette
function makeCategorical(){
  colorScale = d3.scaleQuantize();

  let min = dataRange[0];
  let max = dataRange[1];
  let diff = max - min;

  colorScale.domain(dataRange)
    .range(["#E69F00", "#56B4E9", "#CC79A7", "#009E73", "#F5C710"])
  
  colorTF = [
    [min, d3.rgb("#E69F00")],
    [(diff / 4), d3.rgb("#56B4E9")],
    [(diff / 2), d3.rgb("#CC79A7")],
    [(diff / 4) * 3, d3.rgb("#009E73")],
    [max, d3.rgb("#F5C710")]
  ]

}

// Configure callbacks for each button

// Sequential colormap button
d3.select("#sequential").on("click", function() {
  makeSequential();
  updateTFunc();
  updateVR(colorTF, opacityTF, false);
});

// Diverging colormap button
d3.select("#diverging").on("click", function() {
  makeDiverging();
  updateTFunc();
  updateVR(colorTF, opacityTF, false);
});

//Categorical Colormap button
d3.select("#categorical").on("click", function() {
  makeCategorical();
  updateTFunc();
  updateVR(colorTF, opacityTF, true);
});

