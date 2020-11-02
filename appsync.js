const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const httpsProxyAgent = require('https-proxy-agent');

(async () => {

    let ip_addresses = [];
    let port_numbers = [];
    let url = `https://sslproxies.org/`;

    let data;
    function status() {
        const url = "https://sslproxies.org/";
        return axios.get(url).then(response => {
            let $ = cheerio.load(response.data);
            $("td:nth-child(1)").each(function (index, value) {
                ip_addresses[index] = $(this).text();
            });

            $("td:nth-child(2)").each(function (index, value) {
                port_numbers[index] = $(this).text();
            });
            let wholeAddress = []
            let ipaddress = []
            let port = []
            for (let i = 0; i < ip_addresses.length; i++) {
                ipaddress.push(ip_addresses[i])
                port.push(port_numbers[i])
                wholeAddress.push(ip_addresses[i] + ':' + port_numbers[i])
            }
            return { wholeAddress, ipaddress, port }
        }).catch(error => {
            console.log(error);
            return Promise.reject(error);
        });
    }
    data = await status();
    let ipaddress = data.ipaddress;
    let port = data.port;
    let wholeAddress = data.wholeAddress;
    // console.log(port)
    function httpRequest() {
        const url = "https://jsonplaceholder.typicode.com/todos/1";
        return axios.get(url, {
            proxy: {
                host: `${ipaddress[7]}`,
                port: `${port[7]}`
            }
        }).then(response => {
            console.log(response.data)
        }).catch(error => {
            console.log(error);
            return Promise.reject(error);
        });
    }
    //  function httpRequest(){
    //     try {
    //         console.log(wholeAddress)
    //       const URL = "https://jsonplaceholder.typicode.com/todos/1"
    //       const response = await axios.get(URL, {
    //         proxy: {
    //             host: 'proxy-url',
    //             port: 80
    //         }});
    //       console.log(response);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
    data2 = await httpRequest();

    // data.forEach(element => {
    //     completeAddress.push(element)
    // });
    // console.log(completeAddress)
    var agent = new httpsProxyAgent('http://username:pass@myproxy:port');
    // console.log(data1)

    // function getLeagues() {
    //     return axios.get('https://sslproxies.org/')
    //         .then(response => {
    //             let $ = cheerio.load(response.data);
    //             $("td:nth-child(1)").each(function (index, value) {
    //                 ip_addresses[index] = $(this).text();
    //             });

    //             $("td:nth-child(2)").each(function (index, value) {
    //                 port_numbers[index] = $(this).text();
    //             });
    //             let wholeAddress = []
    //             for (let i = 0; i < ip_addresses.length; i++) {
    //                 wholeAddress.push(ip_addresses[i] + ':' + port_numbers[i])
    //             }
    //             return wholeAddress
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             return Promise.reject(error);
    //         });
    // }

    // axios.get(url)
    //     .then((response) => {
    //         let $ = cheerio.load(response.data);
    //         $("td:nth-child(1)").each(function (index, value) {
    //             ip_addresses[index] = $(this).text();
    //         });

    //         $("td:nth-child(2)").each(function (index, value) {
    //             port_numbers[index] = $(this).text();
    //         });
    //         console.log(ip_addresses)

    //     }).catch(function (e) {
    //         console.log(e);
    //     });

    // function proxyGenerator() {
    //     let ip_addresses = [];
    //     let port_numbers = [];
    //     let proxy;

    //     let i = request("https://sslproxies.org/", function (error, response, html) {
    //         if (!error && response.statusCode == 200) {
    //             const $ = cheerio.load(html);

    //             $("td:nth-child(1)").each(function (index, value) {
    //                 ip_addresses[index] = $(this).text();
    //             });

    //             $("td:nth-child(2)").each(function (index, value) {
    //                 port_numbers[index] = $(this).text();
    //             });
    //         } else {
    //             console.log("Error loading proxy, please try again");
    //         }
    //         let wholeAddress = []
    //         for (let i = 0; i < ip_addresses.length; i++){
    //             wholeAddress.push(ip_addresses[i]+':'+port_numbers[i])
    //         }

    //         return wholeAddress

    //     })
    //     console.log(i.response)
    // }
    // console.log(proxyGenerator())
    // const options = {
    //     url:
    //         "https://www.forextradingbig.com/10-facts-you-must-know-on-online-forex-trading/",
    //     method: "GET",
    //     proxy: proxyGenerator()
    // };

    // request(options, function (error, response, html) {
    //     if (!error && response.statusCode == 200) {
    //         const $ = cheerio.load(html);
    //         let article_headings = $("h2").text();
    //         console.log(options);
    //     } else {
    //         console.log("Error scraping site, please try again");
    //     }
    // });
})();
