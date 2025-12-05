import React from "react";
import { PiNumberCircleOneThin, PiNumberCircleTwoThin } from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import "./recap.scss";

const Recap = ({
  formData,
  data,
  dataType,
  stepNumber,
  onPrev,
  showPrevButton,
}) => {
  console.log("Recap → formData :", formData, "dataType :", dataType);

  // ON CONSTRUIT LA LISTE DES IDs À RÉSERVER
  const getEventIds = () => {
    if (dataType === "traineeship" || dataType === "show") {
      return data?._id ? [data._id.toString()] : [];
    }

    if (dataType === "courses") {
      if (formData.courseType === "essai" && formData.trialCourse?._id) {
        return [formData.trialCourse._id.toString()];
      }

      if (formData.classicCourses) {
        const ids = Object.values(formData.classicCourses)
          .filter(course => course && course._id)
          .map(course => course._id.toString());
        return ids.length > 0 ? ids : [];
      }
    }

    return [];
  };

  const eventIds = getEventIds();
  console.log("eventIds envoyés au back →", eventIds);

  // Pour l'affichage (on garde le premier événement pour le titre, lieu, etc.)
  const displayEvent = (() => {
    if (dataType === "traineeship" || dataType === "show") return data;
    if (dataType === "courses" && formData.courseType === "essai") return formData.trialCourse;
    if (dataType === "courses" && formData.classicCourses) {
      return Object.values(formData.classicCourses).find(c => c) || null;
    }
    return null;
  })();

  // Prix Stripe
  const getStripePriceId = () => {
    if (dataType !== "courses") return null;
    if (formData.courseType === "essai") return import.meta.env.VITE_PRICE_COURSE_TRIAL;

    const isChild = formData.ageGroup === "enfant" || formData.ageGroup === "Enfant";
    const durationMap = { trimestre: "TRIMESTER", semestre: "SEMESTER", annee: "YEAR" };
    const durationKey = formData.duration || formData.courseType;
    const normalizedDuration = durationMap[durationKey];
    if (!normalizedDuration || !formData.nbCoursesPerWeek) return null;

    const nb = formData.nbCoursesPerWeek;
    const type = isChild ? "CHILD" : "ADULT";
    const key = `VITE_PRICE_${normalizedDuration}_${nb}_${type}`;
    return import.meta.env[key] || null;
  };

  const calculateShowTotal = () => {
    const adultes = formData.adultes || 0;
    const enfants = formData.enfants || 0;
    return adultes * 15 + enfants * 10;
  };

  const handleReserve = async () => {
    try {
      let items = [];

      if (dataType === "traineeship") {
        const priceId = import.meta.env.VITE_PRICE_TRAINEESHIP;
        if (!priceId) return alert("Prix stage manquant");
        const nb = formData.nombreParticipants || 1;
        for (let i = 0; i < nb; i++) {
          items.push({ price: priceId, quantity: 1 });
        }
      }

      else if (dataType === "show") {
        const adultPriceId = import.meta.env.VITE_PRICE_SHOW_ADULT;
        const childPriceId = import.meta.env.VITE_PRICE_SHOW_CHILD;
        if (!adultPriceId || !childPriceId) return alert("Prix spectacle manquant");

        if (formData.adultes > 0) items.push({ price: adultPriceId, quantity: formData.adultes });
        if (formData.enfants > 0) items.push({ price: childPriceId, quantity: formData.enfants });
        if (items.length === 0) return alert("Sélectionnez au moins une place");
      }

      else if (dataType === "courses") {
        const priceId = getStripePriceId();
        if (!priceId) return alert("Prix cours non trouvé");
        items = [{ price: priceId, quantity: 1 }];
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerEmail: formData.email,
          metadata: {
            type: dataType,

            // ON ENVOIE TOUS LES IDS (1 ou plusieurs)
            eventIds: eventIds, // ← C'EST ÇA LA CLÉ !

            nom: formData.nom || "",
            email: formData.email || "",
            telephone: formData.telephone || "",

            nombreParticipants: formData.nombreParticipants?.toString() || "",
            adultes: formData.adultes?.toString() || "0",
            enfants: formData.enfants?.toString() || "0",

            ageGroup: formData.ageGroup || "",
            courseType: formData.courseType || "",
            totalPrice: formData.totalPrice?.toString() || "",

            // Pour l'email
            eventTitle: displayEvent?.title || "Réservation Modal Danse",
            eventPlace: displayEvent?.place || "Modal Danse",
            eventDate: displayEvent?.date || "",
            eventHours: displayEvent?.time || displayEvent?.hours || "",
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur serveur");
      }

      const { url } = await response.json();
      window.location.href = url;

    } catch (err) {
      console.error("Erreur paiement :", err);
      alert("Erreur : " + err.message);
    }
  };

  return (
    <div className="containerRecap">
      <div className="RecapTitle">
        {stepNumber === 1 && <PiNumberCircleOneThin className="stepIcon" />}
        {stepNumber === 2 && <PiNumberCircleTwoThin className="stepIcon" />}
        <h2>Résumé de votre commande</h2>
      </div>

      <div className="containerAllRecap">
        <div className="containerRecapObject">
          {dataType === "traineeship" && displayEvent && (
            <>
              <p>Stage :</p>
              <ul>
                <li>{displayEvent.title}</li>
                <li>{displayEvent.place}</li>
                <li>{displayEvent.hours}</li>
                <li>{displayEvent.date}</li>
                <li>Participant(s) : {formData.nombreParticipants || 1}</li>
              </ul>
              <p className="recapTotal">
                Total : {(formData.nombreParticipants || 1) * 20} €
              </p>
            </>
          )}

          {dataType === "show" && displayEvent && (
            <>
              <p>Spectacle :</p>
              <ul>
                <li>{displayEvent.title}</li>
                <li>{displayEvent.place}</li>
                <li>{displayEvent.hours}</li>
                <li>{displayEvent.date}</li>
                <li>Adultes : {formData.adultes || 0} × 15€</li>
                <li>Enfants : {formData.enfants || 0} × 10€</li>
                <li>Total places : {(formData.adultes || 0) + (formData.enfants || 0)}</li>
              </ul>
              <p className="recapTotal">Total : {calculateShowTotal()} €</p>
            </>
          )}

          {dataType === "courses" && (
            <>
              <p>Cours :</p>
              <ul>
                <li>Catégorie d’âge : {formData.ageGroup || "—"}</li>
                <li>Type : {formData.courseType === "essai" ? "Cours d’essai" : "Cours réguliers"}</li>

                {formData.courseType === "essai" && formData.trialCourse && (
                  <>
                    <li>Date : {formData.trialCourse.date}</li>
                    <li>Heure : {formData.trialCourse.time}</li>
                    <li>Lieu : {formData.trialCourse.place}</li>
                  </>
                )}

                {formData.courseType !== "essai" && formData.classicCourses && (
                  <>
                    <li><strong>Cours sélectionnés :</strong></li>
                    <ul>
                      {Object.entries(formData.classicCourses)
                        .filter(([, c]) => c)
                        .map(([day, c]) => (
                          <li key={day}>
                            <strong>{day} :</strong> {c.date} – {c.time} – {c.place}
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
            <HiArrowLongRight style={{ transform: "rotate(180deg)" }} />
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