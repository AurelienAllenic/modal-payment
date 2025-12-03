// src/pages/AdminCapacities.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCapacities.css";

const AdminCapacities = () => {
  const [capacities, setCapacities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCapacities = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/capacities`);
      const data = await res.json();
      setCapacities(data);
      setLoading(false);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchCapacities();
  }, []);

  const updateCapacity = async (eventId, maxPlaces) => {
    if (maxPlaces < 0) return;

    await fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/capacity/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, maxPlaces: parseInt(maxPlaces) }),
    });

    // Mise à jour locale sans reload
    setCapacities(prev =>
      prev.map(c => c.eventId === eventId ? { ...c, maxPlaces } : c)
    );
  };

  const createNew = async () => {
    const eventId = document.getElementById("newId").value.trim();
    const maxPlaces = parseInt(document.getElementById("newMax").value) || 0;

    if (!eventId || !maxPlaces) {
      alert("eventId et places max requis");
      return;
    }

    await updateCapacity(eventId, maxPlaces);
    
    // On vide les champs
    document.getElementById("newId").value = "";
    document.getElementById("newTitle").value = "";
    document.getElementById("newDate").value = "";
    document.getElementById("newType").value = "";
    document.getElementById("newMax").value = "";

    // On rafraîchit proprement
    fetchCapacities();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Retour
      </button>
      <h1>Gérer les capacités</h1>

      <div className="capacities-list">
        {capacities.length === 0 ? (
          <p>Aucun événement → crée-en un ci-dessous</p>
        ) : (
          capacities.map((c) => (
            <div key={c.eventId} className="capacity-item">
              <div className="event-info">
                <strong>{c.title || c.eventId}</strong>
                <br />
                <small>{c.date || "—"} • {c.type || "—"} • Réservées: {c.bookedPlaces || 0}</small>
              </div>
              <div className="capacity-control">
                <button onClick={() => updateCapacity(c.eventId, c.maxPlaces - 1)}>-</button>
                <input
                  type="number"
                  value={c.maxPlaces || 0}
                  onChange={(e) => updateCapacity(c.eventId, parseInt(e.target.value) || 0)}
                />
                <button onClick={() => updateCapacity(c.eventId, c.maxPlaces + 1)}>+</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="add-new">
        <h3>Ajouter un événement</h3>
        <input placeholder="eventId (ex: show-2025-12-13)" id="newId" />
        <input placeholder="Titre (facultatif)" id="newTitle" />
        <input placeholder="Date YYYY-MM-DD (facultatif)" id="newDate" />
        <input placeholder="Type (facultatif)" id="newType" />
        <input type="number" placeholder="Places max" id="newMax" />
        <button onClick={createNew}>Créer</button>
      </div>
    </div>
  );
};

export default AdminCapacities;