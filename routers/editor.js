const express = require("express");
const controllers = require("../controllers");

const editorRouter = express.Router();
editorRouter.get("/", controllers.editor.editor);
editorRouter.get("/newPost", controllers.editor.editorNewPost);
//editorRouter.post("/newPost", controllers.editor.editorWriteNews);
editorRouter.get("/posted", controllers.editor.editorPosted);
editorRouter.get("/profile", controllers.editor.editorProfile);
editorRouter.get("/changePass", controllers.editor.editorChangePass);
editorRouter.post("/changePass", controllers.editor.editorChangePassword);

module.exports = editorRouter;
