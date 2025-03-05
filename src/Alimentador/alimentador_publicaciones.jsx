import React, { useState } from 'react';
import '../StylesAlimentador/alimentador_publicaciones.css';
import { Link } from 'react-router-dom';

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

// Iconos del Modal
import { CgAdd } from "react-icons/cg";
import { GrDocumentUpdate } from "react-icons/gr";

// Simulación de datos de publicaciones con `id` único
const publicaciones = [
  { id: "pub1", fecha: "21/02/2025", categoria: "Colegiaturas", tema: "Mensualidad sobre los semestres para la preparatoria.", descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos quos, atque asperiores consequatur, sint architecto odio beatae dolores possimus enim, sapiente quaerat? Quae beatae veritatis exercitationem iste eligendi fuga velit!", palabrasClave: "hola", documentos: "", urls: "" },
  { id: "pub2", fecha: "22/02/2025", categoria: "Becas", tema: "Becas disponibles para el semestre siguiente." },
  { id: "pub3", fecha: "23/02/2025", categoria: "Cursos", tema: "Cursos extracurriculares para mejorar habilidades." },
];

const AlimentadorPublicaciones = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filtroPublicacion, setfiltroPublicacion] = useState('');
  const [currentPublication, setCurrentPublication] = useState(null);

  // Estados para el Modal
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: '',
    topic: '',
    description: '',
    keywords: [],
    files: [],
    urls: []
  });
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4', 'Categoria 5', 'Categoria 6', 'Categoria 7', 'Categoria 8'];

  // Funciones para artículos
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInputChange = (e) => {
    setfiltroPublicacion(e.target.value);
  };

  const clearInput = () => {
    setfiltroPublicacion('');
  };

  // Funciones para Modal
  const openModal = () => {
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      category: '',
      topic: '',
      description: '',
      keywords: [],
      files: [],
      urls: []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (publicacion) => {
    setCurrentPublication(publicacion);
    setFormData({
      date: publicacion.fecha,
      category: publicacion.categoria,
      topic: publicacion.tema,
      description: publicacion.descripcion,
      keywords: publicacion.palabrasClave.split(','),
      files: [],
      urls: publicacion.urls.split(',')
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentPublication(null);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddKeyword = () => {
    if (keyword.trim()) {
      setFormData({ ...formData, keywords: [...formData.keywords, keyword.trim()] });
      setKeyword('');
    }
  };

  const handleRemoveKeyword = (index) => {
    const updatedKeywords = [...formData.keywords];
    updatedKeywords.splice(index, 1);
    setFormData({ ...formData, keywords: updatedKeywords });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const acceptedFileTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    const validFiles = newFiles.filter(file =>
      acceptedFileTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
    );

    setFormData({ ...formData, files: [...formData.files, ...validFiles] });
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, files: updatedFiles });
  };

  const handleAddUrl = () => {
    if (url.trim()) {
      setFormData({ ...formData, urls: [...formData.urls, url.trim()] });
      setUrl('');
    }
  };

  const handleRemoveUrl = (index) => {
    const updatedUrls = [...formData.urls];
    updatedUrls.splice(index, 1);
    setFormData({ ...formData, urls: updatedUrls });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    closeModal();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('Edited publication:', formData);
    closeEditModal();
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
              <span className="action-content" data-content="Doc. Internos" />
            </Link>

            <Link to={'/alimentador_login'} className="action" type="button">
              <RiLogoutCircleLine className="action-icon" color="#353866" />
              <span className="action-content" data-content="Salir" />
            </Link>

          </div>
        </div>

        <div className='w-[94%] h-screen'>
          {/* Titulo */}
          <div className='titulo w-[100%] h-[15%] flex items-center justify-center'>
            <h1 className='titulo-publicaciones'>Registro de Publicaciones</h1>
            <button className='button-publicaciones' onClick={openModal}>
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
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
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
            </div>
          </div>

          {/* Articulos */}
          <div className='resultados w-[99%] h-[70%] mt-3 overflow-y-auto'>
            {publicaciones.map((publicacion) => (
              <div key={publicacion.id} className={`articulos p-1 flex flex-col transition-all duration-300 ${expandedId === publicacion.id ? "expanded" : ""}`}>

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

                  <div className='editar-articulo w-[10%] flex items-center justify-center text-4xl'>
                    <button onClick={() => openEditModal(publicacion)}>
                      <BiSolidEditAlt className='text-baseazul' />
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

      {/* Modal de Nueva Publicación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-publicaciones rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col overflow-hidden">
            <div className="px-4 py-3 flex justify-center items-center">
              <h2 className="text-3xl text-baseazul font-semibold text-gray-800">Nueva Publicación</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className='flex items-center justify-center mb-5'>
                <div id="firstFilter" className="filter-switch pt-9">
                  <input defaultChecked id="option1" name="options" type="radio" />
                  <label className="option" htmlFor="option1">Público</label>
                  <input id="option2" name="options" type="radio" />
                  <label className="option" htmlFor="option2">Privado</label>
                  <span className="background" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-[20%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Fecha publicada</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="input-fecha"
                    />
                  </div>
                  <div className="w-[50%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Tema</label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="Escribe el tema"
                      className="input-tema"
                    />
                  </div>
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

                <div className='flex gap-3'>
                  <div className='w-[100%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      placeholder="Describe el contenido..."
                      className="input-descripcion w-full h-16 flex items-start justify-start px-2 py-1 text-sm rounded resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
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
                          <a href={linkUrl} target="blank" rel="noopener noreferrer" className="text-blue-600 truncate hover:underline">
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
                      <p>Menos de 5MB</p>
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

            <div className="px-4 py-3 flex justify-end gap-2">
              <button className='cancelar' onClick={closeModal}>
                Cancelar
              </button>
              <button className='guardar' onClick={handleSubmit}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Publicación */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-editar rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col overflow-hidden">
            <div className="px-4 py-3 flex justify-center items-center">
              <h2 className="text-3xl text-baseazul font-semibold text-gray-800">Editar Publicación</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-[20%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Fecha publicada</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="editar-fecha"
                    />
                  </div>
                  <div className="w-[50%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Tema</label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="Escribe el tema"
                      className="editar-tema"
                    />
                  </div>
                  <div className="w-[30%]">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                    <div className="relative">
                      <div className="main-editar" onClick={toggleDropdown}>
                        {selectedCategory || 'Selecciona la categoría'}
                        <input type="checkbox" className="inp" checked={isDropdownOpen} onChange={toggleDropdown} />
                        <div className="bar">
                          <span className="top bar-list"></span>
                          <span className="middle bar-list"></span>
                          <span className="bottom bar-list"></span>
                        </div>

                        {isDropdownOpen && (
                          <div className="menu-categoria">
                            <div className="menu-editar">
                              {categories.map((categoria, index) => (
                                <div
                                  key={index}
                                  className="lista-categoria"
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

                <div className='flex gap-3'>
                  <div className='w-[100%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      placeholder="Describe el contenido..."
                      className="input-descripcion w-full h-16 flex items-start justify-start px-2 py-1 text-sm rounded resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
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
                          <a href={linkUrl} target="blank" rel="noopener noreferrer" className="text-blue-600 truncate hover:underline">
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
                <div className="flex items-center justify-center mb-4">
                  <div className="w-[37%]">
                    <div className="files-editar pl-4">
                      {formData.files.map((file, index) => (
                        <div key={index} className="item-editar">
                          <GrDocumentUpdate className="icon-documento text-xl" />
                          <span className="name-documento">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="eliminar"
                            aria-label="Eliminar archivo"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-4 py-3 flex justify-end gap-2">
              <button className='cancelar-editar' onClick={closeEditModal}>
                Cancelar
              </button>
              <button className='guardar-editar' onClick={handleEditSubmit}>
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