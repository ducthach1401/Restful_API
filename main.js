const express = require('express');
const mongodb = require('mongodb');
const app = express();
const port = 8081;
const mongo_client = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const url_mongo = 'mongodb://root:root@localhost:1234/?authSource=admin';

var data_class = ({
    id: 1814062,
    name: "Nguyen Van A",
    mail: "ducthach.1401@gmail.com",
    phone: "0947185xxx"
},
{
    id: 1814042,
    name: "Nguyen Van B",
    mail: "ducthach.1401@gmail.com",
    phone: "0947185xxx"
},
{
    id: 1814033,
    name: "Nguyen Van C",
    mail: "ducthach.1401@gmail.com",
    phone: "0947185xxx"
});

function create_collection(db,name) {
    var table_class = db.db("database");
    table_class.createCollection(name, function(err, res) {
        if (err) console.log(`Exists ${name}`)
        else {
            console.log("Collection created!");
        }
        db.close();
    });
}

mongo_client.connect(url_mongo, (err, db) =>{
    if (err) {
        console.log(err);
    }
    else {
        create_collection(db, "class");
        create_collection(db, "parent");
        create_collection(db, "student");
        console.log("Login success");
    }
})


var myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
  }
  
app.use(myLogger)
  
app.get('/', (req, res) => {
    res.send('Hello');
})

app.get('/data', (req, res) => {
    res.send('Hello data');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})