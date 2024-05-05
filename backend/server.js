const express = require('express')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const bodyparser=require('body-parser')
const cors=require('cors')

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express()
const port = 3000
app.use(bodyparser.json())
app.use(cors())
const { v4: uuidv4 } = require('uuid');

client.connect();
//get password
app.get('/', async(req, res) => {
    const db=client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

//save password
app.post('/', async(req, res) => {
    const password=req.body
    password._id = uuidv4();
    const db=client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult})
})

//delete password
app.delete('/', async(req, res) => {
    const password=req.body
    const db=client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({success: true, result: findResult})
})




app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})