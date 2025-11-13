import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Success from "./components/Results/Success/Success";
import Failure from "./components/Results/Failure/Failure";
import { traineeship } from "./components/data/Data.js";
import { show } from "./components/data/Data.js";
import Cases from "./Cases.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/traineeship-reservation" element={<Cases />} data={traineeship}/>
        <Route path="/traineeship-show" element={<Cases />} data={show}/>
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Failure />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
