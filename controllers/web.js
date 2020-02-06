function home(req, res) {
  //   const products = Products.find();
  //   const productions = Productions.find();
  //   res.cookie("abc", "lala");

  return res.render("home", {});
}

function post(req, res) {
  return res.render("post", {});
}

module.exports = {
  home,
  post
};
