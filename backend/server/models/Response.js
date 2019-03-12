const mongoose = require("mongoose");

const ResponseSchema = mongoose.Schema({
  name: String,
  email: String,
  days: {
    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean
  },
  matches: [
    {
      email: String
    }
  ]
});

const ResponseModel = mongoose.model("responses", ResponseSchema);

/*ResponseModel.find({ "days.wednesday": true }, function(err, foundResponse) {
  foundResponse.forEach(response =>
    console.log("Response: " + JSON.stringify(response))
  );
});*/

module.exports = ResponseModel;
