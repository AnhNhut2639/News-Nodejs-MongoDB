const express = require("express");
const controllers = require("../controllers");

const WebRouter = express.Router();
WebRouter.get("/", controllers.web.home);
WebRouter.get("/page/:page", controllers.web.pagination);

WebRouter.get("/news/:id", controllers.web.readNews);
WebRouter.get("/news/:id/comments", controllers.web.getComments);
WebRouter.get("/types/:id", controllers.web.getTypes);
WebRouter.post("/news/:id", controllers.web.comment);
WebRouter.get("/post", controllers.web.post);
WebRouter.get("/logout", controllers.web.logout);

WebRouter.get("/search", controllers.web.search);

module.exports = WebRouter;
