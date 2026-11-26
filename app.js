const express = require("express");
const indexRouter = require("./routes/index.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);

module.exports = app;
