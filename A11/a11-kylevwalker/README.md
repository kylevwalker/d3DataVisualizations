A11
------------

Author: NAME [kvwalker@arizona.edu](mailto:kvwalker@arizona.edu)  
Date: 4/26/24


## Notes
To run the program, download and extract zip and open index.html. All visualizations will automatically be generated on page load as long as the file is opened in its original directory. Code was tested on Brave Broswer using Chromium engine. 

The program will create four different visualizations for the same dataset. These act as different flow visualizations where vector magnitudes and directions are represented in different ways. The visualizations are ordered as follows:
- Color cells: Vector magnitude is represented with sequential colormap on a grid.
- Line Plot: Uniform plot of lines with same length representing vector directions.
- Uniformly Placed Glyphs: Glyphs all originate from center points of each cell,
    but have arrow direction and length by vector magnitude.
- Random Custom Glyphs: glyphs are emitted from random points within each cell and
    vary in length and color by magnitude. Glyphs are rounded arrows where length,
    color, and width all represent magnitude. Rotated to face vector direction.


Code for a11.js was built upon skeleton code provided by Joshua Levine:

a11.js

Template code for CSC444 Assignment 11, Spring 2024

Joshua A. Levine <josh@arizona.edu>

## Included files

* a11.js - Program using d3.js to generate visualizations of data.js onto index.html. Automatically processes all data from dataset and populates SVGs on html page to display the 4 different visualizations.
* d3.js - d3 visualization library used by a11.js for scales, data binding, and svg element appending.
* data.js - dataset as javascript array containing vector points in grid for a simulation of three vortex points.
* index.html - main HTML page for viewing visualizations, containing all 4 SVG panes of each visualization method and their labels.
* README.md - this file.


## References
- https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
- https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2


