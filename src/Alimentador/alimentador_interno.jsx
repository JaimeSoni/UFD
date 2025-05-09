import React, { useState, useRef, useEffect } from 'react'
import '../StylesAlimentador/alimentador_interno.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

{/* Iconos */ }
import { FaHome } from "react-icons/fa";
import { BiSolidCollection, BiChevronDownCircle } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

import { MdBlock } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoDocumentOutline } from "react-icons/io5";

function AlimentadorInterno() {
    const [publicaciones, setPublicaciones] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [filtroPublicacion, setFiltroPublicacion] = useState('');
    const [activeArea, setActiveArea] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Nuevo estado para almacenar las categorías obtenidas de la API
    const [categorias, setCategorias] = useState([]);

    // Ref para el contenedor de scroll horizontal
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Estados para los modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAsistenciaModalOpen, setIsAsistenciaModalOpen] = useState(false);

    // Fetch categorías desde la base de datos
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost/UFD/src/BackEnd/obtener_categorias.php');

                if (response.data.success) {
                    setCategorias(response.data.categorias);
                } else {
                    console.error("Error al obtener categorías:", response.data.message);
                }
            } catch (err) {
                console.error("Error al obtener categorías:", err);
            }
        };

        fetchCategorias();
    }, []);

    // Fetch publicaciones desde la base de datos
    useEffect(() => {
        const fetchPublicaciones = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost/UFD/src/BackEnd/obtener_publicaciones_privadas.php');

                // Verificar si la respuesta tiene la estructura esperada
                const publicacionesArray = response.data.publicaciones || [];

                // Ahora mapea sobre el array de publicaciones
                const data = publicacionesArray.map(articulo => ({
                    id: articulo.id_privado.toString(),
                    fecha: articulo.fecha_publicacion, // Usar directamente la fecha sin formatear
                    categoria: articulo.categoria_privada,
                    tema: articulo.tema_privado,
                    descripcion: articulo.descripcion_privada,
                    palabrasClave: Array.isArray(articulo.palabras_clave) ?
                        articulo.palabras_clave.join(', ') :
                        articulo.palabras_clave || '',
                    documentos: Array.isArray(articulo.archivos) ?
                        articulo.archivos.join(', ') :
                        articulo.archivos || '',
                    urls: Array.isArray(articulo.urls) ?
                        articulo.urls.join(', ') :
                        articulo.urls || ''
                }));

                setPublicaciones(data);
            } catch (err) {
                console.error("Error al obtener publicaciones privadas:", err);
                setError("Error al cargar las publicaciones. Por favor, intente de nuevo más tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicaciones();
    }, []);

    // Filtrar publicaciones en tiempo real basado en el texto de búsqueda
    const resultadosFiltrados = filtroPublicacion.trim()
        ? publicaciones.filter(publicacion => {
            const terminoBusqueda = filtroPublicacion.toLowerCase().trim();
            return (
                publicacion.categoria.toLowerCase().includes(terminoBusqueda) ||
                publicacion.tema.toLowerCase().includes(terminoBusqueda) ||
                (publicacion.palabrasClave && publicacion.palabrasClave.toLowerCase().includes(terminoBusqueda))
            );
        })
        : [];

    // Manejar cambios en el input
    const handleInputChange = (e) => {
        setFiltroPublicacion(e.target.value);
    };

    // Limpiar el input
    const clearInput = () => {
        setFiltroPublicacion('');
    };

    // Toggle para expandir/contraer
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Funciones para el modal de filtro
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Función para cerrar el modal de asistencia
    const closeAsistenciaModal = () => {
        setIsAsistenciaModalOpen(false);
    };

    // Función para seleccionar una pregunta frecuente
    const handlePreguntaClick = (pregunta) => {
        setFiltroPublicacion(pregunta);
        closeAsistenciaModal();
    };

    // Función para manejar clicks en los botones de área
    const handleAreaClick = (area) => {
        if (!isDragging) {
            setActiveArea(area === activeArea ? null : area);

            // Si se selecciona un área, establecer el filtro al nombre de la categoría
            if (area && area !== activeArea) {
                setFiltroPublicacion(area.categoria);
                closeModal(); // Cerrar el modal después de seleccionar
            }
        }
    };

    // Eventos para drag-to-scroll
    const handleMouseDown = (e) => {
        if (!scrollContainerRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
        scrollContainerRef.current.style.userSelect = 'none';
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
            scrollContainerRef.current.style.removeProperty('user-select');
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;

        const x = (e.pageX - scrollContainerRef.current.offsetLeft);
        const walk = (x - startX) * 2; // Multiplicador para ajustar la velocidad
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;

        // Prevenir eventos de clic durante el arrastre
        e.preventDefault();
    };

    // Funciones para manejo táctil (móviles/tablets)
    const handleTouchStart = (e) => {
        if (!scrollContainerRef.current) return;

        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;

        const x = (e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Limpiar eventos cuando el componente se desmonta
    useEffect(() => {
        const cleanup = () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
        };

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchend', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove);

        return cleanup;
    }, [isDragging, startX, scrollLeft]);

    //Nagevador para salir
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/alimentador_login');
    };

    return (
        <div className="w-screen h-screen bg-baseazul flex">
            <div className="w-[6%] h-screen bg-baseazul flex items-center justify-center relative">

                {/* Menú izquierdo */}
                <div className="action-wrap bg-basenaranja z-10 flex flex-col items-start absolute left-3">

                    <Link to={'/alimentador_inicio'} className="action" type="button">
                        <FaHome className="action-icon" color="#353866" />
                        <span className="action-content" data-content="Inicio" />
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

                    <Link to={'/'} onClick={handleLogout} className="action" type="button">
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

                <div className='filtros-uf w-[100%] h-[10%] flex items-center justify-center'>

                    {/* Filtro de búsqueda */}
                    <div className='buscador flex items-center justify-center'>
                        <div className="search-panels-filtro">
                            <div className="search-group">
                                <input
                                    required
                                    type="text"
                                    name="text"
                                    autoComplete="on"
                                    className="input"
                                    value={filtroPublicacion}
                                    onChange={handleInputChange}
                                />
                                <label className="enter-label">Realizar Busqueda . . .</label>
                                <div className="btn-box-x">
                                    <button className="btn-cleare" onClick={clearInput}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Boton de filtro */}
                    <div>
                        <button className="filter-uf" onClick={openModal}>
                            <svg viewBox="0 0 512 512" height="1em">
                                <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Resultados */}
                <div className='flex items-center justify-center'>
                    <div className='resultados-final w-[95%] h-[50%] mt-3 overflow-y-auto'>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32 text-coloralternodos">
                                Cargando publicaciones...
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-32 text-red-500">
                                {error}
                            </div>
                        ) : filtroPublicacion.trim() === '' ? (
                            <div className="flex justify-center items-center h-32 text-gray-500">
                            </div>
                        ) : resultadosFiltrados.length === 0 ? (
                            <div className="flex justify-center items-center h-32 text-coloralternodos">
                                No se encontraron resultados para "{filtroPublicacion}"
                            </div>
                        ) : (
                            resultadosFiltrados.map((publicacion) => (
                                <div key={publicacion.id} className={`articulos-finales p-1 flex flex-col transition-all duration-300 ${expandedId === publicacion.id ? "expanded" : ""}`}>

                                    {/* Contenedor principal */}
                                    <div className="flex h-[50px] items-center justify-center">
                                        <div className='fecha-final w-[15%] flex items-center justify-center text-xl'>
                                            <h1>{publicacion.fecha}</h1>
                                        </div>

                                        <div className='categoria-final w-[15%] flex items-center justify-center text-xl'>
                                            <h1 className='bg-basenaranja p-2 rounded-[15px] text-baseblanco'>{publicacion.categoria}</h1>
                                        </div>

                                        <div className='tema-final w-[50%] flex items-center justify-center text-xl'>
                                            <h1>{publicacion.tema}</h1>
                                        </div>

                                        <div className='expandir-contraer w-[10%] flex items-center justify-center text-4xl'>
                                            <button className='icono-final' onClick={() => toggleExpand(publicacion.id)} >
                                                <BiChevronDownCircle className='text-basenaranja' />
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className={`transition-all duration-300 overflow-hidden overflow-y-auto ${expandedId === publicacion.id ? "max-h-[300px]" : "max-h-0"
                                            }`}
                                    >
                                        <div className="descripcion p-2 h-[120px]">
                                            <p className='titulos-resultados text-xl'>Descripcion: <br /> <span className='textos-resultados'>{publicacion.descripcion || "No hay descripción disponible"}</span></p>
                                        </div>
                                        <div className="palabras-clave p-2 h-[100px]">
                                            <p className='titulos-resultados text-xl'>Palabras Clave:</p>
                                            <div className='flex flex-wrap gap-2'>
                                                {publicacion.palabrasClave ? (
                                                    publicacion.palabrasClave.split(',').map((kw, index) => (
                                                        <span key={index} className='text-baseblanco text-sm bg-baseazul px-2 py-1 rounded-lg'>
                                                            {kw.trim()}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className='text-basenaranja'>Sin palabras clave</span>
                                                )}
                                            </div>
                                        </div>


                                        <div className='flex'>
                                            <div className="documentos p-2 w-1/2 h-[80px]">
                                                <p className='titulos-resultados text-xl'>Documentos:</p>
                                                <div className='flex flex-col'>
                                                    {publicacion.documentos ? (
                                                        publicacion.documentos.split(',').map((doc, index) => (
                                                            <span key={index} className='flex items-center border-b-4 mb-3 pl-2 border-basenaranja rounded-[20px]'>
                                                                <IoDocumentOutline className='text-baseazul mr-2' />
                                                                {doc.trim()}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className='text-basenaranja'>Sin documentos</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="urls p-2 w-1/2 h-[80px]">
                                                <p className='titulos-resultados text-xl'>Links:</p>
                                                <div className='flex flex-col'>
                                                    {publicacion.urls ? (
                                                        publicacion.urls.split(/\s+/).map((linkUrl, index) => (
                                                            <a key={index} href={linkUrl.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline hover:text-baseazul">
                                                                {linkUrl.trim()}
                                                            </a>
                                                        ))
                                                    ) : (
                                                        <span className='text-basenaranja'>No hay links</span>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Modal del Filtro */}
                {isModalOpen && (
                    <div className='modal-overlay-uf'>
                        <div className='modal-content-uf'>
                            {/* Boton de x */}
                            <div className='w-[100%] h-[20%] flex items-center justify-end'>
                                <button className="BotonCerrar" onClick={closeModal}>
                                    <IoIosCloseCircleOutline className='text-2xl' />
                                </button>
                            </div>

                            {/* Titulo */}
                            <div className='titulo-filtro-uf w-[100%] h-[15%] flex items-center justify-center text-3xl mt-2'>
                                <h1>Filtrar Búsqueda</h1>
                            </div>

                            {/* Areas */}
                            <div className='w-[100%] h-[50%] flex flex-col p-2 mt-4'>
                                {/* Título de las áreas */}
                                <div className='w-[100%] h-[20%] flex items-center justify-center'>
                                    <h1 className='uf-titulo-areas text-xl'>Categorias:</h1>
                                </div>

                                {/* Navegación de áreas con scroll horizontal */}
                                <div className='w-[100%] h-[70%] bg-coloralternotres rounded-3xl mb-5 mt-3'>
                                    <div
                                        ref={scrollContainerRef}
                                        className='flex overflow-x-auto py-2 no-scrollbar'
                                        style={{
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none',
                                            WebkitOverflowScrolling: 'touch',
                                            cursor: 'grab'
                                        }}
                                        onMouseDown={handleMouseDown}
                                        onTouchStart={handleTouchStart}
                                    >
                                        <div className='flex space-x-3 min-w-max px-2'>
                                            {/* Botón por defecto/ninguno */}
                                            <button
                                                onClick={() => handleAreaClick(null)}
                                                className={`px-2 py-1 ${!activeArea ? 'bg-basenaranja rounded-xl text-baseblanco' : 'bg-white text-black border border-basenaranja'}`}
                                                style={{ touchAction: 'none' }}
                                            >
                                                <span className="text-2xl flex items-center justify-center"><MdBlock /></span>
                                            </button>

                                            {/* Botones para cada área (ahora usando datos de la API) */}
                                            {categorias.map((area) => (
                                                <button
                                                    key={area.id}
                                                    onClick={() => handleAreaClick(area)}
                                                    className={`px-2 py-1 ${activeArea && activeArea.id === area.id ? 'bg-basenaranja rounded-xl text-baseblanco' : 'bg-white text-black border border-basenaranja'}`}
                                                    style={{ touchAction: 'none' }}
                                                >
                                                    {area.categoria}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AlimentadorInterno