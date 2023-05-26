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
  profile: String,
  id: { type: Number, unique: true }
});

const worlds = model('worlds', worldSchema);
export default worlds;

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
app.get('/api/worlds', async (req, res) => {
  try {
    
    const worlds = await worlds.find();
    res.json(worlds);

  } 
  catch (error) {

    console.error('Error retrieving worlds:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});

// Save Selected worlds
app.post('/api/worlds/select', async (req, res) => {
  try {
    const { id } = req.body;
    const selectedWorld = await worlds.findOne({ id: Number(id) });

    
    if (!selectedWorld) {
      return res.status(404).json({ error: 'worlds not found' });
    }
    
    res.json(selectedWorld);
  } catch (error) {
    console.error('Error selecting world:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Return Selected worlds
app.get('/api/worlds/selected', async (req, res) => {
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

// Add worlds
app.post('/api/worlds/add', async (req, res) => {
  try {
    const newWorld = req.body;
    const createdWorld = await worlds.create(newWorld);
    res.json(createdWorld);
  } 
  
  catch (error) {
    console.error('Error creating world:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete worlds 
app.delete('/api/worlds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await worlds.findByIdAndDelete(id);
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