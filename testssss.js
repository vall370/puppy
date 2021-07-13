const fetch = require('node-fetch');
const cheerio = require('cheerio');
// const Nominatim = require('nominatim-geocoder')
const OS = require('os')
process.env.UV_THREADPOOL_SIZE = OS.cpus().length
// const geocoder = new Nominatim({
//   secure: false, // enables ssl
//   host:'nominatim.openstreetmap.org',
//   customUrl: 'http://localhost:7070/', // if you want to host your own nominatim
// },{
//     format: 'json',
// })
// Now you'll have 100 concurrent requests
// const concurrentRequests = 100
// const maxQueueSize = Infinity
// Nominatim.setupQueue(concurrentRequests, maxQueueSize)

// const geocoder = new Nominatim({
//   host: 'nominatim.openstreetmap.org',
//   customUrl: 'http://localhost:7070/', // if you want to host your own nominatim
// }, {
//   format: 'json',
// })
const getReddit = async () => {
  // get html text from reddit
  const response = await fetch('https://www.finn.no/job/fulltime/ad.html?finnkode=192387921');
  // using await to ensure that the promise resolves
  const body = await response.text();


  // parse the html text and extract titles
  const $ = cheerio.load(body, {
    xml: {
      normalizeWhitespace: true,
    },
  });
  const titleList = [];
  const titleList1 = [];
  const titleList2 = [];

  //   let idfromurl = page.url();
  //   let finnId = idfromurl.match(/[0-9]+/);
  let list1;
  let i2123 = $("body").find("body > main > div > div.grid > div.grid__unit.u-r-size1of3 > section:nth-child(3) > div > div").length; // 0
  $('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > section:nth-child(4) dd').each(function (i, elem) {
    const titleNode = $(elem);
    const titleText = titleNode;

    titleList1.push(titleText);
  });
  //   console.log(titleList1)
  $('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > div.import-decoration').each(function (i, elem) {
    const titleNode = $(elem);
    const titleText = titleNode.text();

    titleList2.push(titleText);
  })
  //   console.log(titleList2)

  if (i2123 === 0) {} else {

  }
  list1 = null;
  if (i2123 != 0) {
    console.log('finns')
  } else {
    console.log('finnsinte')
  }
  //   console.log(i2123)
  let i123 = cheerio.html($('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > div.import-decoration'));
  // console.log(i123)

  // using CSS selector  
  $('body > main > div > div.grid > div.grid__unit.u-r-size1of3 > section:nth-child(6) > h2').each((i, title) => {
    const titleNode = $(title);
    const titleText = titleNode.text();

    titleList.push(titleText);
    // geocoder.search({
    //     q: JSON.stringify(titleList)
    //   })
    //   .then((response) => {
    //     console.log(response[0]['lat'], response[0]['lon'])
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
  });

  //   console.log(JSON.stringify(titleList));
  let titleList5 = []
  var text = $('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > section:nth-child(9) > dl dt').contents().map(function () {
    if (this.type === 'text')
      return $(this).text().trim()
  }).get()
  $('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > section:nth-child(9) > dl dd').each(function (i, elem) {
    const titleNode = $(elem);
    const titleText = titleNode.text();

    titleList5.push(titleText);
  });
  //   console.log(text)
  $("body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > section:nth-child(9) > dl dd").children().each(function (index, element) {
    console.log($(this).text());
  });
  let data = $('dt').get().reduce((acc, dt, i) => {
    let key = $(dt).text()
    let value = $(dt).nextUntil('dt').get().map(dl => $(dl).text())
    acc[key] = value
    return acc
  }, {})
  console.log(data)
};

getReddit();