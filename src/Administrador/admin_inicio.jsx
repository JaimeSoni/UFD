import React from 'react'
import '../StylesAdmin/admin_inicio.css'

{/* Iconos */}
import { FaHome } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";
import { FaUsers } from "react-icons/fa";

const AdminInicio = () => {

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    navigate('/'); // Ahora redirige a la ruta raíz que contiene login_ufd
  };

  return (
    <div>
        <div className="w-screen h-screen bg-baseazul flex items-center justify-center relative">
            <img src="./public/Logo.png" alt="" className="absolute inset-0 m-auto object-cover z-0" />

        {/* Menú izquierdo */}
        <div className="action-wrap bg-basenaranja z-10 flex flex-col items-start absolute left-3">


        <Link to={'/admin_inicio'} className="action" type="button">
          <FaHome className="action-icon" color="#353866" />
          <span className="action-content" data-content="Inicio" />
        </Link>

        <Link to={'/admin_areas'} className="action" type="button">
          <TfiWorld className="action-icon" color="#353866" />
          <span className="action-content" data-content="Áreas" />
        </Link>

        <Link to={'/admin_registros'} className="action" type="button">
          <FaUsers className="action-icon" color="#353866" />
          <span className="action-content" data-content="Registro de Accesos" />
        </Link>

        <Link to={'/'} onClick={handleLogout} className="action" type="button">
          <RiLogoutCircleLine className="action-icon" color="#353866" />
          <span className="action-content" data-content="Salir" />
        </Link>

      </div>
      
        </div>  
    </div>
  )
}

export default AdminInicio