var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin.controller');


router.get('/create',adminController.adminCreate);
router.get('/',adminController.manager);

module.exports = router;