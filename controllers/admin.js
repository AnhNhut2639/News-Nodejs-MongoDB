var typesModel = require("../model/typesNewsModel");
var themesModel = require("../model/themesModel");
var usersModel = require("../model/usersModel");
var bannersModel = require("../model/bannerModel");
var advertiseModel = require("../model/advertiseModel");
var newsModel = require("../model/newsModel");
var commentModel = require("../model/commentModel");
var moment = require("moment");
var nodemailer = require("nodemailer");
var alert = require("alert-node");

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

// function getFirstImage(data) {
//   let regex = /<img.*?src="(.*?)"/;
//   data.forEach(item => (item.firstImage = regex.exec(item.noiDung)[1]));
//   return data;
// }
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
    themesCount: themesCount,
  });
}

async function adminNewPost(req, res) {
  const types = await typesModel.find({});
  const themes = await themesModel.find({});
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});

  const dataTypes = types.map((types) => {
    return {
      typesName: types.tenTheLoai,
      id: types.idTheLoai,
    };
  });

  const dataThemes = themes.map((themes) => {
    return {
      theme: themes.tenChuDe,
      id: themes.id,
      idTheLoai: themes.idTheLoai,
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
    themesCount: themesCount,
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
    tenNguoiDang: res.locals.user.tenDayDu,
    hashtag: req.body.themes,
    tinNoiBat: req.body.checkedTypeNews,
    idChuDe: req.body.themes,
    chuDe: themes.tenChuDe,
  });

  res.locals.title = req.body.title;
  next();
}
async function sendmail(req, res) {
  var tieuDe = res.locals.title;
  var userEmail = await usersModel.find({
    PQ: "admin",
    id: { $ne: res.locals.user.id },
  });

  userEmail.forEach(function (user) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
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
      subject: "Yêu cầu xét duyệt",
      html: content,
    };

    transporter.sendMail(mailOptions, function (error, info) {
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
    idNguoiDang: { $ne: res.locals.user.id },
  });
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});

  news.sort(function (a, b) {
    return new Date(b.ngayDang) - new Date(a.ngayDang);
  });
  var arr = getFirstImage(news);

  const data = arr.map((news) => {
    if (news.tinNoiBat == true) {
      var newsKind = "Tin nổi bật";
    } else {
      var newsKind = "Tin thường";
    }

    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
      img: news.firstImage,
      theme: news.chuDe,
      id: news.id,
      kind: newsKind,
    };
  });
  return res.render("admin-approve", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    data: data,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
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
        idNguoiDuyet: res.locals.user.id,
        tenNguoiDuyet: res.locals.user.tenDayDu,
      },
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
      pass: process.env.pass,
    },
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
    html: content,
  };

  transporter.sendMail(mailOptions, function (error, info) {
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
      pass: process.env.pass,
    },
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
    html: content,
  };

  transporter.sendMail(mailOptions, function (error, info) {
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

  const data = type.map((type) => {
    stt++;
    return {
      id: type.idTheLoai,
      Type: type.tenTheLoai,
      position: type.viTri,
      STT: stt,
    };
  });
  return res.render("admin-type", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    types: data,
    title: "Thể Loại",
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}
async function adminAddType(req, res) {
  let position = await typesModel.count({});
  let viTri = position + 1;

  typesModel.create({
    idNguoiTao: res.locals.user.id,
    tenNguoiTao: res.locals.user.tenDayDu,
    tenTheLoai: req.body.addType,
    viTri: viTri,
  });

  res.redirect("/admin/type");
}

async function adminTheme(req, res) {
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
  return res.render("admin-theme", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    title: "Chủ Đề",
    themes: data,
    types: dataTypes,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}

async function adminAddThemes(req, res) {
  if (req.file === undefined) {
    req.body.avatarTheme = "uploads/default.jpg";
  } else if (req.file.path) {
    req.body.avatarTheme = req.file.path.split("/").slice(1).join("/");
  }

  let urlTheme = "/" + req.body.avatarTheme;
  themesModel.create({
    idNguoiTao: res.locals.user.id,
    tenNguoiTao: res.locals.user.tenDayDu,
    tenChuDe: req.body.addTheme,
    img: urlTheme,
    idTheLoai: req.body.typeSelected,
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
    themesCount: themesCount,
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

  const data = userAccount.map((user) => {
    stt++;
    if (user.khoa == true) {
      var lock = "danger";
      var icon = "lock";
    }
    if (user.khoa == false) {
      var lock = "primary";
      var icon = "unlock";
    }
    return {
      username: user.username,
      fullName: user.tenDayDu,
      phoneNumber: user.sdt,
      email: user.email,
      birthDate: moment(user.ngaySinh).format("DD[-]MM[-]YYYY"),
      gender: user.gioiTinh,
      ID: user.cmnd,
      id: user.id,
      lock: lock,
      icon: icon,
      STT: stt,
    };
  });

  return res.render("admin-account", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    userAccount: data,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
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
    themesCount: themesCount,
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
    PQ: req.body.permission,
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
    themesCount: themesCount,
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
          errConfirm: "Mật khẩu không trùng khớp",
        });
      }
      user.password = confirmNewPassword;
      await user.save();
      return res.render("admin-changePass", {
        layout: "admin",
        fullname: res.locals.user.tenDayDu,
        success: "Đổi Mật Khẩu Thành Công",
      });
    } else {
      return res.render("admin-changePass", {
        layout: "admin",
        fullname: res.locals.user.tenDayDu,
        err: "Mật khẩu cũ không chính xác",
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
  const data = advertise.map((advertise) => {
    stt++;
    return {
      STT: stt,
      id: advertise.idQC,
      describe: advertise.motaQC,
      url: advertise.urlHinhQC,
      link: advertise.link,
      position: advertise.viTri,
      postedBy: advertise.tenNguoiDang,
      date: moment(advertise.ngayDang).format("DD[-]MM[-]YYYY"),
    };
  });
  return res.render("admin-advertise", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    advertise: data,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}

async function adminAddAdvertise(req, res) {
  var counts = await advertiseModel.count({});
  var position = counts + 1;
  let describe = req.body.describe;
  let link = req.body.link;
  req.body.advertise = req.file.path.split("/").slice(1).join("/");
  let urlAdvertise = "/" + req.body.advertise;

  advertiseModel.create({
    motaQC: describe,
    urlHinhQC: urlAdvertise,
    link: link,
    viTri: position,
    tenNguoiDang: res.locals.user.tenDayDu,
    idNguoiDang: res.locals.user.id,
  });

  res.redirect("/admin/advertise");
}

async function adminBanner(req, res) {
  const banner = await bannersModel.find({});
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  banner.sort(function (a, b) {
    return new Date(b.ngayDang) - new Date(a.ngayDang);
  });

  let stt = 0;
  const data = banner.map((banner) => {
    stt++;
    return {
      STT: stt,
      id: banner.idBanner,
      describe: banner.motaBanner,
      url: banner.urlHinhAnh,
      postedBy: banner.tenNguoiDang,
      date: moment(banner.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
    };
  });
  return res.render("admin-banner", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    banners: data,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}
function adminAddBanner(req, res) {
  let describe = req.body.describe;
  req.body.banner = req.file.path.split("/").slice(1).join("/");
  let urlBanner = "/" + req.body.banner;

  bannersModel.create({
    motaBanner: describe,
    urlHinhAnh: urlBanner,
    idNguoiDang: res.locals.user.id,
    tenNguoiDang: res.locals.user.tenDayDu,
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

  const data = news.map((news) => {
    return {
      title: news.tieuDe,
      epitomize: news.trichYeu,
      author: news.tacGia,
      content: news.noiDung,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDang).format("h:mm a"),
      admin: news.id,
    };
  });

  return res.render("news", {
    layout: "news",
    fullname: res.locals.user.tenDayDu,
    data: data,
    theme: theme,
    type: type,
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

  const data = theme.map((theme) => {
    return {
      theme: theme.tenChuDe,
      img: theme.img,
    };
  });
  return res.render("admin-update", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    theme: data,
  });
}
async function getType(req, res) {
  let id = req.params.id;
  const type = await typesModel.find({ idTheLoai: id });

  const types = type.map((type) => {
    return {
      type: type.tenTheLoai,
      position: type.viTri,
    };
  });
  return res.render("admin-updateType", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    type: types,
  });
}
async function updateTheme(req, res) {
  let id = req.params.id;

  const oldInfo = await themesModel.findOne({ idChuDe: id });

  var oldImg = oldInfo.img;
  if (req.file === undefined) {
    req.body.avatarChanged = oldImg;
  } else if (req.file.path) {
    req.body.avatarChanged = "/" + req.file.path.split("/").slice(1).join("/");
  }

  let urlTheme = req.body.avatarChanged;

  await themesModel.updateOne(
    { idChuDe: id },
    {
      $set: {
        tenChuDe: req.body.newNameTheme,
        img: urlTheme,
        idNguoiCapNhat: res.locals.user.id,
        tenNguoiCapNhat: res.locals.user.tenDayDu,
        ngayCapNhat: Date.now(),
      },
    }
  );
  res.redirect("/admin/theme");
}

async function getAdvertise(req, res) {
  let id = req.params.id;
  const advertise = await advertiseModel.find({ idQC: id });

  const data = advertise.map((advertise) => {
    return {
      describe: advertise.motaQC,
      link: advertise.link,
      position: advertise.viTri,
    };
  });
  return res.render("admin-updateAdvertise", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    advertise: data,
  });
}

async function updateAdvertise(req, res) {
  let id = req.params.id;
  var oldPos = await advertiseModel.findOne({ idQC: id });
  var newPosition = req.body.newPosition;
  var oldPosition = oldPos.viTri;

  await advertiseModel.updateOne(
    { viTri: newPosition },
    {
      $set: {
        viTri: oldPosition,
      },
    }
  );
  await advertiseModel.updateOne(
    { idQC: id },
    {
      $set: {
        motaQC: req.body.newDescribe,
        link: req.body.newLink,
        viTri: newPosition,
      },
    }
  );

  res.redirect("/admin/advertise");
}

async function updateType(req, res) {
  let id = req.params.id;

  var oldPos = await typesModel.findOne({ idTheLoai: id });
  var newPosition = req.body.newPosition;
  var oldPosition = oldPos.viTri;

  await typesModel.updateOne(
    { viTri: newPosition },
    {
      $set: {
        viTri: oldPosition,
      },
    }
  );
  await typesModel.updateOne(
    { idTheLoai: id },
    {
      $set: {
        tenTheLoai: req.body.newNameType,
        viTri: newPosition,
        idNguoiCapNhat: res.locals.user.id,
        tenNguoiCapNhat: res.locals.user.tenDayDu,
        ngayCapNhat: Date.now(),
      },
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
  comments.sort(function (a, b) {
    return new Date(b.ngayBinhLuan) - new Date(a.ngayBinhLuan);
  });
  const data = comments.map((comment) => {
    stt++;
    return {
      id: comment.id,
      news: comment.idBanTin,
      fullname: comment.hoTen,
      phone: comment.sdt,
      email: comment.email,
      content: comment.binhLuan,
      date: moment(comment.ngayBinhLuan).format("DD[-]MM[-]YYYY"),
      STT: stt,
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
    themesCount: themesCount,
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
    deny: false,
  });
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  news.sort(function (a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });

  var arr = getFirstImage(news);
  const data = arr.map((news) => {
    if (news.ngayCapNhat == null) {
      news.ngayCapNhat = null;
    }
    return {
      title: news.tieuDe,
      // epitomize: news.trichYeu,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
      img: news.firstImage,
      id: news.id,
      theme: news.chuDe,
      postedBy: news.tenNguoiDang,
      approvedBy: news.tenNguoiDuyet,
      dateApproved: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY h:mm a"),
      editedBy: news.tenNguoiCapNhat,
      dateEdited: moment(news.ngayCapNhat).format("DD[-]MM[-]YYYY h:mm a"),
      viewsCount: news.luotXem,
    };
  });

  var page = [];

  var count = await newsModel.count({ daDuyet: true, deny: false });
  var result = count / 5;

  var loop = Math.ceil(result);

  console.log(loop);
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
    themesCount: themesCount,
  });
}
async function pagination(req, res) {
  var page = parseInt(req.params.page) || 1; //n
  var perPage = 5;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  var news = await newsModel.find({ daDuyet: true, deny: false });

  news.sort(function (a, b) {
    return new Date(b.ngayDuyet) - new Date(a.ngayDuyet);
  });
  var arr = getFirstImage(news);
  const data = arr.map((news) => {
    if (news.ngayCapNhat == null) {
      news.ngayCapNhat = null;
    }
    return {
      title: news.tieuDe,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
      img: news.firstImage,
      id: news.id,
      theme: news.chuDe,
      postedBy: news.tenNguoiDang,
      approvedBy: news.tenNguoiDuyet,
      dateApproved: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY h:mm a"),
      editedBy: news.tenNguoiCapNhat,
      dateEdited: moment(news.ngayCapNhat).format("DD[-]MM[-]YYYY h:mm a"),
      viewsCount: news.luotXem,
    };
  });
  const realdata = data.slice(start, end);
  res.json(realdata);
}

async function editNews(req, res) {
  let id = req.params.id;

  const news = await newsModel.find({ id: id }).limit(1);

  const types = await typesModel.find({});
  const themes = await themesModel.find({});
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});

  const data = news.map((news) => {
    return {
      id: news.id,
      title: news.tieuDe,
      epitomize: news.trichYeu,
      content: news.noiDung,
      source: news.nguon,
      author: news.tacGia,
      kind: news.tinNoiBat,
    };
  });
  const dataTypes = types.map((types) => {
    return {
      typesName: types.tenTheLoai,
      id: types.idTheLoai,
    };
  });

  const dataThemes = themes.map((themes) => {
    return {
      theme: themes.tenChuDe,
      id: themes.id,
      idTheLoai: themes.idTheLoai,
    };
  });

  return res.render("admin-edit", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    news: data,
    data: dataTypes,
    arrThemes: dataThemes,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}

async function updateNews(req, res) {
  let id = req.params.id;

  let title = req.body.title;
  let epitomize = req.body.epitomize;
  let content = req.body.editordata;
  let source = req.body.sources;
  let author = req.body.author;
  let kind = req.body.checkedTypeNews;

  await newsModel.updateOne(
    { id: id },
    {
      $set: {
        tieuDe: title,
        epitomize: epitomize,
        noiDung: content,
        nguon: source,
        tacGia: author,
        tinNoiBat: kind,
        idNguoiCapNhat: res.locals.user.id,
        tenNguoiCapNhat: res.locals.user.tenDayDu,
        ngayCapNhat: Date.now(),
      },
    }
  );

  res.redirect("/admin/posted");
}

async function deleteNews(req, res) {
  let id = req.params.id;
  await newsModel.deleteOne({ id: id });
  res.redirect("/admin/posted");
}
async function deleteAdvertise(req, res) {
  let id = req.params.id;
  await advertiseModel.deleteOne({ idQC: id });
  res.redirect("/admin/advertise");
}
async function deleteBanner(req, res) {
  let id = req.params.id;
  await bannersModel.deleteOne({ idQC: id });
  res.redirect("/admin/banner");
}

async function deleteAccount(req, res) {
  let id = req.params.id;
  await usersModel.deleteOne({ id: id });
  res.redirect("/admin/account");
}

async function blockAccount(req, res) {
  let id = req.params.id;
  const user = await usersModel.findOne({ id: id });
  if (user.khoa == false) {
    await usersModel.updateOne({ id: id }, { $set: { khoa: true } });
  }
  if (user.khoa == true) {
    await usersModel.updateOne({ id: id }, { $set: { khoa: false } });
  }

  res.redirect("/admin/account");
}

async function search(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  var q = req.query.search;
  const search = await newsModel.find({
    daDuyet: true,
    deny: false,
    $text: { $search: q },
  });
  if (search == "") {
    var message = "Không tìm thấy bài viết";
  }
  var arr = getFirstImage(search);

  arr.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  const data = arr.map((news) => {
    if (news.ngayCapNhat == null) {
      news.ngayCapNhat = null;
    }
    return {
      title: news.tieuDe,
      // epitomize: news.trichYeu,
      date: moment(news.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
      img: news.firstImage,
      id: news.id,
      theme: news.chuDe,
      postedBy: news.tenNguoiDang,
      approvedBy: news.tenNguoiDuyet,
      dateApproved: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY h:mm a"),
      editedBy: news.tenNguoiCapNhat,
      dateEdited: moment(news.ngayCapNhat).format("DD[-]MM[-]YYYY h:mm a"),
      viewsCount: news.luotXem,
    };
  });

  return res.render("admin-posted", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    data: data,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
    message: message,
  });
}

async function searchType(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});

  var q = req.query.search;
  const search = await typesModel.find({
    $text: { $search: q },
  });
  if (search == "") {
    var message = "Không tìm thấy thể loại";
  }
  let stt = 0;

  const data = search.map((type) => {
    stt++;
    return {
      id: type.idTheLoai,
      Type: type.tenTheLoai,
      position: type.viTri,
      STT: stt,
    };
  });
  return res.render("admin-type", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    types: data,
    title: "Thể Loại",
    message: message,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}

async function searchTheme(req, res) {
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  var q = req.query.search;
  const searchTheme = await themesModel.find({
    $text: { $search: q },
  });
  if (searchTheme == "") {
    var message = "Không tìm thấy chủ đề";
  }
  let types = await typesModel.find({});
  let stt = 0;

  const dataTypes = types.map((type) => {
    return {
      id: type.idTheLoai,
      type: type.tenTheLoai,
    };
  });
  const data = searchTheme.map((theme) => {
    stt++;
    return {
      theme: theme.tenChuDe,
      id: theme.idChuDe,
      STT: stt,
    };
  });
  return res.render("admin-theme", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu, //load dữ liệu lên trang thể loại và chủ đề
    title: "Chủ Đề",
    message: message,
    themes: data,
    types: dataTypes,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}
async function searchAccount(req, res) {
  var q = req.query.search;
  const searchAccount = await usersModel.find({
    $text: { $search: q },
  });
  if (searchAccount == "") {
    var message = "Không tìm thấy Tài khoản";
  }
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  let stt = 0;

  const data = searchAccount.map((user) => {
    stt++;
    if (user.khoa == true) {
      var lock = "danger";
      var icon = "lock";
    }
    if (user.khoa == false) {
      var lock = "primary";
      var icon = "unlock";
    }
    return {
      username: user.username,
      fullName: user.tenDayDu,
      phoneNumber: user.sdt,
      email: user.email,
      birthDate: moment(user.ngaySinh).format("DD[-]MM[-]YYYY"),
      gender: user.gioiTinh,
      ID: user.cmnd,
      id: user.id,
      lock: lock,
      icon: icon,
      STT: stt,
    };
  });

  return res.render("admin-account", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    userAccount: data,
    message: message,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}
async function searchAdvertise(req, res) {
  var q = req.query.search;
  const searchAdvertise = await advertiseModel.find({
    $text: { $search: q },
  });
  if (searchAdvertise == "") {
    var message = "Không tìm thấy quảng cáo tương ứng";
  }
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  let stt = 0;
  const data = searchAdvertise.map((advertise) => {
    stt++;
    return {
      STT: stt,
      id: advertise.idQC,
      describe: advertise.motaQC,
      url: advertise.urlHinhQC,
      link: advertise.link,
      position: advertise.viTri,
      postedBy: advertise.tenNguoiDang,
      date: moment(advertise.ngayDang).format("DD[-]MM[-]YYYY"),
    };
  });
  return res.render("admin-advertise", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    advertise: data,
    message: message,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}

async function searchBanner(req, res) {
  var q = req.query.search;
  const searchBanner = await bannersModel.find({
    $text: { $search: q },
  });
  if (searchAdvertise == "") {
    var message = "Không tìm thấy banner tương ứng";
  }
  var newsCount = await newsModel.count({ daDuyet: true, deny: false });
  var usersCount = await usersModel.count({});
  var typesCount = await typesModel.count({});
  var themesCount = await themesModel.count({});
  searchBanner.sort(function (a, b) {
    return new Date(b.ngayDang) - new Date(a.ngayDang);
  });

  let stt = 0;
  const data = searchBanner.map((banner) => {
    stt++;
    return {
      STT: stt,
      id: banner.idBanner,
      describe: banner.motaBanner,
      url: banner.urlHinhAnh,
      postedBy: banner.tenNguoiDang,
      date: moment(banner.ngayDang).format("DD[-]MM[-]YYYY h:mm a"),
    };
  });
  return res.render("admin-banner", {
    layout: "admin",
    fullname: res.locals.user.tenDayDu,
    banners: data,
    message: message,
    newsCount: newsCount,
    usersCount: usersCount,
    typesCount: typesCount,
    themesCount: themesCount,
  });
}

async function resetPassword(req, res) {
  let id = req.params.id;

  const user = await usersModel.findOne({ id: id });

  const username = user.tenDayDu;

  await usersModel.updateOne(
    { id: id },
    {
      $set: {
        password:
          "$2a$10$lgymVFN7wgXIOgp681YZQeHUTM3Ty4oONgJi8YQbQFuET9jlUAQJ6",
      },
    }
  );

  alert(
    "Bạn vừa reset mật khẩu cho tài khoản  " +
      username +
      " với mật khẩu là 123456(mặc định)"
  );

  res.redirect("/admin/account");
}

async function unload(req, res, next) {
  let id = req.params.id;
  const news = await newsModel.findOne({ id: id });

  await newsModel.updateOne(
    { id: id },
    {
      $set: {
        daDuyet: false,
        deny: true,
      },
    }
  );

  res.locals.id = news.idNguoiDang;
  res.locals.title = news.tieuDe;
  next();
}

async function unloadMail(req, res) {
  var title = res.locals.title;
  var id = res.locals.id;

  var reciever = await usersModel.findOne({ id: id });

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
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
  								<h2> Gỡ bài viết </h2>
  								<p>Dear <b>${reciever.tenDayDu}</b></p>
                  <p><b>${res.locals.user.tenDayDu} </b> vừa gỡ bài viết <b>${title}</b> của bạn, bài viết sẽ được chuyển về mục không được xét duyệt </p>
                  <p>Liên hệ <b>${res.locals.user.tenDayDu}</b> với số điện thoại <b>${res.locals.user.sdt} </b> để biết thêm chi tiết </p>
  							
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
    subject: "Gỡ bài viết",
    html: content,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.redirect("/admin/posted");
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
  pagination,
  getAdvertise,
  updateAdvertise,
  editNews,
  updateNews,
  deleteNews,
  deleteAdvertise,
  deleteBanner,
  deleteAccount,
  blockAccount,
  search,
  searchType,
  searchTheme,
  searchAccount,
  searchAdvertise,
  searchBanner,
  resetPassword,
  unload,
  unloadMail,
};
