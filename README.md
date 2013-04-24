
# Data

See README.md in `app/data` for information about the source data and the maps.

# Build

To run locally, run `grunt server` and open a browser to http://localhost:9000

To build, run `grunt build`. To merge `dist` build into `gh-pages` branch, commit changes to master and from project root:
    git checkout gh-pages
    git merge -s subtree master
    git checkout master
    git push --all