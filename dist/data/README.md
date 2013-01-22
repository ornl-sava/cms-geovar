# Maps

`us.json` is a modification of the [topojson sample](https://github.com/mbostock/topojson/blob/master/examples/topo/us-10m.json), which has counties removed (only 'states' and 'land'). Then the file was further simplified:

    $ topojson -o us-medium.json -s 0.00000015 us.json
    retained 6818 / 9330 points (73%)
    
    $ topojson -o us-small.json -s 0.0000005 us.json
    retained 4880 / 9330 points (52%)
    
    
# Health Indicator Data

Source Data:  https://www.cms.gov/Research-Statistics-Data-and-Systems/Statistics-Trends-and-Reports/Medicare-Geographic-Variation/index.html

Each sheet in the two excel files, one for state and one for HRR, were exported as CSV files. Then all the states were compiled into one file by adding a new column, **Year**, to each file, removing the unknown and notes at the end of each file, removing empty columns from each file (,,,,,,,,,,,,), removing Puerto Rico (PR) rows, and appending all of the rows in each file to a new file (with an added **Locale** label). National entries for each year were placed in a separate file and removed from the states. The same was done for HRRs. 

[cvsjson](http://csvkit.readthedocs.org/en/latest/scripts/csvjson.html) was used to transform the csv files into json. Empty key/value pairs were removed from the json files.