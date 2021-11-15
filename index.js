const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4000
require('dotenv').config()

// Middle Ware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jdcg5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try {
    await client.connect();
        
    const database = client.db('real_watch');
    const productCollections = database.collection('products');
    const userCollections = database.collection('users')
    const orderCollections = database.collection('orders')
    const reviewCollections = database.collection('reviews')

    // Products Collections 
    // get api products
    app.get('/products', async (req,res)=> {
      const cursor = productCollections.find({})
      const products = await cursor.toArray()
      res.send(products)
    })
    // get api products/id
    app.get('/products/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)}
      const product = await productCollections.findOne(query)
      res.json(product)
    })
    // post api products
    app.post('/products',async(req,res)=>{
      const product = req.body;
      const result = await productCollections.insertOne(product)
      res.json(result)
    })

    // Orders Collections 
    // get api orders
    app.get('/orders', async (req,res)=> {
      const cursor = orderCollections.find({})
      const products = await cursor.toArray()
      res.send(products)
    })
    // post api orders
    app.post('/orders',async(req,res)=>{
      const order = req.body;
      const result = await orderCollections.insertOne(order)
      res.json(result)
    })
    // delete api order/email
    app.delete('/orders/:email', async (req,res)=>{
      const email = req.params.email;
      const query = {email:email}
      const user = await orderCollections.deleteOne(query);
      res.json(user)
    })

    // Reviews Collections
    // get api reviews
    app.get('/reviews', async (req,res)=> {
      const cursor = reviewCollections.find({})
      const reviews = await cursor.toArray()
      res.send(reviews)
    })
    // post api reviews
    app.post('/reviews',async(req,res)=>{
      const reviews = req.body;
      const result = await reviewCollections.insertOne(reviews)
      res.json(result)
    })

    // Users Collections
    // Post api users
    app.post('/users',async(req,res)=>{
      const user = req.body;
      const result = await userCollections.insertOne(user)
      res.json(result)
    })
    // put api users
    app.put('/users',async(req,res)=>{
      const user = req.body;
      const filter = {email : user.email}
      const option = {upsert:true}
      const updateDoc = {$set:user}
      const result = await userCollections.updateOne(filter,updateDoc,option)
      res.json(result)
    })
    //put api users/admin
    app.put('/users/admin',async(req,res)=>{
      const user = req.body;
      const filter = {email : user.email}
      const updateDoc = {$set: {role:'admin'}}
      const result = await userCollections.updateOne(filter,updateDoc)
      res.json(result)
    })
    // get api users/email
    app.get('/users/:email',async (req,res)=>{
      const email = req.params.email;
      console.log(email);
      const query = {email:email}
      const user = await userCollections.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
        isAdmin = true;
      }
      res.json({admin: isAdmin})
    })

    }
    finally {
        //  await client.connect()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})