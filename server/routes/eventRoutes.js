const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Profile = require('../models/Profile');
const moment = require('moment-timezone');

// Helper function to convert a date to a specific timezone
const convertToTimezone = (date, timezone) => {
  return moment.tz(date, timezone).toDate();
};

// Create a new event
router.post('/', async (req, res) => {
  try {
    const { profiles, timezone, start, end } = req.body;

    // Validate start and end dates
    const startDate = moment.tz(start, timezone);
    const endDate = moment.tz(end, timezone);

    if (endDate.isBefore(startDate)) {
      return res.status(400).json({ message: 'End date/time cannot be in the past relative to the start date/time.' });
    }

    const newEvent = new Event({
      profiles,
      timezone,
      start: startDate.toDate(),
      end: endDate.toDate(),
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all events for a specific profile, displayed in the user's timezone
router.get('/profile/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const events = await Event.find({ profiles: profileId }).populate('profiles');

    const eventsInUserTimezone = events.map(event => {
      return {
        ...event.toObject(),
        start: moment.tz(event.start, event.timezone).tz(profile.timezone).format(),
        end: moment.tz(event.end, event.timezone).tz(profile.timezone).format(),
        createdAt: moment.tz(event.createdAt, 'UTC').tz(profile.timezone).format(),
        updatedAt: moment.tz(event.updatedAt, 'UTC').tz(profile.timezone).format(),
        updateLogs: event.updateLogs.map(log => ({
          ...log.toObject(),
          timestamp: moment.tz(log.timestamp, 'UTC').tz(profile.timezone).format(),
        })),
      };
    });

    res.json(eventsInUserTimezone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an event
router.patch('/:id', async (req, res) => {
  try {
    const { timezone, start, end, profiles } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const previousValues = { ...event.toObject() };

    if (timezone) event.timezone = timezone;
    if (start) event.start = convertToTimezone(start, event.timezone);
    if (end) event.end = convertToTimezone(end, event.timezone);
    if (profiles) event.profiles = profiles;

    // Validate start and end dates after potential updates
    const startDate = moment.tz(event.start, event.timezone);
    const endDate = moment.tz(event.end, event.timezone);

    if (endDate.isBefore(startDate)) {
      return res.status(400).json({ message: 'End date/time cannot be in the past relative to the start date/time.' });
    }

    const updatedValues = { ...event.toObject() };

    // Log changes
    const changes = {};
    for (const key in updatedValues) {
      if (key !== '_id' && key !== '__v' && JSON.stringify(previousValues[key]) !== JSON.stringify(updatedValues[key])) {
        changes[key] = {
          previous: previousValues[key],
          updated: updatedValues[key],
        };
      }
    }

    if (Object.keys(changes).length > 0) {
      event.updateLogs.push({
        previousValues: changes,
        updatedValues: updatedValues,
      });
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
