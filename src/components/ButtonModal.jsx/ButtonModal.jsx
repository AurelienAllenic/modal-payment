// ButtonModal.jsx
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchCapacities = async () => {
      setLoading(true);
      try {
  
        // 1. Traineeship
        if (dataType === "traineeship") {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/traineeships`);
          if (!res.ok) {
            console.error("Erreur fetch /api/traineeships :", res.status, res.statusText);
            throw new Error("Erreur fetch traineeships");
          }
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
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/shows`);
          if (!res.ok) {
            console.error("Erreur fetch /api/shows :", res.status, res.statusText);
            throw new Error("Erreur fetch shows");
          }
          const shows = await res.json();
          console.log("data brute shows :", shows);
          const event = Array.isArray(shows) ? shows[0] : shows;
          console.log("event extrait :", event);
  
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
            console.log("fetchedData show (local) :", nextFetched);
          }
        }
  
        // 3. Trial + classic courses
        if (dataType === "courses") {
          const trialRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/trial-courses`);
          if (!trialRes.ok) {
            console.error("Erreur fetch /api/trial-courses :", trialRes.status, trialRes.statusText);
            throw new Error("Erreur fetch trial-courses");
          }
          const trials = await trialRes.json();
          console.log("data brute trial-courses :", trials);
  
          const trialCapacities = trials.map(course => ({
            id: course._id,
            total: course.numberOfPlaces || 0,
            booked: course.bookedPlaces || 0,
            available: Math.max(0, (course.numberOfPlaces || 0) - (course.bookedPlaces || 0)),
            isFull: (course.numberOfPlaces || 0) - (course.bookedPlaces || 0) <= 0,
          }));
  
          setTrialCoursesCapacity(trialCapacities);
  
          // Classic courses
          const classicRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classic-courses`);
          if (!classicRes.ok) {
            console.error("Erreur fetch /api/classic-courses :", classicRes.status, classicRes.statusText);
            throw new Error("Erreur fetch classic-courses");
          }
          const classics = await classicRes.json();
          console.log("data brute classic-courses :", classics);
  
          const classicCapacities = classics.map(course => ({
            id: course._id,
            total: course.numberOfPlaces || 0,
            booked: course.bookedPlaces || 0,
            available: Math.max(0, (course.numberOfPlaces || 0) - (course.bookedPlaces || 0)),
            isFull: (course.numberOfPlaces || 0) - (course.bookedPlaces || 0) <= 0,
          }));
  
          setClassicCoursesCapacity(classicCapacities);
  
          const nextFetched = {
            courses: {
              trials,
              classics
            },
            capacities: {
              trialCapacities,
              classicCapacities
            }
          };

          setFetchedData(prev => ({ ...prev, ...nextFetched }));
          console.log("fetchedData courses (local) :", nextFetched);
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