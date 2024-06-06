/**
 * Name: Kyle Walker
 * Course: CSC 444 Data Visualization Spr 2024
 * Assignment: A08 4/6/24
 * Purpose: This program generates different layouts of treemaps based on the flare dataset. The data
 *  is automatically ordered in alternating tree structures where each spot on the grid is shaped and
 *  sized based on the accessor data given to the function, so that value is represented using the entire
 *  view area as a range. The colors range in luminosity based on depth in the tree, with darker colors
 *  closest to the root. There are 4 layouts available using the buttons on the top which transition to 
 *  the following structures:
 *    - Size: the size of each data element determines its size in the tree map, with orientation
 *        alternating by depth
 *    - Count: the count of each data element determines its size in the tree map, with orientation
 *        alternating by depth
 *    - Size: The size of each data element determines its area in the tree map, with orientation
 *        alternating by depth
 *    - Best Size: the size determines the portion of the current rectangle each data point takes up, but
 *        its orientation is determined to have the least differences between width and height.
 *    - Best Count: the count determines the portion of the current rectangle each data point takes up, but
 *        its orientation is determined to have the least differences between width and height.
 * 
 *    Users may hover over each element area to view the data element's name.
 * 
 * Code built on skeleton provided by Joshua Levine credited below
    * a08.js
    * Template for CSC444 Assignment 08, Spring 2024
    * Joshua A. Levine <josh@email.arizona.edu>
      // 
      // a07.js
      // Template for CSC444 Assignment 07, Spring 2024
      // Joshua A. Levine <josh@arizona.edu>
      //
      // This file provides the template code for A10, providing a skeleton
      // for how to initialize and draw tree maps 
      //
 */


////////////////////////////////////////////////////////////////////////
// Global variables for the dataset 

// Different data sets for testing: 

//let data = test_1;
//let data = test_2;
let data = flare;

////////////////////////////////////////////////////////////////////////
// Tree related helper functions

/**
 * Sets the sizes of each subtree in the tree recursively, so all elements will contain the sizes of
 * all children below it. Returns the total size of the tree by returning root size
 * @param {Object} tree data tree passed as arg will recurse through all subtrees
 * @returns total size of the tree
 */
function setTreeSize(tree)
{
  if (tree.children !== undefined) {
    let size = 0;
    for (let i=0; i<tree.children.length; ++i) {
      size += setTreeSize(tree.children[i]);
    }
    tree.size = size;
  }
  return tree.size;
};


/**
 * Sets the Counts of each subtree in the tree recursively, so all elements will contain the counts of
 * all children below it. Returns the total count of the tree by returning root count
 * @param {Object} tree data tree passed as arg will recurse through all subtrees
 * @returns total count of the tree
 */
function setTreeCount(tree)
{
  if (tree.children !== undefined) {
    let count = 0;
    for (let i=0; i<tree.children.length; ++i) {
      count += setTreeCount(tree.children[i]);
    }
    tree.count = count;
  }
  if (tree.children === undefined) {
    tree.count = 1;
  }
  return tree.count;
}

/**
 * Sets the Depth of each subtree in the tree recursively, so all elements will contain the depths of
 * all children below it. Returns the total depth of the tree by returning max depth up to root.
 * @param {Tree} tree data tree passed as arg will recurse through all subtrees
 * @param {Number} depth starts at 0 (root) and stores depth along each recursive step
 * @returns total depth of the tree
 */
function setTreeDepth(tree, depth)
{
  let maxDepth = depth;
  if (tree.children !== undefined){
    tree.depth = depth;
    for (let i=0; i<tree.children.length; i++) {
      let childDepth = setTreeDepth(tree.children[i], depth + 1)
      // Check for max depth from children returns
      if (childDepth > maxDepth){
        maxDepth = childDepth;
      }
    }
  }
  if (tree.children === undefined){
    tree.depth = depth;
    maxDepth = depth;
  }
  return maxDepth;
};


// Initialize the size, count, and depth variables within the tree
setTreeSize(data);
setTreeCount(data);
let maxDepth = setTreeDepth(data, 0);


////////////////////////////////////////////////////////////////////////
// Main Code for the Treemapping Technique

/**
 * Sets the rectangle elements for all elements of the data tree, starting with the entire screen
 * area as a rectangle and recursively adding subareas for each subtree using the given attr Function
 * and flag for best fit orientation. Best fit makes orientation follow the least difference for
 * rectangle width and heights, where normally the division orientation is only based on alternating
 * down depths of the tree. Borders are added for padding.
 * @param {*} rect Current rectangle area to fit children rectangles into, starting with screen bounds
 * @param {*} tree Current subtree to generate rectangles from, starting from root
 * @param {*} attrFun Accessor function for which data attribute to represent in the graph, such as 
 *   size or count
 * @param {*} isBest Flag for best fit option, where if true all rectangles will be divided to minimize
 *  differences in width and height for best visual spacing
 */
function setRectangles(rect, tree, attrFun, isBest)
{
  tree.rect = rect;
  
  if (tree.children !== undefined) {
    // Add up all sizes for children
    let cumulativeSizes = [0];
    for (let i=0; i<tree.children.length; ++i) {
      cumulativeSizes.push(cumulativeSizes[i] + attrFun(tree.children[i]));
    }

    // Current rectangle properties
    let rectWidth = rect.x2 - rect.x1;
    let rectHeight = rect.y2 - rect.y1; 
    let border = 5;
    
    // Scale for child rectangle bounds
    let scale = d3.scaleLinear()
    .domain([0, cumulativeSizes[cumulativeSizes.length-1]]);
    
    // flags used for best fit direction
    let horizontalFit = false;
    let verticalFit = false;
    
    // Determine which direction to divide if Best Fit option flag is true
    if (isBest){
      if (rectWidth > rectHeight){
        verticalFit = true;
      }
      else if (rectHeight >= rectWidth){
        horizontalFit = true;
      }
    }

    // Go in y direction for even depths, or when best fit detects taller than wide
    if ((!isBest && (tree.depth % 2 == 0)) || verticalFit){
      // Border padding added to range
      scale.range([0, rectWidth - border*2])
      let xOffset = 0;
      
      for (let i=0; i<tree.children.length; ++i) {
        let value = cumulativeSizes[i+1] - cumulativeSizes[i];
        let scaledWidth = scale(value)
        
        let newRect = { 
          x1: rect.x1 + border + xOffset, 
          x2: rect.x1 + border + xOffset + scaledWidth, 
          y1: rect.y1 + border, 
          y2: rect.y2 - border
        };

        // Clamp padding so that padding causes no negative numbers for areas smaller than border
        newRect.y2 = Math.max(newRect.y1, newRect.y2)
        xOffset += scaledWidth;
        // Recurse through children
        setRectangles(newRect, tree.children[i], attrFun, isBest);
      }
    }

    // Go in x Direction for odd depths, or when best fit detects wider than tall
    else if ((!isBest && (tree.depth % 2 != 0)) || horizontalFit){
      // Border padding added to range
      scale.range([0, rectHeight - border * 2])
      let yOffset = 0;

      for (let i=0; i<tree.children.length; ++i) {
        let value = cumulativeSizes[i+1] - cumulativeSizes[i];
        let scaledHeight = scale(value)
        let newRect = { 
          x1: rect.x1 + border, 
          x2: rect.x2 - border, 
          y1: rect.y1 + border + yOffset, 
          y2: rect.y1 + border + yOffset + scaledHeight 
        };

        // Clamp padding so that padding causes no negative numbers for areas smaller than border
        newRect.x2 = Math.max(newRect.x1, newRect.x2)
        yOffset += scaledHeight;
        // Recuirse through children
        setRectangles(newRect, tree.children[i], attrFun, isBest);
      }
    }
  }
}

// initialize the tree map
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

// compute the rectangles for each tree node - Starts with size
setRectangles(
  {x1: 0, y1: 0, x2: winWidth, y2: winHeight}, data,
  function(t) { return t.size; }, false
);

// make a list of all tree nodes;
function makeTreeNodeList(tree, lst)
{
  lst.push(tree);
  if (tree.children !== undefined) {
    for (let i=0; i<tree.children.length; ++i) {
      makeTreeNodeList(tree.children[i], lst);
    }
  }
}

let treeNodeList = [];
makeTreeNodeList(data, treeNodeList);



////////////////////////////////////////////////////////////////////////
// Visual Encoding portion

// d3 selection to draw the tree map 
let gs = d3.select("#svg")
           .attr("width", winWidth)
           .attr("height", winHeight)
           .selectAll("g")
           .data(treeNodeList)
           .enter()
           .append("g");

function setAttrs(sel) {
  sel.attr("width", function(treeNode) { return (treeNode.rect.x2 - treeNode.rect.x1)})
     .attr("height", function(treeNode) { return (treeNode.rect.y2 - treeNode.rect.y1)})
     .attr("x", function(treeNode) { return treeNode.rect.x1})
     .attr("y", function(treeNode) { return treeNode.rect.y1})
     .attr("fill", function(treeNode) { return d3.hsl(200, 0.42, 0.10 + (treeNode.depth /5) ,1 )})
     .attr("stroke", function(treeNode) { return "black"});

  if(sel.attr("title") == null){
    sel.append("title")
    .text(function(treeNode) { 
       return treeNode.name;
    });

  }
}

gs.append("rect").call(setAttrs);


////////////////////////////////////////////////////////////////////////
// Callbacks for buttons

// Sets rectangles using Size attr func
d3.select("#size").on("click", function() {
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data, 
    function(t) { return t.size; }, false
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});


// Sets rects using Count attr func
d3.select("#count").on("click", function() {
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data,
    function(t) { return t.count; }, false
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});


// Sets rectangles using Size attr func with best fit flag
d3.select("#best-size").on("click", function() {
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data, 
    function(t) { return t.size; }, true
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});


// Sets rects using Count attr func with best fit flag
d3.select("#best-count").on("click", function() {
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data,
    function(t) { return t.count; }, true
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});
