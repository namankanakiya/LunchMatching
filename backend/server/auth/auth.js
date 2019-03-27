const fetch = require("node-fetch");
const graphUrl = "https://graph.microsoft.com/v1.0/";

const isAuthenticated = (req, res, next) => {
  const headers = { Authorization: req.headers.authorization };
  const options = {
    headers: headers
  };
  if (!req.session.user) {
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
  } else {
    console.log("cached user");
    res.locals.user = req.session.user;
    next();
  }
};

const checkStatus = res => {
  if (res.ok) {
    return res;
  } else {
    var err = new Error(res.statusText);
    err.status = res.status;
    throw err;
  }
};

module.exports = { isAuthenticated, checkStatus };
