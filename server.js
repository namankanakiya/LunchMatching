require("dotenv").config();
require("./server/db-conn");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { isAuthenticated } = require("./server/auth/auth");
const { matchFinder } = require("./server/match/match");
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

app.use(express.static(path.join(__dirname, "client/build")));

app.use("/api/responses/", require("./server/routes/responses-routes"));

app.get("/api/login", isAuthenticated, (req, res, next) => {
  if (!req.session.user) {
    req.session.user = res.locals.user;
  }
  if (!req.session.selections) {
    ResponseModel.findOneAndUpdate(
      { email: req.session.user.userPrincipalName },
      { email: req.session.user.userPrincipalName },
      { upsert: true, setDefaultsOnInsert: true, new: true },
      (err, responses) => {
        if (err) {
          next(err);
        } else {
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

app.get("*", (req, res) => {
  console.log("serving index");
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = PORT || 5001;
app.listen(port, () => console.log(`Something happening on ${port}`));

matchFinder("thursday");
