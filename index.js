const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fphq6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Main Work----------------------------------------------------------------
async function run() {
    try {
        await client.connect();
        const teacherCollection = client.db('studentManagement').collection('teacher');

        app.get('/teacher', async (req, res) => {
            const query = {};
            const cursor = teacherCollection.find(query);
            const teacher = await cursor.toArray();
            res.send(teacher);
        });

        app.get('/teacher/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const teacher = await teacherCollection.findOne(query);
            res.send(teacher);
        });

        // POST
        app.post('/teacher', async(req, res) =>{
            const newTeacher = req.body;
            const result = await teacherCollection.insertOne(newTeacher);
            res.send(result);
        });

        // DELETE
        app.delete('/teacher/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await teacherCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally {

    }
}

run().catch(console.dir);
// Main Work----------------------------------------------------------------


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log('Listening on port ', port);
})