const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const url = "mongodb://localhost:27017/"
const dbname = 'conFusion'
const dboper = require('./options')

MongoClient.connect(url)
    .then((client) => {
        console.log("Connected correctly to the server")
        const db = client.db(dbname)
        
        dboper.insertDocument(db, {name: "Vadonut", description: "Test"}, "dishes")
        .then((result) => {
            console.log("Inserted documents: ",result.ops)
            return dboper.findDocuments(db, 'dishes')
        })   
        .then((docs) => {
        console.log('Found Documents: \n', docs)
        return dboper.updateDocument(db, {name: "Vadonut"},{description: "Updated Test"}, 'dishes')
        })
        .then((result) => {
        console.log('Updated Document : \n', result.result)
        return dboper.findDocuments(db,'dishes')
        })
        .then((docs) => {
        console.log('Found Documents: \n', docs)
        return db.dropCollection('dishes')
        })
        .then((result) => {
        console.log('Dropped Collection : \n', result)
        client.close()
        })
        .catch(err => console.log(err))
    })
.catch(err => console.log(err))
