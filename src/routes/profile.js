const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { validateProfileData, validatePasswordMatch } = require("../utils/util");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error:" + error.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const matchDataToBeUpdated = validateProfileData(req.body);
    if (!matchDataToBeUpdated) {
      return res.status(400).send("Invalid data to update");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.send("Profile updated successfully");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword, reConfirmPassword } = req.body;
    const loggedInUser = req.user;
    if (!validatePasswordMatch(oldPassword, loggedInUser)) {
      return res.status(400).send("Old password does not match");
    }
    if (newPassword !== reConfirmPassword) {
      return res.status(400).send("New password and confirmation do not match");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.send("Password updated successfully");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

module.exports = profileRouter;
