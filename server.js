const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/livingroom-products', (req, res) => {
  const folderPath = path.join(__dirname, 'public', 'Images', 'living-room');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return res.status(500).json({ error: 'Unable to scan directory' });
    }

    const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    res.json(images);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
