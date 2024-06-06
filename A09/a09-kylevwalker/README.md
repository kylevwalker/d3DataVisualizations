A09 - Marching Squares
------------

Author: Kyle Walker [kvwalker@arizona.edu](mailto:kvwalker@arizona.edu)  
Date: 4/10/24


## Notes
This program generates isocontour lines and filled contour areas representing the hurricane Isabel dataset. There are contour and fill visualizations for both pressure and temperature maps. Isocontours are calculated using a 2D version of Marching Cubes, a.k.a. Marching Squares.

To run, download zip and extract to open the index.html file in default browser. Tested in Brave Browser (Chromium). All visualization is automatic, and there are no user interactions necessary.

Temperature uses a sequential colormap where red is higher temperature and blue is lower.
 
Pressure uses a diverging colormap with 0 pressure as white, red is high and blue is lower
pressure where both diverge from 0 at even rates.

The code for A09.js was created using the template code provided by Joshua Levine:

    a11.js

    Template for CSC444 Assignment 11, Fall 2021

Joshua A. Levine <josh@email.arizona.edu>

## Included files

* a09.js - Visualization js file which populates html page with all SVG elements, using d3.js to represent data.js. Automatically generates all visualizations on load.
* d3.js - D3 js visualization library used by a09.js for svg manipulation, path creation, data binding, and scales for vis.
* data.js - Modified Dataset of Hurricane Isabel Pressure and Temperatures by Lattitude and Longitude coordinates. Includes conversion to grid corners used in Marching Squares algorithm of a09.js.
* index.html - Main HTML page which holds all visualization elements for user to view.
* README.md - This file.

## References
https://observablehq.com/@d3/d3-path



