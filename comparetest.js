const mongoose = require("mongoose");
const FinnModel = require("./FinnScraper/Finn.model");
var uri = "mongodb://localhost:27017/jobhunter";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;


Array.prototype.diff = function (arr2) {
    var ret = [];
    this.sort();
    arr2.sort();
    for (var i = 0; i < this.length; i += 1) {
        if (arr2.indexOf(this[i]) > -1) {
            ret.push(this[i]);
        }
    }
    return ret;
};
var str = "How are you doing today?";
var str1 = "are you doing today?";
var res = str.split(" ");
var res1 = str1.split(" ");
var array1 = ["cat", "sum", "fun", "run", "hut"];
var array2 = ["bat", "cat", "dog", "sun", "hut", "gut"];

console.log(res.diff(res1));

connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});
async function fetchFun() {
    const result = await FinnModel.find({
        'jobApplyLink': new RegExp('.*finn.no\/job\/apply.*'),
        'jobCity': new RegExp('.*Drammen.*'),
        'jobAlternativePositions': new RegExp('.*IT utvikling.*')
    }, {jobDescription: 1, jobApplyLink: 1}).exec();

    console.log(result); //etc
}

fetchFun(); // <--