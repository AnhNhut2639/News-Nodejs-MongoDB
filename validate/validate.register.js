var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");
var newsModel = require("../model/newsModel");
function accountExistsed(arr, result) {
  var existed = false;
  arr.forEach(function (item) {
    if (item.username.split(" ").join("").toLowerCase() === result) {
      existed = true;
    }
  });
  return existed;
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
  return str.toLowerCase();
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
module.exports.validateRegister = async function (req, res, next) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  const users = await usersModel.find({});
  // var username = req.body.fullName;
  // var result = username.split(" ").join("").toLowerCase();
  let fullname = req.body.fullName;
  let firstCharacters = getFirstCharacter(fullname);
  let last = getLast(fullname);
  let plus = firstCharacters + last;
  let name = plus + "@vnpt";
  var cmnd = req.body.CMND;
  var erorrs = [];
  // console.log(accountExistsed(users, result));
  // console.log(result);
  if (accountExistsed(users, name)) {
    erorrs.push({ error: "Tài khoản đã tồn tại" });
  }
  if (!req.body.fullName) {
    erorrs.push({ error: "Tên không được bỏ trống" });
  }
  if (!req.body.phone) {
    erorrs.push({ error: "Số điện thoại không được bỏ trống" });
  }
  if (!req.body.email) {
    erorrs.push({ error: "Email không được bỏ trống" });
  }
  if (!req.body.checkedGender) {
    erorrs.push({ error: "Giới tính không được bỏ trống" });
  }
  if (!cmnd) {
    erorrs.push({ error: "CMND không được bỏ trống" });
  }
  if (cmnd.length > 0 && cmnd.length < 9) {
    erorrs.push({ error: "Vui nhập CMND 9 chữ số" });
  }
  if (!req.body.permission) {
    erorrs.push({ error: "Vui lòng phân quyền cho tài khoản" });
  }
  if (!req.body.bday) {
    erorrs.push({ error: "Ngày sinh không được bỏ trống" });
  }
  // console.log(req.body);
  if (erorrs.length) {
    res.render("admin-register", {
      layout: "admin",
      erorrs: erorrs,
      values: [req.body],
      fullname: res.locals.user.tenDayDu,
      newsCount: newsCount,
      usersCount: usersCount,
      typesCount: typesCount,
      themesCount: themesCount,
    });
    return;
  }

  next();
};
