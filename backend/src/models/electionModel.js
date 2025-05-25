const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: String,
  description: String,
  electionType: [String], // Changed from String to array of strings
  startDate: Date,
  endDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Election = mongoose.model('Election', electionSchema);
module.exports = Election;
