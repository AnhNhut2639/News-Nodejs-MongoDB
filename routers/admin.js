const express = require("express");
const controllers = require("../controllers");

const adminRouter = express.Router();
adminRouter.get("/", controllers.admin.admin);
adminRouter.get("/approve", controllers.admin.adminApprove);

module.exports = adminRouter;
