const { Cluster } = require("puppeteer-cluster");
const JobsModel = require("./Finn.model");
const mongoose = require("mongoose");
var uri = "mongodb://localhost:27017/jobHunter";
mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
const connection = mongoose.connection;

const fs = require("fs").promises;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 14,
    monitor: true,
    puppeteerOptions: {
      executablePath: "/opt/google/chrome/chrome",
    },
  });
  var test2 = [];

  const extractTitle = async ({ page, data: url }) => {
    await page.goto(url);
    let idfromurl = page.url();
    let finnId = idfromurl.match(/[0-9]+/);
    let list1;
    if ((await page.$$("dl.definition-list")).length === 0) {
      list1 = null;
    } else {
      list1 = await page.$eval("dl.definition-list", (elm) => {
        const children = elm.children;
        let list = {};
        let temp;

        for (child of children) {
          if (child.tagName === "DT") {
            temp = child.innerText;
            list[temp] = [];
          } else {
            list[temp].push(child.innerText);
          }
        }

        for (key of Object.keys(list))
          if (list[key].length === 1) list[key] = list[key][0];

        return list;
      });
    }
    let list2;
    if ((await page.$$("dl.definition-list.u-mt16")).length === 0) {
      list2 = null;
    } else {
      list2 = await page.$eval("dl.definition-list.u-mt16", (elm) => {
        const children = elm.children;
        let list = {};
        let temp;

        for (child of children) {
          if (child.tagName === "DT") {
            temp = child.innerText;
            list[temp] = [];
          } else {
            list[temp].push(child.innerText);
          }
        }

        for (key of Object.keys(list))
          if (list[key].length === 1) list[key] = list[key][0];

        return list;
      });
    }
    let list;

    if (
      (await page.$$("dl.definition-list.definition-list--inline")).length === 0
    ) {
      list = null;
    } else {
      list = await page.$eval(
        "dl.definition-list.definition-list--inline",
        (elm) => {
          const children = elm.children;
          let list = {};
          let temp;

          for (child of children) {
            if (child.tagName === "DT") {
              temp = child.innerText;
              list[temp] = [];
            } else {
              list[temp].push(child.innerText);
            }
          }

          for (key of Object.keys(list))
            if (list[key].length === 1) list[key] = list[key][0];

          return list;
        }
      );
    }
    let mydate;
    let date;
    if (
      (
        await page.$$(
          "body > main > div > div.panel.u-text-left > table > tbody > tr:nth-child(2) > td"
        )
      ).length === 0
    ) {
      mydate = null;
    } else {
      mydate = await page.$eval(
        "body > main > div > div.panel.u-text-left > table > tbody > tr:nth-child(2) > td",
        (text) => text.textContent
      );

      date = new Date(mydate);
      if (isNaN(date)) {
        date = null;
      }
    }
    let jobdescript;
    if (
      (
        await page.$$(
          "body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > div.import-decoration > section"
        )
      ).length === 0
    ) {
      jobdescript = null;
    } else {
      jobdescript = await page.$eval(
        "body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > div.import-decoration > section",
        (text) => text.textContent
      );
    }
    let jobApplyLink1;
    if (
      (await page.$$('a[class="button button--cta u-size1of1"]')).length === 0
    ) {
      jobApplyLink1 = null;
    } else {
      jobApplyLink1 = await page.$eval(
        'a[class="button button--cta u-size1of1"]',
        (text) => text.href
      );
    }
    let isPastDate;
    if (
      (
        await page.$$(
          "body > main > div > div.panel.u-text-left > table > tbody > tr:nth-child(2) > td"
        )
      ).length === 1
    ) {
      isPastDate = false;
    } else {
      isPastDate = true;
    }
    let image;
    let jobAdImage;
    if (
      (
        await page.$$(
          "body > main > div > div.grid > div.grid__unit.u-r-size1of3 > div > section:nth-child(1) > div > a > img"
        )
      ).length === 0
    ) {
      image = null;
    } else {
      image = await page.$$eval(
        "body > main > div > div.grid > div.grid__unit.u-r-size1of3 > div > section:nth-child(1) > div > a > img",
        (imgs) => imgs.map((img) => img.getAttribute("src"))
      );
      jobAdImage = image[0];
    }
    var object = {
      _id: finnId[0],
      jobLink: page.url(),
      jobTitle: list1["Arbeidsgiver"],
      jobApplyLink: jobApplyLink1,
      jobPosition: list1["Stillingstittel"],
      jobLatestDate: list1["Frist"],
      jobFormOfEmployment: list1["Ansettelsesform"],
      jobNetwork: list["Nettverk"],
      jobSector: list["Sektor"],
      jobCity: list["Sted"],
      jobBranch: list["Bransje"],
      jobAlternativePositions: list["Stillingsfunksjon"],
      jobContactInfo: JSON.stringify(list2),
      jobDescription: jobdescript,
      jobDate: date,
      jobPastDate: isPastDate,
      jobEmployerLogo: jobAdImage,
    };
    JobsModel.findOneAndUpdate(
      { _id: object._id },
      object,
      { upsert: true, new: true },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // console.log(result);
        }
      }
    );
  };
  // Extracts document.title of the crawled pages
  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const pageTitle = await page.evaluate(() => document.title);
    // console.log(`Page title of ${url} is ${pageTitle}`);
  });

  // In case of problems, log them
  cluster.on("taskerror", (err, data) => {
    console.log(`  Error crawling ${data}: ${err.message}`);
  });

  // Read the top-1m.csv file from the current directory
  const csvFile = await fs.readFile(__dirname + "/jobAds.csv", "utf8");
  const lines = csvFile.split("\n");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    cluster.queue(line, extractTitle);
  }
  await cluster.idle();
  await cluster.close();
})();
