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

  // L'OBJET QUI CONTIENT L'ÉVÉNEMENT AVEC SON _id – LA SOURCE DE VÉRITÉ UNIQUE
  const currentEvent = (() => {
    // Stages & Spectacles → data est l'objet complet avec _id
    if (dataType === "traineeship" || dataType === "show") {
      return data && data._id ? data : null;
    }

    // Cours d’essai → tout est dans formData.trialCourse
    if (dataType === "courses" && formData.courseType === "essai" && formData.trialCourse) {
      return formData.trialCourse;
    }

    // Cours réguliers → on prend le premier cours sélectionné qui existe
    if (dataType === "courses" && formData.classicCourses) {
      const selected = Object.values(formData.classicCourses).find(c => c && c._id);
      return selected || null;
    }

    return null;
  })();

  console.log("currentEvent (avec _id) →", currentEvent);

  // Calcul du prix Stripe pour les cours
  const getStripePriceId = () => {
    if (dataType !== "courses") return null;

    // Cours d’essai → prix fixe
    if (formData.courseType === "essai") {
      return import.meta.env.VITE_PRICE_COURSE_TRIAL;
    }

    // Cours réguliers
    const isChild = formData.ageGroup === "enfant" || formData.ageGroup === "Enfant";
    const durationMap = {
      trimestre: "TRIMESTER",
      semestre: "SEMESTER",
      annee: "YEAR",
    };
    const durationKey = formData.duration || formData.courseType;
    const normalizedDuration = durationMap[durationKey];

    if (!normalizedDuration || !formData.nbCoursesPerWeek) {
      console.error("Durée ou nb de cours manquant");
      return null;
    }

    const nb = formData.nbCoursesPerWeek;
    const type = isChild ? "CHILD" : "ADULT";
    const key = `VITE_PRICE_${normalizedDuration}_${nb}_${type}`;

    return import.meta.env[key] || null;
  };

  // Calcul total spectacle (affichage)
  const calculateShowTotal = () => {
    const adultes = formData.adultes || 0;
    const enfants = formData.enfants || 0;
    return adultes * 15 + enfants * 10;
  };

  // Lancement du paiement
  const handleReserve = async () => {
    try {
      let items = [];

      // STAGES
      if (dataType === "traineeship") {
        const priceId = import.meta.env.VITE_PRICE_TRAINEESHIP;
        if (!priceId) return alert("Erreur : prix du stage manquant");
        const nb = formData.nombreParticipants || 1;
        for (let i = 0; i < nb; i++) {
          items.push({ price: priceId, quantity: 1 });
        }
      }

      // SPECTACLES
      else if (dataType === "show") {
        const adultPriceId = import.meta.env.VITE_PRICE_SHOW_ADULT;
        const childPriceId = import.meta.env.VITE_PRICE_SHOW_CHILD;
        if (!adultPriceId || !childPriceId) return alert("Erreur : prix spectacle manquant");

        if (formData.adultes > 0) items.push({ price: adultPriceId, quantity: formData.adultes });
        if (formData.enfants > 0) items.push({ price: childPriceId, quantity: formData.enfants });

        if (items.length === 0) return alert("Veuillez sélectionner au moins une place");
      }

      // COURS
      else if (dataType === "courses") {
        const priceId = getStripePriceId();
        if (!priceId) return alert("Erreur : prix du cours non trouvé");
        items = [{ price: priceId, quantity: 1 }];
      }

      // Envoi à Stripe
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerEmail: formData.email,
          metadata: {
            type: dataType,

            // ID CORRECT DANS TOUS LES CAS
            eventId: currentEvent?._id?.toString() || null,

            // Infos client
            nom: formData.nom || "",
            email: formData.email || "",
            telephone: formData.telephone || "",

            // Quantités
            nombreParticipants: formData.nombreParticipants?.toString() || "",
            adultes: formData.adultes?.toString() || "0",
            enfants: formData.enfants?.toString() || "0",

            // Cours
            ageGroup: formData.ageGroup || "",
            courseType: formData.courseType || "",
            totalPrice: formData.totalPrice?.toString() || "",

            // Pour l'email de confirmation
            eventTitle: currentEvent?.title || "Réservation Modal Danse",
            eventPlace: currentEvent?.place || "Modal Danse",
            eventDate: currentEvent?.date || "",
            eventHours: currentEvent?.time || currentEvent?.hours || "",
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur serveur");
      }

      const { url } = await response.json();
      if (!url) throw new Error("URL de paiement non reçue");
      window.location.href = url;

    } catch (err) {
      console.error("Erreur paiement :", err);
      alert("Une erreur est survenue : " + err.message);
    }
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
          {/* STAGES */}
          {dataType === "traineeship" && currentEvent && (
            <>
              <p>Stage :</p>
              <ul>
                <li>{currentEvent.title}</li>
                <li>{currentEvent.place}</li>
                <li>{currentEvent.hours}</li>
                <li>{currentEvent.date}</li>
                <li>Participant(s) : {formData.nombreParticipants || 1}</li>
              </ul>
              <p className="recapTotal">
                Total : {(formData.nombreParticipants || 1) * 20} €
              </p>
            </>
          )}

          {/* SPECTACLES */}
          {dataType === "show" && currentEvent && (
            <>
              <p>Spectacle :</p>
              <ul>
                <li>{currentEvent.title}</li>
                <li>{currentEvent.place}</li>
                <li>{currentEvent.hours}</li>
                <li>{currentEvent.date}</li>
                <li>Adultes : {formData.adultes || 0} × 15€ = {(formData.adultes || 0) * 15}€</li>
                <li>Enfants : {formData.enfants || 0} × 10€ = {(formData.enfants || 0) * 10}€</li>
                <li>Total places : {(formData.adultes || 0) + (formData.enfants || 0)}</li>
              </ul>
              <p className="recapTotal">Total : {calculateShowTotal()} €</p>
            </>
          )}

          {/* COURS */}
          {dataType === "courses" && (
            <>
              <p>Cours :</p>
              <ul>
                <li>Catégorie d’âge : {formData.ageGroup || "—"}</li>
                <li>Type : {formData.courseType === "essai" ? "Cours d’essai" : "Cours réguliers"}</li>

                {/* Cours d’essai */}
                {formData.courseType === "essai" && formData.trialCourse && (
                  <>
                    <li>Date : {formData.trialCourse.date}</li>
                    <li>Heure : {formData.trialCourse.time}</li>
                    <li>Lieu : {formData.trialCourse.place}</li>
                  </>
                )}

                {/* Cours réguliers */}
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