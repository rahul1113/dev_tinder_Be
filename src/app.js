const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("./models/user");
const { validateData } = require("./utils/util");
const userAuth = require("./middlewares/auth");
const app = express();

//Order of routing is important
// | Pattern | Meaning                          | Example  | Matches              |
// | ------- | -------------------------------- | -------- | -------------------- |
// | `?`     | 0 or 1 occurrence                | `/ab?cd` | `/acd`, `/abcd`      |
// | `+`     | 1 or more occurrences            | `/ab+cd` | `/abcd`, `/abbbbbcd` |
// | `*`     | Wildcard (any chars, any length) | `/ab*cd` | `/abcd`, `/ab123cd`  |

// app.use("/hello", (req, res) => {
//   res.send("Hello ");
// });
// app.use("/", (req, res) => {
//   res.send("Hello World");
// });
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
app.get("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`Connection request from  ${user.firstName}`);
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
