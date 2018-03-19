var ncp=require('ncp').ncp;
var fs = require('fs');

var rootDir='/var/lib/jenkins/jobs/iTrust-Fuzz-Job/builds';


function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path).isDirectory();
  });
}

var max='0';
var ans= getDirectories(rootDir);
ans.forEach(function(n){
	if(!isNaN(n))
	{
		if (n>max)
			max=n;
	}
});

var source='/var/lib/jenkins/workspace/iTrust-Fuzz-Job/iTrust2-v2/iTrust/iTrust2/target/surefire-reports'
var destination='/home/ubuntu/reports/'+max;
ncp(source, destination, function (err) {
 if (err) {
   return console.error(err);
 }
});
