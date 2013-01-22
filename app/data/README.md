# Maps

`us.json` is a modification of the [topojson sample](https://github.com/mbostock/topojson/blob/master/examples/topo/us-10m.json), which has counties removed (only 'states' and 'land'). Then the file was further simplified:

    $ topojson -o us-medium.json -s 0.00000015 us.json
    retained 6818 / 9330 points (73%)
    
    $ topojson -o us-small.json -s 0.0000005 us.json
    retained 4880 / 9330 points (52%)
    
    $ topojson -o us-very-small.json -s 0.00001 us.json
    retained 1188 / 9330 points (13%)
    
# Health Indicator Data

Source Data:  https://www.cms.gov/Research-Statistics-Data-and-Systems/Statistics-Trends-and-Reports/Medicare-Geographic-Variation/index.html

Each sheet in the two excel files, one for state and one for HRR, were exported as CSV files. Then all the states were compiled into one file by adding a new column, **Year**, to each file, removing the unknown and notes at the end of each file, removing empty columns from each file (,,,,,,,,,,,,), and appending all of the rows in each file to a new file (with an added **Locale** label). All spaces at the end of each field were also removed in the header row.

The following rows were removed:

* Puerto Rico (PR)

The following columns were removed:

* 'Average HCC Score Expressed as a Ratio to the National Average'
* All numeric counts for disease indicators (percentages were left), such as 'Count of Medicare beneficiaries who have had a heart attack'
* All numeric counts for utilization indicators (percentages were left), such as 'IP Users (with a covered stay)'
* 'Number of Acute Hospital Readmissions'
* 'Emergency Department Visits'

The same was done for HRRs. 

[cvsjson](http://csvkit.readthedocs.org/en/latest/scripts/csvjson.html) was used to transform the csv files into json. Empty key/value pairs were removed from the json files.