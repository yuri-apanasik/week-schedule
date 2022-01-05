const Pool = require('pg').Pool;
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: 5432,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getAllData = (request, response) => {
  pool.query('SELECT * FROM years ORDER BY year ASC', (error, result) => {
    if (error) { throw error; }
    response.status(200).json(result.rows);
  });
}

const getYearData = (request, response) => {
  const year = parseInt(request.params.year);
  pool.query('SELECT * FROM years WHERE year = $1', [year], (error, result) => {
    if (error) { throw error; }
    response.status(200).json(result.rows);
  });
}

const saveYearData = (request, response) => {
  const { year, data } = request.body;
  pool.query('INSERT INTO years (year, data) VALUES ($1, $2)', [year, data], (error, result) => {
    if (error) {
      pool.query('UPDATE years SET data = $2 WHERE year = $1', [year, data], error => {
        if (error) { throw error; }
        response.status(200).send({ status: 200 });
      });
    } else {
      response.status(201).send({ status: 201 });
    }
  });
}

module.exports = {
  getAllData,
  getYearData,
  saveYearData,
};
