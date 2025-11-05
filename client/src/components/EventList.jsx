import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";

const EventList = ({ profileId, userTimezone, onEditEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchEvents = async () => {
    if (!profileId) {
      setEvents([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
`${API_BASE_URL}/api/events/profile/${profileId}`
      );
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [profileId, userTimezone]);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profileId) return <div>Please select a profile to view events.</div>;
  if (events.length === 0) return <div>No events found for this profile.</div>;

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).tz(userTimezone).format("YYYY-MM-DD HH:mm:ss z");
  };

  return (
    <div>
      <h2>Events</h2>
      {events.map((event) => (
        <div key={event._id} className="event-item-card">
          <p>
            <strong>Profiles:</strong>{" "}
            {event.profiles.map((p) => p.name).join(", ")}
          </p>
          <p>
            <strong>Event Timezone:</strong> {event.timezone}
          </p>
          <p>
            <strong>Start:</strong> {formatTimestamp(event.start)}
          </p>
          <p>
            <strong>End:</strong> {formatTimestamp(event.end)}
          </p>
          <p>
            <strong>Created At:</strong> {formatTimestamp(event.createdAt)}
          </p>
          <p>
            <strong>Updated At:</strong> {formatTimestamp(event.updatedAt)}
          </p>
          <button onClick={() => onEditEvent(event)}>Edit Event</button>

          {event.updateLogs && event.updateLogs.length > 0 && (
            <div
              style={{
                marginTop: "10px",
                borderTop: "1px dashed #eee",
                paddingTop: "10px",
              }}
            >
              <h4>Update Logs:</h4>
              {event.updateLogs.map((log, index) => (
                <div
                  key={index}
                  style={{ marginBottom: "5px", fontSize: "0.9em" }}
                >
                  <p>
                    <strong>Timestamp:</strong> {formatTimestamp(log.timestamp)}
                  </p>
                  <div style={{ marginTop: "10px" }}>
                    <strong>Changes:</strong>
                    {log.previousValues &&
                      Object.entries(log.previousValues).map(([key, value]) => (
                        <div
                          key={key}
                          style={{ marginLeft: "10px", marginBottom: "5px" }}
                        >
                          <p>
                            <strong>{key}</strong>
                          </p>

                          {value &&
                          typeof value === "object" &&
                          ("previous" in value || "updated" in value) ? (
                            <>
                              <p style={{ margin: 0 }}>
                                <strong>Previous:</strong>{" "}
                                {Array.isArray(value.previous)
                                  ? value.previous.join(", ")
                                  : JSON.stringify(value.previous)}
                              </p>
                              <p style={{ margin: 0 }}>
                                <strong>Updated:</strong>{" "}
                                {Array.isArray(value.updated)
                                  ? value.updated.join(", ")
                                  : JSON.stringify(value.updated)}
                              </p>
                            </>
                          ) : (
                            <p style={{ margin: 0 }}>
                              <strong>Value:</strong> {JSON.stringify(value)}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;
