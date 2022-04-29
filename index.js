const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://FRUITS:YIJprcW3zmldSMJZ@cluster0.qgwct.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        await client.connect();
        const AllFruitsCollection = client.db('fruitswarehouse').collection('fruits');
        app.get('/allFruits', async (req, res) => {
            const query = {};
            const cursor = AllFruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);

        });
        app.get('/allFruits/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const fruits = await AllFruitsCollection.findOne(query);
            res.send(fruits);
        })
    }
    finally { }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('books warehouse is running');

})

app.listen(port, () => {
    console.log('books warehouse is running');
})