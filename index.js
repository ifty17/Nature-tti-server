const express = require("express");
const cors = require("cors");
require("dotenv").config();
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

async function run() {
  try {
    const servicesCollection = client.db("wildPhotoGraphy").collection("services");
    const storeReview = client.db("wildPhotoGraphy").collection("storeReview")
    app.get("/homeServices", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.post('/services', async(req, res) =>{
      const add = req.body;
      const result = await servicesCollection.insertOne(add);
      res.send(result);
    })

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);

      res.send(result);
    });

    app.get("/storeReview", async (req, res) =>{
      let query = {};
      if(req.query.email){
        query = {
          email: req.query.email
        }
      }
      const cursor = storeReview.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })

    app.post("/storeReview", async(req, res) =>{
      const rev = req.body;
      const result = await storeReview.insertOne(rev);
      res.send(result);
    });

    app.delete('/storeReview/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await storeReview.deleteOne(query);
      res.send(result);
    })

  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Assignment 11 server is running");
});

app.listen(port, () => {
  console.log(`Assignment running on port: ${port}`);
});
