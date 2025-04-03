import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";

// General
import LoginUFD from "./login_ufd.jsx";
import ProtectedRoute from "./BackEnd/protectedRoute.jsx";

// Administrador
import AdminInicio from "./Administrador/admin_inicio.jsx";
import AdminAreas from "./Administrador/admin_areas.jsx";
import AdminDocs from "./Administrador/admin_docs.jsx";
import AdminRegistros from "./Administrador/admin_registros.jsx";

// Alimentador
import AlimentadorInicio from "./Alimentador/alimentador_inicio.jsx";
import AlimentadorRecopilacion from "./Alimentador/alimentador_recopilacion.jsx";
import AlimentadorPublicaciones from "./Alimentador/alimentador_publicaciones.jsx";
import AlimentadorCategorias from "./Alimentador/alimentador_categorias.jsx"
import AlimentadorInterno from "./Alimentador/alimentador_interno.jsx";


// Usuario Final
import UFInicio from "./UsuarioFinal/uf_inicio.jsx";

// Prueba
import Prueba from "./prueba.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* General */}
      <Route path="/" element={<LoginUFD />} />

      {/* Rutas Protegidas - Administrador */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin_inicio" element={<AdminInicio />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/admin_areas" element={<AdminAreas />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/admin_docs" element={<AdminDocs />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/admin_registros" element={<AdminRegistros />} />
      </Route>

      {/* Rutas Protegidas - Alimentador */}
      <Route element={<ProtectedRoute />}>
        <Route path="/alimentador_inicio" element={<AlimentadorInicio />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/alimentador_recopilacion" element={<AlimentadorRecopilacion />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/alimentador_publicaciones" element={<AlimentadorPublicaciones />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/alimentador_categorias" element={<AlimentadorCategorias />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/alimentador_interno" element={<AlimentadorInterno />} />
      </Route>

      {/* Usuario Final */}
      <Route path="/uf_inicio" element={<UFInicio />} />

      {/* Prueba */}
      <Route path="/prueba" element={<Prueba />} />

    </Routes>
  </BrowserRouter>
);