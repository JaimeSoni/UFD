import React, { useState, useEffect, useRef } from 'react';
import '../StylesAlimentador/alimentador_publicaciones.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Iconos Menu
import { FaHome } from "react-icons/fa";
import { BiSolidCollection } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

// Iconos de los articulos
import { BiChevronDownCircle } from "react-icons/bi";
import { BiSolidEditAlt } from "react-icons/bi";

//Icono de la busqueda no encontrada
import { PiSmileySad } from "react-icons/pi";

// Iconos del Modal
import { CgAdd } from "react-icons/cg";
import { GrDocumentUpdate } from "react-icons/gr";

//Alerta 
import Swal from 'sweetalert2';

const toggleDropdown = () => {
  const dropdown = document.querySelector('.dropdown-content');
  dropdown.classList.toggle('show');
};

const toggleDropdownVisibility = () => {
  setIsDropdownVisible(!isDropdownVisible);
};

const toggleExpand = (id_publico) => {
  setExpandedId(expandedId === id_publico ? null : id); 
};

const AlimentadorPublicaciones = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const [expandedId, setExpandedId] = useState(null);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);
  const [isPrivateModalOpen, setIsPrivateModalOpen] = useState(false);
  const [filtroPublicacion, setfiltroPublicacion] = useState('');
  const [currentPublication, setCurrentPublication] = useState(null);
  const [tipoBusqueda, setTipoBusqueda] = useState('publico'); // 'publico' o 'privado'

  // Estados para el Modal
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10), // Establecer la fecha automáticamente
    category: '',
    topic: '',
    description: '',
    keywords: [],
    files: [],
    urls: [],
    targetAudience: '' // Campo específico para artículos privados
  });

  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Mandar a llamar las categorias
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para las publicaciones
  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionesPrivadas, setPublicacionesPrivadas] = useState([]);

  // Función para cargar las categorías desde el servidor
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost/UFD/src/BackEnd/obtener_categorias.php');

      if (!response.ok) {
        throw new Error('No se pudieron cargar las categorías');
      }

      const data = await response.json();

      if (data.success) {
        const categoriasNombres = data.categorias.map(cat => cat.categoria);
        setCategories(categoriasNombres);
      } else {
        throw new Error(data.message || 'Error al cargar las categorías');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar categorías:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar las publicaciones públicas desde el servidor
  const fetchPublicaciones = async () => {
    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/obtener_publicaciones.php');
      if (!response.ok) {
        throw new Error('No se pudieron cargar las publicaciones');
      }
      const data = await response.json();
      if (data.success) {
        const publicacionesConIdentificador = data.publicaciones.map(pub => ({
          ...pub,
          id_publico:
            pub.id_publico, // Asegúrate de que tu API devuelva un id único
        }));
        setPublicaciones(publicacionesConIdentificador);
      } else {
        throw new Error(data.message || 'Error al cargar las publicaciones');
      }
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
    }
  };

  // Función para cargar las publicaciones privadas desde el servidor
  const fetchPublicacionesPrivadas = async () => {
    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/obtener_publicaciones_privadas.php');
      if (!response.ok) {
        throw new Error('No se pudieron cargar las publicaciones privadas');
      }
      const data = await response.json();
      if (data.success) {
        const publicacionesPrivadasConIdentificador = data.publicaciones.map(pub => ({
          ...pub,
          id_privado: pub.id_privado, // Asegúrate de que tu API devuelva un id único
        }));
        setPublicacionesPrivadas(publicacionesPrivadasConIdentificador);
      } else {
        throw new Error(data.message || 'Error al cargar las publicaciones privadas');
      }
    } catch (err) {
      console.error('Error al cargar publicaciones privadas:', err);
    }
  };

  // Llamar a las funciones cuando el componente se monta
  useEffect(() => {
    fetchPublicaciones();
    fetchPublicacionesPrivadas(); // Cargar publicaciones privadas
    fetchCategories(); // Asegúrate de que las categorías también se carguen
  }, []);

  // Filtrar publicaciones en tiempo real basado en el texto de búsqueda
  const filtroResultados = filtroPublicacion.trim()
    ? (tipoBusqueda === 'publico' ? publicaciones : publicacionesPrivadas).filter(publicacion => {
      const terminoBusqueda = filtroPublicacion.toLowerCase().trim();
      return (
        (publicacion.categoria_publica?.toLowerCase() || '').includes(terminoBusqueda) ||
        (publicacion.tema_publico?.toLowerCase() || '').includes(terminoBusqueda) ||
        (publicacion.palabrasClave?.toLowerCase() || '').includes(terminoBusqueda) ||
        (publicacion.categoria_privada?.toLowerCase() || '').includes(terminoBusqueda) || // Campo para publicaciones privadas
        (publicacion.tema_privado?.toLowerCase() || '').includes(terminoBusqueda) // Campo para publicaciones privadas
      );
    })
    : (tipoBusqueda === 'publico' ? publicaciones : publicacionesPrivadas); // Mostrar todas las publicaciones según el tipo seleccionado

  const handleInputChange = (e) => {
    setfiltroPublicacion(e.target.value);
  };

  const clearInput = () => {
    setfiltroPublicacion('');
  };

  // Función para cambiar el tipo de búsqueda
  const handleTipoBusquedaChange = (tipo) => {
    setTipoBusqueda(tipo);
    setfiltroPublicacion(''); // Limpiar el filtro al cambiar el tipo de búsqueda
  };

  return (
    <div>
      <div className='w-screen h-screen bg-baseazul flex'>
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
              <span className="action-content" data-content="" />             <HiDocumentMagnifyingGlass className="action-icon" color="#353866" />
              <span className="action-content" data-content="Doc. Internos" />
            </Link>

            <Link to={'/alimentador_login'} onClick={handleLogout} className="action" type="button">
              <RiLogoutCircleLine className="action-icon" color="#353866" />
              <span className="action-content" data-content="Salir" />
            </Link>
          </div>
        </div>

        <div className='w-[94%] h-screen'>
          {/* Titulo */}
          <div className='titulo w-[100%] h-[15%] flex items-center justify-center'>
            <h1 className='titulo-publicaciones'>Registro de Publicaciones</h1>
            <button className='button-publicaciones' onClick={toggleDropdownVisibility}>
              Nueva Publicación
              <span />
            </button>
          </div>

          {/* Filtro de búsqueda */}
          <div className='buscador w-[100%] h-[10%] flex items-center justify-center'>
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
                <label className="enter-label">Filtrar Publicaciones</label>
                <div className="btn-box">
                  <button className="btn-search">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                  </button>
                </div>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={clearInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Selector de tipo de búsqueda */}
              <div className="tipo-busqueda">
                <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Búsqueda</label>
                <select
                  value={tipoBusqueda}
                  onChange={(e) => handleTipoBusquedaChange(e.target.value)}
                  className="select-busqueda"
                >
                  <option value="publico">Públicos</option>
                  <option value="privado">Privados</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articulos */}
          <div className='resultados w-full h-[70%] mt-3 overflow-y-auto'>
            {filtroPublicacion.trim() === '' ? (
              <div className="flex justify-center items-center h-32 text-gray-500">
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-8xl mb-4 pt-60">
                    <TbCategoryPlus className='text-baseblanco' />
                  </div>
                  <p className="text-xl font-bold text-baseblanco">Utilice el filtro para obtener su búsqueda.</p>
                </div>
              </div>
            ) : filtroResultados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-8xl mb-4">
                  <PiSmileySad className='text-baseblanco' />
                </div>
                <p className="text-xl font-bold text-baseblanco">
                  No se encontraron los resultados "{filtroPublicacion}".
                </p>
              </div>
            ) : (
              filtroResultados.map((publicacion) => (
                <div key={publicacion.id_publico || publicacion.id_privado} className={`articulos-finales p-1 flex flex-col transition-all duration-300 ${expandedId === (publicacion.id_publico || publicacion.id_privado) ? "expanded" : ""}`}>
                  {/* Contenedor principal */}
                  <div className="flex h-[50px] items-center justify-center">
                    <div className='fecha-articulo w-[15%] flex items-center justify-center text-xl'>
                      <h1>{publicacion.fecha_publicacion || publicacion.fecha_privada}</h1>
                    </div>

                    <div className='categoria-articulo w-[15%] flex items-center justify-center text-xl'>
                      <h1 className='bg-basenaranja p-2 rounded-lg text-baseblanco'>{publicacion.categoria_publica || publicacion.categoria_privada}</h1>
                    </div>

                    <div className='tema-articulo w-[50%] flex items-center justify-center text-xl'>
                      <h1>{publicacion.tema_publico || publicacion.tema_privado} ({tipoBusqueda})</h1> {/* Mostrar el tipo de publicación */}
                    </div>

                    <div className='expandir-contraer w-[10%] flex items-center justify-center text-4xl'>
                      <button className='icono-expandir-articulo' onClick={() => toggleExpand(publicacion.id_publico || publicacion.id_privado)}>
                        <BiChevronDownCircle className='text-basenaranja' />
                      </button>
                    </div>

                    <div className='editar-articulo w-[10%] flex items-center justify-center text-4xl'>
                      <button onClick={() => openEditModal(publicacion)}>
                        <BiSolidEditAlt className='text-baseazul' />
                      </button>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${expandedId === (publicacion.id_publico || publicacion.id_privado) ? "max-h-[300px]" : "max-h-0"}`}
                  >
                    <div className="descripcion p-2 h-[120px]">
                      <p className='titulos-resultados text-xl'>Descripción: <br /> <span className='textos-resultados'>{publicacion.descripcion || 'Sin descripción'}</span></p>
                    </div>
                    <div className="palabras-clave p-2 h-[100px]">
                      <p className='titulos-resultados text-xl'>Palabras Clave: <br /> <span className='text-baseblanco text-[15px] bg-baseazul p-2 rounded-lg'>{publicacion.palabrasClave || 'Sin palabras clave'}</span></p>
                    </div>

                    <div className='flex'>
                      <div className="documentos p-2 w-1/2 h-[80px]">
                        <p className='titulos-resultados text-xl'>Documentos: <br /> <span className='textos-resultados'>{publicacion.documentos || 'Sin documentos'}</span></p>
                      </div>
                      <div className="urls p-2 w-1/2 h-[80px]">
                        <p className='titulos-resultados text-xl'>Links: <br /> <span className='textos-resultados'>{publicacion.urls || 'Sin URLs'}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Artículo Público */}
      {isPublicModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-publicaciones rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col overflow-hidden">
            <div className="px-4 py-3 flex justify-center items-center">
              <h2 className="text-3xl text-baseazul font-semibold text-gray-800">
                Nuevo Artículo Público
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <form className="space-y-4">
                <div className='flex gap-3'>

                  {/* Fecha */}
                  <div className='w-[20%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Fecha publicada</label>
                    <input
                      type="text"
                      value={formData.date}
                      readOnly
                      className="input-fecha"
                    />
                  </div>

                  {/* Tema */}
                  <div className="w-[50%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Tema</label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="Escribe el tema"
                      className="input-tema"
                    />
                  </div>

                  {/* Categoria */}
                  <div className="w-[30%]">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                    <div className="relative">
                      <div className="main" onClick={toggleDropdown}>
                        {selectedCategory || 'Selecciona la categoría'}
                        <input type="checkbox" className="inp" checked={isDropdownOpen} onChange={toggleDropdown} />
                        <div className="bar">
                          <span className="top bar-list"></span>
                          <span className="middle bar-list"></span>
                          <span className="bottom bar-list"></span>
                        </div>

                        {isDropdownOpen && (
                          <div className="menu-container">
                            <div className="menu-scroll">
                              {categories.map((categoria, index) => (
                                <div
                                  key={index}
                                  className="menu-list"
                                  onClick={() => selectCategory(categoria)}
                                >
                                  {categoria}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className='flex gap-3'>
                  <div className='w-[100%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe el contenido..."
                      className="input-descripcion w-full h-16 flex items-start justify-start px-2 py-1 text-sm rounded resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">

                  {/* Palabras claves */}
                  <div className='w-[50%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Palabras clave</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Añadir palabra clave"
                        className="input-palabra"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        <CgAdd className='text-xl' />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.keywords.map((kw, index) => (
                        <span key={index} className="bg-baseazul inline-flex items-center text-xs px-3 py-1 bg-gray-100 rounded-[20px] text-baseblanco">
                          {kw}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(index)}
                            className="ml-1 text-coloralternodos hover:text-baseblanco font-bold text-[15px]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* URL */}
                  <div className="w-[50%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">URLs</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Ingresa una URL"
                        className="input-url"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                      />
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        <CgAdd className='text-xl' />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {formData.urls.map((linkUrl, index) => (
                        <div key={index} className="flex items-center justify-between py-1 px-3 bg-gray-50 rounded text-sm">
                          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 truncate hover:underline">
                            {linkUrl}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveUrl(index)}
                            className="text-baseazul hover:text-basenaranja font-bold text-[15px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Documentos */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-[37%]">
                    <div className="container">
                      <div className="folder">
                        <div className="front-side">
                          <div className="tip" />
                          <div className="cover" />
                        </div>
                        <div className="back-side cover" />
                      </div>
                      <label className="custom-file-upload">
                        <input
                          className="title"
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          disabled={formData.files.length >= 2}
                        />
                        Seleccionar Archivos
                      </label>
                    </div>
                    <div className='documento'>
                      <p>PDF/WORD/EXCEL</p>
                      <p>Menos de 5MB y solo 2 Archivos</p>
                    </div>
                  </div>
                  <div className="files-container pl-4">
                    {formData.files.map((file, index) => (
                      <div key={index} className="file-item">
                        <GrDocumentUpdate className="file-icon text-xl" />
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="file-remove"
                          aria-label="Eliminar archivo"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Botones */}
            <div className="px-4 py-3 flex justify-end gap-2">
              <button className='cancelar' onClick={closePublicModal}>
                Cancelar
              </button>
              <button className='guardar' onClick={() => handleSubmit(true)}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Artículo Privado */}
      {isPrivateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center         justify-center z-50">
          <div className="modal-privados rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col overflow-hidden bg-baseblanco">
            <div className="px-4 py-3 flex justify-center items-center">
              <h2 className="text-3xl text-baseazul font-semibold text-gray-800">
                Nuevo Artículo Privado
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <form className="space-y-4">
                <div className='flex gap-3'>

                  {/* Fecha */}
                  <div className='w-[20%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Fecha publicada</label>
                    <input
                      type="text"
                      value={formData.date} // Mostrar la fecha automáticamente
                      readOnly // Hacer que el campo sea de solo lectura
                      className="input-fecha"
                    />
                  </div>

                  {/* Tema */}
                  <div className="w-[50%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Tema</label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="Escribe el tema"
                      className="input-tema"
                    />
                  </div>

                  {/* Categoria */}
                  <div className="w-[30%]">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                    <div className="relative">
                      <div className="main" onClick={toggleDropdown}>
                        {selectedCategory || 'Selecciona la categoría'}
                        <input type="checkbox" className="inp" checked={isDropdownOpen} onChange={toggleDropdown} />
                        <div className="bar">
                          <span className="top bar-list"></span>
                          <span className="middle bar-list"></span>
                          <span className="bottom bar-list"></span>
                        </div>

                        {isDropdownOpen && (
                          <div className="menu-container">
                            <div className="menu-scroll">
                              {categories.map((categoria, index) => (
                                <div
                                  key={index}
                                  className="menu-list"
                                  onClick={() => selectCategory(categoria)}
                                >
                                  {categoria}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className='flex gap-3'>
                  <div className='w-[100%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe el contenido..."
                      className="input-descripcion w-full h-16 flex items-start justify-start px-2 py-1 text-sm rounded resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">

                  {/* Palabras claves */}
                  <div className='w-[50%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Palabras clave</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Añadir palabra clave"
                        className="editar-palabra"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        <CgAdd className='text-xl' />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.keywords.map((kw, index) => (
                        <span key={index} className="bg-baseazul inline-flex items-center text-xs px-3 py-1 bg-gray-100 rounded-[20px] text-baseblanco                        ">
                          {kw}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(index)}
                            className="ml-1 text-coloralternodos hover:text-baseblanco font-bold text-[15px]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* URL */}
                  <div className="w-[50%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">URLs</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Ingresa una URL"
                        className="editar-url"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                      />
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        <CgAdd className='text-xl' />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {formData.urls.map((linkUrl, index) => (
                        <div key={index} className="flex items-center justify-between py-1 px-3 bg-gray-50 rounded text-sm">
                          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 truncate hover:underline">
                            {linkUrl}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveUrl(index)}
                            className="text-baseazul hover:text-basenaranja font-bold text-[15px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Documentos */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-[37%]">
                    <div className="container">
                      <div className="folder">
                        <div className="front-side">
                          <div className="tip" />
                          <div className="cover" />
                        </div>
                        <div className="back-side cover" />
                      </div>
                      <label className="custom-file-upload">
                        <input
                          className="title"
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          disabled={formData.files.length >= 2}
                        />
                        Seleccionar Archivos
                      </label>
                    </div>
                    <div className='documento'>
                      <p>PDF/WORD/EXCEL</p>
                      <p>Menos de 5MB y solo 2 Archivos</p>
                    </div>
                  </div>
                  <div className="files-container pl-4">
                    {formData.files.map((file, index) => (
                      <div key={index} className="file-item">
                        <GrDocumentUpdate className="file-icon text-xl" />
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="file-remove"
                          aria-label="Eliminar archivo"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Botones */}
            <div className="px-4 py-3 flex justify-end gap-2">
              <button className='cancelar' onClick={closePrivateModal}>
                Cancelar
              </button>
              <button className='guardar' onClick={() => handleSubmit(false)}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlimentadorPublicaciones;