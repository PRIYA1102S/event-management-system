import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

const timezoneOptions = moment.tz.names().map(tz => ({ value: tz, label: tz }));

const EventForm = ({ onEventCreated, currentEvent, selectedProfile, userTimezone }) => {
  const [profiles, setProfiles] = useState([]);
  const [profileOption, setProfileOption] = useState(null);
  const [eventTimezone, setEventTimezone] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetch profiles for dropdown
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get(`${process.env.API_BASE_URL}/api/profiles`);
        const formatted = res.data.map(p => ({
          value: p._id,
          label: p.name,
        }));
        setProfiles(formatted);
      } catch (err) {
        console.error('Error fetching profiles:', err);
      }
    };
    fetchProfiles();
  }, []);

  // Initialize when editing an event or selecting a profile
  useEffect(() => {
    if (currentEvent) {
      setEventTimezone(timezoneOptions.find(tz => tz.value === currentEvent.timezone));
      setStartDate(moment.tz(currentEvent.start, currentEvent.timezone).toDate());
      setEndDate(moment.tz(currentEvent.end, currentEvent.timezone).toDate());
      if (selectedProfile) setProfileOption(selectedProfile);
    } else {
      setEventTimezone(
        timezoneOptions.find(tz => tz.value === userTimezone) ||
        timezoneOptions.find(tz => tz.value === 'UTC')
      );
      if (selectedProfile) setProfileOption(selectedProfile);
      setStartDate(null);
      setEndDate(null);
    }
  }, [currentEvent, selectedProfile, userTimezone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!profileOption || !eventTimezone || !startDate || !endDate) {
      setError('All fields are required.');
      return;
    }

    const startMoment = moment.tz(startDate, eventTimezone.value);
    const endMoment = moment.tz(endDate, eventTimezone.value);

    if (endMoment.isBefore(startMoment)) {
      setError('End date/time cannot be before start date/time.');
      return;
    }

    try {
      const eventData = {
        profiles: [profileOption.value],
        timezone: eventTimezone.value,
        start: startMoment.toISOString(),
        end: endMoment.toISOString(),
      };

     if (currentEvent) {
  await axios.patch(`${API_BASE_URL}/api/events/${currentEvent._id}`, eventData);
} else {
  await axios.post(`${API_BASE_URL}/api/events`, eventData);
}

      if (onEventCreated) onEventCreated();
      toast.success(currentEvent ? 'Event updated successfully!' : 'Event created successfully!');
    } catch (error) {
      console.error('Error creating/updating event:', error);
      setError(error.response?.data?.message || 'An error occurred.');
      toast.error(error.response?.data?.message || 'Error creating/updating event.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h2>{currentEvent ? 'Update Event' : 'Create Event'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}


      <div>
        <label>Select Profile:</label>
        <Select
          options={profiles}
          value={profileOption}
          onChange={setProfileOption}
          placeholder="Select profile"
        />
      </div>

      <div>
        <label>Event Timezone:</label>
        <Select
          options={timezoneOptions}
          value={eventTimezone}
          onChange={setEventTimezone}
          placeholder="Select timezone"
        />
      </div>

      <div>
        <label>Start Date & Time:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
          timeFormat="HH:mm"
          timeIntervals={15}
        />
      </div>

      <div>
        <label>End Date & Time:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          showTimeSelect
          dateFormat="Pp"
          timeFormat="HH:mm"
          timeIntervals={15}
        />
      </div>

      <button type="submit">{currentEvent ? 'Update Event' : 'Create Event'}</button>
    </form>
  );
};

export default EventForm;
