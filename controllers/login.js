function login(req, res) {
  return res.render("login", { layout: "login" });
}
module.exports = {
  login
};
