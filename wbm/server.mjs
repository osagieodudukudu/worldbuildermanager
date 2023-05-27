import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const { Schema, model, connect } = mongoose;
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const worldSchema = new Schema({
  name: String,
  desc: String,
  id: Number
});

const worlds = model('world', worldSchema);

let URL = "mongodb://127.0.0.1:27017/worldbuilder"

// Connecting with MongoDB
connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {

    console.log('Connected to MongoDB');

  })
  .catch(error => {

    console.error('Error connecting to MongoDB:', error);

  });


// Return Worlds
app.get('/api/worlds', async (_, res) => {
  try {

    const allworlds = await worlds.find().exec();
    res.json(allworlds);

  } 
  
  catch (error) {

    console.error('Error retrieving Worlds:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});

// Save Selected Worlds
app.post('/api/worlds/select', async (req, res) => {
  try {
    const { id } = req.body;
    const selectedWorld = await worlds.findOne({ id: Number(id) });

    if (!selectedWorld) {
      return res.status(404).json({ error: 'World not found' });
    }

    res.json(selectedWorld);
  } catch (error) {
    console.error('Error selecting world:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Return Selected Worlds
app.get('/api/worlds/selected', async (_, res) => {
  try {
    const selectedWorld = await worlds.findOne({ selected: true });

    if (selectedWorld) {
      res.json(selectedWorld);
    } else {
      res.status(404).json({ error: 'No selected world found' });
    }
  } catch (error) {
    console.error('Error retrieving selected world:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Worlds
app.post('/api/worlds/add', async (req, res) => {
  try {
    const newWorld = req.body;
    console.log(newWorld);
    const createdWorld = await worlds.create(newWorld);
    res.json(createdWorld);
  } 
  
  catch (error) {
    console.error('Error creating world:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete Worlds 
app.delete('/api/worlds/:id', async (req, res) => {
  try {

    const { id } = req.params;
    await worlds.deleteOne({ id: Number(id) });
    res.sendStatus(204); 
    
  } 
  catch (error) {

    console.error('Error deleting world:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});




app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});