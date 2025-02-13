import React from 'react';
import './Styles/login.css';
import { useNavigate } from 'react-router-dom';

// Iconos
import { FaUserCircle } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Previene el envío del formulario
    // Aquí puedes agregar la lógica de autenticación
    navigate("/admin_inicio");
  };

  return (
    <div>
      <div className='flex w-screen'>
        {/* Lado izquierdo con logo */}
        <div className='w-[50%] h-screen bg-baseazul flex items-center justify-center'>
          <img src="./public/Logo.png" alt="Logo" />
        </div>

        {/* Lado derecho con formulario de sesion */}
        <div className='w-[50%] h-screen bg-basenaranja flex items-center justify-center'>
          <form className="form_main" onSubmit={handleSubmit}>
            <p className="heading">Acceso Administrador</p>
            <div className="inputContainer">
              <FaUserCircle className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input type="text" className="inputField" id="username" placeholder="Usuario" />
            </div>
            <div className="inputContainer">
              <MdOutlinePassword className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input type="password" className="inputField" id="password" placeholder="Contraseña" />
            </div>
            <button id="button" type="submit">Acceder</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
