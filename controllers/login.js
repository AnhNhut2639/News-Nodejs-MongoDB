var userModel = require("../model/usersModel");
var jwt = require("jsonwebtoken");

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
      const payload = {
        fullname: user.tenDayDu,
        id: user.id
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
