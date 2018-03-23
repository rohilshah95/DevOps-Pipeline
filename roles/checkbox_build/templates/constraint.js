// Core/NPM Modules
const esprima = require("esprima");
const faker = require("faker");
const fs = require('fs');
const Random = require('random-js');
const _ = require('lodash');
const randexp = require('randexp');
const path = require('path')
// Set options
faker.locale = "en";
const options = {
    tokens: true,
    tolerant: true,
    loc: false,
    range: true
};


var visited = []
// Create random generator engine
const engine = Random.engines.mt19937().autoSeed();
/**
 * Constraint class. Represents constraints on function call parameters.
 *
 * @property {String}                                                          ident      Identity of the parameter mapped to the constraint.
 * @property {String}                                                          expression Full expression string for a constraint.
 * @property {String}                                                          operator   Operator used in constraint.
 * @property {String|Number}                                                   value      Main constraint value.
 * @property {String|Number}                                                   altvalue   Constraint alternative value.
 * @property {String}                                                          funcName   Name of the function being constrained.
 * @property { fileWithContent'|'fileExists'|'integer'|'string'|'phoneNumber'} kind       Type of the constraint.
 */

class Constraint {
    constructor(properties) {
        this.ident = properties.ident;
        this.expression = properties.expression;
        this.operator = properties.operator;
        this.value = properties.value;
        this.altvalue = properties.altvalue;
        this.funcName = properties.funcName;
        this.kind = properties.kind;
    }
}

/**
 * Generate function parameter constraints for an input file
 * and save them to the global functionConstraints object.
 *
 * @param   {String} filePath Path of the file to generate tests for.
 * @returns {Object}          Function constraints object.
 */
var fileConstraints = {}
var fileInfo = {}
let allConstraints = {};

function addTest(funcName, test) {

    if (!allConstraints[funcName]) {
        allConstraints[funcName] = {}
    }
    if (!allConstraints[funcName].tests) {
        allConstraints[funcName].tests = []
    }
    allConstraints[funcName].tests.push(test)
}

function addMemberDetails(funcName, memberObj) {

    if (!allConstraints[funcName]) {
        allConstraints[funcName] = {}
    }

    _.set(allConstraints[funcName],'member', memberObj) 
}

function addInfo(funcName) {
    if(!allConstraints[funcName]){
        allConstraints[funcName] = {}
    }
    allConstraints[funcName].info = fileInfo[funcName]
}

// read all files from the routes folder
function constraints(path) {
    serverConstraints('server.js')
   getFileConstraints('./routes/admin.js')
 getFileConstraints('./routes/create.js')
    getFileConstraints('./routes/study.js')
    return allConstraints
}


function serverConstraints(filePath) {
    // Read input file and parse it with esprima.
    let buf = fs.readFileSync(filePath, "utf8");
    let result = esprima.parse(buf, options);

    // Start traversing the root node
    traverse(result, function (node) {

        if (node.type === 'CallExpression') {
            var reqType;
            traverse(node, function (child) {
                if (child.type === 'MemberExpression') {
                    if (_.get(child, 'property').type === 'Identifier' && ['get', 'post'].includes(_.get(child, 'property').name)) {
                        reqType = _.get(child, 'property').name
                    }
                }
            })
            if (reqType) {

                var arr = node.arguments[0].value.split("/")
                var last = arr.pop();
                var argSize = node.arguments.length - 1;
                var nextArg = buf.substring(node.arguments[argSize].range[0], node.arguments[argSize].range[1])
                var arr2 = nextArg.split(".")

                var infoObj = {
                    type: reqType,
                    url: node.arguments[0].value.split(":")[0],
                    resource: arr[2],
                    method: arr2[1],
                    needsParams: last.slice(0, 1) == ':',
                }

                fileInfo[nextArg] = infoObj
                // console.log("Key of constraint " + nextArg)
                // if (fileConstraints[nextArg]) {
                //     allConstraints.push(new Constraint({
                //             type: reqType,
                //             url: node.arguments[0].value.split(":")[0],
                //             resource: arr[2],
                //             method: arr2[1],
                //             needsParams: last.slice(0, 1) == ':',
                //             data: fileConstraints[nextArg]

                //     }));
                // }

            }
        }
    })
}

function getFileConstraints(filePath) {

    // Initialize function constraints directory
    var funcArgs = []
    let funcData = []
    // Read input file and parse it with esprima.
    let buf = fs.readFileSync(filePath, "utf8");
    let result = esprima.parse(buf, options);
    // Start traversing the root node
    traverse(result, function (node) {
        if (node.type === 'ExpressionStatement') {
            if (node.expression.right && node.expression.right.type === 'FunctionExpression') {
                var funcName = "";
                // takes information of inputs from callbacks and the actual mocked input data to be later passed to this callback
                traverse(node.expression.left, function (child) {
                    if (child.property && child.property.type === 'Identifier') {
                        var fileName = path.basename(filePath)
                        funcName = fileName.split('/').pop().split('.')[0] + "." + child.property.name;
                    }
                })
                if (funcName) {
                    let params = node.expression.right.params.map(function (p) {
                        return p.name
                    })
                    var visitedMembers = new Map()
                    // Map method parameters to related variable declarations
                    let relatedParams = [];
                    // Initialize function constraints
                    //fileConstraints[funcName] = []

                    let reqObj = {}
                    var obj = {}
                    traverse(node, function (child) {
                        //check all variable declarations to identify variable - parameter mapping.
                        if (child.type == 'VariableDeclarator') {
                            if (child.id && child.id.type === 'Identifier') {
                                let right = child.id.name;
                                traverse(child.init, function (iden) {
                                    if (iden.type === 'Identifier') {
                                        if (params && params.includes(iden.name)) {
                                            relatedParams[right] = iden.name;
                                        } else if (relatedParams[iden.name]) {
                                            relatedParams[right] = relatedParams[iden.name];
                                        }
                                    }
                                })
                            }
                        }
                    })
                    for (var i = 0; i < node.expression.right.params.length; i++) {
                        funcArgs.push(node.expression.right.params[i].name)
                    }
                    traverse(node.expression.right, function (funcChild) {

                        // Handle equivalence expression
                        if (_.get(funcChild, 'type') === 'BinaryExpression') {
                            if (_.get(funcChild, 'left.type') === 'Identifier') {
                                // Get identifier
                                let ident = funcChild.left.name;
                                // Get expression from original source code:
                                let expression = buf.substring(funcChild.range[0], funcChild.range[1]);
                                let rightHand = buf.substring(funcChild.right.range[0], funcChild.right.range[1]);
                                // Test to see if right hand is a string
                                let match = rightHand.match(/^['"](.*)['"]$/);
                                if (match) {
                                    var testObj = {
                                        testVal: match[1],
                                        ident : funcChild.left.name
                                    }
                                 //   addTest(funcName, testObj)
                                }
                            }
                        }

                        if (funcChild.type === 'VariableDeclaration') {
                            var obj = {}
                            var visitedMembers = {}
                            var visited = false;
                            traverse(funcChild, function (memberChild) {
                                var cur = memberChild;
                                if (cur.type === 'MemberExpression' && !visited) {
                                    var temp = cur
                                    while (temp && temp.type === 'MemberExpression' && visitedMembers[temp.range[0]] != temp.range[1]) {
                                        visitedMembers[temp.range[0]] = temp.range[1]
                                        temp = _.get(temp, 'object')
                                    }
                                    if (params.includes(temp.name)) {
                                        visited = true
                                        var ex = buf.substring(cur.range[0], cur.range[1])
                                        _.set(obj, ex, "value")
                                        addMemberDetails(funcName, obj)
                                    }
                                }
                            })
                        }
                     
                    })
                    addInfo(funcName)
                }
            }
        }

    });

    return allConstraints;
}

/**
 * Traverse an object tree, calling the visitor at each
 * visited node.
 *
 * @param {Object}   object  Esprima node object.
 * @param {Function} visitor Visitor called at each node.
 */
function traverse(object, visitor) {

    // Call the visitor on the object
    visitor(object);
    // Traverse all children of object
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}


/**
 * Return the name of a function node.
 */
function functionName(node) {
    return node.id ? node.id.name : '';
}


/**
 * Generates an integer value based on some constraint.
 *
 * @param   {Number}  constraintValue Constraint integer.
 * @param   {Boolean} greaterThan     Whether or not the concrete integer is greater than the constraint.
 * @returns {Number}                  Integer satisfying constraints.
 */
function createConcreteIntegerValue(constraintValue, greaterThan) {
    if (greaterThan) return Random.integer(constraintValue + 1, constraintValue + 10)(engine);
    else return Random.integer(constraintValue - 10, constraintValue - 1)(engine);
}


// Export
module.exports = constraints;