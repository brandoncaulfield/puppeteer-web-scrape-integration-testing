const fs = require('fs');

const data = require('./address_data_test.json');

function writeToCSVFile(array) {
    const filename = 'output.csv';
    fs.writeFile(filename, extractAsCSV(array), err => {
        if (err) {
            console.log('Error writing to csv file', err);
        } else {
            console.log(`saved as ${filename}`);
        }
    });
}

function extractAsCSV(array) {
    const header = ["Address, Zestimate"];
    const rows = array.map(array =>
        `"${array.Address}", "${array.Zestimate}"`
    );
    return header.concat(rows).join("\n");
}   

writeToCSVFile(data);