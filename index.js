const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 2024;

const app = express();

// MongoDB connection URI
const uri =
  'mongodb+srv://khbmh:Br6d5cFjpwDbtaI0@cluster0.pzdjl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let userCollection;

// Middleware
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB and set up the user collection
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');

    // Select the database and collection
    const database = client.db('usersDb');
    userCollection = database.collection('users');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
app.get('/users', async (req, res) => {
  const cursor = userCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get('/users/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const user = await userCollection.findOne(query);
  res.send(user);
});

app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  console.log('please update:', user);

  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateUser = {
    $set: {
      name: user.name,
      email: user.email,
    },
  };
  const result = await userCollection.updateOne(filter, updateUser, options);
  res.send(result);
});

/*
app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  console.log('please update:', user);

  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateUser = {
    $set: {
      name: user.name,
      email: user.email,
    },
  };
  const result = await userCollection.updateOne(filter, options, updateUser);
  res.send(result);
});

*/

// Route to insert new user
app.post('/users', async (req, res) => {
  if (!userCollection) {
    return res.status(500).send('Database not connected');
  }

  const user = req.body;
  try {
    const result = await userCollection.insertOne(user);
    res.send(result);
    console.log('new user', user);
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).send('Error inserting user');
  }
});

/*
app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  console.log('Deleting user with id:', id);

  try {
    const query = {
      _id: new ObjectId(id),
    };

    const result = await userCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
});
*/

app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  console.log('please delete', id);
  const query = {
    _id: new ObjectId(id),
  };
  const result = await userCollection.deleteOne(query);
  res.send(result);
});

// Initializing database connection before handling requests
connectToDatabase().catch(console.error);

// Basic test route
app.get('/', (req, res) => {
  res.send('hello guys');
});

// Start the server after MongoDB is connected
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/*
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 2024;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello there!');
});

app.listen(port, () => {
  console.log(`running on ${port}`);
});

const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3423;
const app = express();

// need to use middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
  res.send('basic crud')
})

app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`)
})
  */
