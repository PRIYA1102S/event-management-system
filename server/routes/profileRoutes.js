const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Create a new profile
router.post('/', async (req, res) => {
  try {
    const { name, timezone } = req.body;
    const profile = new Profile({ name, timezone });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a profile
router.patch('/:id', async (req, res) => {
  try {
    const { name, timezone } = req.body;
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (name) profile.name = name;
    if (timezone) profile.timezone = timezone;

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
