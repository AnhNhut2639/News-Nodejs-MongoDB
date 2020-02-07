const express = require("express");
const controllers = require("../controllers");

const adminRouter = express.Router();
adminRouter.get("/", controllers);

module.exports = adminRouter;
