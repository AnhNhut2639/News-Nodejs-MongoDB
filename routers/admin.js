const express = require("express");
const controllers = require("../controllers");
var multer = require("multer");
var upload = multer({ dest: "./public/uploads/" });

const adminRouter = express.Router();
adminRouter.get("/", controllers.admin.admin);
adminRouter.get("/approve", controllers.admin.adminApprove);
adminRouter.get("/type", controllers.admin.adminType);
adminRouter.post("/type", controllers.admin.adminAddType);
adminRouter.get("/theme", controllers.admin.adminTheme);
adminRouter.post("/theme", controllers.admin.adminAddThemes);
adminRouter.get("/profile", controllers.admin.adminProfile);
adminRouter.post("/profile", controllers.admin.adminUpdateProfile);
adminRouter.get("/account", controllers.admin.adminAccount);
adminRouter.get("/register", controllers.admin.adminRegister);
adminRouter.post("/register", controllers.admin.adminAddAccount);
adminRouter.get("/changepass", controllers.admin.adminChangePass);
adminRouter.post("/changepass", controllers.admin.adminChange);
adminRouter.get("/advertise", controllers.admin.adminAdvertise);
adminRouter.post(
  "/advertise",
  upload.single("advertise"),
  controllers.admin.adminAddAdvertise
);

adminRouter.get("/banner", controllers.admin.adminBanner);
adminRouter.post(
  "/banner",
  upload.single("banner"),
  controllers.admin.adminAddBanner
);
module.exports = adminRouter;
