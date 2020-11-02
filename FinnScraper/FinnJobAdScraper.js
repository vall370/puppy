// You need to download the Alexa 1M from http://s3.amazonaws.com/alexa-static/top-1m.csv.zip
// and unzip it into this directory

const { Cluster } = require('puppeteer-cluster');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser')
const fs1 = require('fs');
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs').promises;

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 14,
        monitor: true,
        puppeteerOptions: {
            executablePath: '/opt/google/chrome/chrome'
        }
    });
    var test2 = [];

    const extractTitle = async ({ page, data: url }) => {
        await page.goto(url);
        if ((await page.$$('#__next > main > div.grid > div.grid__unit.u-r-size2of3 > nav > a')).length === 0) {
            var urls = await page.$$eval('article', list => {
                links = list.map(el => el.querySelector('a').href)
                return links;
            });
            for (let i = 0; i < urls.length; i++) {
                test2.push(urls[i]);
            }
        }
        if ((await page.$$('#__next > main > div.grid > div.grid__unit.u-r-size2of3 > nav > a')).length === 1) {
            var urls = await page.$$eval('article', list => {
                links = list.map(el => el.querySelector('a').href)
                return links;
            });
            for (let i = 0; i < urls.length; i++) {

                test2.push(urls[i]);

            }
            const username2 = await page.waitForSelector('#__next > main > div.grid > div.grid__unit.u-r-size2of3 > nav > a');
            await username2.click();
            // await page.waitFor(5000);
            let x = 1;
            let nextPageExists = true
            do {
                x++;
                if (x = 1) {
                    var urls = await page.$$eval('article', list => {
                        links = list.map(el => el.querySelector('a').href)
                        return links;
                    });
                    for (let i = 0; i < urls.length; i++) {

                        test2.push(urls[i]);

                    }
                }
                const username3 = await page.waitForSelector('#__next > main > div.grid > div.grid__unit.u-r-size2of3 > nav > a.button.button--pill.button--has-icon.button--icon-right');
                await username3.click();

                await page.waitFor(1000);
                if ((await page.$$('a[class="button button--pill button--has-icon button--icon-right"]')).length === 0) {
                    nextPageExists = false
                    break
                }
            } while (nextPageExists === true)
            /*                 for (let i = 0; i < urls.length; i++) {
                await page.setDefaultNavigationTimeout(0);
                await page.goto(urls[i], { waitUntil: 'domcontentloaded' });
            } */
        }
        // var urls = await page.$$eval('article', list => {
        //     links = list.map(el => el.querySelector('a').href)
        //     return links;
        // });
        // for (let i = 0; i < urls.length; i++) {
        //     await page.goto(urls[i])



        // }
        // console.log(urls)
    };
    // Extracts document.title of the crawled pages
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const pageTitle = await page.evaluate(() => document.title);
        // console.log(`Page title of ${url} is ${pageTitle}`);
    });

    // In case of problems, log them
    cluster.on('taskerror', (err, data) => {
        console.log(`  Error crawling ${data}: ${err.message}`);
    });

    // Read the top-1m.csv file from the current directory
    const csvFile = await fs.readFile(__dirname + '/out.csv', 'utf8');
    const lines = csvFile.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const splitterIndex = line.indexOf(',');
        if (splitterIndex !== -1) {
            const domain = line.substr(splitterIndex + 1);
            // queue the domain
            cluster.queue(domain, extractTitle);
        }
    }

    await cluster.idle();

    await cluster.close();
    // console.log(test2)

    var test4 = [];

    for (let i = 0; i < test2.length; i++) {
        test4.push({ jobAd: test2[i] })
    }
    const csvWriter = createCsvWriter({
        path: 'jobAds.csv',
        header: [
            { id: 'jobAd', title: 'jobAd' }
        ],
        append: true
    });

    csvWriter
        .writeRecords(test4);



    function runScript() {
        return spawn('python', [
            "-u",
            path.join(__dirname, 'removeDuplicates.py')
        ]);
    }

    const subprocess = runScript()

    // print output of script
    subprocess.stdout.on('data', (data) => {
        console.log(`data:${data}`);
    });
    subprocess.stderr.on('data', (data) => {
        console.log(`error:${data}`);
    });
    subprocess.on('close', () => {
        console.log("Closed");
    });


})();