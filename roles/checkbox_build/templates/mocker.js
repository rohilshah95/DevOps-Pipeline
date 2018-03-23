//var mongodb = require('mongo-mock')
var sinon = require('sinon')
var mongodb = require('mongo-mock')
const faker = require('faker')
var mongo = require('mongodb')
var sleep = require('system-sleep')

var MongoClient = mongodb.MongoClient;
//just a mocked database in memory, url is passed as a formality
var url = 'mongodb://localhost:270/mocked';
MongoClient.persist = "mockData.js"
var mockDb = null

async function connectMock(){
    db = await MongoClient.connect(url)
    var collection =  db.collection('studies')
    var data = [{
        _id:"",
        token:"",
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
    }]
    res = await collection.insertMany(data)
    var studyId = res.insertedIds[0].toHexString()
    console.log(studyId)
    sinon.stub(mongo.MongoClient,'connect').yields((a,b) => {},db)
    require('./cov_server.js')


}

connectMock()




// mockDb = db

//     //sleep(5000)

// sinon.stub(mongo.MongoClient,'connect').yields((a,b) => {},mockDb)
// console.log(mockDb)
// //var db = mongodb.Db.prototype
// var con = MongoClient.connect
// //var mocollection = sinon.mock(mongodb.Collection.prototype)
// //console.log(mongodb.Collection.prototype)
// //var mocursor = sinon.mock(mongodb.Cursor.prototype)

// // console.log(mongodb.collection.insert({'studies':{"vijay":"lol"}}))

// sleep(5000)

// // console.log(mocollection.object.find())

// // sinon.stub(db, 'collection').yields( (a,b) => {}, mocollection.object)
// // var studyId = new mongodb.ObjectID('5aac31beb748e953ca4dc091');
// })


// exports.mock = function(){
//     mocollection.expects('find').atLeast(0).returns(mocursor.object)
//     mocollection.expects("findOne").atLeast(0).yields(null,{"_id": 1})
//     mocursor.expects("toArray").atLeast(0).yields(null,[{length: 1,email:"abc@gmail.com"}])
//    // mocursor.expects("filter").atLeast(0).yields({email: "abc@email.com"},1,[])
//     //mocollection.expects('find').returns(mocursor.object)
//     mocursor.expects("aggregate").atLeast(0).yields()
// }
// exports.restore = function(){
//     mocollection.restore()
// }