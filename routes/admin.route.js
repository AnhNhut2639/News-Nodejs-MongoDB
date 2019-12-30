var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin.controller');

var controller = require('../controllers/auth.controller');

router.get('/create',adminController.adminCreate);
router.get('/',adminController.manager);
//router.post('/',adminController.);

module.exports = router;