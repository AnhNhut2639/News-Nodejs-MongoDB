var alert = require("alert-node");
module.exports.checkAdmin = function(req, res, next) {
  let permission = res.locals.user.PQ;

  if (permission != "admin") {
    alert("Bạn không được quyền truy cập vào trang Quản trị viên !!!");
    res.redirect("/editor");
    return;
  }

  next();
};

module.exports.checkEditor = function(req, res, next) {
  let permission = res.locals.user.PQ;

  if (permission != "editor") {
    alert("Bạn không được quyền truy cập vào trang Biên tập viên !!!");
    res.redirect("/admin");
    return;
  }

  next();
};
