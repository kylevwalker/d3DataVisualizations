/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Assignment: A04 2/22/24
 * Purpose: This program uses D3.js to recreate the scatterplot from A02 and A03 using scales
 *  and buttons for transitioning colormaps. The use of scales simplifies axis making and plotting
 *  points so this program uses separate scales for the following:
 *      x axis position: SATV score
 *      y axis position: ACT score
 *      circle radius: SATM score
 *      circle color: GPA
 *  All data comes from 2004 Calvin College score dataset and Button code is copied from
 *  J. Levine's Button.js. All data is automatically plotted in an SVG of 500 x 500 pixels
 *  but the buttons allow for smooth 1.5 second transitions between the three color mappings
 *  which use different scales to represent the same data.
 *  Code is auto-formatted for readability
 */

// Sizing and formatting
var margins = { top: 15, right: 15, bottom: 50, left: 50 }; // Margins for data leaving room for axes
var width = 500; // Width of plot area leaving room for axes
var height = 500; // Height of plot area leaving room for axes
const transitionMS = 1500; // Transition time in MS for color changes

// Create SVG area with 500x500 pixel space and id scatterplot_1
var svg = d3
  .select("#vis1")
  .append("svg")
  .attr("id", "scatterplot_1")
  .attr("width", width)
  .attr("height", width);

/** Make scatterplot area a group shifted outside of margins, and adjust height and width for scales to account for axis margins */
var plot_g = svg
  .append("g")
  .attr("transform", "translate(" + margins.left + ", " + margins.top + ")");
width -= margins.left + margins.right;
height -= margins.top + margins.bottom;

/** D3 Linear Scale for x axis with domain of rounded min to max SATV scores, and range of axis width */
const cxScale = d3
  .scaleLinear()
  .domain([
    Math.floor(d3.min(scores, (d) => d.SATV) / 50) * 50,
    d3.max(scores, (d) => d.SATV),
  ])
  .range([0, width]);

/** D3 Linear Scale for y axis with domain of rounded min to max ACT scores, and range of inverted axis height */
const cyScale = d3
  .scaleLinear()
  .domain([
    Math.floor(d3.min(scores, (d) => d.ACT) / 6) * 6 + 2,
    d3.max(scores, (d) => d.ACT) + 1,
  ])
  .range([height, 0]);

/** D3 SquareRoot Scale for radius with domain of min to max of SATM scores, and range of radius 2 to 12 pixels */
const rScale = d3
  .scaleSqrt()
  .domain(d3.extent(scores, (d) => d.SATM))
  .range([2, 12]);

/** D3 Linear Scale for fill color with domain of min to max GPA, and range from blue to red */
const colorRdBuScale = d3
  .scaleLinear()
  .domain(d3.extent(scores, (d) => d.GPA))
  .range(["blue", "red"]);

/** D3 Linear Scale for fill color with domain of min, mean, and max GPA mapped to range of blue, yellow, and red */
const colorRdYlBuScale = d3
  .scaleLinear()
  .domain([
    d3.min(scores, (d) => d.GPA),
    d3.mean(scores, (d) => d.GPA),
    d3.max(scores, (d) => d.GPA),
  ])
  .range(["#2c7bb6", "#ffffbf", "#d7191c"]);

/** D3 Quantized Scale for fill color with 5 sectors with domain of min and max GPA, with range of 5 colors in RdYlBl-5 map */
const colorRdYlBu5Scale = d3
  .scaleQuantize()
  .domain(d3.extent(scores, (d) => d.GPA))
  .range(["#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c"]);

// Plot points with default RdBu colormap, using scales for each attribute of every plot point
plot_g
  .selectAll("circle")
  .data(scores)
  .enter()
  .append("circle")
  .attr("cx", (d) => cxScale(d.SATV))
  .attr("cy", (d) => cyScale(d.ACT))
  .attr("r", (d) => rScale(d.SATM))
  .attr("fill", (d) => colorRdBuScale(d.GPA));

// X axis in bottom margin with SATV label
plot_g
  .append("g")
  .attr("transform", "translate(0 " + height + ")")
  .call(d3.axisBottom(cxScale))
  .append("text")
  .attr("class", "axisLabel")
  .attr("x", width / 2)
  .attr("y", margins.bottom / 1.25)
  .text("SATV");

// Y axis in left margin with ACT label and aligned text
plot_g
  .append("g")
  .call(d3.axisLeft(cyScale))
  .append("text")
  .attr("class", "axisLabel")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -margins.left / 1.5)
  .text("ACT");

/** The 3 buttons mapping to the transitions between the 3 different colormaps of GPA. Sets fill using assigned scale on click 
 * Code adapted from Buttons.js example By J. Levine
*/
var colorButtons = [
  {
    id: "colormap-button-1",
    text: "Cont. RdBu",
    click: () =>
      plot_g
        .selectAll("circle")
        .transition()
        .duration(transitionMS)
        .attr("fill", (d) => colorRdBuScale(d.GPA)),
  },
  {
    id: "colormap-button-2",
    text: "Cont. RdYlBu",
    click: () =>
      plot_g
        .selectAll("circle")
        .transition()
        .duration(transitionMS)
        .attr("fill", (d) => colorRdYlBuScale(d.GPA)),
  },
  {
    id: "colormap-button-3",
    text: "Quant. RdYlBu-5",
    click: () =>
      plot_g
        .selectAll("circle")
        .transition()
        .duration(transitionMS)
        .attr("fill", (d) => colorRdYlBu5Scale(d.GPA)),
  },
];

/** Appends the buttons created above to the controls div so that the buttons are available to viewer. Directly
 * copied from Buttons.js example by J. Levine.
 */
d3.select("#controls")
  .selectAll("button")
  .data(colorButtons)
  .enter()
  .append("button")
  .attr("id", function (d) {
    return d.id;
  })
  .text(function (d) {
    return d.text;
  })
  .on("click", function (event, d) {
    // Since the button is bound to the objects from buttonList,
    // the expression below calls the click function from either
    // of the two button specifications in the list.
    return d.click();
  });
