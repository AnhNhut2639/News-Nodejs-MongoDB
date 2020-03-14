const express = require("express");
const controllers = require("../controllers");

const editorRouter = express.Router();
editorRouter.get("/", controllers.editor.editor);
editorRouter.get("/newPost", controllers.editor.editorNewPost);
editorRouter.post(
  "/newPost",
  controllers.editor.editorWriteNews,
  controllers.editor.sendmail
);

editorRouter.get("/getTheme/:id", controllers.editor.getIDtypes);
editorRouter.get("/posted", controllers.editor.editorPosted);
editorRouter.get("/profile", controllers.editor.editorProfile);
editorRouter.post("/profile", controllers.editor.editorUpdateProfile);
editorRouter.get("/changePass", controllers.editor.editorChangePass);
editorRouter.post("/changePass", controllers.editor.editorChangePassword);

editorRouter.get("/wait", controllers.editor.waitingAprrove);
editorRouter.get("/denied", controllers.editor.deniedPost);
editorRouter.get("/:id", controllers.editor.readNews);
editorRouter.get("/wait/:id", controllers.editor.waitNews);
editorRouter.get("/denied/:id", controllers.editor.deniedNews);
module.exports = editorRouter;
