const express = require('express');

const router = express.Router();

const pg = require('pg');

const config = {
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
}

const pool = new pg.Pool(config);

console.log(config);

// Users
// get all users

router.get('/users', (req, res, next) => {
  pool.connect((errcon, client, done) => {
    if (errcon) {
      return console.error('Error fetching client from pool.', errcon);
    }
    client.query('SELECT * FROM users', (errqry, result) => {
      if (errqry) {
        return console.error('Error running query.', errqry);
      }
      res.render('pages/users', {
        title: 'Users',
        users: result.rows
      })
    });
  });
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('pages/index', {
    title: 'Express',
  });
});

module.exports = router;