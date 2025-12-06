// src/pages/Success.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import "./success.scss";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

   const API_BASE_URL = (() => {
    const isLocal = import.meta.env.MODE === "development";
    const raw = isLocal
      ? import.meta.env.VITE_BACKEND_LOCAL_URL || ""
      : import.meta.env.VITE_BACKEND_URL || "";
    const clean = raw.replace(/\/+$/, "");
    return clean.endsWith("/api") ? clean : `${clean}/api`;
  })();


  useEffect(() => {
    if (!sessionId) {
      setError("Aucune session trouvée");
      setLoading(false);
      return;
    }


    const fetchSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/retrieve-session?session_id=${sessionId}`);

        if (!res.ok) throw new Error("Impossible de récupérer la commande");
        const data = await res.json();
        console.log("DATA :", data);
        setSession(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(session?.orderNumber || session?.id || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sessionId || error) {
    return (
      <div className="success-container">
        <div className="success-card error">
          <h1>Erreur</h1>
          <p>{error || "Session introuvable"}</p>
          <button onClick={() => navigate("/")} className="btn-home">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="success-container">
        <div className="success-card loading">
          <FaSpinner className="spin" />
          <p>Chargement de votre réservation...</p>
        </div>
      </div>
    );
  }

  const metadata = session.metadata || {};
  const customer = session.customer_details || {};
  const amount = (session.amount_total / 100).toFixed(2);
  const dataType = metadata.type;

  const formData = {
    nom: metadata.nom || customer.name || "Non renseigné",
    email: metadata.email || customer.email,
    telephone: metadata.telephone || customer.phone || "Non renseigné",
    nombreParticipants: metadata.nombreParticipants ? parseInt(metadata.nombreParticipants) : 1,
    adultes: metadata.adultes ? parseInt(metadata.adultes) : 0,
    enfants: metadata.enfants ? parseInt(metadata.enfants) : 0,
    ageGroup: metadata.ageGroup || "",
    courseType: metadata.courseType || "",
    event: session.event || {}, 
    totalPrice: metadata.totalPrice ? parseFloat(metadata.totalPrice) : amount,
    trialCourse: metadata.trialCourse ? JSON.parse(metadata.trialCourse) : null,
    classicCourses: metadata.classicCourses ? JSON.parse(metadata.classicCourses) : null,
    eventTitle: metadata.eventTitle || "",
    eventPlace: metadata.eventPlace || "",
    eventDate: metadata.eventDate || "",
    eventHours: metadata.eventHours || "",
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Réservation confirmée !</h1>

        {/* Numéro de commande + copier */}
        <div className="order-number-wrapper">
          <p className="order-number">
            Numéro de commande : <strong>{session.orderNumber || session.id}</strong>
          </p>
          <button onClick={copyOrderNumber} className="copy-btn" title="Copier le numéro de commande">
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>

        <div className="success-details">
          {/* Informations client */}
          <div className="detail-section">
            <h3>Vos informations</h3>
            <p><strong>Nom :</strong> {formData.nom}</p>
            <p><strong>Email :</strong> {formData.email}</p>
            <p><strong>Téléphone :</strong> {formData?.telephone ?? formData?.phone}</p>
          </div>

          {/* STAGE */}
          {dataType === "traineeship" && (
            <div className="detail-section">
              <h3>Détails du stage</h3>
              <p><strong>{session.event.title}</strong></p>
              <p>{session.event.place}</p>
              <p>{session.event.date} • {session.event.hours}</p>
              <p>Participants : {formData.nombreParticipants}</p>
              <p className="price"><strong>Montant payé : {amount} €</strong></p>
            </div>
          )}

          {/* SPECTACLE */}
          {dataType === "show" && (
            <div className="detail-section">
              <h3>Détails du spectacle</h3>
              <p><strong>{session.event.title}</strong></p>
              <p>{session.event.place}</p>
              <p>{session.event.date} • {session.event.hours}</p>
              <p>Places adultes : {formData.adultes} × 15 €</p>
              <p>Places enfants : {formData.enfants} × 10 €</p>
              <p>Total places : {formData.adultes + formData.enfants}</p>
              <p className="price"><strong>Montant payé : {amount} €</strong></p>
            </div>
          )}

          {/* COURS */}
          {dataType === "courses" && (
            <div className="detail-section">
              <h3>Détails du cours</h3>
              <p>Catégorie : {formData.ageGroup}</p>
              <p>Type : {formData.courseType === "essai" ? "Cours d’essai" : "Cours régulier"}</p>

              {formData.courseType === "essai" && (
                <>
                  <p>Date : {session.event.date}</p>
                  <p>Heure : {metadata.trialCourseTime}</p>
                  <p>Lieu : {session.event.place}</p>
                </>
              )}

              {formData.courseType !== "essai" && (
                <>
                  <p><strong>Cours sélectionnés :</strong></p>
                  {Object.entries(formData.classicCourses)
                    .filter(([, c]) => c)
                    .map(([day, c]) => (
                      <p key={day}>
                        <strong>{day.charAt(0).toUpperCase() + day.slice(1)}</strong> : {c.date} – {c.time} – {c.place}
                      </p>
                    ))}
                </>
              )}

              <p className="price"><strong>Montant payé : {amount} €</strong></p>
            </div>
          )}
        </div>

        <p className="confirmation-message">
          Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
        </p>

        <button onClick={() => navigate("/")} className="btn-home">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Success;
