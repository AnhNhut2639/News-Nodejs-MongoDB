const newsModel = require("../model/newsModel");
const usersModel = require("../model/usersModel");
const themesModel = require("../model/themesModel");
const typesModel = require("../model/typesNewsModel");
var moment = require("moment");

function getFirstImage(data) {
  let regex = /<img.*?src="(.*?)"/;
  data.forEach(item => (item.firstImage = regex.exec(item.noiDung)[1]));
  return data;
}
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
// function getFirstImageandAndDelete(data) {
//   let regex = /<img.*?src="(.*?)"/;
//   data.forEach(item => (item.firstImage = regex.exec(item.content)[1]));
//   data.forEach(item => (item.url = deleteSign(item.title)));
//   return data;
// }

function editor(req, res) {
  return res.render("editor", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu
  });
}
async function editorNewPost(req, res) {
  const types = await typesModel.find({});
  const themes = await themesModel.find({});

  const dataTypes = types.map(types => {
    return {
      typesName: types.tenTheLoai,
      id: types.idTheLoai
    };
  });

  const dataThemes = themes.map(themes => {
    return {
      theme: themes.tenChuDe,
      id: themes.id,
      idTheLoai: themes.idTheLoai
    };
  });
  // console.log(dataThemes);

  return res.render("editor-newPost", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    data: dataTypes,
    arrThemes: dataThemes
  });
}
function editorWriteNews(req, res) {
  newsModel.create({
    tieuDe: req.body.title,
    trichYeu: req.body.abstract,
    tacGia: req.body.author,
    nguon: req.body.sources,
    noiDung: req.body.editor,
    idNguoiDang: res.locals.user.id,
    hashtag: req.body.themes,
    loaiTin: req.body.themes,
    idChuDe: req.body.themes
  });
  res.redirect("/editor");
}
async function getIDtypes(req, res) {
  var id = req.params.id;
  const themeById = await themesModel.find({ idTheLoai: id });
  res.json(themeById);
}

async function editorPosted(req, res) {
  let id = res.locals.user.id;

  const news = await newsModel.find({
    idNguoiDang: id,
    daDuyet: true,
    deny: false
  });

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
  return res.render("editor-posted", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    data: data
  });
}
function editorProfile(req, res) {
  let gender = res.locals.user.gioiTinh;
  let DOB = res.locals.user.ngaySinh;
  let cmnd = res.locals.user.cmnd;
  let email = res.locals.user.email;
  let sdt = res.locals.user.sdt;

  return res.render("editor-profile", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    genders: gender,
    DOB: moment(DOB).format("DD[-]MM[-]YYYY"),
    cmnd: cmnd,
    phone: sdt,
    email: email
  });
}

async function editorUpdateProfile(req, res) {
  let id = res.locals.user.id;
  let email = req.body.email;
  let sdt = req.body.phone;

  await usersModel.updateOne({ id: id }, { $set: { email: email, sdt: sdt } });

  res.redirect("/editor/profile");
}
function editorChangePass(req, res) {
  return res.render("editor-changePass", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu
  });
}
async function editorChangePassword(req, res) {
  let id = res.locals.user.id;
  let currentPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let confirmNewPassword = req.body.confirmNewPassword;

  const user = await usersModel.findOne({ id });

  if (user) {
    if (await user.comparePassword(currentPassword)) {
      if (newPassword != confirmNewPassword) {
        return res.render("editor-changePass", {
          layout: "editor",
          fullname: res.locals.user.tenDayDu,
          errConfirm: "Mật khẩu không trùng khớp"
        });
      }
      user.password = confirmNewPassword;
      await user.save();
      return res.render("editor-changePass", {
        layout: "editor",
        fullname: res.locals.user.tenDayDu,
        success: "Đổi Mật Khẩu Thành Công"
      });
    } else {
      return res.render("editor-changePass", {
        layout: "editor",
        fullname: res.locals.user.tenDayDu,
        err: "Mật khẩu cũ không chính xác"
      });
    }
  }
}

async function waitingAprrove(req, res) {
  let id = res.locals.user.id;

  const news = await newsModel.find({
    idNguoiDang: id,
    daDuyet: false,
    deny: false
  });

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

  return res.render("editor-waiting", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    data: data
  });
}

async function deniedPost(req, res) {
  let id = res.locals.user.id;

  const news = await newsModel.find({
    idNguoiDang: id,
    daDuyet: false,
    deny: true
  });

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

  return res.render("editor-denied", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    data: data
  });
}

module.exports = {
  editor,
  editorNewPost,
  editorPosted,
  editorProfile,
  editorChangePass,
  editorChangePassword,
  editorWriteNews,
  getIDtypes,
  editorUpdateProfile,
  waitingAprrove,
  deniedPost
};
