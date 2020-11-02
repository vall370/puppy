var fs = require("fs");

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

const scraperObject = {
    url: 'https://www.finn.no/job/apply?adId=190162535',
    async scraper(browser, category) {
        let page = await browser.newPage();
        let fileToUpload = 'cv.pdf';
        await page.goto(this.url);
        await delay(1000);
        const username = await page.waitForSelector('#username');
        await username.click();
        await page.keyboard.sendCharacter('vall395@gmail.com');
        const password = await page.waitForSelector('#password');
        await password.click();
        await page.keyboard.sendCharacter('Silver1234');
        await page.keyboard.press('Enter');
        await page.waitForSelector('#name');
        await page.$eval('#name', el => el.value = 'Valdemar Johannesson');
        await page.waitForSelector('#phone');
        await page.$eval('#phone', el => el.value = '41382179');
        await page.waitForSelector('#birthYear');
        await page.$eval('#birthYear', el => el.value = '1993');
        await page.waitForSelector('#postcode');
        await page.$eval('#postcode', el => el.value = '3041');
        await page.waitForSelector('#currentTitle');
        await page.$eval('#currentTitle', el => el.value = 'Freelancer');
        await page.waitForSelector('.pageholder > #job-apply-form-root > #job-apply-form #attachmentUpload__label')
        await page.select("select#education", "5")
        const fileEle = await page.$('input[type="file"]');
        await fileEle.uploadFile('cv.pdf');
        var data123 = fs.readFileSync("temp.txt");
        await page.$eval('#applicationLetter', (el, value) => el.value = value, data123.toString());
        const sendApplication = await page.waitForSelector('#job-apply-form > div.u-mt32.u-r-size1of3.u-mha > button');
        await sendApplication.click();
        await browser.close();
    }
}

module.exports = scraperObject;