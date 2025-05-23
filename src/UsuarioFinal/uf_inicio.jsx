import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../StylesUsuarioFinal/uf_inicio.css';

// Iconos
import { BiChevronDownCircle } from "react-icons/bi";
import { FaCreativeCommonsShare } from "react-icons/fa";
import { IoDocumentOutline } from "react-icons/io5";

// Iconos modal
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import { IoDownloadOutline } from "react-icons/io5";
import { IoSearchCircleOutline } from "react-icons/io5";
import { PiSmileySad } from "react-icons/pi";

// Datos de ejemplo para preguntas frecuentes
const preguntasFrecuentes = [
  { id: 1, pregunta: "Mensualidad de Licenciaturas", categoria: "Mensualidad" },
  { id: 2, pregunta: "PruebaPublico", categoria: "CategoriaPrueba" },
  { id: 3, pregunta: "Horarios del Gym", categoria: "Gimnasio" },
  { id: 4, pregunta: "Licenciaturas Disponibles", categoria: "Licenciaturas" },
  { id: 5, pregunta: "Horarios de Computo", categoria: "SaladeComputo" },
  { id: 6, pregunta: "Comida de la semana", categoria: "Comedor" },
  { id: 7, pregunta: "Examenen de Admision", categoria: "Admision" },
  { id: 8, pregunta: "Licenciatura en Terapia Fisica", categoria: "Licenciatura" },
  { id: 9, pregunta: "Entrega de Calificaciones", categoria: "Reuniones" },
  { id: 10, pregunta: "Como darme de baja", categoria: "ControlEscolar" },
];

const UFInicio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [filtroPublicacion, setFiltroPublicacion] = useState('');
  const [activeArea, setActiveArea] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(true);
  const [copiedLink, setCopiedLink] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos' o 'recientes'

  // Ref para el contenedor de scroll horizontal
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Estados para los modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAsistenciaModalOpen, setIsAsistenciaModalOpen] = useState(false);

  // Función para obtener categorías desde la API
  const fetchCategorias = async () => {
    try {
      setIsLoadingCategorias(true);
      const response = await fetch('http://localhost/UFD/src/BackEnd/obtener_categorias.php');
      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }
      const data = await response.json();

      if (data.success && Array.isArray(data.categorias)) {
        setCategorias(data.categorias);
      } else {
        console.error('Formato de respuesta incorrecto:', data);
      }
    } catch (error) {
      console.error('Error fetching categorías:', error);
    } finally {
      setIsLoadingCategorias(false);
    }
  };

  // Función para obtener publicaciones desde la API
  const fetchPublicaciones = async () => {
    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/obtener_publicaciones.php');
      if (!response.ok) {
        throw new Error('Error al obtener las publicaciones');
      }
      const data = await response.json();

      return data.publicaciones.map(pub => ({
        id: pub.id_publico,
        fecha: pub.fecha_publicacion,
        categoria: pub.categoria_publica,
        tema: pub.tema_publico,
        descripcion: pub.descripcion_publico,
        palabras_clave: pub.palabras_clave,
        archivos: pub.archivos,
        urls: pub.urls
      }));
    } catch (error) {
      console.error('Error fetching publicaciones:', error);
      return [];
    }
  };

  // Cargar publicaciones y categorías al montar el componente
  useEffect(() => {
    const loadData = async () => {
      const publicacionesData = await fetchPublicaciones();
      setPublicaciones(publicacionesData || []);
      setIsLoading(false);
      await fetchCategorias();
    };

    loadData();
  }, []);

  // Manejar parámetros de URL al cargar el componente
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoriaParam = searchParams.get('categoria');

    if (categoriaParam) {
      setActiveArea(categoriaParam);
      setFiltroPublicacion(categoriaParam);
      setIsModalOpen(true);
    }
  }, [location.search]);

  // Filtrar y ordenar publicaciones
  const resultadosFiltrados = React.useMemo(() => {
    if (filtroPublicacion.trim()) {
      return publicaciones.filter(publicacion => {
        const terminoBusqueda = filtroPublicacion.toLowerCase().trim();

        let palabrasClave = '';
        if (Array.isArray(publicacion.palabras_clave)) {
          palabrasClave = publicacion.palabras_clave.join(' ').toLowerCase();
        } else if (typeof publicacion.palabras_clave === 'string') {
          palabrasClave = publicacion.palabras_clave.toLowerCase();
        }

        return (
          publicacion.categoria.toLowerCase().includes(terminoBusqueda) ||
          publicacion.tema.toLowerCase().includes(terminoBusqueda) ||
          palabrasClave.includes(terminoBusqueda)
        );
      });
    } else if (filtroTipo === 'recientes') {
      // Ordenar por fecha y limitar a 5 resultados
      return [...publicaciones]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5); // <- Esto limita a 5 publicaciones
    }
    return [];
  }, [publicaciones, filtroPublicacion, filtroTipo]);

  // Función para copiar el enlace de la categoría
  const copiarEnlaceCategoria = (categoria) => {
    const url = `${window.location.origin}${window.location.pathname}?categoria=${encodeURIComponent(categoria)}`;

    navigator.clipboard.writeText(url)
      .then(() => {
        setCopiedLink(categoria);
        setTimeout(() => setCopiedLink(null), 2000);
      })
      .catch(err => {
        console.error('Error al copiar el enlace:', err);
        // Fallback para navegadores antiguos
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          setCopiedLink(categoria);
          setTimeout(() => setCopiedLink(null), 2000);
        } catch (e) {
          console.error('Fallback copy failed:', e);
        }
        document.body.removeChild(textarea);
      });
  };

  const handleInputChange = (e) => {
    setFiltroPublicacion(e.target.value);
  };

  const clearInput = () => {
    setFiltroPublicacion('');
    setFiltroTipo('todos');
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate(location.pathname); // Limpiar parámetros de URL al cerrar
  };

  const openAsistenciaModal = () => {
    setIsAsistenciaModalOpen(true);
  };

  const closeAsistenciaModal = () => {
    setIsAsistenciaModalOpen(false);
  };

  const handlePreguntaClick = (pregunta) => {
    setFiltroPublicacion(pregunta);
    closeAsistenciaModal();
  };

  const handleCategoriaClick = (categoria) => {
    if (!isDragging) {
      setActiveArea(categoria === activeArea ? null : categoria);
      setFiltroPublicacion(categoria && categoria !== activeArea ? categoria : '');
      setFiltroTipo('todos'); // Resetear filtro tipo al seleccionar categoría

      // Actualizar URL sin recargar la página
      if (categoria && categoria !== activeArea) {
        navigate(`?categoria=${encodeURIComponent(categoria)}`, { replace: true });
      } else {
        navigate(location.pathname, { replace: true });
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
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    e.preventDefault();
  };

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

  return (
    <div className='w-screen h-screen'>
      {/* Logo */}
      <div className='logo-uf w-[100%] h-[20%] flex items-center justify-center'>
        <img src="./public/Logo.png" alt="Logo" className='w-[13%] h-[100%]' />
      </div>

      {/* Titulo */}
      <div className='titulo-uf w-[100%] h-[10%] flex items-center justify-center'>
        <h1 className='text-3xl text-baseblanco'>Bienvenido, ¿Cómo puedo asistirte hoy?</h1>
      </div>

      {/* Buscador y filtro */}
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

      {/* Notificación de enlace copiado */}
      {copiedLink && (
        <div className="fixed top-4 right-4 bg-basenaranja text-baseblanco px-4 py-2 rounded-lg shadow-lg z-50">
          Enlace de "{copiedLink}" copiado al portapapeles
        </div>
      )}

      {/* Indicador de filtro recientes */}
      {filtroTipo === 'recientes' && !filtroPublicacion.trim() && (
        <div className="flex justify-center items-center h-12 text-baseazul font-medium">
          Mostrando las publicaciones más recientes
        </div>
      )}

      {/* Resultados */}
      <div className='flex items-center justify-center'>
        <div className='resultados-final w-[95%] h-[50%] mt-3'>
          {isLoading ? (
            <div className="flex justify-center items-center h-32 text-gray-500">
              Cargando publicaciones...
            </div>
          ) : resultadosFiltrados.length === 0 ? (
            filtroPublicacion.trim() || filtroTipo === 'recientes' ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-8xl mb-4">
                  <PiSmileySad className='text-baseblanco' />
                </div>
                <p className="text-xl font-bold text-baseblanco">
                  No se encontraron los resultados "{filtroPublicacion}".
                </p>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-32 text-center">
                <div className="text-8xl mb-4 pt-20">
                  <IoSearchCircleOutline  className='text-baseblanco' />
                </div>
                <p className="text-xl font-bold text-baseblanco">Utilice el filtro para obtener su búsqueda.</p>
              </div>
            )
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
                    <button className='icono-final' onClick={() => toggleExpand(publicacion.id)}>
                      <BiChevronDownCircle className='text-basenaranja' />
                    </button>
                  </div>

                  <div className='copiar-articulo w-[10%] flex items-center justify-center text-4xl'>
                    <button onClick={() => copiarEnlaceCategoria(publicacion.categoria)}>
                      <FaCreativeCommonsShare className='text-baseazul' title='Copiar Enlace' />
                    </button>
                  </div>
                </div>

                <div className={`transition-all duration-300 overflow-y-auto ${expandedId === publicacion.id ? "max-h-[300px]" : "max-h-0"}`}>
                  <div className="descripcion p-2 h-[120px]">
                    <p className='titulos-resultados text-xl'>Descripcion: <br /> <span className='textos-resultados'>{publicacion.descripcion}</span></p>
                  </div>

                  <div className="palabras-clave p-2 h-[100px]">
                    <p className='titulos-resultados text-xl'>Palabras Clave:</p>
                    <div className='flex flex-wrap gap-2'>
                      {(() => {
                        if (!publicacion.palabras_clave) {
                          return <span className='text-basenaranja'>Sin palabras clave</span>;
                        }

                        let keywords = [];

                        if (Array.isArray(publicacion.palabras_clave)) {
                          keywords = publicacion.palabras_clave.map(kw =>
                            typeof kw === 'string' ? kw.trim() : kw
                          );
                        } else if (typeof publicacion.palabras_clave === 'string' &&
                          publicacion.palabras_clave.trim().length > 0) {
                          keywords = publicacion.palabras_clave.split(',').map(kw => kw.trim());
                        }

                        if (keywords.length === 0) {
                          return <span className='text-basenaranja'>Sin palabras clave</span>;
                        }

                        return (
                          <div className='flex flex-wrap gap-2'>
                            {keywords.map((kw, index) => (
                              <span key={index} className='text-baseblanco text-sm bg-baseazul px-2 py-1 rounded-lg'>
                                {kw}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className='flex'>
                    <div className="documentos p-2 w-1/2 h-[80px]">
                      <p className='titulos-resultados text-xl'>Documentos:</p>
                      <div className='flex flex-col'>
                        {publicacion.archivos && publicacion.archivos.length > 0 ? (
                          (Array.isArray(publicacion.archivos) ?
                            publicacion.archivos.map((archivo, index) => {
                              const nombreArchivo = typeof archivo === 'object' ? archivo.name || archivo.filename : archivo;
                              const urlDescarga = typeof archivo === 'object' ?
                                archivo.url || `http://localhost/UFD/src/BackEnd/descargar_archivo.php?archivo=${nombreArchivo}` :
                                `http://localhost/UFD/src/BackEnd/descargar_archivo.php?archivo=${nombreArchivo}`;

                              return (
                                <div key={index} className='flex items-center justify-between border-b-4 mb-3 pl-2 border-basenaranja rounded-[20px]'>
                                  <div className='flex items-center'>
                                    <IoDocumentOutline className='text-baseazul mr-2' />
                                    <span className="truncate max-w-xs">{nombreArchivo}</span>
                                  </div>
                                  <a
                                    href={urlDescarga}
                                    download={nombreArchivo}
                                    className="text-basenaranja hover:text-baseazul ml-2 p-1"
                                    title="Descargar archivo"
                                  >
                                    <IoDownloadOutline className='text-xl' />
                                  </a>
                                </div>
                              );
                            })
                            : (() => {
                              try {
                                const parsedFiles = JSON.parse(publicacion.archivos);
                                return Array.isArray(parsedFiles) ?
                                  parsedFiles.map((archivo, index) => {
                                    const nombreArchivo = typeof archivo === 'object' ? archivo.name || archivo.filename : archivo;
                                    const urlDescarga = typeof archivo === 'object' ?
                                      archivo.url || `http://localhost/UFD/src/BackEnd/descargar_archivo.php?archivo=${nombreArchivo}` :
                                      `http://localhost/UFD/src/BackEnd/descargar_archivo.php?archivo=${nombreArchivo}`;

                                    return (
                                      <div key={index} className='flex items-center justify-between border-b-4 mb-3 pl-2 border-basenaranja rounded-[20px]'>
                                        <div className='flex items-center'>
                                          <IoDocumentOutline className='text-baseazul mr-2' />
                                          <span className="truncate max-w-xs">{nombreArchivo}</span>
                                        </div>
                                        <a
                                          href={urlDescarga}
                                          download={nombreArchivo}
                                          className="text-basenaranja hover:text-baseazul ml-2 p-1"
                                          title="Descargar archivo"
                                        >
                                          <IoDownloadOutline className='text-xl' />
                                        </a>
                                      </div>
                                    );
                                  })
                                  : <span className='text-basenaranja'>Formato de archivos inválido</span>;
                              } catch (e) {
                                const nombreArchivo = publicacion.archivos;
                                const urlDescarga = `http://localhost/UFD/src/BackEnd/descargar_archivo.php?archivo=${nombreArchivo}`;

                                return (
                                  <div className='flex items-center justify-between border-b-4 mb-3 pl-2 border-basenaranja rounded-[20px]'>
                                    <div className='flex items-center'>
                                      <IoDocumentOutline className='text-baseazul mr-2' />
                                      <span className="truncate max-w-xs">{nombreArchivo}</span>
                                    </div>
                                    <a
                                      href={urlDescarga}
                                      download={nombreArchivo}
                                      className="text-basenaranja hover:text-baseazul ml-2 p-1"
                                      title="Descargar archivo"
                                    >
                                      <IoDownloadOutline className='text-xl' />
                                    </a>
                                  </div>
                                );
                              }
                            })()
                          )) : (
                          <span className='text-basenaranja'>Sin documentos</span>
                        )}
                      </div>
                    </div>
                    <div className="urls p-2 w-1/2 h-[80px]">
                      <p className='titulos-resultados text-xl'>Links:</p>
                      <div className='flex flex-col'>
                        {Array.isArray(publicacion.urls) && publicacion.urls.length > 0 ? (
                          publicacion.urls.map((linkUrl, index) => (
                            <a key={index} href={linkUrl.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-600 truncate hover:underline hover:text-baseazul">
                              {linkUrl.trim()}
                            </a>
                          ))
                        ) : (
                          <span className='text-basenaranja'>Sin URLs</span>
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
        <div className='modal-overlay-final'>
          <div className='modal-content-final'>
            {/* Boton de x */}
            <div className='w-[100%] h-[15%] flex items-center justify-end'>
              <button className="BotonCerrar" onClick={closeModal}>
                <IoIosCloseCircleOutline className='text-2xl' />
              </button>
            </div>

            {/* Titulo */}
            <div className='titulo-filtro-final w-[100%] h-[15%] flex items-center justify-center text-3xl mt-2'>
              <h1>Filtrar Búsqueda</h1>
            </div>

            {/* Resumir */}
            <div className='resumir-filtro-final w-[100%] h-[20%] flex items-center justify-center mt-2'>
              <h1 className='pr-5 text-xl'>Filtrar:</h1>

              {/* Options */}
              <div id="firstFilter-final" className="filter-switch-final">
                <input
                  checked={filtroTipo === 'todos'}
                  id="option1-final"
                  name="options"
                  type="radio"
                  onChange={() => setFiltroTipo('todos')}
                />
                <label className="option-final" htmlFor="option1-final">Todos</label>

                <input
                  checked={filtroTipo === 'recientes'}
                  id="option2-final"
                  name="options"
                  type="radio"
                  onChange={() => {
                    setFiltroTipo('recientes');
                    closeModal();
                  }}
                />
                <label className="option-final" htmlFor="option2-final">Recientes</label>

                <span className="background-final" />
              </div>
            </div>

            {/* Categorías */}
            <div className='w-[100%] h-[40%] mt-2 flex flex-col p-2'>
              {/* Título de las categorías */}
              <div className='w-[100%] h-[20%] flex items-center justify-center'>
                <h1 className='uf-titulo-areas text-xl'>Categorias:</h1>
              </div>

              {/* Navegación de categorías con scroll horizontal */}
              <div className='w-[100%] h-[50%] mt-2 bg-coloralternotres rounded-3xl mb-5'>
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
                      onClick={() => handleCategoriaClick(null)}
                      className={`px-2 py-1 ${!activeArea ? 'bg-basenaranja rounded-xl text-baseblanco' : 'bg-white text-black border border-basenaranja'}`}
                      style={{ touchAction: 'none' }}
                    >
                      <span className="text-2xl flex items-center justify-center"><MdBlock /></span>
                    </button>

                    {/* Mostrar categorías dinámicas */}
                    {isLoadingCategorias ? (
                      <div className="px-2 py-1 text-gray-500">Cargando categorías...</div>
                    ) : categorias.length > 0 ? (
                      categorias.map((categoria) => (
                        <button
                          key={categoria.id}
                          onClick={() => handleCategoriaClick(categoria.categoria)}
                          className={`px-2 py-1 ${activeArea === categoria.categoria ? 'bg-basenaranja rounded-xl text-baseblanco' : 'bg-white text-black border border-basenaranja'}`}
                          style={{ touchAction: 'none' }}
                          title={categoria.descripcion || ''}
                        >
                          {categoria.categoria}
                          {categoria.publicaciones > 0 && (
                            <span className="ml-1 text-xs bg-baseazul text-white rounded-full px-1">
                              {categoria.publicaciones}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      // Usar areasData como respaldo si no se pudieron cargar categorías
                      Object.keys(areasData).map((area) => (
                        <button
                          key={area}
                          onClick={() => handleCategoriaClick(area)}
                          className={`px-2 py-1 ${activeArea === area ? 'bg-basenaranja rounded-xl text-baseblanco' : 'bg-white text-black border border-basenaranja'}`}
                          style={{ touchAction: 'none' }}
                        >
                          {area}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Asistencia Rápida */}
      {isAsistenciaModalOpen && (
        <div className='modal-overlay-final'>
          <div className='modal-content-finall'>
            {/* Botón de cerrar */}
            <div className='w-[100%] h-[8%] flex items-center justify-end'>
              <button className="BotonCerrar" onClick={closeAsistenciaModal}>
                <IoIosCloseCircleOutline className='text-2xl' />
              </button>
            </div>

            {/* Título */}
            <div className='titulo-filtro-final w-[100%] h-[15%] flex items-center justify-center text-3xl'>
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
  );
};

export default UFInicio;