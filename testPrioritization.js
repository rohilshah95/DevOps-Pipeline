var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'),
    Bluebird = require('bluebird');
var xmlparser = require('junit-xml-parser').parser;
var parser = new xml2js.Parser();
var obj = fs.readFileSync('./reports/0/junitResult.xml','utf8')

/* Add file path here */
var testReport =  '';
var initial = true;
var n=1;
var testResult = [];

var validFileExtensions = ["xml"];

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


/* Some discussioin had happened on this on RAhuls board */
function main(directoryPath) {

    var dirPath = directoryPath;

    var listOfFiles = readDirectory(dirPath);


    listOfFiles.forEach(function(element) {
       // call testing function
    });
}


fs.readFile(__dirname + testReport, function(err, data) {
    parser.parseString(data, function (err, result) {
        var all_tests = [];
        var status;
        for( var i = 0; i < result.testsuite['$'].tests; i++ )
        {
            var testcase = result.testsuite.testcase[i];
            all_tests.push(testcase);
        }


        //all_tests.sort(compareTestCases);

        for (var i = 0; i < all_tests.length; i++) {
            
            if(initial==true){

                testResult.push({
                    testName: all_tests[i]['$'].name,
                    testTime: all_tests[i]['$'].time,
                    testStatus: all_tests[i].hasOwnProperty('failure') ? -1 : 1

                });
            }
            else {
                //console.log(testResult[i])
                var time = (testResult[i].testTime + all_tests[i]['$'].time);
                var status = (testResult[i].testStatus + all_tests[i].hasOwnProperty('failure') ? -1 : 1)

                testResult.push({
                    testName: all_tests[i]['$'].name,
                    testTime: time,
                    testStatus: status

                });
            }

        }

                console.log(testResult);
        xmlparser.parse(obj).then(function (result) {
        console.log(result)
    })

    });
});

function main(iteration,testResult){
    if(iteration==1) initial = true;
    else initial = false;
}


function compareTestCases(a, b){
    if (a.hasOwnProperty('failure')){
        if (b.hasOwnProperty('failure')) {
            if (a['$'].time < b['$'].time) {
                return -1;
            }
            else if (a['$'].time > b['$'].time) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            return 1;
        }
    }
    else {
        if (b.hasOwnProperty('failure')) {
            return -1;
        }
        else {
            if (a['$'].time < b['$'].time) {
                return -1;
            }
            else if (a['$'].time > b['$'].time) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }

};

exports.testResult = testResult;
