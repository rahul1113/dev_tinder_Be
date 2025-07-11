const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./models/user");
const { validateData } = require("./utils/util");
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
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid Credentials");
    }
    res.send("Login successful");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
app.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users");
    res.status(400).send("error fetching users");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const users = await User.findByIdAndDelete(userId);
    res.send("User deleted Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong", err);
  }
});
// patch user API - updating the data of user
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoURL",
      "about",
      "gender",
      "skills",
      "firstName",
      "lastName",
      "age",
    ];
    const updates = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    if (!updates) {
      throw new Error(
        `Invalid updates! Allowed updates are: ${ALLOWED_UPDATES.join(", ")}`
      );
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
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
