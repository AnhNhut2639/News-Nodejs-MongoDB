const express = require("express");
const controllers = require("../controllers");

const WebRouter = express.Router();
WebRouter.get("/", controllers.web.home);
WebRouter.get("/:id", controllers.web.readNews);
WebRouter.get("/post", controllers.web.post);
WebRouter.get("/logout", controllers.web.logout);

module.exports = WebRouter;
