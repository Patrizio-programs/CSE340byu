
const pool = require("../database/");

/* ***************************
 *  Get user profile by account ID
 * ************************** */
async function getProfileByAccountId(accountId) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.user_profiles WHERE account_id = $1",
      [accountId]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getProfileByAccountId error " + error);
    return null;
  }
}

/* ***************************
 *  Create or update user profile
 * ************************** */
async function updateProfile(accountId, bio, avatar, favoriteClassification) {
  try {
    // Check if profile exists
    const existingProfile = await getProfileByAccountId(accountId);

    if (existingProfile) {
      // Update existing profile
      const result = await pool.query(
        "UPDATE public.user_profiles SET profile_bio = $1, profile_avatar = $2, profile_favorite_classification = $3 WHERE account_id = $4 RETURNING *",
        [bio, avatar, favoriteClassification, accountId]
      );
      return result.rows[0];
    } else {
      // Create new profile
      const result = await pool.query(
        "INSERT INTO public.user_profiles (account_id, profile_bio, profile_avatar, profile_favorite_classification) VALUES ($1, $2, $3, $4) RETURNING *",
        [accountId, bio, avatar, favoriteClassification]
      );
      return result.rows[0];
    }
  } catch (error) {
    console.error("updateProfile error " + error);
    return null;
  }
}

/* ***************************
 *  Get all achievements
 * ************************** */
async function getAllAchievements() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.achievements ORDER BY achievement_points"
    );
    return data.rows;
  } catch (error) {
    console.error("getAllAchievements error " + error);
    return [];
  }
}

/* ***************************
 *  Get user achievements by account ID
 * ************************** */
async function getUserAchievements(accountId) {
  try {
    const data = await pool.query(
      "SELECT a.*, ua.earned_date FROM public.achievements a JOIN public.user_achievements ua ON a.achievement_id = ua.achievement_id WHERE ua.account_id = $1 ORDER BY ua.earned_date DESC",
      [accountId]
    );
    return data.rows;
  } catch (error) {
    console.error("getUserAchievements error " + error);
    return [];
  }
}

/* ***************************
 *  Add achievement to user
 * ************************** */
async function addUserAchievement(accountId, achievementId) {
  try {
    // Check if user already has this achievement
    const existing = await pool.query(
      "SELECT * FROM public.user_achievements WHERE account_id = $1 AND achievement_id = $2",
      [accountId, achievementId]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0]; // Achievement already earned
    }

    // Add new achievement
    const result = await pool.query(
      "INSERT INTO public.user_achievements (account_id, achievement_id) VALUES ($1, $2) RETURNING *",
      [accountId, achievementId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("addUserAchievement error " + error);
    return null;
  }
}

/* ***************************
 *  Get user statistics
 * ************************** */
async function getUserStats(accountId) {
  try {
    // Get account info
    const accountQuery = await pool.query(
      "SELECT account_firstname, account_lastname, account_email, account_type, TO_DATE(account_created_at, 'YYYY-MM-DD') AS join_date FROM public.account WHERE account_id = $1",
      [accountId]
    );

    // Get profile info
    const profileQuery = await getProfileByAccountId(accountId);

    // Count achievements
    const achievementsCount = await pool.query(
      "SELECT COUNT(*) FROM public.user_achievements WHERE account_id = $1",
      [accountId]
    );

    // Calculate total achievement points
    const pointsQuery = await pool.query(
      "SELECT SUM(a.achievement_points) FROM public.achievements a JOIN public.user_achievements ua ON a.achievement_id = ua.achievement_id WHERE ua.account_id = $1",
      [accountId]
    );

    return {
      account: accountQuery.rows[0],
      profile: profileQuery,
      achievementsCount: parseInt(achievementsCount.rows[0].count),
      totalPoints: parseInt(pointsQuery.rows[0].sum) || 0
    };
  } catch (error) {
    console.error("getUserStats error " + error);
    return null;
  }
}

module.exports = {
  getProfileByAccountId,
  updateProfile,
  getAllAchievements,
  getUserAchievements,
  addUserAchievement,
  getUserStats
};
