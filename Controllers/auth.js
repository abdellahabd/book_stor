const crybto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const { validationResult } = require("express-validator");

const nodemaile = require("nodemailer");
const mailegun = require("nodemailer-mailgun-transport");
const { DATE } = require("mysql2/lib/constants/types");

const auth = {
  auth: {
    api_key: "key-c613a09856091a305de3b9b9d7648182",
    domain: "sandboxb87a33e401fa4b4199cafe335e4df058.mailgun.org",
  },
};

const nodemailerMailgun = nodemaile.createTransport(mailegun(auth));

exports.Getlogin = (req, res, next) => {
  res.render("auth/login.ejs", {
    pagetitle: "Login page",
    errue: req.flash("errue"),
    oldData: { email: "", password: "" },
  });
};

exports.Postlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("auth/login.ejs", {
      pagetitle: "Login page",
      errue: errors.array()[0].msg,
      oldData: { email: email, password: password },
    });
  }
  User.findAll({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (user[0]) {
        bcrypt.compare(password, user[0].password).then((ismatch) => {
          if (!ismatch) {
            req.flash("errue", "Password not correct");
            return res.status(400).render("auth/login.ejs", {
              pagetitle: "Login page",
              errue: req.flash("errue"),

              oldData: { email: email, password: password },
            });
          } else {
            req.session.logidIn = true;
            req.session.user_id = user.id_user;
            req.session.save((err) => {
              res.redirect("/");
            });
          }
        });
      } else {
        req.flash("errue", "No account with that email found.");
        return res.status(400).render("auth/login.ejs", {
          pagetitle: "Login page",
          errue: req.flash("errue"),
          oldData: { email: email, password: password },
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.Getsingup = (req, res, next) => {
  res.render("auth/signup", {
    pagetitle: "Sing up",
    errue: req.flash("errue"),
    oldData: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    whicherror: [],
  });
};
exports.Postsingup = (req, res, next) => {
  let user_c;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(400).render("auth/signup", {
      pagetitle: "Sing up",
      oldData: {
        email: email,
        password: password,
        passwordConfirm: req.body.confirmPassword,
      },
      errue: errors.array()[0].msg,
      whicherror: errors.array(),
    });
  }

  User.findAll({
    where: {
      email: email,
    },
  }).then((user) => {
    req.session.logidIn = true;
    bcrypt
      .hash(password, 12)
      .then((hashpass) => {
        return User.create({
          name_user: name,
          email: email,
          password: hashpass,
        });
      })
      .then((user) => {
        req.session.user_id = user.id_user;
        req.session.save((r) => {
          res.redirect("/");
          return nodemailerMailgun.sendMail(
            {
              from: "abdellah-shop@example.com",
              to: email,
              subject: "logUp seccefed ",
              text: "Congratiolation you'r Singup",
            },
            (err, info) => {
              if (err) {
                console.log(`Error: ${err}`);
              }
            }
          );
        });
      });
  });
};

exports.Postlogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("////////////from POSTLogOut" + err);
    res.redirect("/");
  });
};

exports.Getrest = (req, res, next) => {
  res.render("auth/restpassword.ejs", {
    pagetitle: "Rest Password",
    errue: req.flash("errue"),
  });
};

exports.Postrest = (req, res, next) => {
  const mail = req.body.email;
  let userNew;
  let tokken;
  crybto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("////from  Post rest " + err);
      return res.redirect("/rest");
    }
    User.findAll({ where: { email: mail } })
      .then((user) => {
        userNew = user[0];
        tokken = buffer.toString("hex");
        if (!userNew) {
          req.flash("errue", "No account with that email found.");
          return res.redirect("/rest");
        }
        userNew.restToken = tokken;
        userNew.restTokenExperation = Date.now() + 3600000;
        return userNew.save();
      })
      .then((ress) => {
        res.redirect("/");
        return nodemailerMailgun
          .sendMail({
            to: mail,
            from: "abdellah-shop@example.com",
            subject: "REST password ",
            html: `<h1>you reqeaste to rest password</h1>
          <p>cklick this link <a href='http://localhost:2000/rest/${tokken}'>set password</a> to set a new password  </p>`,
          })
          .catch((err) => {
            console.log("//////from Post rest send mail");
          });
      })
      .catch((err) => {
        console.log("//////From  Post rest " + err);
      });
  });
};

exports.Getnewpassword = (req, res, next) => {
  const tokken = req.params.tokken;

  User.findAll({
    where: { restToken: tokken },
  }).then((user) => {
    if (user[0].restTokenExperation > Date.now()) {
      res.render("auth/setnewpassword.ejs", {
        pagetitle: "set password",
        userId: user[0].id_user,
        tokkenpassword: tokken,
      });
    }
  });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userID;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findAll({
    where: {
      restToken: passwordToken,
      id_user: userId,
    },
  })
    .then((user) => {
      resetUser = user[0];
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.restToken = undefined;
      resetUser.restTokenExperation = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
