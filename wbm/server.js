import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const { Schema, connect} = mongoose;
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2MB' }));
app.use(cors({ origin: 'http://localhost:5173' }));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//BASE SCHEMAS
const worldSchema = new Schema({
  isSelected: Boolean,
  name: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  profile: String, Buffer,
  map: String, Buffer,
});

const charactersSchema = new Schema ({
  isSelected: Boolean,
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: Number,
  ethnicity: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'ethnicitySchema'
  },
  nationality: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'nationalitySchema'
  },
  gender: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'genderSchema'
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'speciesSchema'
  },
  bio: String,
  image: String,
})

const placesSchema = new Schema({
  isSelected: Boolean,
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: String,
  population: Number,
  attractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'attractionsSchema'
  }],
  notable_characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'charactersSchema'
  }],
  desc: String,
  image: String
});

const itemsSchema = new Schema({
  isSelected: Boolean,
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: String,
  owners: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'charactersSchema'
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categoriesSchema'
  }],
  value: Number,
  quantity: Number,
  desc: String,
  image: String
});

const eventsSchema = new Schema({
  isSelected: Boolean,
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: String,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'placesSchema'
  },
  date: Date,
  notable_characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'charactersSchema'
  }],
  history: String,
  image: String
});

//CHARACTER SUB-SCHEMAS

const ethnicitySchema = new Schema ({
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  }
});

const nationalitySchema = new Schema({
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  }
});

const genderSchema = new Schema ({
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  }
});

const speciesSchema = new Schema ({
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  }
})

//PLACES SUB-SCHEMA
const attractionsSchema = new Schema({
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: {
    type: String,
    required: true,
    trim: true,
  }
});

//ITEM SUB-SCHEMA
const categoriesSchema = new Schema ({
  world_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worldSchema'
  },
  name: {
    type: String,
    required: true,
    trim: true,
  }
});

//COLLECTIONS
const worlds = mongoose.model('world', worldSchema);
const characters = mongoose.model('characters', charactersSchema);
const places = mongoose.model('places', placesSchema);
const items = mongoose.model('items', itemsSchema);
const events = mongoose.model('events', eventsSchema);

//Character Collections
const ethnicity = mongoose.model('ethnicity', ethnicitySchema);
const nationality = mongoose.model('nationality', nationalitySchema);
const gender = mongoose.model('gender', genderSchema);
const species = mongoose.model('species', speciesSchema);

//Place Collections
const attractions = mongoose.model('attractions', attractionsSchema);

//Item Collections
const categories = mongoose.model('categories', categoriesSchema);

//Entity Models
const entityModels = {
  worlds: worlds,
  characters: characters,
  places: places,
  items: items,
  events: events,
  nationality: nationality,
  ethnicity: ethnicity,
  gender: gender,
  species: species,
  attractions: attractions,
  categories: categories
};

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

//Clean-Up
app.delete('/api/cleanup', async (_,res) => {
  let isReferenced;
  
  try {
  const entityModels = [nationality, ethnicity, gender, species, attractions, categories];

    for (let i = 0; i < entityModels.length; i++) {
      const allEntities = await entityModels[i].find().exec();

      for (const entity of allEntities) {
        const entityId  = entity._id.toString();
        
        switch(entityModels[i]) {

          //CHARACTERS ENTITIES
          case nationality:
            isReferenced = await characters.findOne({ nationality : entityId }).exec();
            break;
          case ethnicity:
            isReferenced = await characters.findOne({ ethnicity : entityId }).exec();
            break;
          case gender:
            isReferenced = await characters.findOne({ gender : entityId }).exec();
            break;
          case species:
            isReferenced = await characters.findOne({ species : entityId }).exec();
            break;

          //PLACES ENTITIES
          case attractions:
            isReferenced = await places.findOne({ attractions : entityId }).exec();
            break;

          //EVENTS ENTITIES
          case categories:
            isReferenced = await places.findOne({ attractions : entityId }).exec();
            break;

        }

      if(!isReferenced) {
        await entityModels[i].findByIdAndDelete( entityId );
      }
    }

  }
  res.sendStatus(204);

  } catch (error) {
    console.error(`Error deleting unsused subentiies`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//World Clean-Up
app.delete('/api/cleanup/:worldId', async (req, res) => {
  const { worldId } = req.params;

  try {
    await Promise.all([
      characters.deleteMany({ world_id: worldId }),
      places.deleteMany({ world_id: worldId }),
      items.deleteMany({ world_id: worldId }),
      events.deleteMany({ world_id: worldId })
    ]);

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting world's associated entities:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Return 
app.get('/api/:entity', async (req, res) => {
  const { entity } = req.params;

  if (!entityModels[entity]){
    return res.status(404).json({ error: "Entity not found"})
  }
  try {

    const allEntities = await entityModels[entity].find().exec();
    
    const reverseEntities = allEntities.reverse();
    
    res.json(reverseEntities);

  } 
  
  catch (error) {
    console.error(`Error retrieving ${entity} in backend:`, error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});


// Add 
app.post('/api/:entity/add', async (req, res) => {
  const { entity } = req.params;

  if (!entityModels[entity]){
    return res.status(404).json({ error: "Entity not found"})
  }
  try {
    const newEntity = req.body;
    const {name, world_id} = newEntity

    const existingEnitiy = await entityModels[entity].findOne({ name: name, world_id:world_id}).exec();

    if (existingEnitiy){
    return res.json(existingEnitiy);}
    
    const createdEntity = await entityModels[entity].create(newEntity);
    res.json(createdEntity);
  }
  
  catch (error) {
    console.error(`Error creating ${entity}:`, error);
    res.status(500).json({ error: 'Internal Server Adding Error' });
  }
});


// Delete 
app.delete('/api/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;

  if (!entityModels[entity]){
    return res.status(404).json({ error: "Entity not found"})
  }

  try {
    const objectId = new mongoose.Types.ObjectId(id);
    await entityModels[entity].deleteOne({ _id: objectId });
    res.sendStatus(204);
  } 
  
  catch (error) {
    console.error(`Error deleting ${entity}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update 
app.put('/api/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const updatedData = req.body;

  if (!entityModels[entity]){
    return res.status(404).json({ error: "Entity not found"})
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const objectId = new mongoose.Types.ObjectId(id);

    const updatedEntity = await entityModels[entity].findOneAndUpdate(
      { _id: objectId },
      updatedData,
      { new: true }
    );

    if (!updatedEntity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    res.json(updatedEntity);
  } catch (error) {
    console.error(`Error updating ${entity}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Select 
app.put('/api/:entity/select/:id', async (req, res) => {
  const { entity, id } = req.params;

  if (!entityModels[entity]){
    return res.status(404).json({ error: "Entity not found"})
  }

  try {
    const objectId = new mongoose.Types.ObjectId(id);

    //Unselect any entity
    await entityModels[entity].updateMany( 
      {isSelected: true}, 
      {$set: { isSelected: false }}
    );
    
    //Select current entity
    const updatedEntity = await entityModels[entity].findByIdAndUpdate(
      objectId ,
      { $set: { isSelected: true}},
      { new: true }
    );


    if (!updatedEntity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    res.json(updatedEntity);
  } catch (error) {
    console.error(`Error updating ${entity}:`, error);
    res.status(500).json({ error: 'Internal Server Updating Error' });
  }
});

// Return Select
app.get('/api/:entity/selected', async (req, res) => {
  const { entity } = req.params;

  if (!entityModels[entity]){
    return res.status(404).json({ error: "Entity not found"})
  }
  
  try {
    const selectedEntity = await entityModels[entity].findOne({ isSelected: true });
    
    if (!selectedEntity) {
      return res.status(404).json({ error: `No selected ${ entity } found` });
    }
    
    res.json(selectedEntity);
  } catch (error) {
    console.error(`Error fetching selected ${ entity }:`, error);
    res.status(500).json({ error: 'Internal Server Retriving Error' });
  }
});

// Select Next
app.put('/api/:entity/select/next/:id', async (req, res) => {
  const { entity, id } = req.params;

  if (!entityModels[entity]){
    return res.status(404).json({ error: "Entity not found"})
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const objectId = new mongoose.Types.ObjectId(id);

    const currentEntity = await entityModels[entity].findById(objectId);

    if (!currentEntity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const nextEntity = await entityModels[entity].findOne({ _id: { $gt: objectId } }).sort({ _id: 1 }).limit(1);

    if (nextEntity) {
      await entityModels[entity].updateOne({ _id: objectId }, { $set: { isSelected: false } });
      await entityModels[entity].updateOne({ _id: nextEntity._id }, { $set: { isSelected: true } });

      res.json(nextEntity);
    }
    else {
      const nextEntity = await entityModels[entity].findOne({ _id: { $lt: objectId } }).sort({ _id: -1 }).limit(1);
      
      if(nextEntity) {
        await entityModels[entity].updateOne({ _id: objectId }, { $set: { isSelected: false } });
        await entityModels[entity].updateOne({ _id: nextEntity._id }, { $set: { isSelected: true } });
        
        res.json(nextEntity);
      }
      else {
        res.json({ message: `No next ${entity} found` });
      }
    } 
  } catch (error) {
    console.error(`Error selecting next ${entity}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Grab
app.get('/api/:entity/grab/:id', async (req, res) => {
  const { entity, id } = req.params;

  if (!entityModels[entity]){
    return res.status(404).json({ error: "Entity not found"})
  }
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const objectId = new mongoose.Types.ObjectId(id);
    
    const entitiesByWorldId = await entityModels[entity].find({ world_id: objectId }).exec();
    const entityById = await entityModels[entity].findById(objectId).exec();

    if (entitiesByWorldId.length > 0) {
      res.json(entitiesByWorldId);
    } else if (entityById) {
      res.json(entityById);
    } else {
      return res.status(404).json({ error: `No ${ entity } found` });
    }
  } 
  
  catch (error) {
    console.error(`Error fetching ${ entity }:`, error);
    res.status(500).json({ error: 'Internal Server Retrieving Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});