import React, { useState, useRef, useEffect } from 'react'
import '../StylesAlimentador/alimentador_interno.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

{/* Iconos */ }
import { FaHome } from "react-icons/fa";
import { BiSolidCollection, BiChevronDownCircle } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

import { FaCreativeCommonsShare } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";

// Simulación de datos de publicaciones con `id` único
const publicaciones = [
    { id: "pub1", fecha: "21/02/2025", categoria: "Colegiaturas", tema: "Mensualidad sobre los semestres para la preparatoria.", descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos quos, atque asperiores consequatur, sint architecto odio beatae dolores possimus enim, sapiente quaerat? Quae beatae veritatis exercitationem iste eligendi fuga velit!", palabrasClave: "pago, mensualidad, costo", documentos: "", urls: "" },
    { id: "pub2", fecha: "15/02/2025", categoria: "Trámites", tema: "Proceso para solicitar constancia de estudios", descripcion: "Información sobre el proceso para solicitar constancias oficiales y los documentos necesarios.", palabrasClave: "constancia, documentos, trámite", documentos: "", urls: "" },
    { id: "pub3", fecha: "10/02/2025", categoria: "Becas", tema: "Convocatoria para becas académicas", descripcion: "Detalles sobre las becas disponibles para estudiantes de alto rendimiento.", palabrasClave: "beca, apoyo, financiamiento", documentos: "", urls: "" }
];

// Datos de ejemplo para preguntas frecuentes
const preguntasFrecuentes = [
    { id: 1, pregunta: "¿Cómo solicito una constancia de estudios?", categoria: "Trámites" },
    { id: 2, pregunta: "¿Cuándo es el último día para pagar la colegiatura?", categoria: "Colegiaturas" },
    { id: 3, pregunta: "¿Qué documentos necesito para inscribirme a la preparatoria?", categoria: "Trámites" },
    { id: 4, pregunta: "¿Cuáles son los requisitos para obtener una beca?", categoria: "Becas" },
    { id: 5, pregunta: "¿Cuál es el horario de la biblioteca?", categoria: "Biblioteca" },
    { id: 6, pregunta: "Convocatoria para becas académicas", categoria: "Becas" }
];

// Datos de ejemplo para las áreas y sus categorías
const areasData = {
    Gimnasio: ["Mensualidad", "Horarios", "Rutinas", "Coachs"],

    Biblioteca: ["Trámites", "Libros", "Prestamos", "Costos", "Secciones", "Clasificaciones", "Horarios", "Entregas"],

    Laboratorio: ["Horarios", "Encargados", "Reglamento"],

    SaladeComputo: ["Horarios", "Maestros", "Equipos", "Encargados", "Espacios"],

    Cafeteria: ["Reglamento", "Normas", "Políticas", "Horarios", "Comidas", "Bebidas"],

    ControlEscolar: ["Horarios", "Personal"],

    DireccionGeneral: ["Reglamento", "Normas", "Políticas"],

    Primaria: ["Reglamento", "Normas", "Horarios", "Maestros", "Salones", "Mensualidad", "Planeaciones", "Materias"],

    Tienda: ["Reglamento", "Normas", "Políticas"],

    SalaDeJuntas: ["Reglamento", "Normas", "Políticas"]
};

function AlimentadorInterno() {

    const [expandedId, setExpandedId] = useState(null);
    const [filtroPublicacion, setFiltroPublicacion] = useState('');
    const [activeArea, setActiveArea] = useState(null);

    // Ref para el contenedor de scroll horizontal
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Estados para los modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAsistenciaModalOpen, setIsAsistenciaModalOpen] = useState(false);

    // Filtrar publicaciones en tiempo real basado en el texto de búsqueda
    const resultadosFiltrados = filtroPublicacion.trim()
        ? publicaciones.filter(publicacion => {
            const terminoBusqueda = filtroPublicacion.toLowerCase().trim();
            return (
                publicacion.categoria.toLowerCase().includes(terminoBusqueda) ||
                publicacion.tema.toLowerCase().includes(terminoBusqueda) ||
                publicacion.palabrasClave.toLowerCase().includes(terminoBusqueda)
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

    // Funciones para el modal de asistencia rápida
    const openAsistenciaModal = () => {
        setIsAsistenciaModalOpen(true);
    };

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

            // Si se selecciona un área, filtrar por la primera categoría de esa área
            if (area && area !== activeArea) {
                setFiltroPublicacion(areasData[area][0]);
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

        const x = e.pageX - scrollContainerRef.current.offsetLeft;
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

        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
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

                {/* Preguntas frecuentes */}
                <div className='w-[100%] h-[10%] flex items-center justify-center'>
                    <button className='pf-uf' onClick={openAsistenciaModal}>
                        Asistencia Rápida
                    </button>
                </div>

                {/* Resultados */}
                <div className='flex items-center justify-center'>
                    <div className='resultados-final w-[95%] h-[50%] mt-3 overflow-y-auto'>
                        {filtroPublicacion.trim() === '' ? (
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

                                        <div className='copiar-articulo w-[10%] flex items-center justify-center text-4xl'>
                                            <button>
                                                <FaCreativeCommonsShare className='text-baseazul' title='Copiar Enlace' />
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
                                            <div className="documentos p-2 w-[40%] h-[80px]">
                                                <p className='titulos-resultados text-xl'>Documentos: <br /> <span className='textos-resultados'> {publicacion.documentos}</span></p>
                                            </div>
                                            <div className="urls p-2 w-[40%] h-[80px]">
                                                <p className='titulos-resultados text-xl'>Links: <br /> <span className='textos-resultados'>{publicacion.urls}</span></p>
                                            </div>

                                            <div className='calificar p-2 w-[20%]'>
                                                <p className='calificar-resultados text-xl text-baseazul'>Calificar:</p>
                                                <div className="like-button">
                                                    <input className="on" id={`heart-${publicacion.id}`} type="checkbox" />
                                                    <label className="like" htmlFor={`heart-${publicacion.id}`}>
                                                        <svg className="like-icon" fillRule="nonzero" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                                        </svg>
                                                        <span className="like-text">Likes</span>
                                                    </label>
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
                            <div className='w-[100%] h-[8%] flex items-center justify-end'>
                                <button className="BotonCerrar" onClick={closeModal}>
                                    <IoIosCloseCircleOutline className='text-2xl' />
                                </button>
                            </div>

                            {/* Titulo */}
                            <div className='titulo-filtro-uf w-[100%] h-[10%] flex items-center justify-center text-3xl'>
                                <h1>Filtrar Búsqueda</h1>
                            </div>

                            {/* Resumir */}
                            <div className='resumir-filtro-uf w-[100%] h-[15%] flex items-center justify-center'>
                                <h1 className='pr-5 text-xl'>Filtrar:</h1>

                                {/* Options */}
                                <div id="firstFilter" className="filter-switch-uf">
                                    <input defaultChecked id="option1-uf" name="options" type="radio" />
                                    <label className="option-uf" htmlFor="option1-uf">Todos</label>
                                    <input id="option2-uf" name="options" type="radio" />
                                    <label className="option-uf" htmlFor="option2-uf">Puntuados</label>
                                    <input id="option3-uf" name="options" type="radio" />
                                    <label className="option-uf" htmlFor="option3-uf">Recientes</label>
                                    <span className="background-uf" />
                                </div>
                            </div>

                            {/* Areas */}
                            <div className='w-[100%] h-[65%] flex flex-col p-2'>
                                {/* Título de las áreas */}
                                <div className='w-[100%] h-[15%] flex items-center justify-center'>
                                    <h1 className='uf-titulo-areas text-xl'>Áreas:</h1>
                                </div>

                                {/* Navegación de áreas con scroll horizontal */}
                                <div className='w-[100%] h-[17%] bg-coloralternotres rounded-3xl mb-5'>
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

                                            {/* Botones para cada área */}
                                            {Object.keys(areasData).map((area) => (
                                                <button
                                                    key={area}
                                                    onClick={() => handleAreaClick(area)}
                                                    className={`px-2 py-1 ${activeArea === area ? 'bg-basenaranja rounded-xl text-baseblanco' : 'bg-white text-black border border-basenaranja'}`}
                                                    style={{ touchAction: 'none' }}
                                                >
                                                    {area}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Mostrar categorías del área seleccionada */}
                                {activeArea && (
                                    <div className='w-full h-[65%] p-2 bg-white border-2 border-baseazul rounded-lg'>
                                        <h3 className='text-lg font-bold mb-2 text-baseazul'>Categorías:</h3>
                                        <div className='flex flex-wrap gap-2'>
                                            {areasData[activeArea].map((category, index) => (
                                                <div
                                                    key={index}
                                                    className='p-1 bg-basenaranja text-baseblanco rounded-lg cursor-pointer'
                                                    onClick={() => {
                                                        setFiltroPublicacion(category);
                                                        closeModal();
                                                    }}
                                                >
                                                    {category}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}

                {/* Modal de Asistencia Rápida */}
                {isAsistenciaModalOpen && (
                    <div className='modal-overlay-uf'>
                        <div className='modal-content-uf'>
                            {/* Botón de cerrar */}
                            <div className='w-[100%] h-[8%] flex items-center justify-end'>
                                <button className="BotonCerrar" onClick={closeAsistenciaModal}>
                                    <IoIosCloseCircleOutline className='text-2xl' />
                                </button>
                            </div>

                            {/* Título */}
                            <div className='titulo-filtro-uf w-[100%] h-[15%] flex items-center justify-center text-3xl'>
                                <h1>Asistencia Rápida</h1>
                            </div>

                            {/* Subtítulo */}
                            <div className='w-[100%] h-[10%] flex items-center justify-center'>
                                <h2 className='text-xl text-baseazul'>Preguntas más buscadas</h2>
                            </div>

                            {/* Lista de preguntas frecuentes */}
                            <div className='w-[90%] mx-auto h-[65%] overflow-y-auto'>
                                {preguntasFrecuentes.map((pregunta) => (
                                    <div
                                        key={pregunta.id}
                                        className='p-4 my-3 bg-white border-l-4 border-basenaranja rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-all'
                                        onClick={() => handlePreguntaClick(pregunta.pregunta)}
                                    >
                                        <div className='flex items-center justify-between'>
                                            <h3 className='text-lg font-medium'>{pregunta.pregunta}</h3>
                                            <span className='bg-baseazul text-baseblanco px-2 py-1 rounded-full text-sm'>{pregunta.categoria}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AlimentadorInterno