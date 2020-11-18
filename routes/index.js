const express = require('express');

const router = express.Router();


/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('pages/index', {
		title: 'SRP Online Store',
	});
});

module.exports = router;