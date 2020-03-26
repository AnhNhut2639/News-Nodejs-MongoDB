var userModel = require("../model/usersModel");
var jwt = require("jsonwebtoken");
module.exports.checkCookies = async function(req, res, next) {
  // if (!req.signedCookies.ID) {
  //
  //   return;
  // }

  const result = jwt.decode(req.cookies.ID, process.env.SECRET_KEY);
  if (result) {
    let id = result.payload.id;
    const user = await userModel.findOne({ id });
    res.locals.user = user;
    // console.log(user);
    next();
  } else {
    res.redirect("/login");
  }
};
