const validator = require("validator");
const bcrypt = require("bcrypt");

const validateData = (data) => {
  const { firstName, lastName, email, password } = data;
  if (!firstName || !lastName) {
    throw new Error("First name and Last name are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a strong password");
  }
};

const validateProfileData = (data) => {
  const DATA_TO_UPDATE = ["skills", "age", "photoUrl", "about"];
  const matchDataToBeUpdated = Object.keys(data).every((key) =>
    DATA_TO_UPDATE.includes(key)
  );
  return matchDataToBeUpdated;
};

const validatePasswordMatch = (passwordbyUserInput, user) => {
  const isPasswordMatch = bcrypt.compare(passwordbyUserInput, user.password);
  return isPasswordMatch;
};

module.exports = {
  validateData,
  validateProfileData,
  validatePasswordMatch,
};
