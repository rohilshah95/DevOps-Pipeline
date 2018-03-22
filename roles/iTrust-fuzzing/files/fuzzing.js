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
 	lines.forEach(function (line, index) {
 		if(!line.includes("class") && !line.includes("List") && !line.includes("Map") && !line.includes("HashMap")&& !line.includes("ArrayList") && !line.includes("String") && !line.includes(".") && !line.includes("Property") && !line.includes("return") && !line.match(/@/) && !line.match(/\\/) && !line.match(/ontext/) && !line.match(/jdbc/))
 		{
            if((!line.match(/<.+>/) && !line.match(/->/)) && (line.match("while") || line.match("if")))
            {
                if(randomizer.bool(0.3) && line.match(">"))
                    lines[index] = lines[index].replace('>','<');
                if(randomizer.bool(0.3) && line.match("<"))
                    lines[index] = lines[index].replace('<','>');
                if(randomizer.bool(0.3) && line.match("=="))
                    lines[index] = lines[index].replace('==','!=');
                if(randomizer.bool(0.3) && line.match("&&"))
                    lines[index] = lines[index].replace('&&','||');
                if(randomizer.bool(0.3) && line.match("||"))
                    lines[index] = lines[index].replace('||','&&');
                if(randomizer.bool(0.3) && line.match("!="))
                    lines[index] = lines[index].replace('!=','==');
            }

            if(randomizer.bool(0.3) && line.match('"((\\"|[^"])+0(\\"|[^"])*|(\\"|[^"])*0(\\"|[^"])+)"')  )
                lines[index] = lines[index].replace('0','1');

            if(randomizer.bool(0.3) && line.match('\"(\\"|[^\"])*\"') && !line.match("//") && !line.match("@"))
                lines[index] = lines[index].replace(/\"(\\"|[^\"])*\"/g, '"' + randomizer.string(10) + '"')
        }
 	});
 	lines=lines.join("\n");
    fs.writeFileSync(filePath, lines);
}
exports.main = main;
