require("dotenv").config();
require("./server/db-conn");
const express = require("express");
const bodyParser = require("body-parser");
const { isAuthenticated } = require("./server/auth/auth");
const session = require("express-session");
const AzureTablesStoreFactory = require("connect-azuretables-updated")(session);
const rateLimit = require("express-rate-limit");
const { PORT, SESSIONSECRET } = process.env;
const ResponseModel = require("./server/models/Response");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    store: AzureTablesStoreFactory.create(),
    secret: SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 /* 1 minute */ }
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});
app.use(limiter);

app.use("/api/responses/", require("./server/routes/responses-routes"));

app.get("/api/login", isAuthenticated, (req, res) => {
  if (!req.session.user) {
    req.session.user = res.locals.user;
  }
  if (!req.session.selections) {
    ResponseModel.find(
      { email: req.session.user.userPrincipalName },
      (err, responses) => {
        if (err) next(err);
        else {
          req.session.selections = responses;
          res.json(responses);
        }
      }
    );
  } else {
    console.log("cached selections");
    res.json(req.session.selections);
  }
});

app.get("/*", (req, res) => {
  console.log("serving index");
  res.sendFile("index.html", {
    root: __dirname
  });
});

const port = PORT || 5001;
app.listen(port, () => console.log(`Something happening on ${port}`));
