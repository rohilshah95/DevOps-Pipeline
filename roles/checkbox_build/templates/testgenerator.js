// Core/NPM Modules
const fs      = require("fs");
const faker = require('faker')

/**
 * Generate test cases based on the global object functionConstraints.
 *
 * @param {String} filepath            Path to write test file.
 * @param {Object} functionConstraints Constraints object as returned by `constraints`.
 */
function generateTestCases(filepath, functionConstraints) {
    let initial = `let subject = require('./mon.js')\nlet sleep = require('system-sleep')\nsleep(5000)\nvar needle = require('needle')\n`
    var content = initial;
    for ( let i in functionConstraints ) {
         content += `try {` +  constructReq(functionConstraints[i])+ `  } catch (e) {} \n`;
    }
    fs.writeFileSync('test.js', content, "utf8");
}

function constructReq(constraint){
    let reqType = constraint.value.type
    let url = constraint.value.url
    let needsParam = constraint.value.needsParams
    let host = "http://localhost:3002"
    let val = needsParam? 1 : ""

    if(reqType == 'get'){
        // get some value here
        return "needle." + reqType + "('" + host+  url + val + "')";
    }
    else if(reqType == 'post'){

        // get the generated mock object here 
        // get the parameter if required.
        var mocked = postMockObject(constraint.value.resource)
        console.log(constraint)
        var objString = mocked?JSON.stringify(mocked):""

        return "needle." + reqType + "('" + host+  url + val + "'," +objString+ ")";
    }
}

function postMockObject(resource){

    if(resource == 'study'){
        return generateStudyMock()
        //generate a mock study object here with fake data
    }
    else if(resource == 'vote'){
        return generateVoteMock()
        //generate a mock vote objcet here with fake data
    }
}

function generateStudyMock(){
    return {
        _id:"",
        name:faker.name.findName,
        description: "this is random text",
        studyKind:"survey",
        researcherName:faker.name.findName,
        contact:faker.internet.email(),
        awards:null,
        awardOptions:[
            "Amazon Gift Card",
            "Github Swag",
            "BrowserStack",
            "Windows Surface RT",
            "iPad Mini",
            "Other",
            "None"
        ],
        status:"open",
        goal:"100",
        invitecode:"RESEARCH",
        markdown : ""
    }
}

function generateVoteMock(){
    return {
            _id:"",
            studyId:"2",
            timestamp:"",
            ip:"192.168.33.1",
            fingerprint:"2019582184",
            answers:[
                {
                    question:1,
                    kind:"multichoice",
                    answer:[
                        "0"
                    ]
                },
                {
                    question:2,
                    kind:"singlechoice",
                    answer:"0"
                },
                {
                question:3,
                    kind:"singlechoicetable",
                    answer:{
                        "3_0":"1",
                        "3_1":"2",
                        "3_2":"3",
                        "3_3":"2"
                    }
                },
                {
                    "question":4,
                    "kind":"multichoicetable",
                    "answer":{
                        "4_0":[
                            "2"
                        ],
                        "4_1":[
                            "2"
                        ],
                        "4_2":[
                            "2"
                        ],
                        "4_3":[
                            "2"
                        ]
                    }
                }
            ],
            email:"",
            contact:"false"
        }
}
// Export
module.exports = generateTestCases;