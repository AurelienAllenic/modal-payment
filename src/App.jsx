import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Success from "./components/Results/Success/Success";
import Failure from "./components/Results/Failure/Failure";
import TraineeshipCase from "./TraineeshipCase";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/traineeship-reservation" element={<TraineeshipCase />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Failure />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
