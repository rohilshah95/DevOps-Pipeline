var ncp=require('ncp').ncp;
var fs = require('fs');
var findRemoveSync=require('find-remove');
var rootDir='/var/lib/jenkins/jobs/iTrust-Fuzz-Job/builds';


function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path).isDirectory();
  });
}

var max='0';
var ans= getDirectories(rootDir);
ans.forEach(function(n){
	if(!isNaN(parseInt(n)))
	{
		if (parseInt(n)>max)
			max=parseInt(n);
	}
});


var source='/var/lib/jenkins/workspace/iTrust-Fuzz-Job/iTrust2-v2/iTrust/iTrust2/target/surefire-reports'
var destination='/home/ubuntu/surefire-reports/'+(max);

ncp(source, destination, function (err) {
if (err) {
  return console.error(err);
}
var result = findRemoveSync(destination, {extensions: ['.txt']})
});
