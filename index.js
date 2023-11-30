const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyhxp1w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("careCampDB").collection("users");
    const campCollection = client.db("careCampDB").collection("camps");
    const regCampCollection = client.db("careCampDB").collection("regCamps");
    const upcomingCampCollection = client
      .db("careCampDB")
      .collection("upcomingCamps");

    // users related api
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      try {
        const result = await userCollection.insertOne(user);
        res.send({
          message: "User added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error inserting user:", error);
        res
          .status(500)
          .send({ message: "Error inserting user", error: error.message });
      }
    });

    // camp related api
    app.get("/camps", async (req, res) => {
      const result = await campCollection.find().toArray();
      res.send(result);
    });

    app.get("/camps/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campCollection.findOne(query);
      res.send(result);
    });

    app.post("/camps", async (req, res) => {
      const item = req.body;
      const result = await campCollection.insertOne(item);
      res.send(result);
    });

    app.patch("/camps/:id", async (req, res) => {
      const camp = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedCapm = {
        $set: {
          campName: camp.campName,
          image: camp.image,
          campFees: camp.campFees,
          scheduledDateTime: camp.scheduledDateTime,
          venueLocation: camp.venueLocation,
          specializedService: camp.specializedService,
          healthcareProfessional: camp.healthcareProfessional,
          targetAudience: camp.targetAudience,
          description: camp.description,
          userEmail: camp.userEmail,
        },
      };

      const result = await campCollection.updateOne(filter, updatedCapm);
      res.send(result);
    });

    app.delete("/camps/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campCollection.deleteOne(query);
      res.send(result);
    });

    // upcoming camp related api
    app.get("/upcomingCamps", async (req, res) => {
      const result = await upcomingCampCollection.find().toArray();
      res.send(result);
    });

    app.post("/upcomingCamps", async (req, res) => {
      const item = req.body;
      const result = await upcomingCampCollection.insertOne(item);
      res.send(result);
    });

    app.delete("/upcomingCamps/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await upcomingCampCollection.deleteOne(query);
      res.send(result);
    });

    // registered camp aip
    app.get("/regCamps", async (req, res) => {
      const result = await regCampCollection.find().toArray();
      res.send(result);
    });

    app.get("/regCamps/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await regCampCollection.findOne(query);
      res.send(result);
    });

    app.post("/regCamps", async (req, res) => {
      const item = req.body;
      const result = await regCampCollection.insertOne(item);
      res.send(result);
    });

    app.delete("/regCamps/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await regCampCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Care Camp server is running...");
});

app.listen(port, () => {
  console.log(`Care Camp server is running on port ${port}`);
});
