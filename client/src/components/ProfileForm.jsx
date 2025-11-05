import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

const timezoneOptions = moment.tz.names().map(tz => ({ value: tz, label: tz }));

const ProfileForm = ({ onProfileCreated }) => {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProfile = { name, timezone: timezone ? timezone.value : 'UTC' };
      await axios.post('http://localhost:5000/api/profiles', newProfile);
      setName('');
      setTimezone(null);
      if (onProfileCreated) {
        onProfileCreated();
        toast.success('Profile created successfully!');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Error creating profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Profile</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Timezone:</label>
        <Select
          options={timezoneOptions}
          value={timezone}
          onChange={setTimezone}
          placeholder="Select a timezone"
          isClearable
          required
        />
      </div>
      <button type="submit">Create Profile</button>
    </form>
  );
};

export default ProfileForm;