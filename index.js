const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
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

    app.get('/products', async (req,res)=> {
      const cursor = productCollections.find({})
      const products = await cursor.toArray()
      res.send(products)
    })

    app.get('/products/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)}
      const product = await productCollections.findOne(query)
      res.json(product)
    })

    }
    finally {
        // await client.connect()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})