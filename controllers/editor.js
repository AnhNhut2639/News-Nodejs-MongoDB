function editor(req, res) {
  return res.render("editor", { layout: "editor" });
}
function editorNewPost(req, res) {
  return res.render("editor-newPost", { layout: "editor" });
}
function editorPosted(req, res) {
  return res.render("editor-posted", { layout: "editor" });
}
function editorProfile(req, res) {
  return res.render("editor-profile", { layout: "editor" });
}
function editorChangePass(req, res) {
  return res.render("editor-changePass", { layout: "editor" });
}
module.exports = {
  editor,
  editorNewPost,
  editorPosted,
  editorProfile,
  editorChangePass
};
