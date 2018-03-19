var fs = require('fs');
var fsExtra = require('fs-extra')
var fuzzer = require('./fuzzing');
var sleep = require('system-sleep');
var child_process = require('child_process');

var REPO = "github.ncsu.edu/sshah14/iTrust2-v2.git";
var REMOTE = ``;
var BRANCH = "fuzzer";
var TOKEN = "{{git_token}}"
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
    for (var i = 1; i <= 5; i++) 
    {
        {
            fuzzer.main(LOCALPATH + ITRUST_RELATIVE_PATH);   
            commit(GITPATH, "Test" + i);
            // build , post commit hook
            revertChanges(GITPATH);
        }
        sleep(120000);
    }
}

function clone(remote, local, branch) {
    fsExtra.ensureDirSync(local);
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
