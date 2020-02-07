function editor(req, res) {
  return res.render("editor", { layout: "editor" });
}
module.exports = {
  editor
};
