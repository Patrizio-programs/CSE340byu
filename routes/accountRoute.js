const express = require("express");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");

const router = express.Router();

//GET /account/profile
router.get("/profile", (req, res) => {
  res.json({ message: "Account profile route" });
});

// /account/register
router.post("/register", (req, res) => {
  // Registration logic here
  res.json({ message: "Account registration route" });
});

// Deliver login view
router.get("/login", async (req, res) => {
  let nav = await utilities.getNav(req, res);
  res.render("account/login", { 
    title: "Login",
    nav,
    errors: null,
    account_email: ""
  });
});

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Default route for account management
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagement)
);

module.exports = router;
