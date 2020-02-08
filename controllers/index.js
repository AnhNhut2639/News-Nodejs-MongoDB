const webController = require("./web");
const adminController = require("./admin");
const editorController = require("./editor");

module.exports = {
  admin: adminController,
  editor: editorController,
  web: webController
};
