const WebRouter = require("./web");
const AdminRouter = require("./admin");
const EditorRouter = require("./editor");
const LoginRouter = require("./login");

module.exports = {
  web: WebRouter,
  admin: AdminRouter,
  editor: EditorRouter,
  login: LoginRouter
};
