import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Success from "./components/Results/Success/Success";
import Failure from "./components/Results/Failure/Failure";
import Cases from "./Cases.jsx";
import OrdersList from "./components/OrdersList/OrdersList.jsx";
import AdminCapacities from "./components/AdminCapacities/AdminCapacity.jsx";
import { useEffect, useState, useMemo } from "react";

function App() {
  const [traineeship, setTraineeship] = useState(null);
  const [showData, setShowData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [trialCourses, setTrialCourses] = useState([]);

  const API_BASE_URL = useMemo(() => {
  // Déterminer si on est en local
  const isLocal = import.meta.env.MODE === "development"; 
  // Choisir la variable d'environnement
  const raw = isLocal
    ? import.meta.env.VITE_BACKEND_LOCAL_URL || ""
    : import.meta.env.VITE_BACKEND_URL || "";

  // Nettoyage de l'URL
  const clean = raw.replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
}, []);

/*
useEffect(() => {
    console.log(traineeship, showData, courses, trialCourses)
}, [traineeship, showData, courses, trialCourses])
*/

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // ⭐ 1. Traineeship
        const tRes = await fetch(`${API_BASE_URL}/traineeships`);
        const tList = await tRes.json();
        setTraineeship(tList[0] || null);

        // ⭐ 2. Show
        const sRes = await fetch(`${API_BASE_URL}/shows`);
        const sList = await sRes.json();
        setShowData(Array.isArray(sList) ? sList[0] : sList);

        // ⭐ 3. Trial courses
        const trRes = await fetch(`${API_BASE_URL}/trial-courses`);
        const trList = await trRes.json();
        setTrialCourses(Array.isArray(trList) ? trList : []);

        // ⭐ 4. Classic courses
        const cRes = await fetch(`${API_BASE_URL}/classic-courses`);
        const cList = await cRes.json();
        setCourses(Array.isArray(cList) ? cList : []);
      } catch (err) {
        console.error("Erreur App.js fetchAll:", err);
      }
    };

    fetchAll();
  }, [API_BASE_URL]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/orders-list" element={<OrdersList />} />
        <Route path="/admin-capacities" element={<AdminCapacities />} />

        {/* ⭐ TOUT COMME AVANT ! mais avec des données fetchées */}
        <Route
          path="/traineeship-reservation"
          element={<Cases data={traineeship} type="traineeship" />}
        />
        
        <Route
          path="/show-reservation"
          element={<Cases data={showData} type="show" />}
        />

        <Route
          path="/course-reservation"
          element={
            <Cases
              data={{
                courses,
                trialCourses,
              }}
              type="courses"
            />
          }
        />

        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Failure />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
