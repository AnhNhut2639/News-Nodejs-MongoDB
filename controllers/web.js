function home(req, res) {
  //   const products = Products.find();
  //   const productions = Productions.find();
  //   res.cookie("abc", "lala");

  return res.render("home", {});
}

function post(req, res) {
  return res.render("post", {});
}
function logout(req, res) {
  res.clearCookie("ID");
  res.redirect("/");
}
module.exports = {
  home,
  post,
  logout
};
