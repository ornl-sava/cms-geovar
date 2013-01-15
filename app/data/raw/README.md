Source Data:  https://www.cms.gov/Research-Statistics-Data-and-Systems/Statistics-Trends-and-Reports/Medicare-Geographic-Variation/index.html

Each sheet in the two excel files, one for state and one for HRR, were exported as CSV files. Then all the states were compiled into one file by adding a new column, **Year**, to each file, removing the unknown and notes at the end of each file, and appending all of the rows in each file to a new file (with an added **Locale** label). National entries for each year were placed in a separate file and removed from the states. The same was done for HRRs. 

[cvsjson](http://csvkit.readthedocs.org/en/latest/scripts/csvjson.html) was used to transform the csv files into json. Empty key/value pairs were removed from the json files.