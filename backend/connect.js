const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const Poll = require('./model');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://mani:yUo5tEJNJqFmfLl5@cluster0.93ngq.mongodb.net/The_Poll', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
/**
 * Create a new poll.
 * Expects: { creatorEmail, question, options: [ 'Option 1', 'Option 2', ... ] }
 */
app.post('/api/polls', async (req, res) => {
  const { question, options, creatorEmail } = req.body;
  if (!question || !options || !Array.isArray(options) || options.length < 2 || !creatorEmail) {
    return res.status(400).json({
      error:
        'Invalid poll data. A question, at least two options, and creator email are required.'
    });
  }
  const pollOptions = options.map(opt => ({ option: opt, votes: 0 }));
  const poll = new Poll({ question, options: pollOptions, creatorEmail });
  try {
    const savedPoll = await poll.save();
    res.status(201).json(savedPoll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving poll.' });
  }
});

/**
 * List all active polls.
 */
app.get('/api/polls', async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching polls.' });
  }
});

/**
 * Get poll details by ID.
 */
app.get('/api/polls/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching poll.' });
  }
});

/**
 * Vote on a poll option.
 * Expects header 'x-user-email' and body { optionIndex }.
 * Ensures each email votes only once.
 */
app.post('/api/polls/:id/vote', async (req, res) => {
  const userEmail = req.headers['x-user-email'];
  if (!userEmail) {
    return res.status(401).json({ error: 'Email is required to vote.' });
  }
  const { optionIndex } = req.body;
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found.' });
    if (!poll.isActive) {
      return res.status(403).json({ error: 'Poll is not active.' });
    }
    if (poll.voters.includes(userEmail)) {
      return res.status(403).json({ error: 'You have already voted on this poll.' });
    }
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: 'Invalid option index.' });
    }
    poll.options[optionIndex].votes += 1;
    poll.voters.push(userEmail);
    const updatedPoll = await poll.save();
    res.json(updatedPoll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error voting on poll.' });
  }
});

/**
 * Cancel a poll.
 * Only the creator (identified by 'x-creator-email' header) can cancel the poll.
 */
app.post('/api/polls/:id/cancel', async (req, res) => {
  const creatorEmail = req.headers['x-creator-email'];
  if (!creatorEmail) {
    return res.status(401).json({ error: 'Creator email required.' });
  }
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found.' });
    if (poll.creatorEmail !== creatorEmail) {
      return res.status(403).json({ error: 'Only the creator can cancel this poll.' });
    }
    poll.isActive = false;
    const updatedPoll = await poll.save();
    res.json({ message: 'Poll cancelled successfully.', poll: updatedPoll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error cancelling poll.' });
  }
});

const port =3000;
app.listen(port, () => console.log(`Server running on port 3000`));
