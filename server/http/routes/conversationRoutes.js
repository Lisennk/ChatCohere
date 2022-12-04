const router = require('express').Router();

const ResponseController = require('../controllers/ResponseController');
router.route('/response/create').post((req, res) => ResponseController.create(req, res));

module.exports = router;