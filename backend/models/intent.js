const mongoose = require("mongoose");

const intentSchema = new mongoose.Schema({
  intent: { type: String, required: true },
  patterns: [String],
  response: { type: String },
  url: { type: String }, // Single URL link
});

const Intent = mongoose.model("Intent", intentSchema);

module.exports = Intent;
