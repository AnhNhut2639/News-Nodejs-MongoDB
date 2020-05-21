const express = require("express");
const controllers = require("../controllers");
const LoginRouter = express.Router();

LoginRouter.get("/", controllers.login.login);
LoginRouter.post("/", controllers.login.authLogin);

LoginRouter.get("/forgot", controllers.login.forgotPassword);
LoginRouter.post("/forgot", controllers.login.confirm);

LoginRouter.post("/certainity", controllers.login.certainity);
LoginRouter.post("/changepass", controllers.login.changepass);
module.exports = LoginRouter;
