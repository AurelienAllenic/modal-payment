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
  const [copied, setCopied] = useState(false); // ← état pour le bouton copier

  useEffect(() => {
    if (!sessionId) {
      setError("Aucune session trouvée");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(
          `http://localhost:4242/retrieve-session?session_id=${sessionId}`
        );
        if (!res.ok) throw new Error("Impossible de récupérer la commande");
        const data = await res.json();
        setSession(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(session.id);
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

  // === DONNÉES STRIPE ===
  const metadata = session.metadata || {};
  const customer = session.customer_details || {};
  const amount = (session.amount_total / 100).toFixed(2);
  const dataType = metadata.type;

  const eventData = metadata.eventData ? JSON.parse(metadata.eventData) : null;
  const singleEvent = Array.isArray(eventData) ? eventData[0] : eventData;

  const formData = {
    nom: metadata.nom || customer.name || "Non renseigné",
    email: metadata.email || customer.email,
    telephone: metadata.telephone || customer.phone || "Non renseigné",
    nombreParticipants: metadata.nombreParticipants ? parseInt(metadata.nombreParticipants) : null,
    adultes: metadata.adultes ? parseInt(metadata.adultes) : 0,
    enfants: metadata.enfants ? parseInt(metadata.enfants) : 0,
    ageGroup: metadata.ageGroup || "",
    courseType: metadata.courseType || "",
    totalPrice: metadata.totalPrice ? parseFloat(metadata.totalPrice) : null,
    trialCourse: metadata.trialCourse ? JSON.parse(metadata.trialCourse) : null,
    classicCourses: metadata.classicCourses ? JSON.parse(metadata.classicCourses) : null,
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Réservation confirmée !</h1>

        {/* NUMÉRO DE COMMANDE + BOUTON COPIER */}
        <div className="order-number-wrapper">
          <p className="order-number">
            Numéro de commande : <strong>{session.id}</strong>
          </p>
          <button onClick={copyOrderNumber} className="copy-btn" title="Copier le numéro de commande">
            {copied ? (
              <>
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
                </svg>
                Copié !
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path>
                  <path d="M5.25 1.75C5.25.784 6.034 0 7 0h7.25C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11H14v-1.5a.75.75 0 00-1.5 0v1.5h-.25a.25.25 0 01-.25-.25v-7.5a.25.25 0 01.25-.25h7.5a.25.25 0 01.25.25v7.5a.25.25 0 01-.25.25h-1.5a.75.75 0 000 1.5h1.5c.966 0 1.75-.784 1.75-1.75v-7.5A1.75 1.75 0 0114.25 1H7a1.75 1.75 0 00-1.75 1.75v.25z"></path>
                </svg>
                Copier
              </>
            )}
          </button>
        </div>

        <div className="success-details">

          {/* Informations client */}
          <div className="detail-section">
            <h3>Vos informations</h3>
            <p><strong>Nom :</strong> {formData.nom}</p>
            <p><strong>Email :</strong> {formData.email}</p>
            <p><strong>Téléphone :</strong> {formData.telephone}</p>
          </div>

          {/* STAGE */}
          {dataType === "traineeship" && singleEvent && (
            <div className="detail-section">
              <h3>Détails du stage</h3>
              <p><strong>{singleEvent.title}</strong></p>
              <p>{singleEvent.place}</p>
              <p>{singleEvent.date} • {singleEvent.hours}</p>
              <p>Participants : {formData.nombreParticipants}</p>
              <p className="price"><strong>Montant payé : {amount} €</strong></p>
            </div>
          )}

          {/* SPECTACLE */}
          {dataType === "show" && singleEvent && (
            <div className="detail-section">
              <h3>Détails du spectacle</h3>
              <p><strong>{singleEvent.title}</strong></p>
              <p>{singleEvent.place}</p>
              <p>{singleEvent.date} • {singleEvent.hours}</p>
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

              {formData.courseType === "essai" && formData.trialCourse && (
                <>
                  <p>Date : {formData.trialCourse.date}</p>
                  <p>Heure : {formData.trialCourse.time}</p>
                  <p>Lieu : {formData.trialCourse.place}</p>
                </>
              )}

              {formData.courseType !== "essai" && formData.classicCourses && (
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