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
