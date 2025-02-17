import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Administrador/login.jsx";
import AdminInicio from "./Administrador/admin_inicio.jsx";
import AdminAreas from "./Administrador/admin_areas.jsx";
import AdminAcceso from "./Administrador/admin_acceso.jsx";
import AdminRegistros from "./Administrador/admin_registros.jsx";

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