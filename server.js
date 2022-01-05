const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./data-server/queries');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/dist/week-schedule')));

app.get('/api/years', db.getAllData);
app.get('/api/years/:year', db.getYearData);
app.post('/api/years', db.saveYearData);

app.get('/*', (req, res) => {
  res.sendFile('/dist/week-schedule/index.html', { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Application started at http://localhost:${PORT}`)
});
