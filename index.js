const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

// using middle ware
app.use(cors());
app.use(express.json());

// connecting to mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6xsao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("database connected");
async function run() {
  try {
    await client.connect();
    const database = client.db("Blood_Web");
    const usersCollection = database.collection("users_collection");

    // get/add new register user to database
    app.post("/addUsers", async (req, res) => {
      const users = req.body;
      console.log(users);
      const result = await usersCollection.insertOne(users);
      res.json(result);
    });
    // get/add new register user to database
    app.get("/getAllUsers", async (req, res) => {
      const cursor = usersCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.get("/allUsers/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { id_: ObjectId(id) };
    //   const findUser = await usersCollection.findOne(query);
    //   console.log(id);
    //   res.send(findUser);
    // });
    // GET user by email
    app.get("/allUsers/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await usersCollection
        .find({
          email: req.params.email,
        })
        .toArray();

      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Welcome to blood web server");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
