const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri =
 `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s5ynbm1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect(err => {
      if (err) {
        console.error(err);
        return;
      }
    });

    const classesCollection = client.db("summerCamp").collection("classes");

    // get all data from classes from database collection
    app.get('/classes', async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    })
    // get the popular classes from database collection
    app.get('/popularclasses', async (req, res) => {
      const query = { enrolled_students: { $gte: 10 } };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server Is Running');
});

app.listen(port, () => {
  console.log(`Server Is Running On Port ${port}`);
})