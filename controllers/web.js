var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");
var bannersModel = require("../model/bannerModel");
var advertiseModel = require("../model/advertiseModel");
var commentsModel = require("../model/commentModel");
var newsModel = require("../model/newsModel");
var moment = require("moment");
function getIDThemes(arr) {
  var temp;
  for (let item of arr) {
    temp = item.idChuDe;
  }
  return temp;
}
function getFirstImage(data) {
  let regex = /<img.*?src="(.*?)"/;
  data.forEach(item => (item.firstImage = regex.exec(item.noiDung)[1]));
  return data;
}
async function home(req, res) {
  let userCookie = req.signedCookies.ID;
  if (userCookie) {
    var user = await usersModel.findOne({ id: userCookie });
    var name = user.tenDayDu;
    if (user.PQ == "admin") {
      var adminHeader = 1;
    } else if (user.PQ == "editor") {
      var editorHeader = 1;
    }
  } else {
    var normal = 1;
  }
  const banner = await bannersModel.find({});
  const advertise = await advertiseModel.find({});
  const news = await newsModel.find({ daDuyet: true, deny: false });
  var arr = getFirstImage(news);
  const data = arr.map(news => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      date: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDuyet).format("h:mm a"),
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
      viewsCount: news.luotXem
    };
  });

  const mostViews = data.sort(function(a, b) {
    return b.viewsCount - a.viewsCount;
  });

  const dataViewsCount = mostViews.slice(0, 5);

  const dataAdvertise = advertise.map(advertise => {
    return {
      img: advertise.urlHinhQC
    };
  });

  const dataBanner = banner.map(banner => {
    return {
      img: banner.urlHinhAnh
    };
  });

  // var str = "viet tue";
  // var strArr =
  //   "Với mức giá báns cao nhất phân khúc sedan hạng D, Honda Accord sở hữu thiết kế đẹp, nội thất rộng rãi, vận hành thể thao nhưng lại thua kém đối thủ về mặt tiện nghi.";
  // const search = await newsModel.find({ $text: { $search: str } });

  // console.log(search);

  return res.render("home", {
    data: data,
    banner: dataBanner,
    advertise: dataAdvertise,
    mostViews: dataViewsCount,
    adminHeader: adminHeader,
    editorHeader: editorHeader,
    homeHeader: normal,
    fullname: name
  });
}

function post(req, res) {
  return res.render("post", {});
}
function logout(req, res) {
  res.clearCookie("ID");
  res.redirect("/");
}
async function readNews(req, res) {
  let id = req.params.id;
  await newsModel.updateOne({ id: id }, { $inc: { luotXem: +1 } });
  const news = await newsModel.find({ id: id });
  var idTheme = getIDThemes(news);

  const themes = await themesModel.findOne({ idChuDe: idTheme });
  var idTheLoai = themes.idTheLoai;

  const types = await typesModel.findOne({ idTheLoai: idTheLoai });
  var theme = themes.tenChuDe;
  var type = types.tenTheLoai;

  const comments = await commentsModel.find({ idBanTin: id });

  const dataComments = comments.map(comment => {
    return {
      fullname: comment.hoTen,
      phone: comment.sdt,
      email: comment.email,
      content: comment.binhLuan,
      date: moment(comment.ngayBinhLuan).format("DD[-]MM[-]YYYY h:mm a")
    };
  });

  const data = news.map(news => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      author: news.tacGia,
      content: news.noiDung,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDang).format("h:mm a"),
      viewsCount: news.luotXem
    };
  });

  return res.render("news", {
    data: data,
    theme: theme,
    type: type,
    comments: dataComments,
    permission: 1
  });
}
async function comment(req, res) {
  let idBantin = req.params.id;
  commentsModel.create({
    idBanTin: idBantin,
    hoTen: req.body.fullname,
    email: req.body.email,
    sdt: req.body.phone,
    binhLuan: req.body.content
  });
  return res.redirect("/news/" + idBantin);
}
async function search(req, res) {
  var normal = 1;
  var q = req.query.search;
  const search = await newsModel.find({
    daDuyet: true,
    deny: false,
    $text: { $search: q }
  });

  console.log(search);

  var arr = getFirstImage(search);

  arr.sort(function(a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  const data = arr.map(news => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      date: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY h:mm a"),
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
      viewsCount: news.luotXem
    };
  });

  return res.render("search", {
    homeHeader: normal,
    data: data
  });
}
module.exports = {
  home,
  post,
  logout,
  readNews,
  comment,
  search
};
