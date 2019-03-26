const router = require("express").Router();
const ResponseModel = require("../models/Response");

/**
 * URL: localhost:5001/api/responses/
 * Response: User Preferences
 */
router.get("/", (req, res, next) => {
  if (req.session.user && req.session.user.userPrincipalName) {
    ResponseModel.find({email: req.session.user.userPrincipalName}, (err, responses) => {
      if (err) next(err);
      else res.json(responses);
    });
  } else {
    res.status(403).send("Forbidden. Please login first");
  }
});

/**
 * URL: localhost:5001/api/responses/create
 * Response: Newly created ResponseModel object if successful
 */
router.post("/create", (req, res, next) => {
  const response = req.body;
  const Response = {
    name: response.name,
    email: response.email,
    days: {
      monday: response.days.monday,
      tuesday: response.days.tuesday,
      wednesday: response.days.wednesday,
      thursday: response.days.thursday,
      friday: response.days.friday
    }
  };
  ResponseModel.findOneAndUpdate(
    {
        email: response.email
    },
    Response,
    {upsert: true, new: true},
    (err, doc) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        console.log(doc);
        req.session.selections = undefined;
        res.json(doc);
      }
    }
  )
});

module.exports = router;
