import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import moment from "moment-timezone";
import ProfileForm from "./components/ProfileForm";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [userTimezone, setUserTimezone] = useState(moment.tz.guess());
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profiles");
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleProfileChange = (selectedOption) => {
    setSelectedProfile(selectedOption);
    if (selectedOption?.timezone) {
      setUserTimezone(selectedOption.timezone);
    } else {
      setUserTimezone(moment.tz.guess());
    }
    setEditingEvent(null);
  };

  const handleEventCreated = () => {
    setEditingEvent(null);
    if (selectedProfile) {
      setSelectedProfile({ ...selectedProfile });
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  return (
    <div className="App">
      <header className="page-header">
        <h1>Event Management System</h1>
        <p className="page-description">
          Build an Event Management System where an admin can create multiple
          profiles and manage events across multiple users and timezones.
        </p>
      </header>

      <div className="header-card">
        <div className="header-flex">
          <div className="profile-selector">
            <Select
              options={profiles.map((p) => ({
                value: p._id,
                label: p.name,
                timezone: p.timezone,
              }))}
              value={selectedProfile}
              onChange={handleProfileChange}
              placeholder="Select current profile..."
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="events-display-section">
          {selectedProfile ? (
            <>
              <div className="profile-banner">
                <h2>{selectedProfile.label}</h2>
                <p>Timezone: {selectedProfile.timezone}</p>
              </div>
              <EventList
                profileId={selectedProfile.value}
                userTimezone={userTimezone}
                onEditEvent={handleEditEvent}
              />
            </>
          ) : (
            <p className="no-profile-msg">Select a profile to view events.</p>
          )}
        </div>

        <div className="event-card">
          <EventForm
            onEventCreated={handleEventCreated}
            currentEvent={editingEvent}
            selectedProfile={selectedProfile}
            userTimezone={userTimezone}
          />
        </div>
      </div>

      <div className="profile-section">
        <ProfileForm onProfileCreated={fetchProfiles} />
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}

export default App;
