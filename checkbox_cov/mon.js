var mongodb = require('mongodb')
var sinon = require('sinon')
//var mongoose = require('mongoose')
//var smon = require('sinon-mongoose')
//mongoose.Promise = require('es6-promise').Promise
 var db = mongodb.Db.prototype
// var db = mongoose.mongo.Db.prototype
var con = mongodb.MongoClient
// var mgs = require('mockgoose').Mockgoose
var mock = sinon.mock(mongodb.Collection.prototype).expects("findOne").withArgs({'_id':"5aac31beb748e953ca4dc091"}).yields(somefunc,{})
// var mg = new mgs(mongoose)

var somefunc = function(err,something){
    console.log(err)
    console.log(something)
}
var collection = {
    findOne : function(err, callback){ 
            // callback(err, {
            //     token : "1",
            //     invitecode : "3.13"
            //  })
    },
    find : function(obj, callback){
        return {toArray: function(callback){
          callback({
            token : "1",
            invitecode : "3.13"
         })
        }}
    }
}

sinon.stub(con,'connect').yields(somefunc,db)
sinon.stub(db, 'collection').withArgs('studies').yields(somefunc, mock)
var server = require('./cov_server.js')


//sinon.stub(collection,'findOne').withArgs({'_id':"5aac31beb748e953ca4dc091"}).yieldsAsync(somefunc, )

//var spy = sinon.spy(db,'collection')

//mongodb.Collection.prototype



