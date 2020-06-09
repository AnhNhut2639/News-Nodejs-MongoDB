const express = require("express");
const controllers = require("../controllers");
var multer = require("multer");
var validate = require("../validate/validate.register");
var validateDelete = require("../validate/validate.deleteTheme");
// var upload = multer({ dest: "./public/uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const adminRouter = express.Router();
adminRouter.get("/", controllers.admin.admin);

adminRouter.get("/writeNews", controllers.admin.adminNewPost);
adminRouter.post(
  "/writeNews",
  controllers.admin.adminWriteNews,
  controllers.admin.sendmail
);
adminRouter.get("/getTheme/:id", controllers.admin.getIDtypes);
adminRouter.get("/approve", controllers.admin.adminApprove);
adminRouter.get(
  "/approve/:id",
  controllers.admin.approvePost,
  controllers.admin.approveMail
);

adminRouter.get(
  "/deny/:id",
  controllers.admin.denyPost,
  controllers.admin.denyMail
);

adminRouter.get("/type", controllers.admin.adminType);
adminRouter.get("/type/search", controllers.admin.searchType);
adminRouter.get("/posted", controllers.admin.adminPosted);
adminRouter.get("/posted/search", controllers.admin.search);
adminRouter.post("/type", controllers.admin.adminAddType);
adminRouter.get("/theme", controllers.admin.adminTheme);
adminRouter.get("/theme/search", controllers.admin.searchTheme);
adminRouter.post(
  "/theme",
  upload.single("avatarTheme"),
  controllers.admin.adminAddThemes
);

adminRouter.get("/profile", controllers.admin.adminProfile);
adminRouter.post("/profile", controllers.admin.adminUpdateProfile);
adminRouter.get("/account", controllers.admin.adminAccount);
adminRouter.get("/account/search", controllers.admin.searchAccount);
adminRouter.get("/register", controllers.admin.adminRegister);
adminRouter.post(
  "/register",
  validate.validateRegister,
  controllers.admin.adminAddAccount
);
adminRouter.get("/changepass", controllers.admin.adminChangePass);
adminRouter.get("/comments", controllers.admin.comment);
adminRouter.post("/changepass", controllers.admin.adminChange);
adminRouter.get("/advertise", controllers.admin.adminAdvertise);
adminRouter.get("/advertise/search", controllers.admin.searchAdvertise);
adminRouter.post(
  "/advertise",
  upload.single("advertise"),
  controllers.admin.adminAddAdvertise
);

adminRouter.get("/banner", controllers.admin.adminBanner);

adminRouter.get("/banner/search", controllers.admin.searchBanner);

adminRouter.post(
  "/banner",
  upload.single("banner"),
  controllers.admin.adminAddBanner
);

adminRouter.get("/:id", controllers.admin.readNews);

adminRouter.get(
  "/deleteTheme/:id",
  validateDelete.checkStillNews,
  controllers.admin.deleteThemes
);
adminRouter.get(
  "/deleteType/:id",
  validateDelete.checkStillThemes,
  controllers.admin.deleteTypes
);
adminRouter.get("/update/:id", controllers.admin.getTheme);
adminRouter.post(
  "/update/:id",
  upload.single("avatarChanged"),
  controllers.admin.updateTheme
);

adminRouter.get("/updateType/:id", controllers.admin.getType);
adminRouter.post("/updateType/:id", controllers.admin.updateType);
adminRouter.get("/deleteComment/:id", controllers.admin.deleteComment);
adminRouter.get("/posted/page/:page", controllers.admin.pagination);
adminRouter.get("/updateAdvertise/:id", controllers.admin.getAdvertise);
adminRouter.post("/updateAdvertise/:id", controllers.admin.updateAdvertise);
adminRouter.get(
  "/advertise/updateAdvertise/:id",
  controllers.admin.getAdvertise
);
adminRouter.post(
  "/advertise/updateAdvertise/:id",
  controllers.admin.updateAdvertise
);

adminRouter.get("/edit/:id", controllers.admin.editNews);
adminRouter.post("/edit/:id", controllers.admin.updateNews);
adminRouter.get("/deleteNews/:id", controllers.admin.deleteNews);
adminRouter.get("/deleteAdvertise/:id", controllers.admin.deleteAdvertise);
adminRouter.get("/deleteBanner/:id", controllers.admin.deleteBanner);
adminRouter.get("/admin/deleteBanner/:id", controllers.admin.deleteBanner);
adminRouter.get("/deleteAccount/:id", controllers.admin.deleteAccount);
adminRouter.get("/blockAccount/:id", controllers.admin.blockAccount);
adminRouter.get("/resetPassword/:id", controllers.admin.resetPassword);
adminRouter.get("/account/blockAccount/:id", controllers.admin.blockAccount);
adminRouter.get("/account/deleteAccount/:id", controllers.admin.deleteAccount);

adminRouter.get(
  "/unload/:id",
  controllers.admin.unload,
  controllers.admin.unloadMail
);
module.exports = adminRouter;
