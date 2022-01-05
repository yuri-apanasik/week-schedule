const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'fptuuphhqvwjcu',
  host: 'ec2-54-76-249-45.eu-west-1.compute.amazonaws.com',
  database: 'd5th7ubf13nq62',
  password: '9ce0c276121adb87977104e2d5b7881a03099aacd347255178d27e39d94d8245',
  port: 5432,
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

const createYearData = (request, response) => {
  const { year, data } = request.body;
  pool.query('INSERT INTO years (year, data) VALUES ($1, $2)', [year, data], (error, result) => {
    if (error) { throw error; }
    response.status(201).send(`Data saved for year: ${result.insertId}`);
  });
}

const saveYearData = (request, response) => {
  const { year, data } = request.body;
  pool.query('INSERT INTO years (year, data) VALUES ($1, $2)', [year, data], (error, result) => {
    if (error) {
      pool.query('UPDATE years SET data = $2 WHERE year = $1', [year, data], error => {
        if (error) { throw error; }
        response.status(200).send(`Data saved for year: ${year}`);
      });
    } else {
      response.status(201).send(`Data saved for year: ${year}`);
    }
  });
}

module.exports = {
  getAllData,
  getYearData,
  saveYearData,
  createYearData,
};
