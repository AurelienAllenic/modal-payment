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
    const fetchAllCapacities = async () => {
      try {
        setLoading(true);

        // 1. Stages
        if (dataType === "traineeship" && data?.id) {
          const res = await fetch(`/api/traineeships/${data.id}`);
          if (res.ok) {
            const event = await res.json();
            const total = event.numberOfPlaces || 0;
            const booked = event.bookedPlaces || 0;
            
            // ✅ FIX 1 : Définir `cap` avant de l'utiliser
            const cap = {
              total,
              booked,
              available: Math.max(0, total - booked),
              isFull: total > 0 && total - booked <= 0,
            };
            
            setTraineeshipCapacity(cap);
            setFetchedData(prev => ({ 
              ...prev, 
              traineeship: event, 
              traineeshipCapacity: cap 
            }));
          }
        }

        // 2. Spectacles
        if (dataType === "show" && data?.id) {
          const res = await fetch(`/api/shows/${data.id}`);
          if (res.ok) {
            const event = await res.json();
            const total = event.numberOfPlaces || 0;
            const booked = event.bookedPlaces || 0;
            
            // ✅ FIX 1 : Définir `cap` avant de l'utiliser
            const cap = {
              total,
              booked,
              available: Math.max(0, total - booked),
              isFull: total > 0 && total - booked <= 0,
            };
            
            setShowCapacity(cap);
            setFetchedData(prev => ({ 
              ...prev, 
              show: event, 
              showCapacity: cap 
            }));
          }
        }

        // 3. COURS : on charge TOUT (essai + réguliers)
        if (dataType === "courses") {
          // Cours d'essai
          const trialRes = await fetch(`/api/trial-courses`);
          if (trialRes.ok) {
            const trials = await trialRes.json();
        
            const trialCapacities = trials.map(course => ({
              id: course.id || course._id,
              total: course.numberOfPlaces || 0,
              booked: course.bookedPlaces || 0,
              available: Math.max(0, (course.numberOfPlaces || 0) - (course.bookedPlaces || 0)),
              isFull: (course.numberOfPlaces || 0) > 0 && (course.numberOfPlaces - course.bookedPlaces) <= 0,
            }));
        
            setTrialCoursesCapacity(trialCapacities);
        
            // ✅ FIX 2 : Structure plus propre pour éviter les collisions futures
            setFetchedData(prev => ({
              ...prev,
              courses: {
                ...prev.courses,
                trials
              },
              capacities: {
                ...prev.capacities,
                trialCapacities
              }
            }));
          }
        
          // Cours classiques
          const classicRes = await fetch(`/api/classic-courses`);
          if (classicRes.ok) {
            const classics = await classicRes.json();
        
            const classicCapacities = classics.map(course => ({
              id: course.id || course._id,
              total: course.numberOfPlaces || 0,
              booked: course.bookedPlaces || 0,
              available: Math.max(0, (course.numberOfPlaces || 0) - (course.bookedPlaces || 0)),
              isFull: (course.numberOfPlaces || 0) > 0 && (course.numberOfPlaces - course.bookedPlaces) <= 0,
            }));
        
            setClassicCoursesCapacity(classicCapacities);
        
            // ✅ FIX 2 : Structure plus propre pour éviter les collisions futures
            setFetchedData(prev => ({
              ...prev,
              courses: {
                ...prev.courses,
                classics
              },
              capacities: {
                ...prev.capacities,
                classicCapacities
              }
            }));
          }
        }

      } catch (err) {
        console.error("Erreur chargement capacités :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCapacities();
  }, [dataType, data?.id]);

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