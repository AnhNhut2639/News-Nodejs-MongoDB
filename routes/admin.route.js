var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin.controller');
var middlewareLogin = require('../middlewares/checkLogin.middleware');
var controller = require('../controllers/auth.controller');

router.get('/create',controller.adminCreate);
router.get('/',middlewareLogin.checkLogin,controller.manager);
router.post('/login',controller.postLogin);

module.exports = router;