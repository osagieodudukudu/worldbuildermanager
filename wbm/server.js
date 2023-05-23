const express = require('express');
const app = express();
const PORT = 3000;

const worldsData = [
  { name: 'Codename: HERO1', desc: 'the world i made when i was in 10th grade.', profile: './src/assets/webtoonxavier.jpg', id: 1 },
  { name: 'Codename: HERO2', desc: 'the world i made when i was in 10th grade.', profile: './src/assets/webtoonxavier.jpg', id: 2 },
  { name: 'Codename: HERO3', desc: 'the world i made when i was in 10th grade.', profile: './src/assets/webtoonxavier.jpg', id: 3 }
];

app.get('/api/worlds', (req, res) => {
  res.json(worldsData);
});

app.post('/api/worlds/select', (req, res) => {
  const { id } = req.body;

  // Find the selected world based on the provided ID
  const selectedWorld = worlds.find(world => world.id === id);

  if (selectedWorld) {
    res.json(selectedWorld);
  } else {
    res.status(404).json({ error: 'World not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});