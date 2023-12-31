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

const worldSchema = new Schema({
  name: String,
  desc: String,
  profile: String, Buffer,
  map: String, Buffer,
  id: Number,
});

const selectedworldSchema = new Schema({
  name: String,
  desc: String,
  profile: String, Buffer,
  map: String, Buffer,
  id: Number,
});

const peopleSchema = new Schema ({
  world_id: Number,
  id: Number,
  name: String,
  age: String,
  ethnic: String,
  nation: String,
  gender: String,
  skills: [String],
  attributes: [String],
  bio: String,
  image: String
})

const selectedpersonSchema = new Schema ({
  world_id: Number,
  id: Number,
  name: String,
  age: String,
  ethnic: String,
  nation: String,
  gender: String,
  skills: [String],
  attributes: [String],
  bio: String,
  image: String
})

const placesSchema = new Schema({
  world_id: Number,
  id: Number,
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

const selectedplaceSchema = new Schema({
  world_id: Number,
  id: Number,
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
  world_id: Number,
  id: Number,
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

const selecteditemSchema = new Schema({
  world_id: Number,
  id: Number,
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'peopleSchema'
  },
  category: String,
  value: Number,
  quantity: Number,
  desc: String,
  image: String
});

const eventsSchema = new Schema({
  world_id: Number,
  id: Number,
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

const selectedeventSchema = new Schema({
  world_id: Number,
  id: Number,
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
const selectedworld = mongoose.model('selectedworld', selectedworldSchema, 'selectedworlds')

const people = mongoose.model('people', peopleSchema);
const selectedperson = mongoose.model('selectedperson', selectedpersonSchema)

const places = mongoose.model('places', placesSchema);
const selectedplace = mongoose.model('selectedplace', selectedplaceSchema)

const items = mongoose.model('items', itemsSchema);
const selecteditem = mongoose.model('selecteditem', selecteditemSchema)

const events = mongoose.model('events', eventsSchema);
const selectedevent = mongoose.model('selectedevent', selectedeventSchema)


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
type
    console.error('Error retrieving Worlds in backend:', error);
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

//Upload Map
app.put('/api/worlds/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the selected world by its ID
    const selectedWorld = await selectedworld.findOne({ id });

    if (!selectedWorld) {
      return res.status(404).json({ error: 'Selected world not found' });
    }

    // Update the map variable in the selected world
    selectedWorld.map = map;

    // Save the updated selected world
    await selectedWorld.save();

    await worlds.findOneAndUpdate({ id: Number(id) }, { map });

    res.json(selectedWorld);
  } catch (error) {
    console.error('Error updating selected world:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//////////////////////////////////////////////////////////////////////////////////////////////////////

// Return People
app.get('/api/people', async (_, res) => {
  try {

    const allpeople = await people.find().exec();
    res.json(allpeople);

  } 
  
  catch (error) {
type
    console.error('Error retrieving People:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});

// Save Selected Person
app.post('/api/people/select/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const person = await people.findOne({ id: Number(id) });
    res.sendStatus(204);


    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }

    await selectedperson.deleteMany();
    const createdPerson = await selectedperson.create({

      world_id: people.world_id,
      id: people.id,
      name: people.name,
      age: people.age,
      ethnic: people.ethnic,
      nation: people.nation,
      gender: people.gender,
      skills: people.skills,
      attributes: people.attributes,
      bio: people.bio,
      image: people.image
    });


  } 
  
  catch (error) {
    console.error('Error selecting person:', error);
  }
});

// Return Selected Person
app.get('/api/people/selected', async (req, res) => {
  try {
    const selectedPerson= await selectedperson.findOne();

    if (selectedPerson) {
      res.json(selectedPerson);
    } else {
      res.status(404).json({ error: 'No selected person found' });
    }
  } catch (error) {
    console.error('Error retrieving selected person:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Person
app.post('/api/people/add', async (req, res) => {
  try {
    const newPerson = req.body;
    console.log(newPerson);
    const createdPerson = await people.create(newPerson);
    res.json(createdPerson);
  }  
  
  catch (error) {
    console.error('Error creating person:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete Person 
app.delete('/api/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    await people.deleteOne({ id: numericId });
    res.sendStatus(204);
  } 
  
  catch (error) {
    console.error('Error deleting person:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


////////////////////////////////////////////////////////

// Return Places
app.get('/api/places', async (_, res) => {
  try {

    const allplaces = await places.find().exec();
    res.json(allplaces);

  } 
  
  catch (error) {
type
    console.error('Error retrieving Places:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});

// Save Selected Place
app.post('/api/places/select/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const place = await places.findOne({ id: Number(id) });
    res.sendStatus(204);


    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    await selectedplace.deleteMany();
    const createdPlace = await selectedplace.create({

      world_id: places.world_id,
      id: places.id,
      name: places.name,
      location: places.location,
      population: places.population,
      attractions: places.attractions,
      notable_people: places.notable_people,
      desc: places.desc,
      image: places.image
    });


  } 
  
  catch (error) {
    console.error('Error selecting place:', error);
  }
});

// Return Selected Place
app.get('/api/places/selected', async (req, res) => {
  try {
    const selectedPlace = await selectedplace.findOne();

    if (selectedPlace) {
      res.json(selectedPlace);
    } else {
      res.status(404).json({ error: 'No selected place found' });
    }
  } catch (error) {
    console.error('Error retrieving selected place:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Place
app.post('/api/places/add', async (req, res) => {
  try {
    const newPlace = req.body;
    console.log(newPlace);
    const createdPlace = await places.create(newPlace);
    res.json(createdPlace);
  }  
  
  catch (error) {
    console.error('Error creating place:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete Place 
app.delete('/api/places/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    await places.deleteOne({ id: numericId });
    res.sendStatus(204);
  } 
  
  catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//////////////////////////////////////////////////////////
// Return Items
app.get('/api/items', async (_, res) => {
  try {

    const allitems = await items.find().exec();
    res.json(allitems);

  } 
  
  catch (error) {
type
    console.error('Error retrieving Items:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});

// Save Selected Item
app.post('/api/items/select/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await items.findOne({ id: Number(id) });
    res.sendStatus(204);


    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await selecteditem.deleteMany();
    const createdItem = await selecteditem.create({

      world_id: items.world_id,
      id: items.id,
      owner: items.owner,
      name: items.name,
      category: items.category,
      value: items.value,
      quantity: items.quantity,
      desc: items.desc,
      image: items.image
    });


  } 
  
  catch (error) {
    console.error('Error selecting item:', error);
  }
});

// Return Selected Item
app.get('/api/items/selected', async (req, res) => {
  try {
    const selectedItem = await selecteditem.findOne();

    if (selectedItem) {
      res.json(selectedItem);
    } else {
      res.status(404).json({ error: 'No selected item found' });
    }
  } catch (error) {
    console.error('Error retrieving selected item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Item
app.post('/api/items/add', async (req, res) => {
  try {
    const newItem = req.body;
    console.log(newItem);
    const createdItem = await items.create(newItem);
    res.json(createdItem);
  }  
  
  catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete Item 
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    await items.deleteOne({ id: numericId });
    res.sendStatus(204);
  } 
  
  catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//////////////////////////////////////////////
// Return Events
app.get('/api/events', async (_, res) => {
  try {

    const allevents = await events.find().exec();
    res.json(allevents);

  } 
  
  catch (error) {
type
    console.error('Error retrieving Events:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});

// Save Selected Event
app.post('/api/events/select/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await events.findOne({ id: Number(id) });
    res.sendStatus(204);


    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await selectedevent.deleteMany();
    const createdEvent = await selectedevent.create({

      world_id: events.world_id,
      id: events.id,
      name: events.name,
      location: events.location,
      date: events.date,
      desc: events.desc,
      attendees: events.attendees,
      bio: events.bio,
      image: events.image
    });


  } 
  
  catch (error) {
    console.error('Error selecting event:', error);
  }
});

// Return Selected Event
app.get('/api/events/selected', async (req, res) => {
  try {
    const selectedEvent = await selectedevent.findOne();

    if (selectedEvent) {
      res.json(selectedEvent);
    } else {
      res.status(404).json({ error: 'No selected event found' });
    }
  } catch (error) {
    console.error('Error retrieving selected event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Event
app.post('/api/events/add', async (req, res) => {
  try {
    const newEvent = req.body;
    console.log(newEvent);
    const createdEvent = await items.create(newEvent);
    res.json(createdEvent);
  }  
  
  catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete Event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    await events.deleteOne({ id: numericId });
    res.sendStatus(204);
  } 
  
  catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});