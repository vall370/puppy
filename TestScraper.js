const puppeteer = require("puppeteer");
const fs = require("fs").promises;
//arbeidsplassen.nav.no/stillinger/api/search?size=10000
https: (async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // const csvFile = await fs.readFile(__dirname + '/FinnScraper/jobAds.csv', 'utf8');

  // const lines = csvFile.split('\n');

  // for (let i = 1; i < lines.length; i++) {
  //     const line = lines[i];
  // document.querySelector("#reactApp > div.Stilling > div.container > div:nth-child(2) > div.col.col-xs-12.col-md-7.col-lg-8 > div > h1")
  await page.goto(
    "https://arbeidsplassen.nav.no/stillinger/stilling/fbd40480-3fbb-4656-a9a4-00664cde830f"
  );
  await page.waitFor(1000);
  await page.waitForSelector(
    "#reactApp > div.Stilling > div.container > div:nth-child(2) > div.col.col-xs-12.col-md-7.col-lg-8 > div > div.Stilling__employer-and-location"
  );

  const pageTitle = await page.title();
  const read = (
    await page.$$(
      "#reactApp > div.Stilling > div.container > div:nth-child(2) > div.col.col-xs-12.col-md-7.col-lg-8 > div > div.Stilling__employer-and-location"
    )
  ).length;

  const textContent = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "#reactApp > div.Stilling > div.container > div:nth-child(2) > div.col.col-xs-12.col-md-5.col-lg-4 > div.HowToApply.detail-section > div > div > a"
      ),
      (e) => e.href
    )
  );
  // var address = textContent.toString().split('mailto:')[1];

  // const innerTextOfButton = await page.$eval('h1', el => el.outerHTML)
  await page.goto(textContent.toString());
  const pageTitle1 = await page.title();
  console.log(pageTitle1);
  // console.log(await page.$$eval('#reactApp > div.Stilling > div.container > div:nth-child(2) > div.col.col-xs-12.col-md-7.col-lg-8 > div > section > p', a => a.innerHTML))
  // #reactApp > div.Stilling > div.container > div:nth-child(2) > div.col.col-xs-12.col-md-7.col-lg-8 > div > h1
  /*       let image
        let jobAdImage
        if ((await page.$$('body > main > div > div.grid > div.grid__unit.u-r-size1of3 > div > section:nth-child(1) > div > a > img')).length === 0) {
            image = null
        } else {
            image = await page.$$eval('body > main > div > div.grid > div.grid__unit.u-r-size1of3 > div > section:nth-child(1) > div > a > img', imgs => imgs.map(img => img.getAttribute('src')));
            jobAdImage = image[0]
        }
        let mydate1
        let date1 
        if ((await page.$$('body > main > div > div.panel.u-text-left > table > tbody > tr:nth-child(2) > td')).length === 0) {
            mydate1 = null
        } else {
            mydate1 = await page.$eval('body > main > div > div.panel.u-text-left > table > tbody > tr:nth-child(2) > td', text => text.textContent)
            date1 =  Date.parse(mydate1);
            console.log(date1)
        }
        let mydate
        if ((await page.$$('body > main > div > div.panel.u-text-left > table > tbody > tr:nth-child(2) > td')).length === 0) {
            mydate = null
        } else {
            mydate = await page.$eval('body > main > div > div.panel.u-text-left > table > tbody > tr:nth-child(2) > td', text => text.textContent)
            let date = new Date(mydate);
            console.log(date)
        }
        let isPastDate
        if ((await page.$$('body > main > div > div.panel.u-text-left > table > tbody > tr:nth-child(2) > td')).length === 1) {
            isPastDate = false
        } else {
            isPastDate = true
        }
        console.log(isPastDate) */
  // let list4;

  // if ((await page.$$('dl.definition-list.definition-list--inline')).length === 0) {
  //     list4 = null
  // } else {
  //     list4 = await page.$eval("body > main > div > div.panel.u-text-left > table > tbody > tr:nth-child(2)", (elm) => {
  //         const children = elm.children;
  //         let list = {};
  //         let temp;

  //         for (child of children) {
  //             if (child.tagName === "DT") {
  //                 temp = child.innerText;
  //                 list[temp] = [];
  //             } else {
  //                 list[temp].push(child.innerText);
  //             }
  //         }

  //         for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];

  //         return list;
  //     });
  // }
  // console.log(list4)
  // }

  //   await page.screenshot({path: 'example.png'});

  //   await browser.close();
})();
