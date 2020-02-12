var userModel = require("../model/usersModel");
module.exports.checkCookies = async function(req, res, next) {
  if (!req.signedCookies.ID) {
    res.redirect("/login");
    return;
  }
  let id = req.signedCookies.ID;
  const user = await userModel.findOne({ id });
  res.locals.user = user;
  // console.log(user);
  next();
};
