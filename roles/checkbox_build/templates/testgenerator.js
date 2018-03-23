// Core/NPM Modules
const fs      = require("fs");
const faker = require('faker')
const _ = require('lodash')
const mongo = require('mongodb')

/**
 * Generate test cases based on the global object functionConstraints.
 *
 * @param {String} filepath            Path to write test file.
 * @param {Object} functionConstraints Constraints object as returned by `constraints`.
 */
function generateTestCases(filepath, functionConstraints) {
    let initial = `let mocker = require('./mocker.js')\nlet sleep = require('system-sleep')\nsleep(5000)\nvar needle = require('needle')\n`
    var content = initial;
    for ( let i in functionConstraints ) {
        if(functionConstraints[i].info && ['post','get'].includes(functionConstraints[i].info.type)){
           content+= constructReq(functionConstraints[i])
        }
    }
    fs.writeFileSync('test.js', content, "utf8");
}

function constructReq(constraint){
    let reqType = constraint.info.type
    let url = constraint.info.url
    let needsParam = constraint.info.needsParams
    let host = "http://localhost:3002"
    let val = needsParam? 1 : ""
    var content = "";


    if(reqType == 'get'){
        
       content+= "needle." + reqType + "('" + host+  url + val + "')\n";
    }
    else if(reqType == 'post'){
        var objString = JSON.stringify(constraint.member.req.body)
        console.log(objString)
        content+= "needle." + reqType + "('" + host+  url + val + "'," +objString+ ")\n";
    }

    // if(constraint.tests){
    //     for(let i in constraint.tests){
    //         content += `try {` +  constructReq(constraint.tests[i])+ `  } catch (e) {} \n`;
            
    //     }   
    // }
    console.log(content)
    return content
}
// Export
module.exports = generateTestCases;