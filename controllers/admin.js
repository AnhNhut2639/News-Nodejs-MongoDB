var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");

function admin(req, res) {
  //console.log(res.locals.user.username);
  // var username = res.locals.user.username; // từ middleware checkCookie sang
  return res.render("admin", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu
  });
}

function adminApprove(req, res) {
  // console.log(res.locals.user.tenDayDu);
  return res.render("admin-approve", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu
  });
}
async function adminType(req, res) {
  let type = await typesModel.find({});
  //console.log(theme);
  function Types(arr) {
    let array = [];
    for (let type of arr) {
      array.push(type.tenTheLoai);
    }
    return array;
  }
  let nameOfTypes = Types(type);

  return res.render("admin-type", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    types: nameOfTypes,
    title: "Thể Loại và Chủ Đề"
  });
}
async function adminAddType(req, res) {
  typesModel.create({
    tenTheLoai: req.body.addType
  });

  return res.redirect("/admin/type");
}

async function adminTheme(req, res) {
  let theme = await themesModel.find({});
  let type = await typesModel.find({});
  function Types(arr) {
    let array = [];
    for (let type of arr) {
      array.push(type.tenTheLoai);
    }
    return array;
  }
  let nameOfTypes = Types(type);
  function Themes(arr) {
    let array = [];
    for (let type of arr) {
      array.push(type.tenChuDe);
    }
    return array;
  }
  let nameOfThemes = Themes(theme);

  return res.render("admin-theme", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    themes: nameOfThemes,
    types: nameOfTypes,
    title: "Chủ Đề"
  });
}

async function adminAddThemes(req, res) {
  let name = req.body.typeSelected;
  let type = await typesModel.findOne({ tenTheLoai: name });

  themesModel.create({
    tenChuDe: req.body.addTheme,
    idTheLoai: type.idTheLoai
  });

  res.redirect("/admin/theme");
}

function adminProfile(req, res) {
  let gender = res.locals.user.gioiTinh;
  let DOB = res.locals.user.ngaySinh;
  let cmnd = res.locals.user.cmnd;
  let email = res.locals.user.email;
  let sdt = res.locals.user.sdt;

  return res.render("admin-profile", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    genders: gender,
    DOB: DOB,
    cmnd: cmnd,
    phone: sdt,
    email: email
  });
}

async function adminUpdateProfile(req, res) {
  let id = res.locals.user.id;
  let email = req.body.email;
  let sdt = req.body.phone;

  await usersModel.updateOne({ id: id }, { $set: { email: email, sdt: sdt } });

  res.redirect("/admin/profile");
}

function adminAccount(req, res) {
  return res.render("admin-account", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu
  });
}

function adminRegister(req, res) {
  return res.render("admin-register", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu
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
    fullname: res.locals.user.tenDayDu
  });
}
async function adminChange(req, res) {
  let id = res.locals.user.id;
  let currentPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let confirmNewPassword = req.body.confirmNewPassword;
  const user = await usersModel.findOne({ id });

  if (user) {
    if (await user.comparePassword(currentPassword)) {
      if (newPassword != confirmNewPassword) {
        return res.render("admin-changePass", {
          layout: "admin",
          fullname: res.locals.user.tenDayDu,
          errConfirm: "Mật khẩu không trùng khớp"
        });
      }
      user.password = confirmNewPassword;
      await user.save();
      return res.render("admin-changePass", {
        layout: "admin",
        fullname: res.locals.user.tenDayDu,
        success: "Đổi Mật Khẩu Thành Công"
      });
    } else {
      return res.render("admin-changePass", {
        layout: "admin",
        fullname: res.locals.user.tenDayDu,
        err: "Mật khẩu cũ không chính xác"
      });
    }
  }
}

function adminAdvertise(req, res) {
  return res.render("admin-advertise", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu
  });
}
function adminBanner(req, res) {
  return res.render("admin-banner", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu
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
  adminChange,
  adminUpdateProfile,
  adminTheme,
  adminAddThemes
};
