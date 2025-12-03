import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Success from "./components/Results/Success/Success";
import Failure from "./components/Results/Failure/Failure";
import {
  traineeship,
  show,
  courses,
  trialCourses,
} from "./components/data/Data.js";
import Cases from "./Cases.jsx";
import OrdersList from "./components/OrdersList/OrdersList.jsx";
import AdminCapacities from "./components/AdminCapacities/AdminCapacity.jsx";

function App() {
  return (
    <BrowserRouter>
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
          element={<Cases data={show} type="show" />}
        />
        <Route
          path="/course-reservation"
          element={<Cases data={{ courses, trialCourses }} type="courses" />}
        />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Failure />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
