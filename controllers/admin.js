var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");
var bannersModel = require("../model/bannerModel");
var advertiseModel = require("../model/advertiseModel");
var newsModel = require("../model/newsModel");
var moment = require("moment");

function deleteSign(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str.toLowerCase().replace(/ /g, "+");
}

function getFirstImage(data) {
  let regex = /<img.*?src="(.*?)"/;
  data.forEach(item => (item.firstImage = regex.exec(item.noiDung)[1]));
  return data;
}
function admin(req, res) {
  return res.render("admin", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu
  });
}

async function adminApprove(req, res) {
  const news = await newsModel.find({ daDuyet: false, deny: false });
  var arr = getFirstImage(news);

  const data = arr.map(news => {
    return {
      title: news.tieuDe,
      abstract: news.trichYeu,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
      img: news.firstImage,
      id: news.id
    };
  });
  return res.render("admin-approve", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    data: data
  });
}
async function approvePost(req, res) {
  let id = req.params.id;
  await newsModel.updateOne({ id: id }, { $set: { daDuyet: true } });

  res.redirect("/admin/approve");
}

async function denyPost(req, res) {
  let id = req.params.id;
  await newsModel.updateOne({ id: id }, { $set: { deny: true } });

  res.redirect("/admin/approve");
}

async function adminType(req, res) {
  let type = await typesModel.find({});
  let stt = 0;

  const data = type.map(type => {
    stt++;
    return {
      Type: type.tenTheLoai,
      STT: stt
    };
  });
  return res.render("admin-type", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    types: data,
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
  let stt = 0;

  const data = theme.map(theme => {
    stt++;
    return {
      theme: theme.tenChuDe,
      STT: stt
    };
  });
  return res.render("admin-theme", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    title: "Chủ Đề",
    themes: data
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
    DOB: moment(DOB).format("DD[-]MM[-]YYYY"),
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

async function adminAccount(req, res) {
  const userAccount = await usersModel.find({});

  const data = userAccount.map(user => {
    return {
      username: user.username,
      fullName: user.tenDayDu,
      phoneNumber: user.sdt,
      email: user.email,
      birthDate: user.ngaySinh,
      gender: user.gioiTinh,
      ID: user.cmnd
    };
  });

  return res.render("admin-account", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    userAccount: data
  });
}

function adminRegister(req, res) {
  return res.render("admin-register", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu
  });
}

function getFirstCharacter(str) {
  var strArr = str.split(" ");
  var newArr = [];

  for (var i = 0; i < strArr.length - 1; i++) {
    var FirstLetter = strArr[i].charAt(0);

    newArr[i] = FirstLetter;
  }

  var temp = newArr.join("");
  var first = deleteSign(temp);
  return first;
}
function getLast(str) {
  var strArr = str.split(" ");
  var name = strArr[strArr.length - 1];
  var last = deleteSign(name);
  return last;
}
function adminAddAccount(req, res) {
  let fullname = req.body.fullName;
  let firstCharacters = getFirstCharacter(fullname);
  let last = getLast(fullname);
  let plus = firstCharacters + last;
  let name = plus + "@vnpt";

  usersModel.create({
    username: name,
    password: req.body.password,
    sdt: req.body.phone,
    email: req.body.email,
    tenDayDu: req.body.fullName,
    ngaySinh: req.body.bday,
    gioiTinh: req.body.checkedGender,
    cmnd: req.body.CMND,
    idNguoiTao: res.locals.user.id,
    PQ: req.body.permission
  });
  res.redirect("/admin/account");
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

async function adminAdvertise(req, res) {
  const advertise = await advertiseModel.find({});
  let stt = 0;
  const data = advertise.map(advertise => {
    stt++;
    return {
      STT: stt,
      describe: advertise.motaQC,
      url: advertise.urlHinhQC,
      postedBy: advertise.tenNguoiDang,
      date: moment(advertise.ngayDang).format("DD[-]MM[-]YYYY")
    };
  });
  return res.render("admin-advertise", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    advertise: data
  });
}

async function adminAddAdvertise(req, res) {
  // let id = res.locals.user.id;
  // const user = await usersModel.findOne({ id });
  let describe = req.body.describe;
  req.body.advertise = req.file.path
    .split("/")
    .slice(1)
    .join("/");
  let urlAdvertise = "/" + req.body.advertise;

  advertiseModel.create({
    motaQC: describe,
    urlHinhQC: urlAdvertise,
    tenNguoiDang: res.locals.user.tenDayDu,
    idNguoiDang: res.locals.user.id
  });

  res.redirect("/admin/advertise");
}

async function adminBanner(req, res) {
  const banner = await bannersModel.find({});

  function getName(arr) {
    let array = [];
    for (let user of arr) {
      array.push(user.id);
    }
    return array;
  }

  let id = getName(banner);

  // const user = await usersModel.find({ id });

  // console.log(user);

  let stt = 0;
  const data = banner.map(banner => {
    stt++;
    return {
      STT: stt,
      describe: banner.motaBanner,
      url: banner.urlHinhAnh,
      postedBy: banner.tenNguoiDang,
      date: moment(banner.ngayDang).format("DD[-]MM[-]YYYY")
    };
  });
  return res.render("admin-banner", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    banners: data
  });
}
function adminAddBanner(req, res) {
  let describe = req.body.describe;
  req.body.banner = req.file.path
    .split("/")
    .slice(1)
    .join("/");
  let urlBanner = "/" + req.body.banner;

  bannersModel.create({
    motaBanner: describe,
    urlHinhAnh: urlBanner,
    idNguoiDang: res.locals.user.id,
    tenNguoiDang: res.locals.user.tenDayDu
  });

  res.redirect("/admin/banner");
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
  adminAddThemes,
  adminAddBanner,
  adminAddAdvertise,
  approvePost,
  denyPost
};
