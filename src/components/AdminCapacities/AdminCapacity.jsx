// src/pages/AdminCapacities.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./adminCapacity.scss";

const AdminCapacities = () => {
  const [capacities, setCapacities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/capacities`)
      .then((res) => res.json())
      .then((data) => {
        setCapacities(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Erreur chargement des capacités");
        setLoading(false);
      });
  }, []);

  const updateCapacity = async (eventId, newMax) => {
    if (newMax < 0) return;

    await fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/capacity/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, maxPlaces: newMax }),
    });

    setCapacities(prev =>
      prev.map(c =>
        c.eventId === eventId ? { ...c, maxPlaces: newMax } : c
      )
    );
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Retour
      </button>
      <h1>Gérer les capacités</h1>
      <p>Modifie le nombre max de places pour chaque événement</p>

      <div className="capacities-list">
        {capacities.length === 0 ? (
          <p>Aucun événement trouvé. Crée-les via le seed ou manuellement.</p>
        ) : (
          capacities.map((c) => (
            <div key={c.eventId} className="capacity-item">
              <div className="event-info">
                <strong>{c.title || c.eventId}</strong>
                <br />
                <small>
                  {c.date} • {c.type} • Réservées : {c.bookedPlaces}
                </small>
              </div>
              <div className="capacity-control">
                <button onClick={() => updateCapacity(c.eventId, (c.maxPlaces || 0) - 1)}>-</button>
                <input
                  type="number"
                  value={c.maxPlaces || 0}
                  onChange={(e) => updateCapacity(c.eventId, parseInt(e.target.value) || 0)}
                  min="0"
                />
                <button onClick={() => updateCapacity(c.eventId, (c.maxPlaces || 0) + 1)}>+</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="add-new">
        <h3>Ajouter un nouvel événement</h3>
        <input placeholder="eventId (ex: stage-2025-12-20)" id="newId" />
        <input placeholder="Titre" id="newTitle" />
        <input placeholder="Date (YYYY-MM-DD)" id="newDate" />
        <input placeholder="Type (traineeship/show/courses)" id="newType" />
        <input type="number" placeholder="Places max" id="newMax" />
        <button
          onClick={() => {
            const eventId = document.getElementById("newId").value;
            const title = document.getElementById("newTitle").value;
            const date = document.getElementById("newDate").value;
            const type = document.getElementById("newType").value;
            const maxPlaces = parseInt(document.getElementById("newMax").value) || 0;

            if (eventId && type) {
              updateCapacity(eventId, maxPlaces);
              setTimeout(() => window.location.reload(), 500);
            }
          }}
        >
          Créer
        </button>
      </div>
    </div>
  );
};

export default AdminCapacities;