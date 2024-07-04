import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import ObjectDetection from "./pages/ObjectDetection.jsx";
import TrainingMode from "./pages/TrainingMode.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route exact path="/object-detection" element={<ObjectDetection />} />
        <Route exact path="/training-mode" element={<TrainingMode />} />
      </Routes>
    </Router>
  );
}

export default App;