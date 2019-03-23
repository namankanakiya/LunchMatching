require("dotenv").config();
require("./server/db-conn");
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const graphUrl = "https://graph.microsoft.com/v1.0/";
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

function isAuthenticated(req, res, next) {
  const headers = { Authorization: req.headers.authorization };
  const options = {
    headers: headers
  };
  fetch(`${graphUrl}/me`, options)
    .then(checkStatus)
    .then(response => {
      return response.json();
    })
    .then(
      data => {
        res.locals.user = data;
        next();
      },
      error => {
        next(error);
      }
    )
    .catch(err => {
      next(err);
    });
}

function checkStatus(res) {
  if (res.ok) {
    return res;
  } else {
    var err = new Error(res.statusText);
    err.status = res.status;
    throw err;
  }
}
