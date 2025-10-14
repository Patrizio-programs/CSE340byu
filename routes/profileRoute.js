
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const utilities = require("../utilities");

// Profile route
router.get("/", utilities.checkJWTToken, utilities.handleErrors(profileController.userProfile));

// Update profile
router.post("/update", utilities.checkJWTToken, utilities.handleErrors(profileController.updateProfile));

module.exports = router;
