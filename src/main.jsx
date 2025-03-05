import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// General
import LoginUFD from "./login_ufd.jsx";

// Administrador
import Login from "./Administrador/login.jsx";
import AdminInicio from "./Administrador/admin_inicio.jsx";
import AdminAreas from "./Administrador/admin_areas.jsx";
import AdminDocs from "./Administrador/admin_docs.jsx";
import AdminRegistros from "./Administrador/admin_registros.jsx";

// Alimentador
import AlimentadorLogin from "./Alimentador/alimentador_login.jsx";
import AlimentadorInicio from "./Alimentador/alimentador_inicio.jsx";
import AlimentadorRecopilacion from "./Alimentador/alimentador_recopilacion.jsx";
import AlimentadorPublicaciones from "./Alimentador/alimentador_publicaciones.jsx";
import AlimentadorCategorias from "./Alimentador/alimentador_categorias.jsx"

// Usuario Final
import UFInicio from "./UsuarioFinal/uf_inicio.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      {/* General */}
      <Route path="/login_ufd" element={<LoginUFD />} />

      {/* Administrador */}
      <Route path="/" element={<Login />} />
      <Route path="/admin_inicio" element={<AdminInicio />} />
      <Route path="/admin_areas" element={<AdminAreas />} />
      <Route path="/admin_docs" element={<AdminDocs />} />
      <Route path="/admin_registros" element={<AdminRegistros />}/>

      {/* Alimentador */}
      <Route path="/alimentador_login" element={<AlimentadorLogin />} />
      <Route path="/alimentador_inicio" element={<AlimentadorInicio />} />
      <Route path="/alimentador_recopilacion" element={<AlimentadorRecopilacion />} />
      <Route path="/alimentador_publicaciones" element={<AlimentadorPublicaciones />} />
      <Route path="/alimentador_categorias" element={<AlimentadorCategorias />} />

      {/* Usuario Final */}
      <Route path="/uf_inicio" element={<UFInicio />} />
      
    </Routes>
  </Router>
);