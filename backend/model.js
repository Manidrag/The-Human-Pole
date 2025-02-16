// server/models/Poll.js
const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [
      {
        option: { type: String, required: true },
        votes: { type: Number, default: 0 }
      }
    ],
    // Array to store emails that have voted
    voters: [{ type: String }],
    // Poll creator information:
    creatorEmail: { type: String, required: true },
    creatorName: { type: String, required: true },  // New field for the username
    // Active flag (poll remains active until canceled by creator)
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Poll', PollSchema);
