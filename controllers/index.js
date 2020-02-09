const webController = require("./web");
const adminController = require("./admin");
const editorController = require("./editor");
const loginController = require("./login");

module.exports = {
  admin: adminController,
  editor: editorController,
  web: webController,
  login: loginController
};
