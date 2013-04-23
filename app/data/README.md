# Maps

`us.json` is a modification of the [topojson sample](https://raw.github.com/mbostock/topojson/master/examples/us-10m.json), which has 'counties' removed (only 'states' and 'land' objects). Then the file was further simplified:

    $ curl -O https://raw.github.com/mbostock/topojson/master/examples/us-10m.json

    # edit file to remove counties

    $ topojson -o us-med.json -s 0.0000005 us-10m.json
    quantization: bounds -178.23207000663965 17.67439566600018 179.7677121177734 71.34194095537273 (spherical)
    quantization: maximum error 1.902km (0.0171°)
    simplification: retained 4965 / 6068 points (82%)
    prune: retained 353 / 359 arcs (98%)
    
    $ topojson -o us-very-small.json -s 0.00006 us-10m.json
    quantization: bounds -178.23207000663965 17.67439566600018 179.7677121177734 71.34194095537273 (spherical)
    quantization: maximum error 1.902km (0.0171°)
    simplification: retained 932 / 6068 points (15%)
    prune: retained 187 / 359 arcs (52%)
    
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