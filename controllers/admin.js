function adminApprove(req, res) {
  return res.render("admin-approve", { layout: "admin" });
}

function admin(req, res) {
  return res.render("admin", { layout: "admin" });
}

module.exports = {
  admin,
  adminApprove
};
