const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3e0xlo7.mongodb.net/?retryWrites=true&w=majority`;
  console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){

    const servicesCollection = client.db('wildPhotoGraphy').collection('services');
    const reviewCollection = client.db("wildPhotoGraphy").collection('reviews')
    app.get('/homeServices', async(req, res) =>{
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.limit(3).toArray();
        res.send(services);
    })

    app.get('/services', async(req, res) =>{
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })

    app.get('/services/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await servicesCollection.findOne(query);
      
      res.send(result);
    })

    app.post('/reviews', async(req, res) =>{
      const review = req.body;
      const result = await reviewCollection.insertOne(review); 
      res.send(result);
    })


}
run().catch(err => console.error(err));



app.get('/', (req, res) =>{
    res.send('Assignment 11 server is running')
})


app.listen(port, () =>{
    console.log(`Assignment running on port: ${port}`);
})