const mongoose = require("mongoose");
const env = require("./env");

const connectDb = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  // eslint-disable-next-line no-console
  console.log(`[db] connected: ${mongoose.connection.name}`);
};

module.exports = connectDb;
