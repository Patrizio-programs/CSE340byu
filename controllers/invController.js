// controllers/invController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

invCont.buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  try {
    let data = await invModel.getInventoryByClassificationId(classificationId);

    // Check if data exists and has rows property
    if (!data || !data.rows) {
      throw new Error("No data found for this classification");
    }

    const grid = await utilities.buildClassificationGrid(data.rows);

    // Let's add a title for the page
    let nav = await utilities.getNav();

    // Format the classification name for the heading
    const classificationName =
      data.rows.length > 0
        ? data.rows[0].classification_name
        : "Unknown Classification";

    res.render("./inventory/classification", {
      title: classificationName,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error in buildByClassificationId:", error);
    next(error);
  }
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  try {
    let data = await invModel.getInventoryByInventoryId(inventoryId);

    // Check if data exists and has rows property
    if (!data || !data.rows || data.rows.length === 0) {
      throw new Error("No data found for this vehicle");
    }

    const vehicleDetail = await utilities.buildVehicleDetail(data.rows[0]);

    // Let's add a title for the page
    let nav = await utilities.getNav();

    // Format the vehicle name for the heading
    const vehicleName = `${data.rows[0].inv_make} ${data.rows[0].inv_model} ${data.rows[0].inv_year}`;

    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      vehicleDetail,
    });
  } catch (error) {
    console.error("Error in buildByInventoryId:", error);
    next(error);
  }
};

module.exports = invCont;
