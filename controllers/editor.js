const newsModel = require("../model/newsModel");
const usersModel = require("../model/usersModel");
const themesModel = require("../model/themesModel");
const typesModel = require("../model/typesNewsModel");
var moment = require("moment");
var nodemailer = require("nodemailer");

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

async function editor(req, res) {
  var newsCount = await newsModel.count({
    idNguoiDang: res.locals.user.id
  });
  var waitingCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: false
  });
  var denyCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: true
  });

  if (denyCount == 0) {
    denyCount = "0";
  }
  if (waitingCount == 0) {
    waitingCount = "0";
  }

  return res.render("editor", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    newsCount: newsCount,
    waitingCount: waitingCount,
    denyCount: denyCount
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
  var newsCount = await newsModel.count({
    idNguoiDang: res.locals.user.id
  });
  var waitingCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: false
  });
  var denyCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: true
  });

  if (denyCount == 0) {
    denyCount = "0";
  }
  if (waitingCount == 0) {
    waitingCount = "0";
  }

  return res.render("editor-newPost", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    data: dataTypes,
    arrThemes: dataThemes,
    newsCount: newsCount,
    waitingCount: waitingCount,
    denyCount: denyCount
  });
}
async function editorWriteNews(req, res, next) {
  let id = req.body.themes;
  var themes = await themesModel.findOne({ idChuDe: id });
  newsModel.create({
    tieuDe: req.body.title,
    trichYeu: req.body.epitomize,
    tacGia: req.body.author,
    nguon: req.body.sources,
    noiDung: req.body.editordata,
    idNguoiDang: res.locals.user.id,
    tenNguoiDang: res.locals.user.tenDayDu,
    hashtag: req.body.themes,
    tinNoiBat: req.body.checkedTypeNews,
    idChuDe: req.body.themes,
    chuDe: themes.tenChuDe
  });

  res.locals.title = req.body.title;
  next();
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
      epitomize: news.trichYeu,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDang).format("h:mm a"),
      img: news.firstImage,
      id: news.id,
      theme: news.chuDe,
      viewsCount: news.luotXem
    };
  });
  var newsCount = await newsModel.count({
    idNguoiDang: res.locals.user.id
  });
  var waitingCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: false
  });
  var denyCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: true
  });

  if (denyCount == 0) {
    denyCount = "0";
  }
  if (waitingCount == 0) {
    waitingCount = "0";
  }
  return res.render("editor-posted", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    data: data,
    newsCount: newsCount,
    waitingCount: waitingCount,
    denyCount: denyCount
  });
}
async function editorProfile(req, res) {
  let gender = res.locals.user.gioiTinh;
  let DOB = res.locals.user.ngaySinh;
  let cmnd = res.locals.user.cmnd;
  let email = res.locals.user.email;
  let sdt = res.locals.user.sdt;
  var newsCount = await newsModel.count({
    idNguoiDang: res.locals.user.id
  });
  var waitingCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: false
  });
  var denyCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: true
  });

  if (denyCount == 0) {
    denyCount = "0";
  }
  if (waitingCount == 0) {
    waitingCount = "0";
  }

  return res.render("editor-profile", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    genders: gender,
    DOB: moment(DOB).format("DD[-]MM[-]YYYY"),
    cmnd: cmnd,
    phone: sdt,
    email: email,
    newsCount: newsCount,
    waitingCount: waitingCount,
    denyCount: denyCount
  });
}

async function editorUpdateProfile(req, res) {
  let id = res.locals.user.id;
  let email = req.body.email;
  let sdt = req.body.phone;

  await usersModel.updateOne({ id: id }, { $set: { email: email, sdt: sdt } });

  res.redirect("/editor/profile");
}
async function editorChangePass(req, res) {
  var newsCount = await newsModel.count({
    idNguoiDang: res.locals.user.id
  });
  var waitingCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: false
  });
  var denyCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: true
  });

  if (denyCount == 0) {
    denyCount = "0";
  }
  if (waitingCount == 0) {
    waitingCount = "0";
  }
  return res.render("editor-changePass", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    newsCount: newsCount,
    waitingCount: waitingCount,
    denyCount: denyCount
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
  var newsCount = await newsModel.count({
    idNguoiDang: res.locals.user.id
  });
  var waitingCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: false
  });
  var denyCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: true
  });

  if (denyCount == 0) {
    denyCount = "0";
  }
  if (waitingCount == 0) {
    waitingCount = "0";
  }

  var arr = getFirstImage(news);
  const data = arr.map(news => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDang).format("h:mm a"),
      img: news.firstImage,
      theme: news.chuDe,
      id: news.id
    };
  });

  return res.render("editor-waiting", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    data: data,
    newsCount: newsCount,
    waitingCount: waitingCount,
    denyCount: denyCount
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
      epitomize: news.trichYeu,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY "),
      time: moment(news.ngayDang).format("h:mm a"),
      img: news.firstImage,
      theme: news.chuDe,
      id: news.id
    };
  });
  var newsCount = await newsModel.count({
    idNguoiDang: res.locals.user.id
  });
  var waitingCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: false
  });
  var denyCount = await newsModel.count({
    idNguoiDang: res.locals.user.id,
    daDuyet: false,
    deny: true
  });

  if (denyCount == 0) {
    denyCount = "0";
  }
  if (waitingCount == 0) {
    waitingCount = "0";
  }
  return res.render("editor-denied", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    data: data,
    newsCount: newsCount,
    waitingCount: waitingCount,
    denyCount: denyCount
  });
}

function getIDThemes(arr) {
  var temp;
  for (let item of arr) {
    temp = item.idChuDe;
  }
  return temp;
}
async function readNews(req, res) {
  let id = req.params.id;
  const news = await newsModel.find({ id: id });
  var idTheme = getIDThemes(news);

  const themes = await themesModel.findOne({ idChuDe: idTheme });
  var idTheLoai = themes.idTheLoai;

  const types = await typesModel.findOne({ idTheLoai: idTheLoai });
  var theme = themes.tenChuDe;
  var type = types.tenTheLoai;

  const data = news.map(news => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      author: news.tacGia,
      content: news.noiDung,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDang).format("h:mm a"),
      editor: news.id
    };
  });

  return res.render("news", {
    layout: "news",
    fullname: res.locals.user.tenDayDu,
    data: data,
    theme: theme,
    type: type
  });
}

async function deniedNews(req, res) {
  let id = req.params.id;
  const news = await newsModel.find({ id: id });
  var idTheme = getIDThemes(news);

  const themes = await themesModel.findOne({ idChuDe: idTheme });
  var idTheLoai = themes.idTheLoai;

  const types = await typesModel.findOne({ idTheLoai: idTheLoai });
  var theme = themes.tenChuDe;
  var type = types.tenTheLoai;

  const data = news.map(news => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      author: news.tacGia,
      content: news.noiDung,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDang).format("h:mm a"),
      editor: news.id
    };
  });

  return res.render("news", {
    layout: "news",
    fullname: res.locals.user.tenDayDu,
    data: data,
    theme: theme,
    type: type
  });
}
async function waitNews(req, res) {
  let id = req.params.id;
  const news = await newsModel.find({ id: id });
  var idTheme = getIDThemes(news);

  const themes = await themesModel.findOne({ idChuDe: idTheme });
  var idTheLoai = themes.idTheLoai;

  const types = await typesModel.findOne({ idTheLoai: idTheLoai });
  var theme = themes.tenChuDe;
  var type = types.tenTheLoai;

  const data = news.map(news => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      author: news.tacGia,
      content: news.noiDung,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDang).format("h:mm a")
    };
  });

  return res.render("news", {
    layout: "news",
    fullname: res.locals.user.tenDayDu,
    data: data,
    theme: theme,
    type: type
  });
}
async function sendmail(req, res) {
  var tieuDe = res.locals.title;

  if (res.locals.idNews) {
    var id = res.locals.idNews;
    await newsModel.deleteOne({ id: id });
  }

  var userEmail = await usersModel.find({ PQ: "admin" });

  userEmail.forEach(function(user) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass
      }
    });

    var content = "";
    content += ` <div width="100%" style="margin:0;padding:0;background-color:#222222">
    <center style="width:100%;background-color:#f1f1f1">
      <div style="display:none;font-size:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;font-family:sans-serif">
        ‌
      </div>
      <div style="max-width:600px;margin:0 auto" >
  
        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:auto">
          <tbody><tr>
            <td style="padding:1em 2.5em;background-color:#03a9f4">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tbody><tr>
                  <td width="100%"style="text-align:left">
                    <h1 style="color: white">VNPT An Giang</h1>
                  </td>
                  <td width="60%"style="text-align:right"></td>
                </tr>
              </tbody></table>
            </td>
          </tr>
          <tr>
            <td style="background-size:cover;height:400px">
              <div></div>
              <table>
                <tbody><tr>
                  <td>
                  <div style="padding:0 3em;text-align:left">
                    <h2>Yêu cầu xét duyệt</h2>
                    <p>Dear <b>${user.tenDayDu}</b></p>
                    <p><b>${res.locals.user.tenDayDu}</b> vừa thêm bài viết của anh(chị) ấy và đang đợi bạn xét duyệt bài viết</p>
                    <p>Tiêu đề: <b>${tieuDe}</b></p>
                    <p>Vui lòng xem kỹ bài viết trước khi xác nhận phê duyệt </p>
                    <p>Chi tiết bài viết <a href="#" target="_blank">tại đây</a>.</p>
                    </div>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody></table>
      </div>
    </center>
      `;

    var mailOptions = {
      from: "DeliMarvel",
      to: user.email,
      subject: "Sending Email using Node.js",
      html: content
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });
  res.redirect("/editor");
}

async function editNews(req, res) {
  let id = req.params.id;

  const news = await newsModel.find({ id: id }).limit(1);

  const types = await typesModel.find({});
  const themes = await themesModel.find({});
  const data = news.map(news => {
    return {
      id: news.id,
      title: news.tieuDe,
      epitomize: news.trichYeu,
      content: news.noiDung,
      source: news.nguon,
      author: news.tacGia
    };
  });
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

  return res.render("editor-edit", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu,
    news: data,
    data: dataTypes,
    arrThemes: dataThemes
  });
}

async function editorRepost(req, res, next) {
  let news = req.params.id;

  let id = req.body.themes;
  var themes = await themesModel.findOne({ idChuDe: id });
  newsModel.create({
    tieuDe: req.body.title,
    trichYeu: req.body.epitomize,
    tacGia: req.body.author,
    nguon: req.body.sources,
    noiDung: req.body.editordata,
    idNguoiDang: res.locals.user.id,
    tenNguoiDang: res.locals.user.tenDayDu,
    hashtag: req.body.themes,
    loaiTin: req.body.themes,
    idChuDe: req.body.themes,
    chuDe: themes.tenChuDe
  });

  res.locals.title = req.body.title;
  res.locals.idNews = news;
  next();
}

async function deleteNews(req, res) {
  let id = req.params.id;
  await newsModel.deleteOne({ id: id });
  res.redirect("/editor/denied");
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
  deniedPost,
  readNews,
  deniedNews,
  waitNews,
  sendmail,
  editNews,
  editorRepost,
  deleteNews
};
