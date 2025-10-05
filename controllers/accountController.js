const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
require("dotenv").config();

//  GET /account/profile
router.get("/profile", (req, res) => {
  // Placeholder logic for fetching user profile
  res.json({ message: "User profile data" });
});

//  POST /account/register
router.post("/register", (req, res) => {
  // Placeholder logic for user registration
  res.json({ message: "User registered successfully" });
});

// POST /account/login
router.post("/login", (req, res) => {
  // Placeholder logic for user login
  res.json({ message: "User logged in successfully" });
});

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver account management view
 * ************************************ */
async function accountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    messages: req.flash(),
    errors: null,
  });
}

module.exports = { router, accountLogin, accountManagement };
