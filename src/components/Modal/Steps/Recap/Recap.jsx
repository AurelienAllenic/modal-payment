import React from "react";
import { PiNumberCircleOneThin, PiNumberCircleTwoThin } from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import "./recap.scss";
import { loadStripe } from "@stripe/stripe-js"; // Gardé, mais pas utilisé pour la redirection

const Recap = ({
  formData,
  data,
  dataType,
  stepNumber,
  onPrev,
  onReserve,
  showPrevButton,
}) => {
  console.log(formData, data);

  const handleReserve = async () => {
    try {
      let priceId = null;
  
      if (dataType === "traineeship") {
        priceId = import.meta.env.VITE_PRICE_TRAINEESHIP;
      } else if (dataType === "show") {
        priceId = import.meta.env.VITE_PRICE_SHOW;
      } else if (dataType === "courses") {
        priceId = getStripePriceId();
      }
  
      if (!priceId) {
        alert("Erreur : aucun prix configuré pour cette réservation.");
        return;
      }
  
      const quantity =
        dataType === "traineeship"
          ? formData.nombreParticipants
          : dataType === "show"
          ? (formData.adultes || 0) + (formData.enfants || 0)
          : 1;
  
      // On récupère les vraies données de l'événement (stage, spectacle...)
      const eventData = Array.isArray(data) ? data[0] : data;
  
      // ENVOIE TOUT CE QU'IL FAUT DANS METADATA
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          quantity,
          customerEmail: formData.email,
          metadata: {
            // Type de réservation
            type: dataType,
  
            // Infos client
            nom: formData.nom,
            email: formData.email,
            telephone: formData.telephone,
  
            // === STAGES ===
            nombreParticipants: formData.nombreParticipants?.toString(),
  
            // === SPECTACLES ===
            adultes: formData.adultes?.toString() || "0",
            enfants: formData.enfants?.toString() || "0",
  
            // === COURS ===
            ageGroup: formData.ageGroup || "",
            courseType: formData.courseType || "",
            totalPrice: formData.totalPrice?.toString() || "",
            trialCourse: formData.trialCourse ? JSON.stringify(formData.trialCourse) : null,
            classicCourses: formData.classicCourses ? JSON.stringify(formData.classicCourses) : null,
  
            // === ÉVÉNEMENT (stage, spectacle, etc.) ===
            eventTitle: eventData?.title || "",
            eventPlace: eventData?.place || "",
            eventDate: eventData?.date || "",
            eventHours: eventData?.hours || "",
  
            // Optionnel : stringify tout l'objet event si tu veux être sûr
            eventData: JSON.stringify(eventData),
          },
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur serveur");
      }
  
      const { url } = await response.json();
      if (!url) throw new Error("URL de paiement non générée.");
  
      // Redirection vers Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error("Erreur :", err);
      alert("Une erreur est survenue : " + err.message);
    }
  };

  // Calcul du total pour les spectacles
  const calculateShowTotal = () => {
    const adultes = formData.adultes || 0;
    const enfants = formData.enfants || 0;
    return adultes * 15 + enfants * 10;
  };

  const eventData = Array.isArray(data) ? data[0] : data;

  const getStripePriceId = () => {
    if (dataType !== "courses") return null;

    if (formData.courseType === "essai") {
      return import.meta.env.VITE_PRICE_COURSE_TRIAL;
    }

    const duration = formData.duration;
    const nbCours = formData.nbCoursesPerWeek;

    if (!duration || !nbCours) return null;

    if (duration === "trimester") {
      if (nbCours === 1) return import.meta.env.VITE_PRICE_TRIMESTER_1;
      if (nbCours === 2) return import.meta.env.VITE_PRICE_TRIMESTER_2;
      if (nbCours === 3) return import.meta.env.VITE_PRICE_TRIMESTER_3;
    }

    if (duration === "semester") {
      if (nbCours === 1) return import.meta.env.VITE_PRICE_SEMESTER_1;
      if (nbCours === 2) return import.meta.env.VITE_PRICE_SEMESTER_2;
      if (nbCours === 3) return import.meta.env.VITE_PRICE_SEMESTER_3;
    }

    if (duration === "year") {
      if (nbCours === 1) return import.meta.env.VITE_PRICE_YEAR_1;
      if (nbCours === 2) return import.meta.env.VITE_PRICE_YEAR_2;
      if (nbCours === 3) return import.meta.env.VITE_PRICE_YEAR_3;
    }

    return null;
  };

  return (
    <div className="containerRecap">
      <div className="RecapTitle">
        {stepNumber === 1 ? (
          <PiNumberCircleOneThin className="stepIcon" />
        ) : stepNumber === 2 ? (
          <PiNumberCircleTwoThin className="stepIcon" />
        ) : null}
        <h2>Résumé de votre commande</h2>
      </div>
      <div className="containerAllRecap">
        <div className="containerRecapObject">
          {dataType === "traineeship" && (
            <>
              <p>Stage :</p>
              <ul>
                <li>{eventData?.title}</li>
                <li>{eventData?.place}</li>
                <li>{eventData?.hours}</li>
                <li>{eventData?.date}</li>
                <li>Participant(s) : {formData.nombreParticipants}</li>
              </ul>
              <p className="recapTotal">
                Total : {formData.nombreParticipants * 20} €
              </p>
            </>
          )}
          {dataType === "show" && (
            <>
              <p>Spectacle :</p>
              <ul>
                <li>{eventData?.title}</li>
                <li>{eventData?.place}</li>
                <li>{eventData?.hours}</li>
                <li>{eventData?.date}</li>
                <li>
                  Places adultes : {formData.adultes || 0} × 15€ ={" "}
                  {(formData.adultes || 0) * 15}€
                </li>
                <li>
                  Places enfants : {formData.enfants || 0} × 10€ ={" "}
                  {(formData.enfants || 0) * 10}€
                </li>
                <li>
                  Total places : {(formData.adultes || 0) + (formData.enfants || 0)}
                </li>
              </ul>
              <p className="recapTotal">Total : {calculateShowTotal()} €</p>
            </>
          )}
          {dataType === "courses" && (
            <>
              <p>Cours :</p>
              <ul>
                <li>Catégorie d’âge : {formData.ageGroup}</li>
                <li>Type de cours : {formData.courseType}</li>
                {formData.courseType === "essai" && formData.trialCourse && (
                  <>
                    <li>Date du cours : {formData.trialCourse.date}</li>
                    <li>Heure : {formData.trialCourse.time}</li>
                    <li>Lieu : {formData.trialCourse.place}</li>
                  </>
                )}
                {formData.courseType !== "essai" && formData.classicCourses && (
                  <>
                    <li>
                      <strong>Cours sélectionnés :</strong>
                    </li>
                    <ul>
                      {Object.entries(formData.classicCourses)
                        .filter(([, course]) => course)
                        .map(([day, course], index) => (
                          <li key={index}>
                            <strong>{day} :</strong> {course.date} – {course.time} –{" "}
                            {course.place}
                          </li>
                        ))}
                    </ul>
                  </>
                )}
              </ul>
              <p className="recapTotal">
                Total : {formData.totalPrice ? `${formData.totalPrice} €` : "—"}
              </p>
            </>
          )}
        </div>
        <div className="containerUserRecap">
          <p>Vos informations :</p>
          <ul>
            <li>Nom : {formData.nom}</li>
            <li>Téléphone : {formData.telephone}</li>
            <li>Email : {formData.email}</li>
            {formData.message && <li>Message : {formData.message}</li>}
          </ul>
        </div>
      </div>
      <div className="buttons-group">
        {showPrevButton && (
          <button type="button" onClick={onPrev} className="btn-prev-step">
            <HiArrowLongRight />
            Précédent
          </button>
        )}
        <button type="button" onClick={handleReserve} className="btn-reserve">
          Réserver <HiArrowLongRight />
        </button>
      </div>
    </div>
  );
};

export default Recap;