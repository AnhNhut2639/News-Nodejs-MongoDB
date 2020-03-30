var userModel = require("../model/usersModel");
var jwt = require("jsonwebtoken");

module.exports.checkWasLogin = async function(req, res, next) {
  const token = jwt.decode(req.cookies.ID, process.env.SECRET_KEY);
  if (token) {
    let id = token.payload.id;
    const user = await userModel.findOne({ id });
    if (user.PQ == "admin") {
      res.redirect("/admin");
    }
    if (user.PQ == "editor") {
      res.redirect("/editor");
    }
  } else {
    next();
  }
};
