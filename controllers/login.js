var userModel = require("../model/usersModel");

function login(req, res) {
  return res.render("login", { layout: "login" });
}
async function authLogin(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = await userModel.findOne({ username });
  if (user) {
    if (await user.comparePassword(password)) {
      res.cookie("ID", user.id, {
        signed: true
      });
      return res.render("admin", {
        layout: "admin",
        name: username
      });
    }
  }
  // throw new Error("sai tài khoản hoặc mật khẩu");
  // if (!user) {
  //   return res.render("login", {
  //     layout: "login",
  //     erorrs: [{ error: "Sai Tài Khoản hoặc Mật Khẩu" }],
  //     value: req.body
  //   });
  //   return;
  // }
  if (user.password !== password) {
    return res.render("login", {
      layout: "login",
      erorrs: [{ erorr: "Sai Tài Khoản Hoặc Mật Khẩu " }],
      values: username
    });
    return;
  }
}
module.exports = {
  login,
  authLogin
};
