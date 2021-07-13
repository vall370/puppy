var fs = require('fs');

var dirPath = 'C:\\Users\\valle\\Documents\\aksjer\\';
var result = []; //this is going to contain paths

fs.readdir( dirPath, function (err, filesPath) {
    if (err) throw err;
    result = filesPath.map(function (filePath) {
        return dirPath + filePath;
    });
    console.log(result);
});