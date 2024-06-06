A07
------------

Author: Kyle Walker [kvwalker@arizona.edu](mailto:kvwalker@arizona.edu)  
Date: 3/25/24


## Notes
To run, download and extract zip and open index.html in browser. Tested with Brave Browser (Chromium).


The visualization represents a dataset of penguins including Bill Length, Bill Depth, Flipper Length, and Body Mass. The penguins each fall into one of the following species denoted by their corresponding colors on the plot:
 *    Blue: Adelie
 *    Pink: Chinstrap
 *    Orange: Gentoo



Interact with the visualization in the following ways:
* Click on axis labels to swap the selected axis with the one right of it, or the other way around when selecting the rightmost axis label.
* Drag vertically on any and each axis to create a brush region which can be further translated and scaled freely. All brushes will be applied as filters to focus on the data elements which fall into the data ranges for each axis selected by brush.


Code built on skeleton provided by Joshua Levine: 

a07.js
Skeleton for CSC444 Assignment 07, Fall 2021.
Joshua A. Levine <josh@email.arizona.edu>


## Included files

* a07.js - Main Javascript file using d3.js to generate the interactive visualization seen on index.html. Creates SVG for visualization and handles user input events like label clicks and brush selections.
* d3.js - D3 javascript visualization library used by a07.js to bind data to visuals.
* index.html - Main html page containing visualization to be viewed on browser.
* penguins.js - Dataset of penguins used in visualization as javascript object conversion of CSV file adapted from: https://gist.github.com/slopp/ce3b90b9168f2f921784de84fa445651 
* README.md - This file.

## References
https://d3-graph-gallery.com/graph/parallel_basic.html
https://blocks.roadtolarissa.com/jasondavies/1341281


