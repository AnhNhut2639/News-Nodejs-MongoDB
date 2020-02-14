const newsModel = require("../model/newsModel");
function getDateTime() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  let hour = today.getHours();
  let minute = today.getUTCMinutes();
  let second = today.getUTCSeconds();

  let created =
    yyyy + "-" + mm + "-" + dd + "T" + hour + ":" + minute + ":" + second;
  return created;
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
function editorNewPost(req, res) {
  return res.render("editor-newPost", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu
  });
}
// function editorWriteNews(req, res) {
//   let createdDate = getDateTime();
//   newsModel.create({
//     tieuDe: req.body.title,
//     trichYEu: req.body.abstract,
//     tacGia: req.body.author,
//     nguon: req.body.sources,
//     noiDung: req.body.editor,
//     idNguoiDang: res.locals.user.id,
//     ngayDang: createdDate,
//     hashtag: req.body.themes,
//     // idchuDe:,
//     loaiTIn: req.body.themes
//   });
//   res.redirect("/editor/posted");
// }
function editorPosted(req, res) {
  return res.render("editor-posted", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu
  });
}
function editorProfile(req, res) {
  return res.render("editor-profile", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu
  });
}
function editorChangePass(req, res) {
  return res.render("editor-changePass", {
    layout: "editor",
    fullname: res.locals.user.tenDayDu
  });
}
module.exports = {
  editor,
  editorNewPost,
  editorPosted,
  editorProfile,
  editorChangePass
  //editorWriteNews
};
