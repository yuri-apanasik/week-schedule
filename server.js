const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static(path.join(__dirname, '/dist/week-schedule')));

app.get('/*', (req, res) => {
  res.sendFile('/dist/week-schedule/index.html', { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Application started at http://localhost:${PORT}`)
});
