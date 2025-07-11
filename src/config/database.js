const moongoose = require("mongoose");
const connectDB = async () => {
  await moongoose.connect(process.env.URI);
};

module.exports = connectDB;
