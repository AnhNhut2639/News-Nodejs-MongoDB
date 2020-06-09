var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");
var newsModel = require("../model/newsModel");
function still(arr, result) {
  var still = false;
  arr.forEach(function (item) {
    if (item.idChuDe === result) {
      still = true;
    }
  });
  return still;
}

module.exports.checkStillNews = async function (req, res, next) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  let theme = await themesModel.find({});
  let types = await typesModel.find({});
  let stt = 0;

  const dataTypes = types.map((type) => {
    return {
      id: type.idTheLoai,
      type: type.tenTheLoai,
    };
  });
  const data = theme.map((theme) => {
    stt++;
    return {
      theme: theme.tenChuDe,
      id: theme.idChuDe,
      img: theme.img,
      STT: stt,
    };
  });
  let id = req.params.id;
  const news = await newsModel.find({}, { idChuDe: 1 });
  var erorrs = [];
  if (still(news, id)) {
    erorrs.push({
      error:
        "Không thể xóa chủ đề. Bạn phải xóa tất cả các bài viết của chủ đề này",
    });
  }
  if (erorrs.length) {
    res.render("admin-theme", {
      layout: "admin",
      fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
      title: "Chủ Đề",
      themes: data,
      types: dataTypes,
      newsCount: newsCount,
      usersCount: usersCount,
      typesCount: typesCount,
      themesCount: themesCount,
      message: erorrs,
    });
    return;
  }

  next();
};
