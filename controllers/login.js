var userModel = require("../model/usersModel");
var jwt = require("jsonwebtoken");
const shortid = require("shortid");
var nodemailer = require("nodemailer");

function login(req, res) {
  return res.render("login", { layout: "login" });
}
async function authLogin(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = await userModel.findOne({ username });
  //console.log(user.password);

  if (user) {
    if (await user.comparePassword(password)) {
      if (user.khoa == true) {
        return res.render("login", {
          layout: "login",
          erorrs: [{ erorr: "Tài khoản của bạn đã bị khóa" }],
          values: username,
        });
      } else if (user.khoa == false) {
        const payload = {
          fullname: user.tenDayDu,
          id: user.id,
        };

        const token = jwt.sign({ payload }, process.env.SECRET_KEY);
        res.cookie("ID", token);
        if (user.PQ === "admin") {
          return res.redirect("/admin");
        } else if (user.PQ === "editor") {
          return res.redirect("/editor");
        }
      }
    }
  }
  if (user.password !== password) {
    return res.render("login", {
      layout: "login",
      erorrs: [{ erorr: "Sai Tài Khoản Hoặc Mật Khẩu " }],
      values: username,
    });
    return;
  }
}
function forgotPassword(req, res) {
  return res.render("forgotpassword", {
    layout: "login",
  });
}

async function confirm(req, res) {
  const account = req.body.accountForgot;
  const phone = req.body.phoneForgot;

  const user = await userModel.findOne({
    username: account,
    sdt: phone,
  });

  if (user) {
    shortid.characters(
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
    );
    var token = shortid.generate();
    var eventually = token.slice(0, 6);
    console.log(eventually);
    const payload = {
      final: eventually,
      id: user.id,
    };
    const tokenSecret = jwt.sign({ payload }, process.env.SECRET_KEY, {
      expiresIn: "5m",
    });

    res.cookie("verify", tokenSecret);
    //#region gmail
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
    								<h2>Mã xác minh</h2>
    								<p><b>${eventually}</b> là mã xác minh của bạn. Mã xác minh sẽ hết hiệu lực sau 5 phút</p>

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
      subject: "Mã xác thực",
      html: content,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    //#endregion
    res.render("certainy", {
      layout: "login",
    });
  }

  if (!user) {
    return res.render("forgotpassword", {
      layout: "login",
      erorrs: [{ erorr: "Sai tài khoản hoặc số điện thoại" }],
      accountForgot: account,
      phoneForgot: phone,
    });
  }
}

async function certainity(req, res) {
  const token = jwt.decode(req.cookies.verify, process.env.SECRET_KEY);
  let certainyCode = token.payload.final;
  let code = req.body.certainityCode;
  if (Date.now() >= token.exp * 1000) {
    res.render("certainy", {
      layout: "login",
      erorrs: [{ erorr: "Mã xác nhận đã hết hạn" }],
      verifyCode: code,
      link: "/login",
    });
  } else if (code === certainyCode) {
    res.render("certainyChangepass", {
      layout: "login",
    });
  } else {
    res.render("certainy", {
      layout: "login",
      erorrs: [{ erorr: "Mã xác nhận không hợp lệ" }],
      verifyCode: code,
    });
  }
}

async function changepass(req, res) {
  let newPassword = req.body.newPassword;
  let confirmNewPassword = req.body.confirmNewPassword;

  const token = jwt.decode(req.cookies.verify, process.env.SECRET_KEY);

  let id = token.payload.id;
  const user = await userModel.findOne({ id });

  if (user) {
    if (newPassword != confirmNewPassword) {
      return res.render("certainyChangepass", {
        layout: "login",
        errConfirm: "Mật khẩu không trùng khớp",
      });
    }
    user.password = confirmNewPassword;
    await user.save();
    return res.render("certainyChangepass", {
      layout: "login",
      success: "Đổi Mật Khẩu Thành Công",
      link: "/login",
    });
  }
  // res.clearCookie("verify");
}
module.exports = {
  login,
  authLogin,
  forgotPassword,
  confirm,
  certainity,
  changepass,
};
