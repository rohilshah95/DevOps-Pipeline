// Core/NPM Modules
const esprima = require("esprima");
const faker = require("faker");
const fs = require('fs');
const Random = require('random-js');
const _ = require('lodash');
const randexp = require('randexp');
const encode = require('hashcode').hashCode

// Set options
faker.locale = "en";
const options = {
    tokens: true,
    tolerant: true,
    loc: false,
    range: true
};
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
function constraints(filePath) {

    // Initialize function constraints directory
    let allConstraints = []
    let functionConstraints = {};

    // Read input file and parse it with esprima.
    let buf = fs.readFileSync(filePath, "utf8");
    let result = esprima.parse(buf, options);
    // Start traversing the root node
    traverse(result, function (node) {
        
        if(node.type === 'CallExpression'){
            var reqType;
            traverse(node, function(child){
                if(child.type === 'MemberExpression'){
                    if(_.get(child,'property').type === 'Identifier' && ['get','post'].includes(_.get(child,'property').name)){
                        reqType = _.get(child,'property').name
                    }
                }
            })
            if(reqType){
                var arr = node.arguments[0].value.split("/")
                var last = arr.pop();
                var argSize = node.arguments.length -1 ;
                var nextArg = buf.substring(node.arguments[argSize].range[0],node.arguments[argSize].range[1])
                var arr2 = nextArg.split(".")
                allConstraints.push(new Constraint({
                    ident: nextArg,
                    value: {type: reqType, url: node.arguments[0].value.split(":")[0], resource: arr[2] , method: arr2[1], needsParams: last.slice(0,1) == ':' },
                    funcName: "server",
                    kind: "string",
                    operator: "",
                    expression: nextArg
                }));
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