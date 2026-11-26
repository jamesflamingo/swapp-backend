const app = require("./app");
const connectDB = require("./config/db.config");

const PORT = 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`SWAPP server running on port ${PORT}`);
  });
});