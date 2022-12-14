const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Middle Wares //
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Swap Server site is Running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rjzdusk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const phoneCollection = client.db('swap').collection('phoneCollection');
    const allPhoneCollection = client.db('swap').collection('allPhones');
    const itemsCollection = client.db('swap').collection('items');
    const userCollection = client.db("swap").collection("usersList");
    const productsCollection = client.db("swap").collection("myProducts");
    const advertiseCollection = client.db("swap").collection("advertise");
   
    try {
        app.get('/phones', async (req, res) => {
            const query = {}
            const cursor = phoneCollection.find(query);
            const phones = await cursor.toArray();
            res.send(phones);
        });
        app.get('/allPhones', async (req, res) => {
            const query = {}
            const cursor = allPhoneCollection.find(query);
            const allPhones = await cursor.toArray();
            res.send(allPhones);
        });

        app.get("/category/:id", async (req, res) => {
            const id = req.params.id;
            const query = {};
            const cursor = await allPhoneCollection.find(query).toArray();
            const category_phone = cursor.filter((n) => n.category_id === id);
            console.log(category_phone);
            res.send(category_phone);
          });


          //Modal Item
        
app.get("/items", async (req, res) => {
            const query = {};
            const cursor = await itemsCollection.find(query);
            const reviews = await cursor.toArray();
            const reverseArray = reviews.reverse();
            res.send(reverseArray);
        });

        app.post("/items", async (req, res) => {
            const items = req.body;
            const result = await itemsCollection.insertOne(items);
            res.send(result);
        });

        //Dashboard

        app.get("/items", async (req, res) => {
            const email = req.query.email;
            const query = {email:email};
            const cursor = await itemsCollection.find(query).toArray();;
            res.send(cursor);
        });

        // all User
        app.get("/usersList", async (req, res) => {
            const query = {};
            const cursor = await userCollection.find(query);
            const reviews = await cursor.toArray();
           
            res.send(reviews);
        });

        app.post("/usersList", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.put ("/usersList/admin/:id",async(req,res)=>{
            const id = req.params.id;
            const filter ={_id:ObjectId(id)}
            const option ={upsert: true};
            const updateDoc ={
                $set:{
                    role : 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, option,);
            console.log(result);
            res.send(result);
        });
        app.get('/usersList/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        app.delete("/usersList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        // products collection
        app.post("/myProducts", async (req, res) => {
            const items = req.body;
            console.log(items);
            const result = await productsCollection.insertOne(items);
            res.send(result);
        });
        app.get("/myProducts", async (req, res) => {
            const query = {};
            const cursor = await productsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.delete("/myProducts", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        app.post("/advertise", async (req, res) => {
            const items = req.body;
            console.log(items);
            const result = await advertiseCollection.insertOne(items);
            res.send(result);
        });

        app.get("/advertise", async (req, res) => {
            const query = {};
            const cursor = await advertiseCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.delete("/advertise", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await advertiseCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

    }
    finally {

    }
}
run().catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Swap Server site is Running on ${port}`);
})