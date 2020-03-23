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
  const banner = await bannersModel.find({}).limit(5);
  const advertise = await advertiseModel.find({});
  const news = await newsModel.find({ daDuyet: true, deny: false });
  news.sort(function(a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });
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

  const dataViewsMost = arr.map(news => {
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
  const mostViews = dataViewsMost.sort(function(a, b) {
    return b.viewsCount - a.viewsCount;
  });

  const dataViewsCount = mostViews.slice(0, 5);

  advertise.sort(function(a, b) {
    return a.viTri - b.viTri;
  });

  const dataAdvertise = advertise.map(advertise => {
    return {
      img: advertise.urlHinhQC,
      link: advertise.link
    };
  });
  banner.sort(function(a, b) {
    return new Date(b.ngayDang) - new Date(a.ngayDang);
  });
  const dataBanner = banner.map(banner => {
    return {
      img: banner.urlHinhAnh
    };
  });
  var page = [];

  var count = await newsModel.count({ daDuyet: true, deny: false });
  var result = count / 10;

  var loop = Math.ceil(result);
  for (var i = 1; i <= loop; i++) {
    page.push(i);
  }
  const types = await typesModel.find({});
  types.sort(function(a, b) {
    return a.viTri - b.viTri;
  });

  const dataType = types.map(type => {
    return {
      id: type.idTheLoai,
      type: type.tenTheLoai
    };
  });

  var limitTypes = dataType.slice(0, 10);
  var restTypes = dataType.slice(10);

  return res.render("home", {
    data: data.slice(0, 10),
    dataType: limitTypes,
    restTypes: restTypes,
    banner: dataBanner,
    advertise: dataAdvertise,
    mostViews: dataViewsCount,
    adminHeader: adminHeader,
    editorHeader: editorHeader,
    homeHeader: normal,
    fullname: name,
    paginate: page
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
  comments.sort(function(a, b) {
    return new Date(b.ngayBinhLuan) - new Date(a.ngayBinhLuan);
  });

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
      source: news.nguon,
      content: news.noiDung,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDang).format("h:mm a"),
      viewsCount: news.luotXem
    };
  });

  const relateNews = await newsModel.find({
    idChuDe: idTheme,
    id: { $ne: id }
  });
  relateNews.sort(function(a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });
  var relate = getFirstImage(relateNews);
  const dataRelateNews = relate.map(relate => {
    return {
      title: relate.tieuDe,
      id: relate.id,
      img: relate.firstImage,
      viewsCount: relate.luotXem
    };
  });
  const typesData = await typesModel.find({});

  const dataType = typesData.map(type => {
    return {
      id: type.idTheLoai,
      type: type.tenTheLoai
    };
  });
  return res.render("news", {
    layout: "news",
    data: data,
    dataType: dataType,
    relateNews: dataRelateNews.slice(0, 6),
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

async function pagination(req, res) {
  var page = parseInt(req.params.page) || 1; //n
  var perPage = 10;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  var news = await newsModel.find({ daDuyet: true, deny: false });

  news.sort(function(a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });
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
  const realdata = data.slice(start, end);
  res.json(realdata);
}

async function getTypes(req, res) {
  let id = req.params.id;
  const theme = await themesModel.find({ idTheLoai: id });
  var idChuDe = [];
  var name = [];
  theme.forEach(function(item) {
    idChuDe.push(item.idChuDe);
    name.push(item.tenChuDe);
  });

  const news = await newsModel.find({
    idChuDe: idChuDe,
    daDuyet: true,
    deny: false
  });

  news.sort(function(a, b) {
    return b.ngayDuyet - a.ngayDuyet;
  });
  var arr = getFirstImage(news);
  const data = arr.map(news => {
    return {
      title: news.tieuDe.slice(0, 80) + " ...",
      date: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY h:mm a"),
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
      viewsCount: news.luotXem
    };
  });

  var main = data.slice(0, 1);
  var right = data.slice(1, 4);
  var down = data.slice(4, 7);
  var rest = data.slice(7);
  const types = await typesModel.find({});
  types.sort(function(a, b) {
    return a.viTri - b.viTri;
  });

  const dataType = types.map(type => {
    return {
      id: type.idTheLoai,
      type: type.tenTheLoai
    };
  });

  var limitTypes = dataType.slice(0, 10);
  var restTypes = dataType.slice(10);

  return res.render("types", {
    layout: "news",
    dataType: limitTypes,
    restTypes: restTypes,
    theme: name,
    main: main,
    right: right,
    down: down,
    rest: rest
  });
}

module.exports = {
  home,
  post,
  logout,
  readNews,
  comment,
  search,
  pagination,
  getTypes
};
