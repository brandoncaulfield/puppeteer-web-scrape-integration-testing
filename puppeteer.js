const puppeteer = require('puppeteer');

console.log('This is only a test');

const array = require('./address_data.json');

console.log(array);

// Need to wrap everything in an async function so we can  use await 
// further down when calling the export to .csv stuff. No idea if 
// this is correct or not :( 
const asyncWrapper = async () => {


    ///////////////////
    // MAIN FUNCTION //
    ///////////////////
    const scrape = async (array) => {
        
        // This is out here so we can still close hte browser in the catch section
        let browser = null
        
        try {

            // const browser = await puppeteer.launch({ headless: false, slowMo: 5 });
            browser = await puppeteer.launch({ headless: false, slowMo: 5 });

            const page = await browser.newPage();

            // Zillow.com Home Page Search
            await page.goto('https://www.zillow.com/');

            // Type query in search bar
            // await page.type('[id=search-box-input]', '223 Baker St, Winchester, VA 22601');
            await page.type('[id=search-box-input]', array.Address);

            // Exectue search
            await page.click('#search-icon');

            await page.waitFor(5000);

            // Execute code in the DOM
            const data = await page.evaluate(() => {

                // const images = document.querySelectorAll('img');
                // const urls = Array.from(images).map(v => v.src);
                // return urls

                const zestimate = document.querySelector('.zestimate-value').innerHTML;

                return zestimate;

            });

            await browser.close();

            // addressArray.price = zestimate
            array.Zestimate = data

            // return data;
            return array;

        } catch (error) {
            console.log('Shit an error has occured while scraping :/')
            await browser.close();
        }

    }

    console.log('And here are the results')
    const scrapeLoopFunction = async (array) => {

        let finalArray = []

        for (let i = 0; i < array.length; i++) {

            // CALL MAIN FUNCTION //
            const scrapeData = await scrape(array[i]);

            finalArray.push(scrapeData);

        };

        return finalArray;

    }

    const data = await scrapeLoopFunction(array)
        .then(console.log);


    /////////////////////////
    // Export To .CSV Part //
    /////////////////////////
    const fs = require('fs');

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
            // The double quotes help contain values under their columns in excel 
            `"${array.Address}", "${array.Zestimate}"`
        );
        return header.concat(rows).join("\n");
    }

    writeToCSVFile(data)

};

////////////////////////////////
// Call the main async Wrapper//
////////////////////////////////
asyncWrapper();



