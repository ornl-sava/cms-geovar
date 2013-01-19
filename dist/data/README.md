# Maps

`us.json` is a modification of the [topojson sample](https://github.com/mbostock/topojson/blob/master/examples/topo/us-10m.json), which has counties removed (only 'states' and 'land'). Then the file was further simplified:

    $ topojson -o us-medium.json -s 0.00000015 us.json
    retained 6818 / 9330 points (73%)
    
    $ topojson -o us-small.json -s 0.0000005 us.json
    retained 4880 / 9330 points (52%)
    
    
# Health Indicator Data

