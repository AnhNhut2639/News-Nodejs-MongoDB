var express = require('express');
//import express from 'express';
var router = express.Router();
var authController = require('../controllers/auth.controller.js');
//var validate = require('../validate/validate.city');

router.get('/',authController.requireLogin);
router.post('/',authController.postLogin); // đường dẫn trong action form để viết action trong form đăng nhập 

module.exports = router;