import React, { useState } from 'react'
import '../StylesAdmin/admin_acceso.css'

{/* Iconos */}
import { FaHome } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";
import { FaUsers } from "react-icons/fa";
import { BiChevronDownCircle, BiSolidEditAlt } from "react-icons/bi"; // Added missing icon imports

// Simulación de datos de publicaciones con `id` único
const publicaciones = [
  { id: "pub1", fecha: "21/02/2025", categoria: "Colegiaturas", tema: "Mensualidad sobre los semestres para la preparatoria.", descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos quos, atque asperiores consequatur, sint architecto odio beatae dolores possimus enim, sapiente quaerat? Quae beatae veritatis exercitationem iste eligendi fuga velit!", palabrasClave: "hola", documentos: "", urls: "" },
  { id: "pub2", fecha: "22/02/2025", categoria: "Becas", tema: "Becas disponibles para el semestre siguiente.", descripcion: "", palabrasClave: "", documentos: "", urls: "" },
  { id: "pub3", fecha: "23/02/2025", categoria: "Cursos", tema: "Cursos extracurriculares para mejorar habilidades.", descripcion: "", palabrasClave: "", documentos: "", urls: "" },
];

const AdminAcceso = () => {
  const [expandedId, setExpandedId] = useState(null);

  // Funcion de la X en los filtros
  const [filtroDoc, setfiltroDoc] = useState('');
  const handleInputChange = (e) => {
    setfiltroDoc(e.target.value);
  };

  const clearInput = () => {
    setfiltroDoc('');
  };

  // Funciones para artículos
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Added missing openEditModal function
  const openEditModal = (publicacion) => {
    // Placeholder function - implement actual edit modal logic
    console.log('Editing publication:', publicacion);
  };

  return (
    <div>
      {/* Menú */}
      <div className="w-screen h-screen bg-baseazul flex">
        <div className='w-[6%] h-screen bg-baseazul flex items-center justify-center relative'> 
          <div className="action-wrap z-10 flex flex-col items-start absolute">
            <Link to={'/admin_inicio'} className="action" type="button">
              <FaHome className="action-icon" color="#353866" />
              <span className="action-content" data-content="Inicio" />
            </Link>
            
            <Link to={'/admin_areas'} className="action" type="button">
              <TfiWorld className="action-icon" color="#353866" />
              <span className="action-content" data-content="Áreas" />
            </Link>
            
            <Link to={'/admin_acceso'} className="action" type="button">
              <HiDocumentMagnifyingGlass className="action-icon" color="#353866" />
              <span className="action-content" data-content="Doc. Internos" />
            </Link>

            <Link to={'/admin_registros'} className="action" type="button">
              <FaUsers className="action-icon" color="#353866" />
              <span className="action-content" data-content="Registro de Accesos" />
            </Link>
            
            <Link to={'/'} className="action" type="button">
              <RiLogoutCircleLine className="action-icon" color="#353866" />
              <span className="action-content" data-content="Salir" />
            </Link>
            
            <div className="backdrop" />
          </div>
        </div>

        {/* Titulo */}
        <div className='w-[94%] h-screen'>
          <div className='w-[100%] h-[15%] flex'>
            <h1 id='titulo'>Últimos Accesos Registrados</h1>
          </div>

          {/* Buscador */}
          <div className='w-[100%] h-[10%] flex items-center justify-center'>
            <div className="search-panels-filtro">
              <div className="search-group">
                <input 
                  required 
                  type="text" 
                  name="text" 
                  autoComplete="on" 
                  className="input" 
                  value={filtroDoc} 
                  onChange={handleInputChange} 
                />
                <label className="enter-label">Filtrar Documentos</label>
                <div className="btn-box">
                  <button className="btn-search">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /><circle id="svg-circle" cx={208} cy={208} r={144} /></svg>
                  </button>
                </div>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={clearInput} >
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" id="cleare-line" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
      
          {/* Articulos privados */}
          <div className='resultados-articulos w-[98%] h-[70%] mt-3 overflow-y-auto'>
            {publicaciones.map((publicacion) => (
              <div key={publicacion.id} className={`articulos-privados p-1 flex flex-col transition-all duration-300 ${expandedId === publicacion.id ? "expanded" : ""}`}>
                {/* Contenedor principal */}
                <div className="flex h-[50px] items-center justify-center">
                  <div className='fecha-articulo w-[15%] flex items-center justify-center text-xl'>
                    <h1>{publicacion.fecha}</h1>
                  </div>

                  <div className='categoria-articulo w-[15%] flex items-center justify-center text-xl'>
                    <h1 className='bg-basenaranja p-2 rounded-[15px] text-baseblanco'>{publicacion.categoria}</h1>
                  </div>

                  <div className='tema-articulo w-[50%] flex items-center justify-center text-xl'>
                    <h1>{publicacion.tema}</h1>
                  </div>

                  <div className='expandir-contraer w-[10%] flex items-center justify-center text-4xl'>
                    <button className='icono-expandir-articulo' onClick={() => toggleExpand(publicacion.id)} >
                      <BiChevronDownCircle className='text-basenaranja' />
                    </button>
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 overflow-hidden ${expandedId === publicacion.id ? "max-h-[300px]" : "max-h-0"
                    }`}
                >
                  <div className="descripcion p-2 h-[120px]">
                    <p className='titulos-resultados text-xl'>Descripcion: <br /> <span className='textos-resultados'>{publicacion.descripcion}</span></p>
                  </div>
                  <div className="palabras-clave p-2 h-[100px]">
                    <p className='titulos-resultados text-xl'>Palabras Clave: <br /> <span className='text-baseblanco text-[15px] bg-baseazul p-2 rounded-[20px]'>{publicacion.palabrasClave}</span></p>
                  </div>

                  <div className='flex'>
                    <div className="documentos p-2 w-[50%] h-[80px]">
                      <p className='titulos-resultados text-xl'>Documentos: <br /> <span className='textos-resultados'> {publicacion.documentos}</span></p>
                    </div>
                    <div className="urls p-2 w-[50%] h-[80px]">
                      <p className='titulos-resultados text-xl'>Links: <br /> <span className='textos-resultados'>{publicacion.urls}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAcceso