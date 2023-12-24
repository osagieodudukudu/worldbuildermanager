import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const { Schema, model, connect } = mongoose;
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2MB' }));
app.use(cors({ origin: 'http://localhost:5174' }));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

const worldSchema = new Schema({
  name: String,
  desc: String,
  profile: String, Buffer,
  map: String, Buffer,
  isSelected: Boolean,
  people: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'peopleSchema'
  }],
  places: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'placesSchema'
  }],
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'itemsSchema'
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'eventsSchema'
  }]
});

const peopleSchema = new Schema ({
  name: String,
  age: Number,
  ethnic: String,
  nation: String,
  gender: String,
  skills: [String],
  attributes: [String],
  bio: String,
  image: String
})

const placesSchema = new Schema({
  name: String,
  population: Number,
  attractions: [String],
  notable_people: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'peopleSchema'
  }],
  desc: String,
  image: String
});

const itemsSchema = new Schema({
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'peopleSchema'
  },
  category: String,
  value: Number,
  quantity: Number,
  desc: String
});

const eventsSchema = new Schema({
  name: String,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'placesSchema'
  },
  date: Date,
  desc: String,
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'peopleSchema'
  }],
  bio: String,
  image: String
});

const worlds = mongoose.model('world', worldSchema);

const people = mongoose.model('people', peopleSchema);

const places = mongoose.model('places', placesSchema);

const items = mongoose.model('items', itemsSchema);

const events = mongoose.model('events', eventsSchema);

const entityModels = {
  worlds: worlds,
  people: people,
  places: places,
  items: items,
  events: events
};


// Return Worlds
// app.get('/api/worlds', async (_, res) => {
//   try {

//     const allworlds = await worlds.find().exec();
//     res.json(allworlds);

//   } 
  
//   catch (error) {
// type
//     console.error('Error retrieving Worlds in backend:', error);
//     res.status(500).json({ error: 'Internal Server Error' });

//   }
// });

app.get('/api/:entity', async (req,res) => {
  const { entity } = req.params;

  if (!entityModels[entity]) {
    return res.status(404).json({ error: 'Entity not found' });
  }

  try {
    const allEntities = await entityModels[entity].find().exec();
    res.json(allEntities);
  } catch (error) {
    console.error(`Error retrieving ${entity} in backend:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

// Save Selected Worlds
app.post('/api/worlds/select/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const world = await worlds.findOne({ id: Number(id) });
    res.sendStatus(204);


    if (!world) {
      return res.status(404).json({ error: 'World not found' });
    }

    await selectedworld.deleteMany();
    const createdWorld = await selectedworld.create({
      name: world.name,
      desc: world.desc,
      profile: world.profile,
      map: world.map,
      id: world.id
    });


  } 
  
  catch (error) {
    console.error('Error selecting world:', error);
  }
});

// Return Selected Worlds
app.get('/api/worlds/selected', async (_, res) => {
  try {
    const selectedWorld = await selectedworld.findOne();

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
    const numericId = Number(id);
    await worlds.deleteOne({ id: numericId });
    res.sendStatus(204);
  } 
  
  catch (error) {
    console.error('Error deleting world:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update World
app.put('/api/worlds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWorldData = req.body;
    console.log('updatedWorldData:', updatedWorldData);

    const updatedWorld = await worlds.findOneAndUpdate(
      { id: Number(id) },
      updatedWorldData,
      { new: true }
    );
    console.log("updatedWorld:", updatedWorld);

    if (!updatedWorld) {
      return res.status(404).json({ error: 'World not found' });
    }

    // Update the selected world if it matches the edited world
    const selectedWorld = await selectedworld.findOne();
    console.log('selectedWorld:', selectedWorld);

    if (selectedWorld && selectedWorld.id === updatedWorld.id) {
      await selectedworld.findOneAndUpdate({}, updatedWorldData);
    }

    res.json(updatedWorld);
  } catch (error) {
    console.error('Error updating world:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});