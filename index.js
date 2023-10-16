const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send('server thik ache')
})


const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://CoffeeProject:nEm5VQ4hND46Lb4l@cluster0.4ievbno.mongodb.net/?retryWrites=true&w=majority";

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
    
    await client.connect();

    
    // user info
    const userDatabase = client.db("EcommerceDB").collection('users');


    app.post('/users',async(req,res) => {
      const user = req.body;
      const result = await userDatabase.insertOne(user);
      res.send(result);
    })

    app.patch('/users',async(req,res) => {
      const user = req.body;
      
      const filter = { userEmail: user.email};

      const updateTime = {
        $set: {
          lastSignInTime: user.lastSignInTime
        },
      };

      const result = await userDatabase.updateOne(filter,updateTime);

      res.send(result)


    })

    // product related work

    const productsDatabase = client.db("EcommerceDB").collection("product");
    
    app.get('/products',async(req,res) => {
        const result = await productsDatabase.find().toArray('product');
        res.send(result)
    })


    
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port,() => {
    console.log('the server is running')
})
