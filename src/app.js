const express = require("express");
const indexRouter = require("./routes/index.routes");
const authRouter = require("./routes/auth.routes");
const usersRouter = require("./routes/users.routes");
const itemsRouter = require("./routes/items.routes");
const servicesRoutes = require("./routes/services.routes");
const requestsRoutes = require("./routes/request.routes");

const app = express();

app.use(express.json());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/items", itemsRouter);
app.use("/api/services", servicesRoutes);
app.use("/api/requests", requestsRoutes);

module.exports = app;