A08
------------

Author: Kyle Walker [kvwalker@arizona.edu](mailto:kvwalker@arizona.edu)  
Date: 4/6/24


## Notes
Generates a treemap of the flare dataset with buttons to change between 4 different treemap layouts. To run, download and extract the zip file and run index.html on default browser. Mine was tested using Brave Browser which uses the Chromium Engine. 

To interact with the data, use the 4 buttons to switch between layouts:
* Count: The count of each data element determines its area in the tree map, with orientation alternating by depth.
* Size: The size of each data element determines its area in the tree map, with orientation alternating by depth.
* Best Size: The size determines the portion of the current rectangle each data point takes up, but its orientation is determined to have the least differences between width and height.
* Best Count: The count determines the portion of the current rectangle each data point takes up, but its orientation is determined to have the least differences between width and height.

The treemap starts default in the Size layout. 

To view data, hover over any data area and the name will become visible as a label.

Color Luminance corresponds to depth in data tree, with darker blue closest to root and bright blue closest to leaf nodes.

To change datasets to the test cases, switch the assignment of the data variable in a08.js in line 44 by uncommenting the desired variable and commenting the previous one:

    //let data = test_1;
    //let data = test_2;
    let data = flare;

Code built on skeleton provided by Joshua Levine: 

* a08.js
Template for CSC444 Assignment 08, Fall 2021.
Joshua A. Levine <josh@email.arizona.edu>

## Included files

* a08.js - Main javascript code using d3.js to populate index.html with the treemap visualization. uses the flare.js data tree to generate treemaps, and will respond to button input to switch the layout using a 1 second transition.
* d3.js - Javascript d3 visualization library used by a08.js for transitions, scales, colors, and attribute assignments.
* flare.js - "Flare" dataset. By Jeffrey Heer, accessed from Mike Bostock: https://bl.ocks.org/mbostock/972398 represented as a Javascript array tree object used by a08.js as data for the treemap.
* index.html - main html page containing the visualization elements and buttons for user to view and interact with in browser.
* README.md - This file.
* test-cases.js - Test trees used in development for a08.js, which may also be viewed when reassigning variables in a08.js.


## References
* https://www.cs.umd.edu/users/ben/papers/Shneiderman1992Tree.pdf
* https://hslpicker.com/#1f3c4c
* https://www.geeksforgeeks.org/d3-js-d3-hsl-function/
