var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");

function admin(req, res) {
  //console.log(res.locals.user.username);
  // var username = res.locals.user.username; // từ middleware checkCookie sang
  return res.render("admin", {
    layout: "admin",
    username: res.locals.user.tenDayDu
  });
}

function adminApprove(req, res) {
  // console.log(res.locals.user.tenDayDu);
  return res.render("admin-approve", {
    layout: "admin",
    username: res.locals.user.tenDayDu
  });
}
async function adminType(req, res) {
  var type = await typesModel.find({});
  //console.log(type);
  return res.render("admin-type", {
    layout: "admin",
    username: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
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
    username: res.locals.user.tenDayDu
  });
}

function adminAccount(req, res) {
  return res.render("admin-account", {
    layout: "admin",
    username: res.locals.user.tenDayDu
  });
}

function adminRegister(req, res) {
  return res.render("admin-register", {
    layout: "admin",
    username: res.locals.user.tenDayDu
  });
}

function adminAddAccount(req, res) {
  usersModel.create({
    username: req.body.userName,
    password: req.body.passWord,
    sdt: req.body.phone,
    email: req.body.email,
    tenDayDu: req.body.fullName,
    ngaySinh: req.body.bday,
    gioiTinh: req.body.checkedGender,
    cmnd: req.body.CMND,
    idNguoiTao: res.locals.user.id,
    PQ: req.body.permission
  });
  res.redirect("/admin/register");
}

function adminChangePass(req, res) {
  return res.render("admin-changePass", {
    layout: "admin",
    username: res.locals.user.tenDayDu
  });
}
async function adminChange(req, res) {
  let id = res.locals.user.id;
  let currentPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let confirmNewPassword = req.body.confirmNewPassword;
  let condition = { id: id };
  let query = { $set: { password: confirmNewPassword } };
  let username = res.locals.user.username;

  const user = await usersModel.findOne({ id });

  if (user) {
    if (await user.comparePassword(currentPassword)) {
      //check new match password
      if (newPassword != confirmNewPassword) {
        return res.render("admin-changePass", {
          layout: "admin",
          username: res.locals.user.tenDayDu,
          errConfirm: "Mật khẩu không trùng khớp"
        });
      }
      user.password = confirmNewPassword;
      await user.save();
    } else {
      return res.render("admin-changePass", {
        layout: "admin",
        username: res.locals.user.tenDayDu,
        err: "Mật khẩu cu không chính xác"
      });
    }
  }

  // if (user) {
  //   if (await user.comparePassword(currentPassword)) {
  //     if (newPassword === confirmNewPassword) {
  //       console.log(user);
  //       user.updateOne({ id: user.id }, { password: confirmNewPassword });
  //       await user.save();
  //       // usersModel.updateOne(condition, query, function(err, res) {
  //       //   if (err) throw err;
  //       // });
  //       res.redirect("/admin");
  //     }
  //   }
  // }

  // chuyen password hien tai sang brcypt
  //sau do so sanh currentPassword vs res.locals.user.password
}

function adminAdvertise(req, res) {
  return res.render("admin-advertise", {
    layout: "admin",
    username: res.locals.user.tenDayDu
  });
}
function adminBanner(req, res) {
  return res.render("admin-banner", {
    layout: "admin",
    username: res.locals.user.tenDayDu
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
  adminAddType,
  adminAddAccount,
  adminChange
};
