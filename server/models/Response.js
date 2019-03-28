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

module.exports = ResponseModel;
