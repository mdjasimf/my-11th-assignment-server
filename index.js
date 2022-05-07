const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());




function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden' });
        }
        req.decoded = decoded;
        next();
    })

}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qgwct.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        await client.connect();
        const AllFruitsCollection = client.db('fruitswarehouse').collection('fruits');
        const BestDeliverFruits = client.db('bestDeliver').collection('fruits');
        app.get('/allFruits', async (req, res) => {
            const query = {};
            const cursor = AllFruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);

        });

        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            })
            res.send({ accessToken });
        })

        app.get('/myItems', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = AllFruitsCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);


        });



        app.get('/allFruits/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const fruits = await AllFruitsCollection.findOne(query);
            res.send(fruits);
        });

        app.put('/allFruits/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateQuantity.quantity
                }
            };

            const result = await AllFruitsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
        app.delete('/allFruits/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await AllFruitsCollection.deleteOne(query);
            res.send(result);
        })
        app.delete('/myItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await AllFruitsCollection.deleteOne(query);
            res.send(result);
        })
        app.post('/allFruits', async (req, res) => {
            const newAdd = req.body;
            const result = await AllFruitsCollection.insertOne(newAdd);
            res.send(result);
        })
        app.post('/bestDeliverFruits', async (req, res) => {
            const newAdd = req.body;
            const result = await BestDeliverFruits.insertOne(newAdd);
            res.send(result);
        })
        app.get('/bestDeliverFruits', async (req, res) => {
            const query = {};
            const cursor = BestDeliverFruits.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);

        });

    }
    finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('fruits warehouse is running');

})
app.get('/new', (req, res) => {
    res.send('fruits warehouse is running');

})

app.listen(port, () => {
    console.log('fruits warehouse is running');
})