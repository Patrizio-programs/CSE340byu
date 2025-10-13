const utilities = require("../utilities/");
const baseController = {};
const session = require("express-session");
const flash = require("connect-flash");

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav(req, res);
  res.render("index", { title: "Home", nav, messages: [] });
};

module.exports = baseController;
