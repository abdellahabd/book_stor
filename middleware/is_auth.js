module.exports = (req, res, next) => {
  if (!req.session.logidIn) {
    res.redirect("/login");
  }
  console.log("donne");
  next();
};
