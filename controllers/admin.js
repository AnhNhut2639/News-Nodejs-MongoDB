var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");
var bannersModel = require("../model/bannerModel");
var advertiseModel = require("../model/advertiseModel");
var newsModel = require("../model/newsModel");
var commentModel = require("../model/commentModel");
var moment = require("moment");
var nodemailer = require("nodemailer");

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

// function getDateTime() {
//   let today = new Date();
//   let dd = String(today.getDate()).padStart(2, "0");
//   let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
//   let yyyy = today.getFullYear();
//   let hour = today.getHours();
//   let minute = today.getUTCMinutes();
//   let second = today.getUTCSeconds();

//   let created =
//     yyyy + "-" + mm + "-" + dd + "T" + hour + ":" + minute + ":" + second;
//   return created;
// }

async function admin(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });

  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});

  return res.render("admin", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
  });
}

async function adminNewPost(req, res) {
  const types = await typesModel.find({});
  const themes = await themesModel.find({});
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});

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
  return res.render("admin-newPost", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    data: dataTypes,
    arrThemes: dataThemes,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
  });
}

async function adminWriteNews(req, res, next) {
  let id = req.body.themes;
  var themes = await themesModel.findOne({ idChuDe: id });
  newsModel.create({
    tieuDe: req.body.title,
    trichYeu: req.body.epitomize,
    tacGia: req.body.author,
    nguon: req.body.sources,
    noiDung: req.body.editordata,
    idNguoiDang: res.locals.user.id,
    hashtag: req.body.themes,
    loaiTin: req.body.themes,
    idChuDe: req.body.themes,
    chuDe: themes.tenChuDe
  });

  res.locals.title = req.body.title;
  next();
}
async function sendmail(req, res) {
  var tieuDe = res.locals.title;
  var userEmail = await usersModel.find({
    PQ: "admin",
    id: { $ne: res.locals.user.id }
  });

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
  res.redirect("/admin");
}
async function getIDtypes(req, res) {
  var id = req.params.id;
  const themeById = await themesModel.find({ idTheLoai: id });
  res.json(themeById);
}
async function adminApprove(req, res) {
  const news = await newsModel.find({
    daDuyet: false,
    deny: false,
    idNguoiDang: { $ne: res.locals.user.id }
  });
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});

  news.sort(function(a, b) {
    return new Date(b.ngayDang) - new Date(a.ngayDang);
  });
  var arr = getFirstImage(news);

  const data = arr.map(news => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
      img: news.firstImage,
      theme: news.chuDe,
      id: news.id
    };
  });
  return res.render("admin-approve", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    data: data,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
  });
}
async function approvePost(req, res, next) {
  let id = req.params.id;
  await newsModel.updateOne(
    { id: id },
    {
      $set: {
        daDuyet: true,
        ngayDuyet: Date.now(),
        idNguoiDuyet: res.locals.user.id
      }
    }
  );
  var news = await newsModel.findOne({ id: id });

  res.locals.receiveID = news.idNguoiDang;
  res.locals.title = news.tieuDe;

  next();
}

async function approveMail(req, res) {
  var id = res.locals.receiveID;
  var title = res.locals.title;

  var reciever = await usersModel.findOne({ id: id });

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
  								<h2>Yêu cầu xét duyệt thành công </h2>
  								<p>Dear <b>${reciever.tenDayDu}</b></p>
  								<p><b>${res.locals.user.tenDayDu} </b> vừa phê duyệt bài viết <b>${title}</b> của bạn </p>
  							
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
    to: reciever.email,
    subject: "Phê Duyệt !!!",
    html: content
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.redirect("/admin/approve");
}

async function denyPost(req, res, next) {
  let id = req.params.id;
  await newsModel.updateOne({ id: id }, { $set: { deny: true } });
  var news = await newsModel.findOne({ id: id });

  res.locals.receiveID = news.idNguoiDang;
  res.locals.title = news.tieuDe;

  next();
}

async function denyMail(req, res) {
  var id = res.locals.receiveID;
  var title = res.locals.title;

  var reciever = await usersModel.findOne({ id: id });

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
  								<h2>Yêu cầu xét duyệt không thành công </h2>
  								<p>Dear <b>${reciever.tenDayDu}</b></p>
  								<p> bài viết <b>${title} </b> của bạn không được phê duyệt. Người quyết định <b>${res.locals.user.tenDayDu}</b> </p>
  							
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
    to: reciever.email,
    subject: "Yêu cầu phê duyệt không được xác nhận",
    html: content
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.redirect("/admin/approve");
}

async function adminType(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  let type = await typesModel.find({});
  let stt = 0;

  const data = type.map(type => {
    stt++;
    return {
      id: type.idTheLoai,
      Type: type.tenTheLoai,
      STT: stt
    };
  });
  return res.render("admin-type", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    types: data,
    title: "Thể Loại và Chủ Đề",
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
  });
}
async function adminAddType(req, res) {
  typesModel.create({
    idNguoiTao: res.locals.user.id,
    tenNguoiTao: res.locals.user.tenDayDu,
    tenTheLoai: req.body.addType
  });

  return res.redirect("/admin/type");
}

async function adminTheme(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  let theme = await themesModel.find({});
  let types = await typesModel.find({});
  let stt = 0;

  const dataTypes = types.map(type => {
    return {
      id: type.idTheLoai,
      type: type.tenTheLoai
    };
  });
  const data = theme.map(theme => {
    stt++;
    return {
      theme: theme.tenChuDe,
      id: theme.idChuDe,
      STT: stt
    };
  });
  return res.render("admin-theme", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    title: "Chủ Đề",
    themes: data,
    types: dataTypes,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
  });
}

async function adminAddThemes(req, res) {
  themesModel.create({
    idNguoiTao: res.locals.user.id,
    tenNguoiTao: res.locals.user.tenDayDu,
    tenChuDe: req.body.addTheme,
    idTheLoai: req.body.typeSelected
  });

  res.redirect("/admin/theme");
}

async function adminProfile(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
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
    email: email,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
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
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  let stt = 0;

  const data = userAccount.map(user => {
    stt++;
    return {
      username: user.username,
      fullName: user.tenDayDu,
      phoneNumber: user.sdt,
      email: user.email,
      birthDate: moment(user.ngaySinh).format("DD[-]MM[-]YYYY"),
      gender: user.gioiTinh,
      ID: user.cmnd,
      STT: stt
    };
  });

  return res.render("admin-account", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    userAccount: data,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
  });
}

async function adminRegister(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  return res.render("admin-register", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
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

async function adminChangePass(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  return res.render("admin-changePass", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
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
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
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
    advertise: data,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
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
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});

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
    banners: data,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
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
      admin: news.id
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
async function deleteThemes(req, res) {
  let id = req.params.id;
  await themesModel.deleteOne({ idChuDe: id });

  res.redirect("/admin/theme");
}

async function deleteTypes(req, res) {
  let id = req.params.id;
  await typesModel.deleteOne({ idTheLoai: id });

  res.redirect("/admin/type");
}
async function getTheme(req, res) {
  let id = req.params.id;
  const theme = await themesModel.find({ idChuDe: id });

  const data = theme.map(theme => {
    return {
      theme: theme.tenChuDe
    };
  });
  return res.render("admin-update", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    theme: data
  });
}
async function getType(req, res) {
  let id = req.params.id;
  const type = await typesModel.find({ idTheLoai: id });

  const types = type.map(type => {
    return {
      type: type.tenTheLoai
    };
  });
  return res.render("admin-updateType", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    type: types
  });
}
async function updateTheme(req, res) {
  let id = req.params.id;
  await themesModel.updateOne(
    { idChuDe: id },
    {
      $set: {
        tenChuDe: req.body.newNameTheme,
        idNguoiCapNhat: res.locals.user.id,
        tenNguoiCapNhat: res.locals.user.tenDayDu,
        ngayCapNhat: Date.now()
      }
    }
  );
  res.redirect("/admin/theme");
}

async function updateType(req, res) {
  let id = req.params.id;
  await typesModel.updateOne(
    { idTheLoai: id },
    {
      $set: {
        tenTheLoai: req.body.newNameType,
        idNguoiCapNhat: res.locals.user.id,
        tenNguoiCapNhat: res.locals.user.tenDayDu,
        ngayCapNhat: Date.now()
      }
    }
  );
  res.redirect("/admin/type");
}

async function comment(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  let comments = await commentModel.find({});
  let stt = 0;
  comments.sort(function(a, b) {
    return new Date(b.ngayBinhLuan) - new Date(a.ngayBinhLuan);
  });
  const data = comments.map(comment => {
    stt++;
    return {
      id: comment.id,
      news: comment.idBanTin,
      fullname: comment.hoTen,
      phone: comment.sdt,
      email: comment.email,
      content: comment.binhLuan,
      date: moment(comment.ngayBinhLuan).format("DD[-]MM[-]YYYY"),
      STT: stt
    };
  });
  return res.render("admin-comments", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    comments: data,
    title: "Bình Luận",
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
  });
}
async function deleteComment(req, res) {
  let id = req.params.id;
  await commentModel.deleteOne({ id: id });

  res.redirect("/admin/comments");
}
async function adminPosted(req, res) {
  const news = await newsModel.find({
    daDuyet: true,
    deny: false
  });
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  news.sort(function(a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });

  var arr = getFirstImage(news);
  const data = arr.map(news => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
      img: news.firstImage,
      id: news.id,
      theme: news.chuDe,
      viewsCount: news.luotXem
    };
  });

  var page = [];

  var count = await newsModel.count({ daDuyet: true, deny: false });
  var result = count / 4;

  var loop = Math.ceil(result);
  for (var i = 1; i <= loop; i++) {
    page.push(i);
  }
  return res.render("admin-posted", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    data: data.slice(0, 5),
    paginate: page,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount
  });
}
async function pagination(req, res) {
  var page = parseInt(req.params.page) || 1; //n
  var perPage = 5;

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
  denyPost,
  readNews,
  deleteThemes,
  deleteTypes,
  getTheme,
  updateTheme,
  updateType,
  getType,
  approveMail,
  denyMail,
  comment,
  deleteComment,
  adminNewPost,
  getIDtypes,
  adminWriteNews,
  sendmail,
  adminPosted,
  pagination
};
