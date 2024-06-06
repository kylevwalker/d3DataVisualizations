A10
------------

Author: Kyle Walker [kvwalker@arizona.edu](mailto:kvwalker@arizona.edu)  
Date: 4/20/24


## Notes
To use this program, download zip and extract index.html to be opened in your browser of choice. First, choose a .vti dataset from your computer or from the included datasets in the /datasets folder. 

Click and drag or scroll in the 3D viewport to change the orientation of the 3D render. Click and drag the points in the transfer function curve editor window to change the opacity ranges
for each value, which correspond to a color in the current colormap. 

Change colormaps by using the buttons above the viewport to swap between 3 maps:
* Sequential: YeGrBu gradient
* Diverging: ReWhBu gradient
* Categorical: Okabe Ito solid colors

Code was tested using Brave Browser (Chromium). Code depends on d3.js, volren.js, and vtk.js libraries for visualization, processing and rendering of volume data. 

The code for A10.js was created using the template code provided by Joshua Levine:

a10.js

Template code for CSC444 Assignment 10, Spring 2024

Joshua A. Levine <josh@arizona.edu>


## Included files

* datasets/ - Included datasets folder with four different .vti 3d volume data. Includes models for an Engine, Fuel part, Hydrogen molecule, and Tooth
* a10.js - Main visualization code which gives interface for user control and visualizes data and transfer function curve. Processes user input to change visualization. Depends on vtk.js, volren.js, and d3.js.
* d3.js - d3 visualization library used by a10.js for scales, event handling, and function graph visualization.
* index.html - main HTML page containing all vis for users to view in broswer. Automatically populated by a10.js on load, but requires manual file selection to begin vis.
* README.md - This file.
* volren.js - Helper code used for transforming transfer function data and parameters from a10.js into usable function calls in vtk.js renderer. Adjusts the render settings to reflect the colors and opacity values defined in the current state of a10.js by the html input.
* vtk.js - Volume rendering code used for the 3d viewport display. Handles color, opacity, shading, and camera orientation for the rendering of .vti volume datasets.

## References
* https://siegal.bio.nyu.edu/color-palette/
* https://github.com/d3/d3-scale-chromatic


