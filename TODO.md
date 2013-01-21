## Code

* split code up into data, ui, events
* remove references to 'states' and replace with 'locales'
* use require.js 

## Data

* remove duplicate numeric rows from data
* create indicator lookup table with category and full name (from excel file)
* automatically determine which column is 'year'
* automatically determine which column is 'locale'
* calculate percentages from numeric columns
* calculate top/botom 5 for each indicator/year
* calculate correlations

## Previews

* anchor tags for all indicators
* ui to select or jump to categories and indicators
* option to show only correlated indicators

## Detailed View

* initial detailed view
* maps in detailed view
* line graph in detailed view below maps (line up years)
* identify outliers for the data to annotate in detailed view
* natural language for detailed view
* display list of correlated indicators

## General UI

* help overlay while loading
* use full screen loading dialog, update with description of progress
* affix (bootstrap affix.js) collapsed sidebar
* 'about' overlap for sidebar