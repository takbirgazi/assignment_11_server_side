const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json())

// MongoDB Start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h4cvmus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("sevenStarDB"); // Database Name
    const users = database.collection("user"); // Collection or Table Name
    const rooms = database.collection("rooms"); // Collection or Table Name
    const booking = database.collection("booking"); // Collection or Table Name
    const review = database.collection("review"); // Collection or Table Name

    app.post('/user', async(req, res)=>{
      const usr = req.body;
      const usrData = await users.insertOne(usr);
      res.send(usrData);
    })
    app.get('/user', async(req, res)=>{
      const usr = users.find();
      const result = await usr.toArray();
      res.send(result);
    })
    app.get('/rooms', async(req, res)=>{
      const filter = req.query;
      const query = {};
      const option = {
        sort:{
          price_per_night: filter.sort === 'asc' ? 1 : -1
        }
      };
      const room = rooms.find(query, option);
      const result = await room.toArray();
      res.send(result);
    })
    app.get('/rooms/:id', async (req, res)=>{
      const id = req.params.id;
      const findId = {_id: new ObjectId(id)};
      const details = await rooms.findOne(findId);
      res.send(details)
    })
    app.put('/rooms/:id', async (req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateDetails = req.body;
      const updateDetailsInfo = {
        $set: {
            availability: updateDetails.availability
        }
      }
      const result = await rooms.updateOne(filter, updateDetailsInfo, options);
      res.send(result);
    })
    app.get('/booking/:email', async(req, res)=>{
      const result = await booking.find({email:req.params.email}).toArray();
      res.send(result);
    })
    app.post('/booking', async(req, res)=>{
      const newBooking = req.body;
      const result = await booking.insertOne(newBooking);
      res.send(result);
    })
    app.get('/review', async(req, res)=>{
      const rvw = review.find();
      const result = await rvw.toArray();
      res.send(result);
    })
    app.post('/review', async(req, res)=>{
      const newReview = req.body;
      const result = await review.insertOne(newReview);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// MongoDB End


app.get('/',(req, res)=>{
    res.send("This is home page");
})

app.listen(port, ()=>{
    console.log(`Server is running at ${port}`);
});