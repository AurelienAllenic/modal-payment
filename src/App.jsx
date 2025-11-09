import ButtonModal from "./components/ButtonModal.jsx/ButtonModal";
import { traineeship } from "./components/data/Data.js";
function App() {
  return (
    <div className="container-app">
      <ButtonModal
        text={"Réservez ce stage ici"}
        traineeshipData={traineeship}
        coursesData={""}
        ShowData={""}
      />
    </div>
  );
}

export default App;
