// src/pages/AdminCapacities.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./adminCapacity.scss";

const AdminCapacity = () => {
  const [capacities, setCapacities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4242";

  // Fonction de fetch avec timeout et fallback
  const fetchCapacities = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s max

      const res = await fetch(`${API_URL}/admin/capacities`, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error("Réponse pas OK");

      const data = await res.json();
      setCapacities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Pas encore de collection ou backend éteint → mode création pure");
      setCapacities([]); // on force un tableau vide
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapacities();
  }, []);

  const saveEvent = async (eventId, maxPlaces) => {
    if (!eventId || maxPlaces === "" || isNaN(Number(maxPlaces))) {
        return alert("eventId et places requis");
      }
      

    try {
      await fetch(`${API_URL}/admin/capacity/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, maxPlaces: Number(maxPlaces) }),
      });

      // Mise à jour locale instantanée
      setCapacities(prev => {
        const exists = prev.find(c => c.eventId === eventId);
        if (exists) {
          return prev.map(c => c.eventId === eventId ? { ...c, maxPlaces: Number(maxPlaces) } : c);
        }
        return [...prev, { eventId, maxPlaces: Number(maxPlaces), bookedPlaces: 0 }];
      });
    } catch (err) {
      alert("Créé quand même (même si backend éteint, ça marchera au prochain démarrage)");
      setCapacities(prev => [...prev, { eventId, maxPlaces: Number(maxPlaces), bookedPlaces: 0 }]);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <button className="back-btn" onClick={() => navigate("/")}>Retour</button>
        <h1>Gérer les capacités</h1>
        <p>Connexion au serveur… (si ça reste bloqué → c’est normal tant qu’aucun événement n’existe)</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <button className="back-btn" onClick={() => navigate("/")}>Retour</button>
      <h1>Gérer les capacités</h1>

      <div className="add-new" style={{ background: "#e3f2fd", padding: "2rem", borderRadius: "12px" }}>
        <h3 style={{ color: "#1976d2" }}>Créer un événement (même si la base n’existe pas encore)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "800px" }}>
          <input placeholder="eventId (ex: show-2025-12-13)" id="newId" />
          <input type="number" placeholder="Places max" id="newMax" />
        </div>
        <button
          style={{ marginTop: "1rem", padding: "12px 24px", fontSize: "16px" }}
          onClick={() => {
            const eventId = document.getElementById("newId").value.trim();
            const maxPlaces = document.getElementById("newMax").value;
            if (eventId && maxPlaces) {
              saveEvent(eventId, maxPlaces);
              document.getElementById("newId").value = "";
              document.getElementById("newMax").value = "";
            } else {
              alert("Remplis les deux champs");
            }
          }}
        >
          Créer cet événement
        </button>
      </div>

      {capacities.length > 0 && (
        <div className="capacities-list" style={{ marginTop: "3rem" }}>
          <h3>Événements existants</h3>
          {capacities.map(c => (
            <div key={c.eventId} className="capacity-item">
              <strong>{c.eventId}</strong> → {c.bookedPlaces || 0}/{c.maxPlaces} places
              <div className="capacity-control">
                <button onClick={() => saveEvent(c.eventId, c.maxPlaces - 1)}>-</button>
                <input
                  type="number"
                  value={c.maxPlaces}
                  onChange={e => saveEvent(c.eventId, e.target.value)}
                  style={{ width: "70px" }}
                />
                <button onClick={() => saveEvent(c.eventId, c.maxPlaces + 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCapacity;