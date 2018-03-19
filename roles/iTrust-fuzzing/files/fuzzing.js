var fs = require('fs');
var Random = require('random-js');
var path = require('path');
var crypto = require('crypto');
var randomizer = new Random(Random.engines.mt19937().autoSeed());

var validFileExtensions = ["java"];

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

    var randomListOfFiles = randomizer.sample(listOfFiles, randomizer.integer((listOfFiles.length/2), listOfFiles.length));

    randomListOfFiles.forEach(function(element) {
        createRandomChangesInAFile(element);
    });
}


function createRandomChangesInAFile(filePath) {
    
    var lines = fs.readFileSync(filePath, 'utf-8').split('\n');

    //console.log("in here");
    // lines.forEach(function(element,index){

    // 	if(!element.includes("class")){

    // var lines = fs.readFileSync(filePath, 'utf-8').split('\n');


    // var data = fs.readFileSync(filePath, 'utf-8').split(' ');

    // data.forEach(function(element, index) {
    //     var match = element.match(/\"[\w|\d]*\"/i);


    //     if (match != undefined) {

    //     	// Change content of "strings" in code

    //         var originalString = match[0].substring(1, match[0].length - 1);
    //         var replacementString = originalString;

    //         if (randomizer.bool(0.20)) {
    //             replacementString = replacementString.split('').reverse().join('');
    //         }


    //         if (randomizer.bool(0.20)) {
    //             replacementString = crypto.randomBytes(10).toString('hex');;
    //         }

    //         if (randomizer.bool(0.10)) {
    //             replacementString = '';
    //         }


    //         data[index] = data[index].replace(match, "\""+replacementString+"\"");


    //         if (randomizer.bool(0.01)) {
    //             data[index] = data[index].replace(match, null);
    //         }
    //     }

    //     // Swap "<" with ">"

    //     if (element.includes(">")) {

    //         if (randomizer.bool(0.20)) {
    //             data[index] = element.replace(/>/g, "<");
    //         }
    //     }

    //     if (element.includes("<")) {

    //         if (randomizer.bool(0.20)) {
    //             data[index] = element.replace(/</g, ">");
    //         }
    //     }

    //     // Swap "==" with "!="

    //     if (element.includes("!=")) {
    //         if (randomizer.bool(0.10)) {
    //             data[index] = element.replace(/!=/g, "==");
    //         }
    //     }

    //     if (element.includes("==")) {
    //         if (randomizer.bool(0.20)) {
    //             data[index] = element.replace(/==/g, "!=");
    //         }
    //     }

    //     // Swap "1" with "0"

    //     if (element.includes("1")) {
    //         if (randomizer.bool(0.20)) {
    //             data[index] = element.replace(/1/g, "0");
    //         }
    //     }

    //     if (element.includes("0")) {
    //         if (randomizer.bool(0.15)) {
    //             data[index] = element.replace(/1/g, "1");
    //         }
    //     }

    // });
















 	lines.forEach(function (line, index) {
 		if(!line.includes("class") && !line.includes("List") && !line.includes("Map") && !line.includes("HashMap")&& !line.includes("ArrayList") && !line.includes("String") && !line.includes(".") && !line.includes("Property") && !line.includes("return") && !line.match(/@/) && !line.match(/\\/) && !line.match(/ontext/) && !line.match(/jdbc/))
 		{

            if((!line.match(/<.+>/) && !line.match(/->/)) && (line.match("while") || line.match("if")))
            {
                if(randomizer.bool(0.2) && line.match(">"))
                    lines[index] = lines[index].replace('>','<');
                if(randomizer.bool(0.2) && line.match("<"))
                    lines[index] = lines[index].replace('<','>');
                if(randomizer.bool(0.2) && line.match("=="))
                    lines[index] = lines[index].replace('==','!=');
                if(randomizer.bool(0.2) && line.match("!="))
                    lines[index] = lines[index].replace('!=','==');
            }

            if(randomizer.bool(0.2) && line.match('"((\\"|[^"])+0(\\"|[^"])*|(\\"|[^"])*0(\\"|[^"])+)"')  )

                lines[index] = lines[index].replace('0','1');

            if(randomizer.bool(0.2) && line.match('\"(\\"|[^\"])*\"') && !line.match("//") 
                    && !line.match("@"))
                lines[index] = lines[index].replace(/\"(\\"|[^\"])*\"/g, '"' + randomizer.string(10) + '"')
				
            
            // fs.appendFileSync(filePath, line + '\n');
        }
 		});
 		lines=lines.join("\n");













    // data = data.join(" ");
// }



	// });
	// lines = lines.join(" ");

    fs.writeFileSync(filePath, lines);
    //console.log("file done");

}



exports.main = main;
