var fs = require('fs');
var fsExtra = require('fs-extra')
var fuzzer = require('./fuzzing');
var sleep = require('system-sleep');
var child_process = require('child_process');

/* Rohil ask about environment variables */
var REPO = "github.ncsu.edu/sshah14/iTrust2-v2.git";
var REMOTE = ``;
var BRANCH = "fuzzer";
var TOKEN = "{{git_token}}"

/* Remember to create a job called fuzzer , tell Rohil */
// var LOCALPATH = "/Users/siddhantshah1/Desktop/iTrust-v23";
var LOCALPATH= "/home/ubuntu/iTrust"
var JENKINSPATH= "/var/lib/jenkins/workspace/iTrust-Fuzz-Job"

var ITRUST2_V2 = "iTrust2";
var ITRUST = "iTrust";
var GITPATH = ``;
var ITRUST_RELATIVE_PATH = '/iTrust2/src/main/java/edu/ncsu/csc/itrust2';



function main() {

    REMOTE = `https://${TOKEN}@${REPO}`;
    GITPATH = `${LOCALPATH}/`;

    clone(REMOTE, LOCALPATH, BRANCH);

    //pull(GITPATH);



    for (var i = 1; i <= 5; i++) {

        // var maxRetries = 50;


        // var commitID = '';

        // pull(GITPATH);

       {
            fuzzer.main(LOCALPATH + ITRUST_RELATIVE_PATH);
           
                commit(GITPATH, "Test" + i);
                // build , post commit hook
                revertChanges(GITPATH);

           

        }

        sleep(180000);
    
    }

}





function clone(remote, local, branch) {
    fsExtra.ensureDirSync(local);

    // if (fs.existsSync(local + "/" + ITRUST2_V2)) {
    //     fsExtra.removeSync(local + "/" + ITRUST2_V2);
    // }

    // var result = child_process.execSync(`git clone ${remote}`, {
    //     cwd: local
    // }).toString('utf8');


    // child_process.execSync(`git push origin --delete fuzzer`, {
    //     cwd: local + "/" + ITRUST2_V2
    // });

    child_process.execSync(`sudo git checkout -b fuzzer`, {
    });

}

function pull(local) {
    var result = child_process.execSync('sudo git pull', {
        cwd: local
    }).toString('utf8');


    if (result.match(/fatal|error/)) {
        throw new Error("Error pulling changes from remote:\n" + result);
    }

}

function commit(local, message) {

    // console.log("hi")
    var result = child_process.execSync(`sudo git add *java && sudo git commit -m "${message}" `, {
        cwd: local
    }).toString('utf8');





    if (result.match(/fatal|error/)) {
        throw new Error("Error commiting changes:\n" + result);
    }

}


function revertChanges(local) {

    var result = child_process.execSync(`sudo git reset --hard origin/master`, {
        cwd: local
    }).toString('utf-8');


    if (result.match(/fatal|error/)) {
        throw new Error("Error reverting changes:\n" + result);
    }

}



main();
