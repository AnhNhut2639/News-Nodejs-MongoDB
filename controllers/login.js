var userModel = require("../model/usersModel");

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
      res.cookie("ID", user.id, {
        signed: true
      });
      if (user.PQ === "admin") {
        // cần phải sửa chỗ này
        return res.render("admin", {
          //render ra file o view
          layout: "admin"
          //name: username
        });
      } else if (user.PQ === "editor") {
        return res.render("editor", {
          layout: "editor"
        });
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
