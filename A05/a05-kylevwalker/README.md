A05
------------

Author: Kyle Walker [kvwalker@arizona.edu](mailto:kvwalker@arizona.edu)  
Date: 3/12/24


## Notes
To run this code, download and extract the zip file and open index.html in your default browser. Code was tested using Brave Browser (Chromium). The html page will display the 4 visualizations of data from the Hurricane Isabel dataset using different colormaps and data points. The visualizations are shown as follows:
* Temperature in a simple sequential colormap
* Temperature in a LAB perceptually uniform colormap from vis 1
* Pressure in a LAB perceptually uniform diverging colormap
* Bivariate colormap of pressure and temperature using perceptually uniform LAB colors

My code was added onto the skeleton code provided by Joshua Levine.

Joshua A. Levine: <josh@email.arizona.edu>


## Included files
* a05.js - Main code which populates index.html with visualizations for the dataset. Uses d3.js to map data to rectangle grid svgs using d3 color scales and interpolation.
* d3.js - d3 visualization library for javascript used by a05.js for visualization creation and color interpolation.
* data.js - Dataset as javascript array containing Lattitude, Longitude, Pressure, and Temperature values in Hurricane Isabel. The Lat and Lon values are used for coordinates of rectangles in the svg grid, while temp and pressure are used for the different color mappings seen in index.html.
* index.html - The html page which displays the visualizations in browser to be viewed. Automatically runs a05.js on load so visualizations are ready to be viewed.
* README.md - This file.


## References
* https://blocks.roadtolarissa.com/mbostock/9f37cc207c0cb166921b
* https://d3js.org/d3-interpolate/color


