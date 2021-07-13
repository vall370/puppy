var http = require('http');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
const t =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const shortName = uniqueNamesGenerator({
  dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
  length: 2
}); // big-donkey
//create a server object:
http.createServer(function (req, res) {
  res.write(t); //write a response to the client
  res.end(); //end the response
}).listen(5554); //the server object listens on port 8080