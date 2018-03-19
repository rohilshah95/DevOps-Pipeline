var express = require('express')
var cov = require('istanbul-middleware')
cov.hookLoader(__dirname, {verbose: true})
var covApp = express();
covApp.use('/coverage', cov.createHandler());
require('./server.js')
covApp.listen(4004);
console.log('Coverage Server is Listening on port 4004...');
