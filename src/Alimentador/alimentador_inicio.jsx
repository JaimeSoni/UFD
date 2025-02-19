import React from 'react'
import '../StylesAlimentador/alimentador_inicio.css'

import { Link } from 'react-router-dom';

{/* Iconos */}
import { FaHome } from "react-icons/fa";
import { BiSolidCollection } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";

const AlimentadorInicio = () => {
  return (
    <div>
        <div className="w-screen h-screen bg-baseazul flex items-center justify-center relative">
            <img src="./public/Logo.png" alt="" className="absolute inset-0 m-auto object-cover z-0" />

        {/* Menú izquierdo */}
        <div className="action-wrap bg-basenaranja z-10 flex flex-col items-start absolute left-3">


        <Link to={'/alimentador_inicio'} className="action" type="button">
          <FaHome className="action-icon" color="#353866" />
          <span className="action-content" data-content="Inicio" />
        </Link>

        <Link to={'/alimentador_recopilacion'} className="action" type="button">
          <BiSolidCollection className="action-icon" color="#353866" />
          <span className="action-content" data-content="Recopilacion" />
        </Link>

        <Link to={''} className="action" type="button">
          <IoMdCloudUpload className="action-icon" color="#353866" />
          <span className="action-content" data-content="Publicaciones" />
        </Link>

        <Link to={''} className="action" type="button">
          <TbCategoryPlus className="action-icon" color="#353866" />
          <span className="action-content" data-content="Categorias" />
        </Link>

        <Link to={'/alimentador_login'} className="action" type="button">
          <RiLogoutCircleLine className="action-icon" color="#353866" />
          <span className="action-content" data-content="Salir" />
        </Link>

      </div>
      
        </div>  
    </div>
  )
}

export default AlimentadorInicio