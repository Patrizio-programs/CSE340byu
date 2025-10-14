
const express = require("express");
const router = express.Router();
const profileModel = require("../models/profile-model");
const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");

/* ****************************************
 *  Deliver user profile view
 * ************************************ */
async function userProfile(req, res) {
  try {
    const accountId = res.locals.accountData.account_id;
    const nav = await utilities.getNav();

    // Get user statistics
    const userStats = await profileModel.getUserStats(accountId);

    // Get user achievements
    const achievements = await profileModel.getUserAchievements(accountId);

    // Get all available achievements
    const allAchievements = await profileModel.getAllAchievements();

    // Get classification names for favorite classification
    let classificationName = "None";
    if (userStats.profile && userStats.profile.profile_favorite_classification) {
      const classificationData = await invModel.getClassifications();
      const classification = classificationData.rows.find(
        c => c.classification_id === userStats.profile.profile_favorite_classification
      );
      if (classification) {
        classificationName = classification.classification_name;
      }
    }

    res.render("profile/profile", {
      title: "My Profile",
      nav,
      userStats,
      achievements,
      allAchievements,
      classificationName,
      messages: req.flash(),
      errors: null,
    });
  } catch (error) {
    console.error("userProfile error:", error);
    req.flash("notice", "Error loading profile.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Update user profile
 * ************************************ */
async function updateProfile(req, res) {
  try {
    const accountId = res.locals.accountData.account_id;
    const { bio, avatar, favoriteClassification } = req.body;

    // Update profile
    const updatedProfile = await profileModel.updateProfile(
      accountId, 
      bio, 
      avatar, 
      favoriteClassification ? parseInt(favoriteClassification) : null
    );

    if (updatedProfile) {
      // Check if user has "Profile Complete" achievement
      const achievements = await profileModel.getUserAchievements(accountId);
      const hasProfileComplete = achievements.some(a => a.achievement_name === "Profile Complete");

      // Add achievement if not already earned and profile is complete
      if (!hasProfileComplete && bio && avatar) {
        await profileModel.addUserAchievement(accountId, 5); // Assuming ID 5 is "Profile Complete"
        req.flash("notice", "Profile updated! Achievement unlocked: Profile Complete!");
      } else {
        req.flash("notice", "Profile updated successfully!");
      }
    } else {
      req.flash("notice", "Error updating profile.");
    }

    res.redirect("/profile");
  } catch (error) {
    console.error("updateProfile error:", error);
    req.flash("notice", "Error updating profile.");
    res.redirect("/profile");
  }
}

/* ****************************************
 *  Award first login achievement
 * ************************************ */
async function awardFirstLogin(req, res, next) {
  try {
    const accountId = res.locals.accountData.account_id;

    // Check if user has "First Login" achievement
    const achievements = await profileModel.getUserAchievements(accountId);
    const hasFirstLogin = achievements.some(a => a.achievement_name === "First Login");

    // Add achievement if not already earned
    if (!hasFirstLogin) {
      await profileModel.addUserAchievement(accountId, 1); // Assuming ID 1 is "First Login"
      req.flash("notice", "Achievement unlocked: First Login!");
    }

    next();
  } catch (error) {
    console.error("awardFirstLogin error:", error);
    next();
  }
}

/* ****************************************
 *  Track vehicle views for achievements
 * ************************************ */
async function trackVehicleView(req, res, next) {
  try {
    const accountId = res.locals.accountData.account_id;

    if (accountId) {
      // This is a simplified approach - in a real app, you'd track in a separate table
      // For now, we'll just check if they've viewed enough vehicles to unlock an achievement

      // Get all achievements
      const achievements = await profileModel.getUserAchievements(accountId);
      const hasCarExplorer = achievements.some(a => a.achievement_name === "Car Explorer");

      // Add achievement if not already earned
      if (!hasCarExplorer) {
        // In a real implementation, you'd check actual view count
        // For demo purposes, we'll just unlock it after viewing 5 vehicles
        await profileModel.addUserAchievement(accountId, 2); // Assuming ID 2 is "Car Explorer"
        req.flash("notice", "Achievement unlocked: Car Explorer!");
      }
    }

    next();
  } catch (error) {
    console.error("trackVehicleView error:", error);
    next();
  }
}

module.exports = {
  userProfile,
  updateProfile,
  awardFirstLogin,
  trackVehicleView
};
