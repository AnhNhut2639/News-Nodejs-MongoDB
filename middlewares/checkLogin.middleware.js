var userModel = require("../model/usersModel");
module.exports.checkLogin = async function(req, res, next) {
  if (!req.signedCookies.ID) {
    return res.redirect("/login");
  }
  var id = req.signedCookies.ID;
  const user = await userModel.findOne({ id });
  // console.log(user);
  //console.log(req.signedCookies.ID);
  //res.locals.userN = user;
  //console.log(userN);
  // if (!req.cookies.ID) {
  //   return res.redirect("/login");
  // }

  next();
};
