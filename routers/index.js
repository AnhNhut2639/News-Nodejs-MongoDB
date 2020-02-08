const WebRouter = require("./web");
const AdminRouter = require("./admin");
const EditorRouter = require("./editor");

module.exports = {
  web: WebRouter,
  admin: AdminRouter,
  editor: EditorRouter
};
