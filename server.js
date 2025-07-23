<<<<<<< HEAD
const express = require('express');
const path = require('path');
const fs = require('fs');
=======
const express = require("express");
const fs = require("fs");
const path = require("path");
>>>>>>> 57ead0b (update)

const app = express();
const PORT = 3000;

app.use(express.static("public"));

function getImageFilesRecursively(dir, baseUrl = "") {
  let results = [];

  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(
        getImageFilesRecursively(filePath, path.join(baseUrl, file))
      );
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
      results.push(`/Images/${baseUrl}/${file}`);
    }
  });

  return results;
}

app.get("/api/images/:category", (req, res) => {
  const category = req.params.category;
  const folderPath = path.join(__dirname, "public", "Images", category);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ error: "Category not found" });
  }

  const images = getImageFilesRecursively(folderPath, category);
  res.json(images);
});

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
  console.log(`Server is running at http://localhost:${PORT}`);
});
