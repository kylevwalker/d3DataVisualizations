A04
------------

Author: Kyle Walker [kvwalker@arizona.edu](mailto:kvwalker@arizona.edu)  
Date: 2/23/24

## Notes
To run this program, simply download the zip and open the extracted index.html file in your default browser. Testing was done on Brave Browser using Chromium engine. To view the different colormaps for the 
GPA mapping, select any of the three labeled buttons below the visual.

Code relating to the buttons was directly adapted from the included Buttons.js file provided and written by Joshua Levine. 

D3 library used for visualizations.

## Included files

* index.html - HTML page to load in browser to view visualization. Populated by a04.js.
* a04.js - Main Javascript file used for generating the visualizations and populating the DOM of index.html. Creates the scatterplot of data from calvinScores.js using d3.js library. Runs on load of index.html.
* style.css - stylesheet for index.html which centers elements and adds padding to buttons, and makes axis labels more readable. 
* d3.js - d3 library used for visualizations in a04.js. Provides functionality for web visualization workflow and is necessary for a04.js.
* calvinScores.js - File containing JS array of data from 2004 Calvin College Senior grade CSV, which is the data represented by a04.js in index.html.
* buttons.js - Example file for creating buttons in d3 which was copied and adapted for a04.js. Included as reference.
* README.md - this file.


## References
 * https://d3js.org/d3-scale
 * https://d3js.org/d3-scale/quantize
 * https://d3js.org/d3-transition
 * https://observablehq.com/@d3/d3-extent
 *  https://blocks.roadtolarissa.com/mbostock/3883245
 * https://observablehq.com/@d3/d3-scalelinear
