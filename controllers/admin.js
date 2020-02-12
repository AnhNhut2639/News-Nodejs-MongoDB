function admin(req, res) {
  //console.log(res.locals.user.username);
  // var username = res.locals.user.username; // từ middleware checkCookie sang
  return res.render("admin", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminApprove(req, res) {
  return res.render("admin-approve", {
    layout: "admin",
    username: res.locals.user.username
  });
}
function adminType(req, res) {
  return res.render("admin-type", { layout: "admin" });
}

function adminProfile(req, res) {
  return res.render("admin-profile", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminAccount(req, res) {
  return res.render("admin-account", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminRegister(req, res) {
  return res.render("admin-register", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminChangePass(req, res) {
  return res.render("admin-changePass", {
    layout: "admin",
    username: res.locals.user.username
  });
}

function adminAdvertise(req, res) {
  return res.render("admin-advertise", {
    layout: "admin",
    username: res.locals.user.username
  });
}
function adminBanner(req, res) {
  return res.render("admin-banner", {
    layout: "admin",
    username: res.locals.user.username
  });
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
