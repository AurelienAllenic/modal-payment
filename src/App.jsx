import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./HomePage";
import Success from "./components/Results/Success/Success";
import Failure from "./components/Results/Failure/Failure";
import Cases from "./Cases.jsx";
import OrdersList from "./components/OrdersList/OrdersList.jsx";
import AdminCapacities from "./components/AdminCapacities/AdminCapacity.jsx";
import { useEffect, useState, useMemo } from "react";

function AppContent() {
  const [traineeship, setTraineeship] = useState(null);
  const [showData, setShowData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [trialCourses, setTrialCourses] = useState([]);
  const location = useLocation();

  const API_BASE_URL = useMemo(() => {
    const isLocal = import.meta.env.MODE === "development"; 
    const raw = isLocal
      ? import.meta.env.VITE_BACKEND_LOCAL_URL || ""
      : import.meta.env.VITE_BACKEND_URL || "";
    const clean = raw.replace(/\/+$/, "");
    return clean.endsWith("/api") ? clean : `${clean}/api`;
  }, []);

  const fetchAll = async () => {
    try {
      
      const tRes = await fetch(`${API_BASE_URL}/traineeships`);
      const tList = await tRes.json();
      setTraineeship(tList[0] || null);

      const sRes = await fetch(`${API_BASE_URL}/shows`);
      const sList = await sRes.json();
      setShowData(Array.isArray(sList) ? sList[0] : sList);

      const trRes = await fetch(`${API_BASE_URL}/trial-courses`);
      const trList = await trRes.json();
      setTrialCourses(Array.isArray(trList) ? trList : []);

      const cRes = await fetch(`${API_BASE_URL}/classic-courses`);
      const cList = await cRes.json();
      setCourses(Array.isArray(cList) ? cList : []);

    } catch (err) {
      console.error("Erreur App.js fetchAll:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (location.pathname.includes("-reservation")) {
      fetchAll();
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/orders-list" element={<OrdersList />} />
      <Route path="/admin-capacities" element={<AdminCapacities />} />

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
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
