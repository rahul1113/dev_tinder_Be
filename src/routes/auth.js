const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateData } = require("../utils/util");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    validateData(req.body);
    const passwordMatch = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: passwordMatch });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordMatch = await user.getPasswordMathched(password);
    if (isPasswordMatch) {
      res.cookie("token", await user.getJWT());
      res.send("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
authRouter.get("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send("Logout successful");
    //  res.clearCookie("token");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

module.exports = authRouter;
