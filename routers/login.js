const express = require("express");
const controllers = require("../controllers");
const LoginRouter = express.Router();

LoginRouter.get("/", controllers.login.login);
module.exports = LoginRouter;
