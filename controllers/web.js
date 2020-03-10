var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");
var bannersModel = require("../model/bannerModel");
var advertiseModel = require("../model/advertiseModel");
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
  const banner = await bannersModel.find({});
  const advertise = await advertiseModel.find({});
  const news = await newsModel.find({ daDuyet: true, deny: false });
  var arr = getFirstImage(news);
  const data = arr.map(news => {
    return {
      title: news.tieuDe,
      abstract: news.trichYeu,
      date: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDuyet).format("h:mm a"),
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
      viewsCount: news.luotXem
    };
  });

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

  return res.render("home", {
    data: data,
    banner: dataBanner,
    advertise: dataAdvertise
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

  const data = news.map(news => {
    return {
      title: news.tieuDe,
      abstract: news.trichYeu,
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
    permission: 1
  });
}

module.exports = {
  home,
  post,
  logout,
  readNews
};
