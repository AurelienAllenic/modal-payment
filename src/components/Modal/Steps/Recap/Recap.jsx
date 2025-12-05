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
  onReserve,
  showPrevButton,
}) => {
  console.log("Recap → formData :", formData, "dataType :", dataType, "data :", data );
  if(dataType === "courses"){
    const courseType = formData.courseType
    console.log("courseType => ", courseType)
    if(courseType === "essai"){
      console.log('essai');
    }else{
      formData.classicCourses.forEach((course) => {
        console.log("course id : ", course._id)
      })
    }
  }
  const eventData = Array.isArray(data) 
      ? data[0]
      : Object.values(data || {}).find(item => item?.title || item?.date) || data;

  const handleReserve = async () => {
    try {
      let items = []; // Tableau d'items envoyé à Stripe
  
      // === STAGES → 1 ligne par participant (comme les spectacles) ===
      if (dataType === "traineeship") {
        const stagePriceId = import.meta.env.VITE_PRICE_TRAINEESHIP;
        const nbParticipants = formData.nombreParticipants || 1;
  
        if (!stagePriceId) {
          alert("Erreur : prix du stage manquant (VITE_PRICE_TRAINEESHIP)");
          return;
        }
  
        // On ajoute une ligne séparée pour chaque participant
        for (let i = 0; i < nbParticipants; i++) {
          items.push({ price: stagePriceId, quantity: 1 });
        }
      }
  
      // === SPECTACLES → 2 produits séparés (adulte / enfant) ===
      else if (dataType === "show") {
        const adultPriceId = import.meta.env.VITE_PRICE_SHOW_ADULT;
        const childPriceId = import.meta.env.VITE_PRICE_SHOW_CHILD;
  
        if (!adultPriceId || !childPriceId) {
          alert("Erreur : prix adulte ou enfant manquant dans les variables d'environnement.");
          return;
        }
  
        if (formData.adultes > 0) {
          items.push({ price: adultPriceId, quantity: formData.adultes });
        }
        if (formData.enfants > 0) {
          items.push({ price: childPriceId, quantity: formData.enfants });
        }
  
        if (items.length === 0) {
          alert("Veuillez sélectionner au moins une place.");
          return;
        }
      }
  
      // === COURS (essai ou réguliers) ===
      else if (dataType === "courses") {
        const priceId = getStripePriceId();
        if (!priceId) {
          alert("Erreur : aucun prix configuré pour ce cours.");
          return;
        }
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
            eventId: eventData._id.toString(), // LA LIGNE QUI CHANGE TOUT (obligatoire)

            // Infos client
            nom: formData.nom,
            email: formData.email,
            telephone: formData.telephone,

            // Quantités réservées
            nombreParticipants: formData.nombreParticipants?.toString() || "",
            adultes: formData.adultes?.toString() || "0",
            enfants: formData.enfants?.toString() || "0",

            // Cours
            ageGroup: formData.ageGroup || "",
            courseType: formData.courseType || "",
            totalPrice: formData.totalPrice?.toString() || "",

            // Bonus propre pour les cours d'essai (fortement recommandé)
            trialCourseId: formData.courseType === "essai" && formData.trialCourse?._id
              ? formData.trialCourse._id.toString()
              : null,

            // Tu peux garder ces champs pour l'affichage dans l'email (inoffensifs)
            eventTitle: eventData?.title || "",
            eventPlace: eventData?.place || "",
            eventDate: eventData?.date || "",
            eventHours: eventData?.hours || "",

            // Tu peux supprimer ces deux lignes si tu veux (plus utilisées par le back)
            // trialCourse: formData.trialCourse ? JSON.stringify(formData.trialCourse) : null,
            // classicCourses: formData.classicCourses ? JSON.stringify(formData.classicCourses) : null,
          },
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur serveur");
      }
  
      const { url } = await response.json();
      if (!url) throw new Error("URL de paiement non générée.");
  
      window.location.href = url;
    } catch (err) {
      console.error("Erreur paiement :", err);
      alert("Une erreur est survenue : " + err.message);
    }
  };

  // Calcul du total pour affichage (spectacles)
  const calculateShowTotal = () => {
    const adultes = formData.adultes || 0;
    const enfants = formData.enfants || 0;
    return adultes * 15 + enfants * 10;
  };

  // === Gestion des priceId pour les cours ===
  const getStripePriceId = () => {
    if (dataType !== "courses") return null;

    if (formData.courseType === "essai") {
      return import.meta.env.VITE_PRICE_COURSE_TRIAL;
    }

    const isChild = formData.ageGroup === "enfant" || formData.ageGroup === "Enfant";

    const durationMap = {
      trimestre: "TRIMESTER",
      semestre: "SEMESTER",
      annee: "YEAR",
    };

    const durationKey = formData.duration || formData.courseType;
    const normalizedDuration = durationMap[durationKey];

    if (!normalizedDuration) {
      console.error("Durée non reconnue :", durationKey);
      return null;
    }

    const nb = formData.nbCoursesPerWeek;
    if (!nb || nb < 1 || nb > 3) {
      console.error("Nombre de cours par semaine invalide :", nb);
      return null;
    }

    const type = isChild ? "CHILD" : "ADULT";
    const key = `VITE_PRICE_${normalizedDuration}_${nb}_${type}`;

    console.log("Price ID cours →", key, "=", import.meta.env[key]);
    return import.meta.env[key] || null;
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
          {/* === STAGES === */}
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

          {/* === SPECTACLES === */}
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

          {/* === COURS === */}
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
                    <li><strong>Cours sélectionnés :</strong></li>
                    <ul>
                      {Object.entries(formData.classicCourses)
                        .filter(([, course]) => course)
                        .map(([day, course], index) => (
                          <li key={index}>
                            <strong>{day} :</strong> {course.date} – {course.time} – {course.place}
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