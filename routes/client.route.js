var express = require('express');
var router = express.Router();
var clientControllers = require('../controllers/client.controller');

router.get('/',clientControllers.index);


module.exports = router;