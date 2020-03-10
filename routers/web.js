const express = require("express");
const controllers = require("../controllers");

const WebRouter = express.Router();
WebRouter.get("/", controllers.web.home);
WebRouter.get("/news/:id", controllers.web.readNews);
WebRouter.post("/news/:id", controllers.web.comment);
WebRouter.get("/post", controllers.web.post);
WebRouter.get("/logout", controllers.web.logout);

module.exports = WebRouter;
