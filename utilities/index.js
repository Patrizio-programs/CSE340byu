const invModel = require("../models/inventory-model");
const bcrypt = require("bcryptjs");
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

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildVehicleDetail = async function (data) {
  let detail;
  if (data) {
    // Format price with commas and dollar sign
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(data.inv_price);
    
    // Format mileage with commas
    const formattedMileage = new Intl.NumberFormat("en-US").format(data.inv_miles);
    
    detail = '<div class="vehicle-detail">';
    detail += '<div class="vehicle-image">';
    detail += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />';
    detail += '</div>';
    detail += '<div class="vehicle-info">';
    detail += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details</h2>';
    detail += '<div class="price">Price: <span>' + formattedPrice + '</span></div>';
    detail += '<div class="mileage">Mileage: <span>' + formattedMileage + '</span></div>';
    detail += '<div class="year">Year: <span>' + data.inv_year + '</span></div>';
    detail += '<div class="color">Color: <span>' + data.inv_color + '</span></div>';
    detail += '<div class="description"><h3>Description</h3><p>' + data.inv_description + '</p></div>';
    detail += '</div>';
    detail += '</div>';
  } else {
    detail += '<p class="notice">Sorry, vehicle details could not be found.</p>';
  }
  return detail;
};

/* ****************************************
* Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (req.session.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
* Hash Password
* ************************************ */
Util.hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Password hashing failed");
  }
};

/* ****************************************
* Compare Passwords
* ************************************ */
Util.comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

module.exports = Util;
