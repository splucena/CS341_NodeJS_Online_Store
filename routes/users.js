const express = require('express');

const router = express.Router();

const pg = require('pg');

const config = {
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT,
};

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/getUsers', (req, res) => {
	pool.connect((errcon, client) => {
		client.query('SELECT * FROM users', (errqry, result) => {
			res.send({
				users: result.rows,
			});
		});
	});
});

// Users
// get and display all users
console.log(1);
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
				users: result.rows,
			});
		});
	});
});

router.post('/user/save', (req, res, next) => {
	pool.connect((errcon, client, done) => {
		if (errcon) {
			return console.error('Error fetching client from pool.', errcon);
		}

		const user = {};
		user.first_name = req.body.first_name;
		user.last_name = req.body.last_name;
		user.username = req.body.username;

		const qry = `INSERT INTO users (username, first_name, last_name) VALUES('${user.username}', '${user.first_name}', '${user.last_name}') returning user_id`;
		client.query(qry, (errres, result) => {
			done();

			if (errres) {
				return console.error('Error running query. ', errres);
			}

			console.log(result);
			user.result = result;
			user.user_id = result.rows[0].user_id;

			return res.send(user);
		});

		return null;
	});
});

router.put('/user/:id', (req, res, next) => {
	pool.connect((errcon, client, done) => {
		if (errcon) {
			return console.error('Error fetching client from pool.', errcon);
		}

		const user = {};
		user.first_name = req.body.first_name;
		user.last_name = req.body.last_name;
		user.username = req.body.username;
		user.user_id = req.params.id;

		const qry = `UPDATE users 
                  SET username = '${user.username}', 
                      first_name = '${user.first_name}', 
                      last_name = '${user.last_name}' 
                WHERE user_id = ${user.user_id}`;
		client.query(qry, (errres, result) => {
			done();

			if (errres) {
				return console.error('Error running query. ', errres);
			}
			user.result = result;

			return res.send(user);
		});

		return null;
	});
});

router.delete('/user/:id', (req, res, next) => {
	pool.connect((errcon, client, done) => {
		if (errcon) {
			return console.error('Error fetching client from pool.', errcon);
		}

		const user = {};
		user.user_id = req.params.id;

		const qry = `DELETE FROM users 
                WHERE user_id = ${user.user_id}`;
		client.query(qry, (errres, result) => {
			done();

			if (errres) {
				return console.error('Error running query. ', errres);
			}
			user.result = result;

			return res.send(user);
		});

		return null;
	});
});

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('pages/index', {
		title: 'Express',
	});
});

module.exports = router;