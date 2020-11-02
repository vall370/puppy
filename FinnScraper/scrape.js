const puppeteer = require("puppeteer");
const JobsModel = require("./test.model");
const mongoose = require("mongoose");
var uri = "mongodb://localhost:27017/jobhunter";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
let testArray = [{ "Arbeidsgiver": "American Car Club of Norway", "Stillingstittel": "Teknisk rådgiver", "Frist": "11.10.2020", "Ansettelsesform": "Fast" }]
connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    let industry = 'industry=65'
    let i2 = 0;
    const page = await browser.newPage();
    const links = []
    await page.goto("https://www.finn.no/job/fulltime/search.html?page=0");
    var urls = await page.$$eval('article', list => {
        links = list.map(el => el.querySelector('a').href)
        return links;
    });
    let nextPageExists = true
    do {
        i2++
        await page.goto(`https://www.finn.no/job/fulltime/search.html?${industry}&page=${i2}`)
        var urls = await page.$$eval('article', list => {
            links = list.map(el => el.querySelector('a').href)
            return links;
        });
        // console.log(urls)
        for (let i = 0; i < urls.length; i++) {
            let newPage = await browser.newPage();
            await newPage.goto(urls[i]);
            console.log(newPage.url())
            let idfromurl = newPage.url()
            let finnId = idfromurl.match(/[0-9]+/)
            let list1;
            if ((await newPage.$$('dl.definition-list')).length === 0) {
                list1 = null
            } else {

                list1 = await newPage.$eval("dl.definition-list", (elm) => {
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

                    for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];

                    return list;
                });
            }
            let list2;
            if ((await newPage.$$('dl.definition-list.u-mt16')).length === 0) {
                list2 = null
            } else {
                list2 = await newPage.$eval("dl.definition-list.u-mt16", (elm) => {
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

                    for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];

                    return list;
                });
            }
            let list;

            if ((await newPage.$$('dl.definition-list.definition-list--inline')).length === 0) {
                list = null
            } else {
                list = await newPage.$eval("dl.definition-list.definition-list--inline", (elm) => {
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

                    for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];

                    return list;
                });
            }

            let jobdescript = await newPage.$eval('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > div.import-decoration > section', text => text.innerText)
            let jobApplyLink1
            if ((await newPage.$$('a[class="button button--cta u-size1of1"]')).length === 0) {
                jobApplyLink1 = null
            } else {
                jobApplyLink1 = await newPage.$eval('a[class="button button--cta u-size1of1"]', text => text.href)
            }
            // console.log(finnId)
            var object = {
                _id: finnId[0],
                jobLink: newPage.url(),
                jobTitle: list1['Arbeidsgiver'],
                jobApplyLink: jobApplyLink1,
                jobPosition: list1['Stillingstittel'],
                jobLatestDate: list1['Frist'],
                jobFormOfEmployment: list1['Ansettelsesform'],
                jobNetwork: list['Nettverk'],
                jobSector: list['Sektor'],
                jobCity: list['Sted'],
                jobBranch: list['Bransje'],
                jobAlternativePositions: list['Stillingsfunksjon'],
                jobContactInfo: JSON.stringify(list2),
                jobDescription: jobdescript,
            };
            JobsModel.create(object, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            });
            await newPage.close();
        }
        if ((await page.$$('a[class="button button--pill button--has-icon button--icon-right"]')).length === 0) {
            nextPageExists = false
        }
    } while (nextPageExists === true)
    while (nextPageExists === true) {
        for (let i = 1; i < 15; i++) {


        }
    }
    while (nextPageExists === true) {
        for (let i = 0; i < 50; i++) {
            await page.goto(`https://www.finn.no/job/fulltime/search.html?page=${i}`);
            console.log(i)
            for (let i = 0; i < urls.length; i++) {
                let idfromurl = page.url()
                let finnId = idfromurl.match(/[0-9]+/)
                // console.log(finnId[0])
                await page.goto(urls[i]);
                const list1 = await page.$eval("dl.definition-list", (elm) => {
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

                    for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];

                    return list;
                });
                /*                 
                                let list2;
                                if ((await page.$$('dl.definition-list.u-mt16')).length === 0) {
                                    list2 = null
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
                
                                        for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];
                
                                        return list;
                                    });
                                }
                                console.log('how many?', (await page.$$('dl.definition-list.u-mt16')).length)
                                // if ((await page.$$('dl.definition-list.u-mt16')).length === 0) {
                                //     chevronExists = false
                                // }
                
                                const list = await page.$eval("dl.definition-list.definition-list--inline", (elm) => {
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
                
                                    for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];
                
                                    return list;
                                }); */
                let jobdescript = await page.$eval('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > div.import-decoration > section', text => text.innerText)
                let jobApplyLink = await page.$eval('a[class="button button--cta u-size1of1"]', text => text.href)

                // console.log(finnId)
                var object = {
                    _id: finnId[0],
                    jobLink: page.url(),
                    jobTitle: list1['Arbeidsgiver'],
                    jobApplyLink: jobApplyLink,
                    /*                     jobTitle: list1['Arbeidsgiver'],
                                        jobPosition: list1['Stillingstittel'],
                                        jobLatestDate: list1['Frist'],
                                        jobFormOfEmployment: list1['Ansettelsesform'],
                                        jobNetwork: list['Nettverk'],
                                        jobSector: list['Sektor'],
                                        jobCity: list['Sted'],
                                        jobBranch: list['Bransje'],
                                        jobAlternativePositions: list['Stillingsfunksjon'],
                                        jobContactInfo: JSON.stringify(list2),
                                        jobDescription: jobdescript,
                                        jobApplyLink: jobApplyLink,
                                        jobLink: page.url() */

                };
                JobsModel.create(object, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                    }
                });
                if ((await page.$$('a[class="button button--pill button--has-icon button--icon-right"]')).length === 0) {
                    nextPageExists = false
                }
            }
        }
    }
    // console.log(urls[0])
    // Loop through each of those links, open a new page instance and get the relevant data from them
    /*     let pagePromise = (link) => new Promise(async (resolve, reject) => {
            let dataObj = page.url()
            let newPage = await browser.newPage();
    
            await newPage.goto(link);
            console.log(newPage.url())
    
            resolve(dataObj);
            await newPage.close();
        });
    
        for (link in urls) {
            let currentPageData = await pagePromise(urls[link]);
            // scrapedData.push(currentPageData);
            // console.log(currentPageData);
        } */
    /*     while (nextPageExists === true) {
            for (let i = 0; i < 15; i++) {
                await page.goto(`https://www.finn.no/job/fulltime/search.html?page=${i}`, {
                    waitUntil: "domcontentloaded",
                    timeout: 90000,
                });
                var urls = await page.$$eval('article', list => {
                    links = list.map(el => el.querySelector('a').href)
                    return links;
                });
                let pagePromise = (link) => new Promise(async (resolve, reject) => {
                    let newPage = await browser.newPage();
    
                    let idfromurl = link
                    let finnId = idfromurl.match(/[0-9]+/)
                    console.log(finnId[0])
                    // resolve(dataObj);
                    await newPage.close();
                });
    
                for (link in urls) {
    
                    let currentPageData = await pagePromise(urls[link]);
                    console.log(currentPageData)
    
                    // scrapedData.push({ currentPageData });
    
                }
    
    
                if ((await page.$$('a[class="button button--pill button--has-icon button--icon-right"]')).length === 0) {
                    nextPageExists = false
                }
            }
        } */
    /*     const list1 = await page.$eval("dl.definition-list", (elm) => {
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
    
            for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];
    
            return list;
        });
    
        const list2 = await page.$eval("dl.definition-list.u-mt16", (elm) => {
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
    
            for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];
    
            return list;
        });
        const list = await page.$eval("dl.definition-list.definition-list--inline", (elm) => {
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
    
            for (key of Object.keys(list)) if (list[key].length === 1) list[key] = list[key][0];
    
            return list;
        });
        let jobdescript = await page.$eval('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > div.import-decoration > section', text => text.innerText)
        let jobApplyLink = await page.$eval('a[class="button button--cta u-size1of1"]', text => text.href)
        await browser.close();
        let idfromurl = page.url()
        let finnId = idfromurl.match(/[0-9]+/)
        var object = {
            _id: finnId[0],
            jobTitle: list1['Arbeidsgiver'],
            jobPosition: list1['Stillingstittel'],
            jobLatestDate: list1['Frist'],
            jobFormOfEmployment: list1['Ansettelsesform'],
            jobNetwork: list['Nettverk'],
            jobSector: list['Sektor'],
            jobCity: list['Sted'],
            jobBranch: list['Bransje'],
            jobAlternativePositions: list['Stillingsfunksjon'],
            jobContactInfo: JSON.stringify(list2),
            jobDescription: jobdescript,
            jobApplyLink: jobApplyLink,
            jobLink: page.url()
    
        };
        JobsModel.create(object, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
        // JobsModel.insertMany(testArray)
        // console.log(Array.isArray(JSON.stringify(list)));
    
        console.log(list2); */
    // await page.close()
})();
