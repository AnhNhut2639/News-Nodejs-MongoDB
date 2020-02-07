function admin(req, res) {
  return res.render("admin", { layout: "admin" });
}

function adminApprove(req, res) {
  return res.render("admin-approve", { layout: "admin" });
}
function adminType(req, res) {
  return res.render("admin-type", { layout: "admin" });
}

function adminProfile(req, res) {
  return res.render("admin-profile", { layout: "admin" });
}

function adminAccount(req, res) {
  return res.render("admin-account", { layout: "admin" });
}

function adminRegister(req, res) {
  return res.render("admin-register", { layout: "admin" });
}

function adminChangePass(req, res) {
  return res.render("admin-changePass", { layout: "admin" });
}

function adminAdvertise(req, res) {
  return res.render("admin-advertise", { layout: "admin" });
}
function adminBanner(req, res) {
  return res.render("admin-banner", { layout: "admin" });
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
  adminBanner
};
