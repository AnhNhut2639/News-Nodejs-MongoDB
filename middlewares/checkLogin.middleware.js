var userModel = require("../model/usersModel");
module.exports.checkLogin = function(req, res, next) {
  if (!req.signedCookies.ID) {
    return res.redirect("/login");
  }
  // let id = req.signedCookies.ID;

  // const user = userModel.findOne({ id });
  // res.locals.Name = user;
  next();
};
