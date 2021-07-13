const puppeteer = require('puppeteer-extra');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

(async () => {
    let sitePersonel = {};
    let employees = []
    sitePersonel.employees = employees;
    const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
    puppeteer.use(AdblockerPlugin())
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--start-maximized'],
        'ignoreHTTPSErrors': true
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    const client = await page.target().createCDPSession();

    await client.send('Network.setCacheDisabled', {
        cacheDisabled: true,
    });
    await page.setDefaultNavigationTimeout(0);

    // page.waitForNavigation({ waitUntil: 'networkidle0' })
    await page.goto("https://www.finn.no/job/fulltime/search.html", { waitUntil: 'domcontentloaded' });
    const click1 = await page.waitForSelector('#__next > main > div.grid > section > ul:nth-child(12) > li:nth-child(16) > button');
    await click1.click();
    await page.waitFor(1000);
    let checkboxText = await page.$$eval('#__next > main > div.grid > section > ul:nth-child(12) > li > div > label', links => {

        // Checkbox labeltext
        links = links.map(el => el.textContent)
        return links;
    })
    let checkboxID = await page.$$eval('#__next > main > div.grid > section > ul:nth-child(12) > li > div > input[type=checkbox]', links => {
        // Checkbox html id

        links = links.map(el => el.getAttribute("id"))
        return links;
    })
    console.log(checkboxText)

    await browser.close()
    var test2 = [];

    for (let i = 0; i < checkboxID.length; i++) {

        test2.push({ rowNumber: [i], address: `https://www.finn.no/job/fulltime/search.html?${checkboxID[i]}` });

    }

    // console.log(test2)
    const csvWriter = createCsvWriter({
        path: 'out.csv',
        header: [
            { id: 'rowNumber', title: 'Row' },
            { id: 'address', title: 'Address' }
        ]
    });

    csvWriter
        .writeRecords(test2)
    console.log('slut')
})();
