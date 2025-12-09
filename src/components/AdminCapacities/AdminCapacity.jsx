import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLongRight } from "react-icons/hi2";
import "./adminCapacity.scss";

const AdminCapacity = () => {
  const [events, setEvents] = useState({
    traineeships: [],
    shows: [],
    classicCourses: [],
    trialCourses: [],
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = useMemo(() => {
    const isLocal = import.meta.env.MODE === "development";
    const raw = isLocal
      ? import.meta.env.VITE_BACKEND_LOCAL_URL || ""
      : import.meta.env.VITE_BACKEND_URL || "";
    const clean = raw.replace(/\/+$/, "");
    return clean.endsWith("/api") ? clean : `${clean}/api`;
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/events`);
      if (!res.ok) throw new Error("Erreur réseau");
      const data = await res.json();
      
      if (data.success && data.data) {
        setEvents(data.data);
      }
    } catch (err) {
      console.error("Erreur chargement événements:", err);
      alert("Impossible de charger les événements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [API_BASE_URL]);

  const updatePlaces = async (type, id, newValue) => {
    if (newValue < 0 || isNaN(newValue)) return;
    
    setUpdating(`${type}-${id}`);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/events/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numberOfPlaces: Number(newValue) }),
      });

      if (!res.ok) throw new Error("Erreur mise à jour");

      setEvents((prev) => {
        const key = 
          type === 'traineeship' ? 'traineeships' :
          type === 'show' ? 'shows' :
          type === 'classic-course' ? 'classicCourses' :
          'trialCourses';

        return {
          ...prev,
          [key]: prev[key].map((e) =>
            e._id === id ? { ...e, numberOfPlaces: Number(newValue) } : e
          ),
        };
      });
    } catch (err) {
      console.error("Erreur update:", err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setUpdating(null);
    }
  };

  const returnHome = () => navigate("/");

  if (loading) {
    return (
      <div className="container-app">
        <div className="admin-container">
          <p>Chargement des événements...</p>
        </div>
      </div>
    );
  }

  const EventCard = ({ event, type }) => {
    const [localValue, setLocalValue] = useState(event.numberOfPlaces);

    return (
      <div className="event-card">
        <div className="event-info">
          <h3>{event.title || `${event.day || ''} ${event.time || ''}`}</h3>
          <p className="event-details">
            {event.date && <span>📅 {event.date}</span>}
            {event.hours && <span>🕐 {event.hours}</span>}
            {event.time && !event.hours && <span>🕐 {event.time}</span>}
            {event.place && <span>📍 {event.place}</span>}
          </p>
        </div>
        <div className="places-control">
          <label>Places disponibles :</label>
          <div className="control-buttons">
            <button
              onClick={() => {
                const newVal = localValue - 1;
                setLocalValue(newVal);
                updatePlaces(type, event._id, newVal);
              }}
              disabled={updating === `${type}-${event._id}` || localValue <= 0}
            >
              -
            </button>
            <input
              type="number"
              value={localValue}
              onChange={(e) => {
                const val = e.target.value;
                setLocalValue(val);
              }}
              onBlur={() => updatePlaces(type, event._id, localValue)}
              disabled={updating === `${type}-${event._id}`}
              min="0"
            />
            <button
              onClick={() => {
                const newVal = localValue + 1;
                setLocalValue(newVal);
                updatePlaces(type, event._id, newVal);
              }}
              disabled={updating === `${type}-${event._id}`}
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  };

  const totalEvents = 
    events.traineeships.length +
    events.shows.length +
    events.classicCourses.length +
    events.trialCourses.length;

  return (
    <div className="container-app">
      <div className="return-home">
        <HiArrowLongRight className="iconReturnHome" onClick={returnHome} />
      </div>
      
      <div className="admin-container">
        <h1>Gestion des places disponibles</h1>
        <p className="subtitle">
          {totalEvents} événement{totalEvents > 1 ? 's' : ''} au total
        </p>

        {events.traineeships.length > 0 && (
          <section className="events-section">
            <h2>🎭 Stages ({events.traineeships.length})</h2>
            <div className="events-grid">
              {events.traineeships.map((event) => (
                <EventCard key={event._id} event={event} type="traineeship" />
              ))}
            </div>
          </section>
        )}

        {events.shows.length > 0 && (
          <section className="events-section">
            <h2>🎪 Spectacles ({events.shows.length})</h2>
            <div className="events-grid">
              {events.shows.map((event) => (
                <EventCard key={event._id} event={event} type="show" />
              ))}
            </div>
          </section>
        )}

        {events.classicCourses.length > 0 && (
          <section className="events-section">
            <h2>📚 Cours réguliers ({events.classicCourses.length})</h2>
            <div className="events-grid">
              {events.classicCourses.map((event) => (
                <EventCard key={event._id} event={event} type="classic-course" />
              ))}
            </div>
          </section>
        )}

        {events.trialCourses.length > 0 && (
          <section className="events-section">
            <h2>🎯 Cours d'essai ({events.trialCourses.length})</h2>
            <div className="events-grid">
              {events.trialCourses.map((event) => (
                <EventCard key={event._id} event={event} type="trial-course" />
              ))}
            </div>
          </section>
        )}

        {totalEvents === 0 && (
          <div className="no-events">
            <p>Aucun événement trouvé dans la base de données.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCapacity;