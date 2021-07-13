require('dayjs/locale/nb')

const cluster = require("cluster");
var cheerio = require('cheerio'); // Basically jQuery for node.js
// const Nominatim = require('nominatim-geocoder')
const fetch = require('node-fetch');
const customParseFormat = require('dayjs/plugin/customParseFormat')

const fs = require("fs").promises;
var rp = require('request-promise');
const { link } = require("fs");
const dayjs = require('dayjs')
const forks = 32;
// const concurrentRequests = 100
// const maxQueueSize = Infinity
// Nominatim.setupQueue(concurrentRequests, maxQueueSize)
dayjs.extend(customParseFormat)

// const geocoder = new Nominatim({
// 	host: 'nominatim.openstreetmap.org',
// 	customUrl: 'http://localhost:7070/', // if you want to host your own nominatim
// }, {
// 	format: 'json',
// })
const main = async () => {
	const hugeData = [];

	// Read the top-1m.csv file from the current directory
	const csvFile = await fs.readFile(__dirname + "/jobAds.csv", "utf8");
	const lines = csvFile.split("\n");
	for (let i = 1; i < lines.length; i++) {

		const line = lines[i];
		hugeData.push(line);
	}
	const files = hugeData;
	const clusterFiles = files.filter(
		(_, index) => index % forks === cluster.worker.id - 1
	);

	for (const file of clusterFiles) {
		let finn = []

		var options = {
			uri: file,
			transform: function (body) {
				return cheerio.load(body);
			}
		};
		const response = await fetch(file);

		const body = await response.text();


		// parse the html text and extract titles
		const $ = cheerio.load(body, {
			xml: {
				normalizeWhitespace: true,
			},
		});
		let data = $('dt').get().reduce((acc, dt, i) => {
			let key = $(dt).text()
			let value = $(dt).nextUntil('dt').get().map(dl => $(dl).text())
			acc[key] = value
			return acc
		}, {})
		let employer = elementExists(data['Arbeidsgiver'])
		let worktitle = elementExists(data['Stillingstittel'])
		let latestdate
		if (typeof data['Frist'] === 'undefined'){
			latestdate = 'undefined'
			console.log('undefined');
		} else{
			 latestdate = JSON.stringify(data['Frist']).replace(/]|[[]/g, '').replace(/['"]+/g, '').split('.').join('-');

		}
		// console.log(typeof data['Frist']);
		let typeofemployment = elementExists(data['Ansettelsesform'])
		let city = elementExists(data['Sted'])
		 let number_of_vacancies = elementExists(data['Antall stillinger'])
		// console.log(file)
		// console.log(employer, worktitle, latestdate, typeofemployment, city)
		// let res = await fetch(`http://localhost:7070/search.php?q=${city}&limit=1&format=json`)
		// const data1 = await res.json();//assuming data is json
		// const coordinates = data1[0]
		const text = []
		$('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > div.import-decoration').each(function (i, elem) {
			const titleNode = $(elem);
			const titleText = titleNode.text();

			text.push(titleText);
		})
		// console.log(file,'\n',JSON.stringify(text).includes('førerkort'))
		var src = $('body > main > div > div.grid > div.grid__unit.u-r-size1of3 > section:nth-child(1) > div > a > img').attr("src");
		let headline = $('body > main > div > div.grid > div.grid__unit.u-r-size2of3 > div > section:nth-child(3) > h1').text();
		let data2 = $('th').get().reduce((acc, dt, i) => {
			let key = $(dt).text()
			let value = $(dt).nextUntil('th').get().map(dl => $(dl).text())
			acc[key] = value
			return acc
		}, {})
		if ($('body > main > div > div.grid > div.grid__unit.u-r-size1of3 > section:nth-child(3) > div > div').length){
			console.log('exists');
		}
		// JSON.stringify(data2['Sist endret']).replace(/]|[[]/g, '').replace(/['"]+/g, '') === 'Snarest' ? console.log('sant') : 
		// console.log(dayjs(JSON.stringify(data2['Sist endret']).replace(/]|[[]/g, '').replace(/['"]+/g, '')).format())
		function arraymove(arr, fromIndex, toIndex) {
			var element = arr[fromIndex];
			arr.splice(fromIndex, 1);
			// console.log("::" + arr);
			arr.splice(toIndex, 0, element);
		}
		var swapArrayElements = function(arr, indexA, indexB) {
			var temp = arr[indexA];
			arr[indexA] = arr[indexB];
			arr[indexB] = temp;
		  };
		const getLatestdate = (date) => {
			let newDate = date.replace(/]|[[]/g, '').replace(/['"]+/g, '').replace(/\./g, '')
			newDate = newDate.split(' ')
			if ((newDate[0]+'').length == 1) {
				newDate[0] = "0" + newDate[0];
		   }
		   swapArrayElements(newDate, 2, 0);
			let month
			switch (newDate[1]) {
				case 'jan':
					month = 0
					break;
				case 'feb':
					month = 1
					break;
				case 'mar':
					month = 2
					break;
				case 'apr':
					month = 3
					break;
				case 'mai':
					month = 4
					break;
				case 'jun':
					month = 5
					break;
				case 'jul':
					month = 6
					break;
				case 'aug':
					month = 7
					break;
				case 'sep':
					month = 8
					break;
				case 'okt':
					month = 9
					break;
				case 'nov':
					month = 10
					break;
				case 'des':
					month = 11
					break;
			}
			newDate.push((month + 1).toString())
			newDate.splice(1, 1)
			Array.prototype.move = function (from, to) {
				this.splice(to, 0, this.splice(from, 1)[0]);
				return this;
			};
			newDate = JSON.stringify(newDate.move(3, 1).join('-')).replace()
			var t = 0;
			newDate = newDate.replace(/[-]/g, function (match) {
				t++;
				return (t === 3) ? " " : match;
			});
			newDate = newDate.toString().replace(/['"]+/g, '')
			return newDate
		} // body > main > div > div.grid > div.grid__unit.u-r-size1of3 > section:nth-child(3) > div > div
		// let latestdate1 = dayjs(JSON.stringify(data2['Sist endret']).replace(/]|[[]/g, '').replace(/['"]+/g, '').replace(/\./g, ''), { locale: 'nb' })
		// console.log(dayjs(getLatestdate(JSON.stringify(data2['Sist endret']))).toISOString());
		// console.log(dayjs(JSON.stringify(data2['Sist endret']).replace(/]|[[]/g, '').replace(/['"]+/g, '')).format())
		let object = []
		let link = file.match(/[0-9]+/)
		if (number_of_vacancies === null){
			number_of_vacancies = 1
			number_of_vacancies.toString()
		}
		object.push({
			'id': link[0],
			'external_id': link[0],
			'webpage_url': files,
			'logo_url': src,
			headline,
			'application_deadline': typeof data2['Sist endret'] != 'undefined' ? dayjs(getLatestdate(JSON.stringify(data2['Sist endret']))).toISOString() : null,
			number_of_vacancies,
			employer,
			worktitle,
			latestdate,
			typeofemployment,
			city,
			// coordinates
		})
 console.log(link[0]);
	}
};
const elementExists = (element) => {
	if(typeof element === 'undefined') {
		return null;
	}
	else {
		return JSON.stringify(element).replace(/]|[[]/g, '').replace(/['"]+/g, '');
	}
}
if (cluster.isMaster) {
	// console.log(`[${process.pid}] I am master`);

	for (let i = 0; i < forks; i++) {
		cluster.fork();
	}
} else {
	// console.log(`[${process.pid}] I am worker ${cluster.worker.id}`);
	main()
		.then(() => process.exit(0))
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
}
