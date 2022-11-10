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
    const servicesCollection = client
      .db("wildPhotoGraphy")
      .collection("services");
    const storeReview = client.db("wildPhotoGraphy").collection("storeReview");
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

    app.post("/services", async (req, res) => {
      const add = req.body;
      const result = await servicesCollection.insertOne(add);
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);

      res.send(result);
    });

    app.post("/storeReview", async (req, res) => {
      const rev = req.body;
      const result = await storeReview.insertOne(rev);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      console.log(req.query.email)
       let query = {};
       if (req.query.email) {
         query = {
           email: req.query.email,
         };
       }
       const cursor = storeReview.find(query);
       const orders = await cursor.toArray();
       res.send(orders);
    });

    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await storeReview.findOne(query);
      res.send(user);
    });

    // app.patch('/reviews/:id', async(req, res) =>{
    //   const id = req.params.id;
    //   const rev = req.body.rev;
    //   const query = {_id: ObjectId(id)};
    //   const updatedDoc = {
    //     $set: {
    //       rev: rev
    //     }
    //   }
    //   const result = await storeReview.updateOne(query, updatedDoc)
    //   res.send(result);
    // })

    app.get("/storeReview", async (req, res) => {
      console.log(req.query.serviceId);
      let query = {};
      if (req.query.serviceId) {
        query = {
          serviceId: req.query.serviceId,
        };
      }
      const result = storeReview.find(query);
      const reviews = await result.toArray();
      res.send(reviews);
    });

    // app.get("/reviewsbyid", async (req, res) => {
    //   let query = {};
    //   if (req.query.serviceId) {
    //     query = {
    //       serviceId: req.query.serviceId,.sort({ dateField: -1 })
    //     };
    //   }
    //   const result = reviewCollection.find(query).sort({ dateField: -1 });
    //   const reviews = await result.toArray();
    //   res.send(reviews);
    // });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await storeReview.deleteOne(query);
      res.send(result);
    });
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
