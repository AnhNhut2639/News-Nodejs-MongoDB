const express = require("express");
const controllers = require("../controllers");

const adminRouter = express.Router();
adminRouter.get("/", controllers.admin.admin);
adminRouter.get("/approve", controllers.admin.adminApprove);
adminRouter.get("/type", controllers.admin.adminType);
adminRouter.get("/profile", controllers.admin.adminProfile);
adminRouter.get("/account", controllers.admin.adminAccount);
adminRouter.get("/register", controllers.admin.adminRegister);
adminRouter.get("/changepass", controllers.admin.adminChangePass);
adminRouter.get("/advertise", controllers.admin.adminAdvertise);
adminRouter.get("/banner", controllers.admin.adminBanner);

module.exports = adminRouter;
