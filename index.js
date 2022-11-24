const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Middle Wares //


app.get('/', (req, res) => {
    res.send('Swap Server site is Running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rjzdusk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const phoneCollection = client.db('swap').collection('phoneCollection');
   
    try {
        app.get('/phones', async (req, res) => {
            const query = {}
            const cursor = phoneCollection.find(query);
            const phones = await cursor.toArray();
            res.send(phones);
        });
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Swap Server site is Running on ${port}`);
})