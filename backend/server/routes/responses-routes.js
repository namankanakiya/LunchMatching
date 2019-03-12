const router = require("express").Router();
const ResponseModel = require("../models/Response");

/**
 * URL: localhost:5001/api/responses/
 * Response: Array of all responses documents
 */
router.get("/", (req, res, next) => {
  ResponseModel.find({}, (err, responses) => {
    if (err) next(err);
    else res.json(responses);
  });
});

/**
 * URL: localhost:5001/api/responses/create
 * Response: Newly created ResponseModel object if successful
 */
router.post("/create", (req, res, next) => {
  const response = req.body;
  const Response = new ResponseModel({
    name: response.name,
    email: response.email,
    days: {
      monday: response.days.monday,
      tuesday: response.days.tuesday,
      wednesday: response.days.wednesday,
      thursday: response.days.thursday,
      friday: response.days.friday
    }
  });
  Response.save(err => {
    if (err) next(err);
    else res.json({ Response, msg: "response successfully saved!" });
  });
});

module.exports = router;
