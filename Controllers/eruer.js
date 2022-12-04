module.exports = (req, res) => {
  res.status(404);
  res.render("eruer", { pagetitle: "ERUER" });
};
