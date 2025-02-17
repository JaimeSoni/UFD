import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./login.jsx";
import AdminInicio from "./admin_inicio.jsx";
import AdminAreas from "./admin_areas.jsx";
import AdminAcceso from "./admin_acceso.jsx";
import AdminRegistros from "./admin_registros.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin_inicio" element={<AdminInicio />} />
      <Route path="/admin_areas" element={<AdminAreas />} />
      <Route path="/admin_acceso" element={<AdminAcceso />} />
      <Route path="/admin_registros" element={<AdminRegistros />}/>
    </Routes>
  </Router>
);