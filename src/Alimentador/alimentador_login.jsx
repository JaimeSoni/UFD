import React, { useState } from 'react';
import '../StylesAlimentador/alimentador_login.css';
import { useNavigate } from 'react-router-dom';

// Iconos
import { FaUserCircle } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";

const AlimentadorLogin = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario,
          contrasena: contrasena,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify({
          usuario: usuario,
          area: data.area
        }));
        navigate("/alimentador_inicio");
      } else {
        // Mostrar mensaje de error
        setError(data.message);
      }
    } catch (error) {
      setError("Error en la conexión con el servidor");
    }
  };

  return (
    <div>
      <div className='flex w-screen'>
        {/* Lado izquierdo con logo */}
        <div className='w-[50%] h-screen bg-baseazul flex items-center justify-center'>
          <img src="./public/Logo.png" alt="Logo" />
        </div>

        {/* Lado derecho con formulario de sesión */}
        <div className='w-[50%] h-screen bg-basenaranja flex items-center justify-center'>
          <form className="form_main" onSubmit={handleSubmit}>
            <p className="heading">Acceso Alimentador</p>

            <div className="inputContainer">
              <FaUserCircle className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input
                type="text"
                className="inputField"
                id="username"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="inputContainer">
              <MdOutlinePassword className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input
                type="password"
                className="inputField"
                id="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <button id="button" type="submit">Acceder</button>

            <div className='error-container'>
              {error && <div className="error-message">{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlimentadorLogin;