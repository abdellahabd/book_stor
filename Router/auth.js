const express = require("express");
const router = express.Router();
const authControllers = require("../Controllers/auth");
const User = require("../models/User");
const { check, body } = require("express-validator");

router.get("/login", authControllers.Getlogin);
router.post(
  "/login",
  [check("email").isEmail().withMessage("enter a valide email plz")],
  authControllers.Postlogin
);
router.post("/logout", authControllers.Postlogout);

router.get("/signup", authControllers.Getsingup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("enter a valide email please")
      .custom((email, { req }) => {
        return User.findAll({
          where: {
            email: email,
          },
        }).then((user) => {
          if (user[0]) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }),
    body("password", "please enter only text and numbres, or more than 5 ")
      .isAlphanumeric()
      .isLength({ min: 5 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password  is not match");
      }
      return true;
    }),
  ],
  authControllers.Postsingup
);

router.get("/rest", authControllers.Getrest);
router.post("/rest", authControllers.Postrest);

router.get("/rest/:tokken", authControllers.Getnewpassword);
router.post("/new-password", authControllers.postNewPassword);

module.exports = router;
