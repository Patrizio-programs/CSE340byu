const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function getNav(req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data);
  let nav = "<ul>";

  // Add home link
  nav += '<li><a href="/">Home</a></li>';

  // Add classification links
  data.rows.forEach((row) => {
    nav += `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`;
  });

  nav += "</ul>";
  return nav;
};

module.exports = Util;
