var fs = require('fs'),
xml2js = require('xml2js'),
child  = require('child_process'),
Bluebird = require('bluebird');
var sleep = require('system-sleep')
const parseString = require('xml2js-parser').parseString;
var parser = new xml2js.Parser();
const path = require('path');
var validFileExtensions = ["xml"];
var directoryPath = "/home/ubuntu/surefire-reports/"
var map = new Map();
var testResults = []


var readDirectory = (directory) =>
fs.readdirSync(directory).reduce(function(files, file) {
    if (fs.statSync(path.join(directory, file)).isDirectory()) {
        var readListOfFiles = readDirectory(path.join(directory, file));
        if (readListOfFiles != undefined) {
            return files.concat(readListOfFiles);
        } else {
            return files;
        }
    } else {
        if (validFileExtensions.indexOf(file.substring(file.lastIndexOf(".") + 1)) > -1) {
            return files.concat(path.join(directory, file));
        } else {
            return files;
        }
    }
}, []);

function main(directoryPath) {
    var dirPath = directoryPath;
    var listOfFiles = readDirectory(dirPath);
    listOfFiles.forEach(function(element) {
    	readFile(element);
    });
    sleep(120000);
    for(key in map){
    	map[key].time /= 100
    }
    var xyz=Object.values(map);
    xyz.sort(function(a, b){
    	if(a.failed==b.failed)
    		return (b.time-a.time)
    	else
    		return (b.failed-a.failed)
    });
	fs.appendFile('/home/ubuntu/result.md', '|Test name|Time|No of times Failed|\n', function(err){
			if (err)
				console.log(err);
		})
	fs.appendFile('/home/ubuntu/result.md', '|---|---|---|\n', function(err){
			if (err)
				console.log(err);
		})

	xyz.forEach(function(v) {
		var temp=JSON.parse(JSON.stringify(v))
		fs.appendFile('/home/ubuntu/result.md', "|"+temp.name+"\t\t\t\t\t|"+temp.time+"\t\t\t\t\t|"+temp.failed + '\n', function(err){
			if (err)
				console.log(err);
		})
	});	
}

function readFile(testReport){
	var data = fs.readFileSync(testReport, 'utf-8');
	parseString(data, (err, result) => {
  		for( var i = 0; i < result.testsuite.testcase.length; i++ ){
			if(!map[result.testsuite.testcase[i]['$'].name]){
  				var testResultObject = {name:null, time:null, failed:0};
	 			testResultObject.name = result.testsuite.testcase[i]['$'].name
	 			testResultObject.time = result.testsuite.testcase[i]['$'].time
	 			if(result.testsuite.testcase[i].hasOwnProperty('failure'))
	 			testResultObject.failed = 1;
	 			map[result.testsuite.testcase[i]['$'].name] = testResultObject;
 			}
 			else{
 				var obj = map[result.testsuite.testcase[i]['$'].name];
 				obj.time = parseFloat(obj.time) + parseFloat(result.testsuite.testcase[i]['$'].time)
 				if(result.testsuite.testcase[i].hasOwnProperty('failure'))
	 			obj.failed += 1;
 			}
  		}
	});		
}

main(directoryPath)