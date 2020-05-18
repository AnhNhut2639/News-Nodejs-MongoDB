var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");
var bannersModel = require("../model/bannerModel");
var advertiseModel = require("../model/advertiseModel");
var commentsModel = require("../model/commentModel");
var newsModel = require("../model/newsModel");
var accessModel = require("../model/accessCountModel");
var moment = require("moment");
var ip = require("ip");
var jwt = require("jsonwebtoken");
function getIDThemes(arr) {
  var temp;
  for (let item of arr) {
    temp = item.idChuDe;
  }
  return temp;
}
function getLast(str) {
  var strArr = str.split(" ");
  var name = strArr[strArr.length - 1];
  var last = deleteSign(name).charAt(0).toUpperCase();
  return last;
}
function getIDArrThemes(arr) {
  var themes = [];
  for (var x of arr) {
    themes.push(x.idChuDe);
  }
  return themes;
}
function getFirstImage(data) {
  let regex = /<img.*?src="(.*?)"/;
  data.forEach(function (item) {
    if (regex.exec(item.noiDung) == null) {
      item.firstImage = "/uploads/defaultvnpt.jpg";
    } else {
      item.firstImage = regex.exec(item.noiDung)[1];
    }
  });
  return data;
}

async function home(req, res) {
  // let userCookie = req.signedCookies.ID;
  let token = jwt.decode(req.cookies.ID, process.env.SECRET_KEY);
  if (token) {
    let id = token.payload.id;
    var user = await usersModel.findOne({ id: id });
    var name = getLast(user.tenDayDu);
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
  const hotNews = await newsModel.find({
    daDuyet: true,
    deny: false,
    tinNoiBat: true,
  });
  const news = await newsModel.find({ daDuyet: true, deny: false });

  hotNews.sort(function (a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });
  var hot = getFirstImage(hotNews);
  const dataHotNews = hot.map((news) => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      date: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY h:mm a"),
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
    };
  });

  var mainHotNews = dataHotNews.slice(0, 1);

  var restHotNews = dataHotNews.slice(1, 6);

  news.sort(function (a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });
  var arr = getFirstImage(news);
  const data = arr.map((news) => {
    var date = news.ngayDuyet;
    var datetime = moment(date).fromNow();
    var x = datetime.split(" ").slice(1, 2);
    if (
      x == "days" ||
      x == "day" ||
      x == "month" ||
      x == "months" ||
      x == "year" ||
      x == "years"
    ) {
      datetime = moment(date).format("DD[-]MM[-]YYYY h:mm a");
    }

    return {
      title: news.tieuDe,
      epitomize: news.trichYeu.slice(0, 100) + "...",
      date: datetime,
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
      viewsCount: news.luotXem,
    };
  });

  const dataViewsMost = arr.map((news) => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      date: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDuyet).format("h:mm a"),
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
      viewsCount: news.luotXem,
    };
  });
  const mostViews = dataViewsMost.sort(function (a, b) {
    return b.viewsCount - a.viewsCount;
  });

  const dataViewsCount = mostViews.slice(0, 5);

  advertise.sort(function (a, b) {
    return a.viTri - b.viTri;
  });

  const dataAdvertise = advertise.map((advertise) => {
    return {
      img: advertise.urlHinhQC,
      link: advertise.link,
    };
  });
  banner.sort(function (a, b) {
    return new Date(b.ngayDang) - new Date(a.ngayDang);
  });
  const dataBanner = banner.map((banner) => {
    return {
      img: banner.urlHinhAnh,
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
  types.sort(function (a, b) {
    return a.viTri - b.viTri;
  });

  const dataType = types.map((type) => {
    return {
      id: type.idTheLoai,
      type: type.tenTheLoai,
    };
  });

  var limitTypes = dataType.slice(0, 10);
  var restTypes = dataType.slice(10);

  var address = ip.address();
  if (address) {
    await accessModel.updateOne({ $inc: { luotTruyCap: +1 } });
  }

  const access = await accessModel.find({}).limit(1);

  const dataAccess = access.map((access) => {
    return {
      id: access.id,
      access: access.luotTruyCap
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
    };
  });

  const service = await themesModel.find({
    idTheLoai: "997506ab-0c93-41f3-b288-87b71f4157e1",
  });

  const dataService = service.map((service) => {
    return {
      img: service.img,
      name: service.tenChuDe,
      id: service.idChuDe,
    };
  });

  const dataThemes = await themesModel.find({
    idTheLoai: "7e971381-39a5-4cb6-bf01-f5e14b7b51ed",
  });

  const arrIDThemes = getIDArrThemes(dataThemes);

  const internalNews = await newsModel
    .find({
      idChuDe: arrIDThemes,
    })
    .limit(5);
  internalNews.sort(function (a, b) {
    return new Date(b.ngayDang) - new Date(a.ngayDang);
  });
  var arrInternalNews = getFirstImage(internalNews);
  const internal = arrInternalNews.map((news) => {
    return {
      title: news.tieuDe,
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
    };
  });

  return res.render("home", {
    data: data.slice(0, 10),
    dataType: limitTypes,
    restTypes: restTypes,
    mainHotNews: mainHotNews,
    service: dataService,
    restHotNews: restHotNews,
    banner: dataBanner,
    advertise: dataAdvertise,
    mostViews: dataViewsCount,
    access: dataAccess,
    internalNews: internal,
    ip: address,
    adminHeader: adminHeader,
    editorHeader: editorHeader,
    homeHeader: normal,
    fullname: name,
    paginate: page,
  });
}

function post(req, res) {
  return res.render("post", {});
}
function logout(req, res) {
  res.clearCookie("ID");
  res.redirect("/");
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

async function readNews(req, res) {
  let token = jwt.decode(req.cookies.ID, process.env.SECRET_KEY);
  if (token) {
    let id = token.payload.id;
    var user = await usersModel.findOne({ id: id });
    var name = getLast(user.tenDayDu);
    if (user.PQ == "admin") {
      var adminHeader = 1;
    } else if (user.PQ == "editor") {
      var editorHeader = 1;
    }
  } else {
    var normal = 1;
  }
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
  comments.sort(function (a, b) {
    return new Date(b.ngayBinhLuan) - new Date(a.ngayBinhLuan);
  });

  const dataComments = comments.map((comment) => {
    var firstChart = getLast(comment.hoTen);
    return {
      fullname: comment.hoTen,
      firstChart: firstChart,
      phone: comment.sdt,
      email: comment.email,
      content: comment.binhLuan,
      date: moment(comment.ngayBinhLuan).format("DD[-]MM[-]YYYY h:mm a"),
    };
  });
  const commentsCount = await commentsModel.find({ idBanTin: id }).count();

  const data = news.map((news) => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      author: news.tacGia,
      source: news.nguon,
      content: news.noiDung,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDang).format("h:mm a"),
      viewsCount: news.luotXem,
      commentsCount: commentsCount,
    };
  });

  const relateNews = await newsModel.find({
    idChuDe: idTheme,
    id: { $ne: id },
  });
  relateNews.sort(function (a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });
  var relate = getFirstImage(relateNews);
  const dataRelateNews = relate.map((relate) => {
    return {
      title: relate.tieuDe,
      id: relate.id,
      img: relate.firstImage,
      viewsCount: relate.luotXem,
    };
  });
  // const typesData = await typesModel.find({});

  // const dataType = typesData.map((type) => {
  //   return {
  //     id: type.idTheLoai,
  //     type: type.tenTheLoai,
  //   };
  // });

  const typesSelect = await typesModel.find({});
  typesSelect.sort(function (a, b) {
    return a.viTri - b.viTri;
  });

  const dataType = typesSelect.map((type) => {
    return {
      id: type.idTheLoai,
      type: type.tenTheLoai,
    };
  });

  var limitTypes = dataType.slice(0, 10);
  var restTypes = dataType.slice(10);
  return res.render("news", {
    layout: "news",
    data: data,
    dataType: limitTypes,
    restTypes: restTypes,
    relateNews: dataRelateNews.slice(0, 6),
    theme: theme,
    type: type,
    comments: dataComments,
    permission: 1,
    adminHeader: adminHeader,
    editorHeader: editorHeader,
    homeHeader: normal,
    fullname: name,
  });
}
async function comment(req, res) {
  let idBantin = req.params.id;
  commentsModel.create({
    idBanTin: idBantin,
    hoTen: req.body.fullname,
    email: req.body.email,
    sdt: req.body.phone,
    binhLuan: req.body.content,
  });
  // res.redirect("/news/" + idBantin);
}
async function search(req, res) {
  var normal = 1;
  var q = req.query.search;
  const search = await newsModel.find({
    daDuyet: true,
    deny: false,
    $text: { $search: q },
  });

  var arr = getFirstImage(search);

  arr.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  const data = arr.map((news) => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      date: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY h:mm a"),
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
      viewsCount: news.luotXem,
    };
  });

  return res.render("search", {
    homeHeader: normal,
    data: data,
  });
}

async function pagination(req, res) {
  var page = parseInt(req.params.page) || 1; //n
  var perPage = 10;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  var news = await newsModel.find({ daDuyet: true, deny: false });

  news.sort(function (a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });
  var arr = getFirstImage(news);
  const data = arr.map((news) => {
    var date = news.ngayDuyet;
    var datetime = moment(date).fromNow();
    var x = datetime.split(" ").slice(1, 2);
    if (
      x == "days" ||
      x == "day" ||
      x == "month" ||
      x == "months" ||
      x == "year" ||
      x == "years"
    ) {
      datetime = moment(date).format("DD[-]MM[-]YYYY h:mm a");
    }
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu.slice(0, 100) + "...",
      date: datetime,
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
      viewsCount: news.luotXem,
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
  theme.forEach(function (item) {
    idChuDe.push(item.idChuDe);
    name.push(item.tenChuDe);
  });

  const news = await newsModel.find({
    idChuDe: idChuDe,
    daDuyet: true,
    deny: false,
  });

  news.sort(function (a, b) {
    return b.ngayDuyet - a.ngayDuyet;
  });
  var arr = getFirstImage(news);
  const data = arr.map((news) => {
    return {
      title: news.tieuDe.slice(0, 80) + " ...",
      epitomize: news.trichYeu,
      date: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY h:mm a"),
      id: news.id,
      img: news.firstImage,
      theme: news.chuDe,
      viewsCount: news.luotXem,
    };
  });

  var main = data.slice(0, 1);
  var right = data.slice(1, 4);
  var down = data.slice(4, 7);
  var rest = data.slice(7);
  const types = await typesModel.find({});
  types.sort(function (a, b) {
    return a.viTri - b.viTri;
  });

  const dataType = types.map((type) => {
    return {
      id: type.idTheLoai,
      type: type.tenTheLoai,
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
    rest: rest,
  });
}

async function getComments(req, res) {
  let idBanTin = req.params.id;
  const comments = await commentsModel.find({ idBanTin: idBanTin });
  comments.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  const dataComments = comments.map((comment) => {
    var firstChart = getLast(comment.hoTen);
    return {
      fullname: comment.hoTen,
      phone: comment.sdt,
      email: comment.email,
      content: comment.binhLuan,
      firstChart: firstChart,
      date: moment(comment.ngayBinhLuan).format("DD[-]MM[-]YYYY h:mm a"),
    };
  });

  res.json(dataComments);
}

async function getNewsThemes(req, res) {
  let id = req.params.id;

  const news = await newsModel.find({ idChuDe: id });
  var newsByThemes = getFirstImage(news);
  const data = newsByThemes.map((news) => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      author: news.tacGia,
      source: news.nguon,
      content: news.noiDung,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
      viewsCount: news.luotXem,
      img: news.firstImage,
    };
  });

  return res.render("themes", {
    layout: "news",
    data: data,
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
  getTypes,
  getComments,
  getNewsThemes,
};
