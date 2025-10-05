// Needed Resources
const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);

// Route to build vehicle detail view
router.get("/detail/:inventoryId", invCont.buildByInventoryId);

// Route to build delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invCont.buildDeleteConfirmation));

// Route to process the delete request
router.post("/delete/:inv_id", utilities.handleErrors(invCont.processDelete));

module.exports = router;
