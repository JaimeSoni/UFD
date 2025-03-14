import React, { useState } from 'react';
import '../StylesAlimentador/alimentador_interno.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

{/* Iconos */}
import { FaHome } from "react-icons/fa";
import { BiSolidCollection, BiChevronDownCircle } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

// Simulación de datos de publicaciones con varias categorías y datos de ejemplo
const publicaciones = [
    { 
        id: "pub1", 
        fecha: "21/02/2025", 
        categoria: "Colegiaturas", 
        tema: "Mensualidad sobre los semestres para la preparatoria.", 
        descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos quos, atque asperiores consequatur, sint architecto odio beatae dolores possimus enim, sapiente quaerat? Quae beatae veritatis exercitationem iste eligendi fuga velit!", 
        palabrasClave: "colegiatura, mensualidad, pago, semestre", 
        documentos: "colegiatura_2025.pdf", 
        urls: "https://ejemplo.com/colegiatura" 
    },
    { 
        id: "pub2", 
        fecha: "15/02/2025", 
        categoria: "Becas", 
        tema: "Convocatoria de becas para el ciclo escolar 2025-2026", 
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia doloribus omnis dignissimos harum amet officiis enim at sint reprehenderit quidem vel nulla rerum accusamus consequatur optio, corrupti ullam quam alias.", 
        palabrasClave: "becas, ayuda financiera, convocatoria, solicitud", 
        documentos: "convocatoria_becas_2025.pdf", 
        urls: "https://ejemplo.com/becas" 
    }

];

function AlimentadorInterno() {

    const navigate = useNavigate();
    
      const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
        navigate('/login');
      };
    
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
    
    // Función para filtrar las publicaciones según el texto de búsqueda
    const filtrarPublicaciones = () => {
        if (!filtroDoc.trim()) {
            return publicaciones; // Si no hay texto de búsqueda, devolver todas las publicaciones
        }
        
        const terminoBusqueda = filtroDoc.toLowerCase();
        
        return publicaciones.filter(pub => 
            pub.categoria.toLowerCase().includes(terminoBusqueda) ||
            pub.tema.toLowerCase().includes(terminoBusqueda) ||
            pub.descripcion.toLowerCase().includes(terminoBusqueda) ||
            pub.palabrasClave.toLowerCase().includes(terminoBusqueda) ||
            pub.documentos.toLowerCase().includes(terminoBusqueda) ||
            pub.fecha.toLowerCase().includes(terminoBusqueda)
        );
    };
    
    // Obtener las publicaciones filtradas
    const publicacionesFiltradas = filtrarPublicaciones();
    
    return (
        <div className="w-screen h-screen bg-baseazul flex">

            <div className="w-[6%] h-screen bg-baseazul flex items-center justify-center relative">

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

                    <Link to={'/alimentador_publicaciones'} className="action" type="button">
                        <IoMdCloudUpload className="action-icon" color="#353866" />
                        <span className="action-content" data-content="Publicaciones" />
                    </Link>

                    <Link to={'/alimentador_categorias'} className="action" type="button">
                        <TbCategoryPlus className="action-icon" color="#353866" />
                        <span className="action-content" data-content="Categorias" />
                    </Link>

                    <Link to={'/alimentador_interno'} className="action" type="button">
                        <HiDocumentMagnifyingGlass className="action-icon" color="#353866" />
                        <span className="action-content" data-content="Doc. Internos" />
                    </Link>

                    <Link to={'/alimentador_login'} onClick={handleLogout} className="action" type="button">
                        <RiLogoutCircleLine className="action-icon" color="#353866" />
                        <span className="action-content" data-content="Salir" />
                    </Link>

                </div>

            </div>


            {/* Titulo */}
            <div className='w-[94%] h-screen'>
                <div className='w-[100%] h-[15%] flex'>
                    <h1 id='titulo'>Documentos Internos UFD</h1>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Articulos privados */}
                <div className='resultados-articulos w-[98%] h-[70%] mt-3 overflow-y-auto'>
                    {publicacionesFiltradas.length > 0 ? (
                        publicacionesFiltradas.map((publicacion) => (
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
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-xl font-bold text-baseblanco">No se escuentra la búsqueda. </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AlimentadorInterno