var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");

function admin(req, res) {
  //console.log(res.locals.user.username);
  // var username = res.locals.user.username; // từ middleware checkCookie sang
  return res.render("admin", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminApprove(req, res) {
  return res.render("admin-approve", {
    layout: "admin",
    username: res.locals.user.username
  });
}
async function adminType(req, res) {
  var type = await typesModel.find({});
  //console.log(type);
  return res.render("admin-type", {
    layout: "admin",
    username: res.locals.user.username, //load dữ liệu lên trang thể loại và chủ đề
    types: type
  });
}
async function adminAddType(req, res) {
  var idType = "1f1ce022-4e66-4f97-a03a-3f64b7c60f8b";
  // const theme = await themesModel.findOne({idType});
  typesModel.create({
    tenTheLoai: req.body.addType
  });

  themesModel.create({
    tenChuDe: req.body.addTheme,
    idTheLoai: idType
  });

  return res.redirect("/admin/type");
}

function adminProfile(req, res) {
  return res.render("admin-profile", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminAccount(req, res) {
  return res.render("admin-account", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminRegister(req, res) {
  return res.render("admin-register", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminChangePass(req, res) {
  return res.render("admin-changePass", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminAdvertise(req, res) {
  return res.render("admin-advertise", {
    layout: "admin",
    username: res.locals.user.username
  });
}
function adminBanner(req, res) {
  return res.render("admin-banner", {
    layout: "admin",
    username: res.locals.user.username
  });
}

module.exports = {
  admin,
  adminApprove,
  adminType,
  adminProfile,
  adminAccount,
  adminRegister,
  adminChangePass,
  adminAdvertise,
  adminBanner,
  adminAddType
};
