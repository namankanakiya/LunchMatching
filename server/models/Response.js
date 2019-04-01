const mongoose = require("mongoose");

const ResponseSchema = mongoose.Schema({
  name: String,
  email: String,
  days: {
    monday: { type: Boolean, default: false },
    tuesday: { type: Boolean, default: false },
    wednesday: { type: Boolean, default: false },
    thursday: { type: Boolean, default: false },
    friday: { type: Boolean, default: false }
  },
  matches: [String]
});

const ResponseModel = mongoose.model("responses", ResponseSchema);

module.exports = ResponseModel;
