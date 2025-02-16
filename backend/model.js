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
    // Array of emails that have voted (each email can vote once)
    voters: [{ type: String }],
    // The creator's email (required to create/cancel the poll)
    creatorEmail: { type: String, required: true },
    // Poll remains active until the creator cancels it
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Poll', PollSchema);
