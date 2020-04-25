var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");
var newsModel = require("../model/newsModel");

module.exports.validateRegister = async function(req, res, next) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  var cmnd = req.body.CMND;
  var erorrs = [];
  if (!req.body.fullName) {
    erorrs.push({ error: "Tên không được bỏ trống" });
  }
  if (!req.body.phone) {
    erorrs.push({ error: "Số điện thoại không được bỏ trống" });
  }
  if (!req.body.email) {
    erorrs.push({ error: "Email không được bỏ trống" });
  }
  if (!req.body.checkedGender) {
    erorrs.push({ error: "Giới tính không được bỏ trống" });
  }
  if (!cmnd) {
    erorrs.push({ error: "CMND không được bỏ trống" });
  }
  if (cmnd.length > 0 && cmnd.length < 9) {
    erorrs.push({ error: "Vui nhập CMND 9 chữ số" });
  }
  if (!req.body.permission) {
    erorrs.push({ error: "Vui lòng phân quyền cho tài khoản" });
  }
  if (!req.body.bday) {
    erorrs.push({ error: "Ngày sinh không được bỏ trống" });
  }
  console.log(req.body);
  if (erorrs.length) {
    res.render("admin-register", {
      layout: "admin",
      erorrs: erorrs,
      values: [req.body],
      fullname: res.locals.user.tenDayDu,
      newsCount: newsCount,
      usersCount: usersCount,
      typesCount: typesCount,
      themesCount: themesCount
    });
    return;
  }

  next();
};
