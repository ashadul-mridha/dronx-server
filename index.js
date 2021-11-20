const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

//middleware
app.use( cors())
app.use( express.json())

//mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.riphr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

    try{
        await client.connect();
        const database = client.db("dronx");
        const userCollection = database.collection("users");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("reviews");


        //insert a user
        app.post('/user' , async (req , res) => {
            const user = req.body.user;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        //get all users
        app.get('/users', async(req , res) => {
            const result = await userCollection.find({}).toArray();
            res.send(result);
        })

        //update user
        app.put('/user', async (req, res) => {
            const email = req.body.email
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  role: true
                },
            };
              
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        
        //insert product to database
        app.post('/product' , async (req , res) => {
            const product = req.body.product;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })

        //get all products from products collection
        app.get('/products' , async (req , res) => {
            const allProducts = await productsCollection.find({}).toArray();
            res.send(allProducts);
        })

        //get single product
        app.get('/product/:id', async (req , res) => {
            const id = req.params.id;
            const query = {_id:  ObjectId(id)}
            const result = await productsCollection.findOne(query);
            res.send(result);
        })

        //delete product
        app.delete('/product/:id', async (req , res) => {
            const id = req.params.id;
            const query = {_id:  ObjectId(id)}
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        //inset a order
        app.post( '/order' , async (req , res) => {
            const order = req.body.order;
            const result = await ordersCollection.insertOne(order);
            res.send(result)
        })

        //get all order
        app.get('/orders', async (req, res) => {
            const allOrders = await ordersCollection.find({}).toArray();
            res.send(allOrders);
        })

        //get single order
        app.get('/order/:id', async (req , res) => {
            const id = req.params.id;
            const query = {_id:  ObjectId(id)}
            const result = await ordersCollection.findOne(query);
            res.send(result);
        })

        //delete single order
        app.delete('/order/:id', async (req , res) => {
            const id = req.params.id;
            const query = {_id:  ObjectId(id)}
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })

        //update order status
        app.put('/order/status', async (req, res) => {
            const id = req.body._id
            const filter = {_id:  ObjectId(id)};
            const updateDoc = {
                $set: {
                  status: true
                },
            };
              
            const result = await ordersCollection.updateOne( filter, updateDoc );
            res.send(result)
        })

        //insert review
        app.post('/review', async (req , res) => {
            const review = req.body.reviewData;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        //get all review
        app.get('/review', async (req , res) => {
            const result = await reviewsCollection.find({}).toArray();
            res.send(result);
        })



    }
    finally{

    }

}
run().catch(console.dir);


app.get('/', (req , res) => {
    res.send('I Love BD')
})


app.listen(port, () => {
    console.log(`Try Again Man You Do It In Sha Allah`)
})

