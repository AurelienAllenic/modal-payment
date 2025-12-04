// ButtonModal.jsx
import { useState, useEffect, useMemo } from "react";

const ButtonModal = ({ text, data, dataType, Modal }) => {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // États pour stocker les capacités
  const [traineeshipCapacity, setTraineeshipCapacity] = useState(null);
  const [showCapacity, setShowCapacity] = useState(null);
  const [trialCoursesCapacity, setTrialCoursesCapacity] = useState([]);
  const [classicCoursesCapacity, setClassicCoursesCapacity] = useState([]);

  const [fetchedData, setFetchedData] = useState({});
  const [loading, setLoading] = useState(true);

  // Normalise l'URL de base pour éviter les /api doublés ou manquants
  const API_BASE_URL = useMemo(() => {
    const raw = import.meta.env.VITE_BACKEND_URL || "";
    const base = raw.replace(/\/+$/, ""); // supprime les / en trop à la fin
    // Si l'URL se termine déjà par /api, on la garde telle quelle,
    // sinon on ajoute /api
    const finalUrl = base.endsWith("/api") ? base : `${base}/api`;
    console.log("[ButtonModal] API_BASE_URL utilisé :", finalUrl);
    return finalUrl;
  }, []);

  useEffect(() => {
    const fetchCapacities = async () => {
      setLoading(true);
      try {
  
        // 1. Traineeship
        if (dataType === "traineeship") {
          const res = await fetch(`${API_BASE_URL}/traineeships`);
          const list = await res.json();
          const event = list[0]; // ⭐ PRENDRE LE PREMIER
  
          if (event) {
            const cap = {
              total: event.numberOfPlaces || 0,
              booked: event.bookedPlaces || 0,
              available: Math.max(0, (event.numberOfPlaces || 0) - (event.bookedPlaces || 0)),
              isFull: (event.numberOfPlaces || 0) - (event.bookedPlaces || 0) <= 0
            };
  
            setTraineeshipCapacity(cap);
            const nextFetched = {
              traineeship: event,
              traineeshipCapacity: cap,
            };
            setFetchedData(prev => ({ ...prev, ...nextFetched }));
            console.log("fetchedData traineeship (local) :", nextFetched);
          }
        }
  
        // 2. Show
        if (dataType === "show") {
          const showUrl = `${API_BASE_URL}/shows`;
          console.log("[SHOW] URL appelée :", showUrl);
          const res = await fetch(showUrl);
          console.log("[SHOW] Statut HTTP :", res.status, res.statusText);
          
          if (!res.ok) {
            console.error("[SHOW] Erreur HTTP :", res.status, res.statusText);
            const errorText = await res.text();
            console.error("[SHOW] Réponse erreur :", errorText);
            throw new Error(`Erreur fetch shows: ${res.status}`);
          }
          
          const data = await res.json();
          console.log("[SHOW] Réponse brute (type):", typeof data, "| (isArray):", Array.isArray(data), "| (length):", Array.isArray(data) ? data.length : "N/A");
          console.log("[SHOW] Réponse brute complète :", JSON.stringify(data, null, 2));
          
          const event = Array.isArray(data) ? data[0] : data;
          console.log("[SHOW] Event extrait :", event);

          if (event) {
            const cap = {
              total: event.numberOfPlaces || 0,
              booked: event.bookedPlaces || 0,
              available: Math.max(0, (event.numberOfPlaces || 0) - (event.bookedPlaces || 0)),
              isFull: (event.numberOfPlaces || 0) - (event.bookedPlaces || 0) <= 0
            };

            setShowCapacity(cap);
            const nextFetched = {
              show: event,
              showCapacity: cap,
            };
            setFetchedData(prev => ({ ...prev, ...nextFetched }));
            console.log("[SHOW] fetchedData show (local) :", nextFetched);
          } else {
            console.warn("[SHOW] Aucun event trouvé dans la réponse");
          }
        }
  
        // 3. Trial courses
        if (dataType === "courses") {
          // Trial courses
          const trialUrl = `${API_BASE_URL}/trial-courses`;
          console.log("[TRIAL] URL appelée :", trialUrl);
          const trialRes = await fetch(trialUrl);
          console.log("[TRIAL] Statut HTTP :", trialRes.status, trialRes.statusText);
          
          if (!trialRes.ok) {
            console.error("[TRIAL] Erreur HTTP :", trialRes.status, trialRes.statusText);
            const errorText = await trialRes.text();
            console.error("[TRIAL] Réponse erreur :", errorText);
            throw new Error(`Erreur fetch trial-courses: ${trialRes.status}`);
          }
          
          const trials = await trialRes.json();
          console.log("[TRIAL] Réponse brute (type):", typeof trials, "| (isArray):", Array.isArray(trials), "| (length):", Array.isArray(trials) ? trials.length : "N/A");
          console.log("[TRIAL] Réponse brute complète :", JSON.stringify(trials, null, 2));

          const trialCapacities = Array.isArray(trials) ? trials.map(course => ({
            id: course._id,
            total: course.numberOfPlaces || 0,
            booked: course.bookedPlaces || 0,
            available: Math.max(0, (course.numberOfPlaces || 0) - (course.bookedPlaces || 0)),
            isFull: (course.numberOfPlaces || 0) - (course.bookedPlaces || 0) <= 0,
          })) : [];

          setTrialCoursesCapacity(trialCapacities);

          // Classic courses
          const classicUrl = `${API_BASE_URL}/classic-courses`;
          console.log("[CLASSIC] URL appelée :", classicUrl);
          const classicRes = await fetch(classicUrl);
          console.log("[CLASSIC] Statut HTTP :", classicRes.status, classicRes.statusText);
          
          if (!classicRes.ok) {
            console.error("[CLASSIC] Erreur HTTP :", classicRes.status, classicRes.statusText);
            const errorText = await classicRes.text();
            console.error("[CLASSIC] Réponse erreur :", errorText);
            throw new Error(`Erreur fetch classic-courses: ${classicRes.status}`);
          }
          
          const classics = await classicRes.json();
          console.log("[CLASSIC] Réponse brute (type):", typeof classics, "| (isArray):", Array.isArray(classics), "| (length):", Array.isArray(classics) ? classics.length : "N/A");
          console.log("[CLASSIC] Réponse brute complète :", JSON.stringify(classics, null, 2));

          const classicCapacities = Array.isArray(classics) ? classics.map(course => ({
            id: course._id,
            total: course.numberOfPlaces || 0,
            booked: course.bookedPlaces || 0,
            available: Math.max(0, (course.numberOfPlaces || 0) - (course.bookedPlaces || 0)),
            isFull: (course.numberOfPlaces || 0) - (course.bookedPlaces || 0) <= 0,
          })) : [];

          setClassicCoursesCapacity(classicCapacities);

          const nextFetched = {
            courses: {
              trials: Array.isArray(trials) ? trials : [],
              classics: Array.isArray(classics) ? classics : []
            },
            capacities: {
              trialCapacities,
              classicCapacities
            }
          };

          setFetchedData(prev => ({ ...prev, ...nextFetched }));
          console.log("[COURSES] fetchedData courses (local) :", nextFetched);
        }
  
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
  
    fetchCapacities();
  }, [dataType]);
  
  useEffect(() => {
    console.log("fetchedData mis à jour :", fetchedData);
  }, [fetchedData]);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

  const openModal = () => {
    // On bloque seulement si c'est un stage/spectacle complet
    if (dataType === "traineeship" && traineeshipCapacity?.isFull) return;
    if (dataType === "show" && showCapacity?.isFull) return;
    // Pour les cours → on laisse passer, le blocage se fera plus tard dans le formulaire
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="btn-payment-modal-wrapper">
        <button className="btn-payment-modal" disabled>
          Chargement…
        </button>
      </div>
    );
  }

  // Blocage visuel uniquement pour stages et spectacles
  const isFull =
    (dataType === "traineeship" && traineeshipCapacity?.isFull) ||
    (dataType === "show" && showCapacity?.isFull);

  if (isFull) {
    return (
      <div className="btn-payment-modal-wrapper">
        <div className="places-full">
          Plus aucune place disponible
        </div>
      </div>
    );
  }

  return (
    <div className="btn-payment-modal-wrapper">
      {!showModal ? (
        <>
          <button className="btn-payment-modal" onClick={openModal}>
            {text} <span className="icon-btn-modal">👉</span>
          </button>

          {/* Affichage selon le type */}
          {dataType === "traineeship" && traineeshipCapacity && traineeshipCapacity.available < Infinity && (
            <p className="places-remaining">
              {traineeshipCapacity.available <= 3 ? (
                <strong style={{ color: "#d32f2f" }}>
                  Dernière{traineeshipCapacity.available > 1 ? "s" : ""} {traineeshipCapacity.available} place{traineeshipCapacity.available > 1 ? "s" : ""} !
                </strong>
              ) : (
                <>Encore <strong>{traineeshipCapacity.available}</strong> place{traineeshipCapacity.available > 1 ? "s" : ""} disponible{traineeshipCapacity.available > 1 ? "s" : ""}</>
              )}
            </p>
          )}

          {dataType === "show" && showCapacity && showCapacity.available < Infinity && (
            <p className="places-remaining">
              Encore <strong>{showCapacity.available}</strong> place{showCapacity.available > 1 ? "s" : ""} disponible{showCapacity.available > 1 ? "s" : ""}
            </p>
          )}

          {dataType === "courses" && (
            <p className="places-remaining">
              Places limitées sur certains cours — vérifiez la disponibilité
            </p>
          )}
        </>
      ) : (
        Modal && <Modal
          dataType={dataType}
          data={data}
          onClose={handleCloseModal}
          isClosing={isClosing}
          fetchedData={fetchedData}
          trialCoursesCapacity={trialCoursesCapacity}
          classicCoursesCapacity={classicCoursesCapacity}
        />
      )}
    </div>
  );
};

export default ButtonModal;