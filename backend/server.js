require("dotenv").config();
require("./server/db-conn");
const express = require("express");
const bodyParser = require("body-parser");
const {isAuthenticated} = require("./server/auth/auth")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/responses/", require("./server/routes/responses-routes"));

app.get("/api/login", isAuthenticated, (req, res) => {
  console.log(res.locals.user);
  res.send(res.locals.user);
});

app.get("/*", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname
  });
});

const { PORT } = process.env;
app.listen(PORT, () => console.log(`Something happening on ${PORT}`));