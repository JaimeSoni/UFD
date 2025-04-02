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
import { IoDocumentOutline } from "react-icons/io5";

//Icono de la busqueda no encontrada
import { PiSmileySad } from "react-icons/pi";

// Iconos del Modal
import { CgAdd } from "react-icons/cg";
import { GrDocumentUpdate } from "react-icons/gr";

//Alerta 
import Swal from 'sweetalert2';

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
  const [tipoBusqueda, setTipoBusqueda] = useState('publico');

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: '',
    topic: '',
    description: '',
    keywords: [],
    files: [],
    urls: [],
    targetAudience: ''
  });

  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdownVisibility = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleAddKeyword = () => {
    if (keyword.trim()) {
      setFormData({ ...formData, keywords: [...formData.keywords, keyword.trim()] })
      setKeyword('');
    };
  }

  const handleAddUrl = () => {
    if (url.trim()) {
      setFormData({ ...formData, urls: [...formData.urls, url.trim()] })
      setUrl('');
    };
  }

  const handleRemoveKeyword = (indexToRemove) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleRemoveUrl = (indexToRemove) => {
    setFormData({
      ...formData,
      urls: formData.urls.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleRemoveFile = (indexToRemove) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, index) => index !== indexToRemove)
    });
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

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectCategory = (categoria) => {
    setSelectedCategory(categoria);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionesPrivadas, setPublicacionesPrivadas] = useState([]);

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

  const fetchPublicaciones = async () => {
    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/obtener_publicaciones.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setPublicaciones(data.publicaciones);
      } else {
        console.error('Error fetching publications:', data.message);
        setPublicaciones([]);
      }
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      setPublicaciones([]);
    }
  };

  const fetchPublicacionesPrivadas = async () => {
    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/obtener_publicaciones_privadas.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setPublicacionesPrivadas(data.publicaciones);
      } else {
        console.error('Error fetching publications:', data.message);
        setPublicacionesPrivadas([]);
      }
    } catch (error) {
      console.error('Error al cargar publicaciones privadas:', error);
      setPublicacionesPrivadas([]);
    }
  };

  useEffect(() => {
    fetchPublicaciones();
    fetchPublicacionesPrivadas();
    fetchCategories();
  }, []);

  const filtroResultados = filtroPublicacion.trim()
    ? (tipoBusqueda === 'publico' ? publicaciones : publicacionesPrivadas).filter(publicacion => {
      const terminoBusqueda = filtroPublicacion.toLowerCase().trim();
      return (
        (publicacion.categoria_publica?.toLowerCase() || '').includes(terminoBusqueda) ||
        (publicacion.tema_publico?.toLowerCase() || '').includes(terminoBusqueda) ||
        (publicacion.palabrasClave?.toLowerCase() || '').includes(terminoBusqueda) ||

        (publicacion.categoria_privada?.toLowerCase() || '').includes(terminoBusqueda) ||
        (publicacion.tema_privado?.toLowerCase() || '').includes(terminoBusqueda)
      );
    })
    : (tipoBusqueda === 'publico' ? publicaciones : publicacionesPrivadas);

  const handleInputChange = (e) => {
    setfiltroPublicacion(e.target.value);
  };

  const clearInput = () => {
    setfiltroPublicacion('');
  };

  const handleTipoBusquedaChange = (tipo) => {
    setTipoBusqueda(tipo);
    setfiltroPublicacion('');
  };

  const openPublicModal = () => {
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      category: '',
      topic: '',
      description: '',
      keywords: [],
      files: [],
      urls: []
    });
    setIsPublicModalOpen(true);
  };

  const closePublicModal = () => {
    setIsPublicModalOpen(false);
  };

  const openPrivateModal = () => {
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      category: '',
      topic: '',
      description: '',
      keywords: [],
      files: [],
      urls: [],
      targetAudience: ''
    });
    setIsPrivateModalOpen(true);
  };

  const closePrivateModal = () => {
    setIsPrivateModalOpen(false);
  };

  const handleOptionSelect = (option) => {
    setIsDropdownVisible(false);
    if (option === 'publico') {
      openPublicModal();
    } else {
      openPrivateModal();
    }
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isDropdownVisible) {
        setIsDropdownVisible(false);
      }
    };
    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownVisible]);

  const handleSubmit = async (isPublic) => {
    if (!formData.topic || !selectedCategory || !formData.description) {
      alert('Por favor, complete los campos obligatorios');
      return;
    }

    const submissionData = {
      date: formData.date,
      topic: formData.topic,
      category: selectedCategory,
      description: formData.description || null,
      keywords: formData.keywords,
      urls: formData.urls
    };

    const formDataUpload = new FormData();
    Object.keys(submissionData).forEach(key => {
      if (submissionData[key] !== null) {
        formDataUpload.append(key, JSON.stringify(submissionData[key]));
      }
    });

    formData.files.forEach((file) => {
      formDataUpload.append(`files[]`, file);
    });

    const url = isPublic
      ? 'http://localhost/UFD/src/BackEnd/articulos_publicos.php'
      : 'http://localhost/UFD/src/BackEnd/articulos_privados.php';

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formDataUpload
      });

      const result = await response.json();

      if (result.status === 'success') {
        Swal.fire({
          title: "Publicación Guardada Correctamente",
          icon: "success",
          color: '#000',
          confirmButtonColor: "#ED6B06",
          draggable: true
        });

        setFormData({
          date: new Date().toISOString().slice(0, 10),
          topic: '',
          description: '',
          keywords: [],
          urls: [],
          files: []
        });
        setSelectedCategory('');
        closePublicModal();
        closePrivateModal();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al guardar el artículo');
    }
  };

  // Funciones de editar publicaciones

  // Estados adicionales para edición
  const [isEditPublicModalOpen, setIsEditPublicModalOpen] = useState(false);
  const [isEditPrivateModalOpen, setIsEditPrivateModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    date: '',
    topic: '',
    description: '',
    keywords: [],
    files: [],
    urls: []
  });
  const [editKeyword, setEditKeyword] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const [editSelectedCategory, setEditSelectedCategory] = useState('');

  // Función para preparar la edición
  const openEditModal = (publicacion) => {
    setCurrentPublication(publicacion);

    // Determinar si es público o privado
    const isPublic = publicacion.hasOwnProperty('id_publico');

    // Extraer palabras clave y URLs
    const keywords = Array.isArray(publicacion.palabras_clave) ? publicacion.palabras_clave : publicacion.palabras_clave.split(',').map(kw => kw.trim());
    const urls = Array.isArray(publicacion.urls) ? publicacion.urls : publicacion.urls.split(',').map(url => url.trim());

    // Inicializar correctamente los archivos existentes
    let existingFiles = [];
    if (publicacion.archivos) {
      if (Array.isArray(publicacion.archivos)) {
        existingFiles = publicacion.archivos;
      } else if (typeof publicacion.archivos === 'string' && publicacion.archivos.trim() !== '') {
        try {
          existingFiles = JSON.parse(publicacion.archivos);
        } catch (e) {
          existingFiles = publicacion.archivos.split(',').map(file => file.trim());
        }
      }
    }

    setEditFormData({
      date: publicacion.fecha_publicacion || publicacion.fecha_privada || new Date().toISOString().slice(0, 10),
      topic: publicacion.tema_publico || publicacion.tema_privado || '',
      description: publicacion.descripcion_publico || publicacion.descripcion_privada || '',
      keywords: keywords,
      files: existingFiles, // Usar los archivos existentes correctamente formateados
      urls: urls
    });

    setEditSelectedCategory(publicacion.categoria_publica || publicacion.categoria_privada || '');

    if (isPublic) {
      setIsEditPublicModalOpen(true);
    } else {
      setIsEditPrivateModalOpen(true);
    }
  };

  // Funciones para manejar el dropdown de categorías en la edición
  const toggleEditDropdown = () => {
    setIsEditDropdownOpen(!isEditDropdownOpen);
  };

  const selectEditCategory = (categoria) => {
    setEditSelectedCategory(categoria);
    setIsEditDropdownOpen(false);
  };

  // Funciones para manejar palabras clave en la edición
  const handleAddEditKeyword = () => {
    if (editKeyword.trim()) {
      setEditFormData({ ...editFormData, keywords: [...editFormData.keywords, editKeyword.trim()] });
      setEditKeyword('');
    }
  };

  const handleRemoveEditKeyword = (indexToRemove) => {
    setEditFormData(prevState => ({
      ...prevState,
      keywords: prevState.keywords.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Funciones para manejar URLs en la edición
  const handleAddEditUrl = () => {
    if (editUrl.trim()) {
      setEditFormData({ ...editFormData, urls: [...editFormData.urls, editUrl.trim()] });
      setEditUrl('');
    }
  };

  const handleRemoveEditUrl = (indexToRemove) => {
    setEditFormData({
      ...editFormData,
      urls: editFormData.urls.filter((_, index) => index !== indexToRemove)
    });
  };

  // Funciones para manejar archivos en la edición
  const handleEditFileChange = (e) => {
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

    // Añadir nuevos archivos a los existentes
    setEditFormData(prevState => ({
      ...prevState,
      files: [...prevState.files, ...validFiles]
    }));
  };

  const handleRemoveEditFile = (indexToRemove) => {
    setEditFormData(prevState => ({
      ...prevState,
      files: prevState.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Funciones para cerrar modales de edición
  const closeEditPublicModal = () => {
    setIsEditPublicModalOpen(false);
    setCurrentPublication(null);
  };

  const closeEditPrivateModal = () => {
    setIsEditPrivateModalOpen(false);
    setCurrentPublication(null);
  };

  // Enviar datos
  const handleUpdatePublic = async (id) => {
    if (!editFormData.topic || !editSelectedCategory || !editFormData.description) {
      alert('Por favor, complete los campos obligatorios');
      return;
    }

    const submissionData = {
      id: id,
      topic: editFormData.topic,
      category: editSelectedCategory,
      description: editFormData.description || null,
      keywords: editFormData.keywords,
      urls: editFormData.urls
    };

    const formDataUpload = new FormData();
    Object.keys(submissionData).forEach(key => {
      if (submissionData[key] !== null) {
        if (Array.isArray(submissionData[key])) {
          formDataUpload.append(key, JSON.stringify(submissionData[key]));
        } else {
          formDataUpload.append(key, submissionData[key]);
        }
      }
    });

    const existingFiles = editFormData.files.filter(file => !(file instanceof File));
    formDataUpload.append('existing_files', JSON.stringify(existingFiles));

    // Handle new files
    const newFiles = editFormData.files.filter(file => file instanceof File);
    newFiles.forEach(file => {
      formDataUpload.append('files[]', file);
    });

    try {
      // Rest of your code...
    } catch (error) {
      // Error handling...
    }


    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/actualizar_articulos_publicos.php', {
        method: 'POST',
        body: formDataUpload
      });

      const responseText = await response.text(); // Obtener la respuesta como texto

      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText); // Parseo solo si es JSON
      } catch (e) {
        throw new Error(`Error al parsear la respuesta: ${responseText}`);
      }

      if (result.status === 'success') {
        Swal.fire({
          title: "Publicación Actualizada Correctamente",
          icon: "success",
          color: '#000',
          confirmButtonColor: "#ED6B06",
          draggable: true
        });

        closeEditPublicModal();
        // Actualizar la lista de publicaciones
        await fetchPublicaciones();
        await fetchPublicacionesPrivadas();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al actualizar el artículo');
    }
  };

  // Privado
  const handleUpdatePrivate = async (id) => {
    if (!editFormData.topic || !editSelectedCategory || !editFormData.description) {
      alert('Por favor, complete los campos obligatorios');
      return;
    }

    const submissionData = {
      id: id,
      topic: editFormData.topic,
      category: editSelectedCategory,
      description: editFormData.description || null,
      keywords: editFormData.keywords,
      urls: editFormData.urls
    };

    const formDataUpload = new FormData();

    // Agregar datos simples
    Object.keys(submissionData).forEach(key => {
      if (submissionData[key] !== null) {
        if (Array.isArray(submissionData[key])) {
          formDataUpload.append(key, JSON.stringify(submissionData[key]));
        } else {
          formDataUpload.append(key, submissionData[key]);
        }
      }
    });

    // Separar archivos existentes de nuevos
    const existingFiles = editFormData.files.filter(file => !(file instanceof File));
    const newFiles = editFormData.files.filter(file => file instanceof File);

    // Agregar archivos existentes como JSON
    formDataUpload.append('existing_files', JSON.stringify(existingFiles));

    // Agregar nuevos archivos
    newFiles.forEach(file => {
      formDataUpload.append('files[]', file);
    });

    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/actualizar_articulos_privados.php', {
        method: 'POST',
        body: formDataUpload
      });

      const result = await response.json();

      if (result.status === 'success') {
        Swal.fire({
          title: "Publicación Actualizada Correctamente",
          icon: "success",
          color: '#000',
          confirmButtonColor: "#ED6B06",
          draggable: true
        });

        // Actualizar el estado con los archivos devueltos por el servidor
        if (result.archivos) {
          setEditFormData(prev => ({
            ...prev,
            files: result.archivos
          }));
        }

        closeEditPrivateModal();
        // Actualizar la lista de publicaciones
        await fetchPublicacionesPrivadas();
        await fetchPublicaciones();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al actualizar el artículo');
    }
  };


  return (
    <div>
      <div className='w-screen h-screen bg-baseazul flex'>
        <div className="w-[6%] h-screen bg-baseazul flex items-center justify-center relative">
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

            <Link to={'/alimentador_login'} onClick={handleLogout} className="action" type="button">
              <RiLogoutCircleLine className="action-icon" color="#353866" />
              <span className="action-content" data-content="Salir" />
            </Link>
          </div>
        </div>

        <div className='w-[94%] h-screen'>
          <div className='titulo w-[100%] h-[13%] flex items-center justify-center mb-1'>
            <h1 className='titulo-publicaciones'>Registro de Publicaciones</h1>
            <button className='button-publicaciones' onClick={toggleDropdownVisibility}>
              Nueva Publicación
              <span />
            </button>

            {isDropdownVisible && (
              <div className='dropdown-options' ref={dropdownRef}>
                <button className='bg-basenaranja' onClick={() => handleOptionSelect('publico')}> Art. Público</button>

                <button className='bg-basenaranja' onClick={() => handleOptionSelect('privado')}> Art. Privado</button>
              </div>
            )}
          </div>

          <div className='buscador w-[100%] h-[10%] flex items-center justify-center pt-12'>
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

              <div className='flex items-center justify-center'>
                <div id="firstFilter" className="filter-switch w-full h-[10%] mt-2 pt-8">
                  <input
                    defaultChecked={tipoBusqueda === "publico"}
                    id="publico"
                    name="options"
                    type="radio"
                    value="publico"
                    onChange={(e) => handleTipoBusquedaChange(e.target.value)}
                  />
                  <label htmlFor="publico" className="option">Público</label>

                  <input
                    id="privado"
                    name="options"
                    type="radio"
                    value="privado"
                    checked={tipoBusqueda === "privado"}
                    onChange={(e) => handleTipoBusquedaChange(e.target.value)}
                  />
                  <label htmlFor="privado" className="option">Privado</label>

                  <span className="background" />
                </div>
              </div>

            </div>
          </div>

          <div className='resultados w-full h-[65%] mt-12 overflow-y-auto'>
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
                  <div className="flex h-[50px] items-center justify-center">
                    <div className='fecha-articulo w-[15%] flex items-center justify-center text-xl'>
                      <h1>{publicacion.fecha_publicacion || publicacion.fecha_privada}</h1>
                    </div>

                    <div className='categoria-articulo w-[15%] flex items-center justify-center text-xl'>
                      <h1 className='bg-basenaranja p-2 rounded-lg text-baseblanco'>{publicacion.categoria_publica || publicacion.categoria_privada}</h1>
                    </div>

                    <div className='tema-articulo w-[50%] flex items-center justify-center text-xl'>
                      <h1>{publicacion.tema_publico || publicacion.tema_privado}</h1>
                    </div>

                    <div className='expandir-contraer w-[10%] flex items-center justify-center text-4xl'>
                      <button className='icono-final' onClick={() => toggleExpand(publicacion.id_publico || publicacion.id_privado)}>
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
                    className={`transition-all duration-300 overflow-hidden overflow-y-auto ${expandedId === (publicacion.id_publico || publicacion.id_privado) ? "max-h-[300px]" : "max-h-0"}`}
                  >
                    <div className="descripcion p-2 h-[120px]">
                      <p className='titulos-resultados text-xl'>Descripción: <br /> <span className='textos-resultados'>{publicacion.descripcion_publico || publicacion.descripcion_privada || 'Sin descripcion almacenada'}</span></p>
                    </div>

                    <div className="palabras-clave p-2 h-[100px]">
                      <p className='titulos-resultados text-xl'>Palabras Clave:</p>
                      <div className='flex flex-wrap gap-2'>
                        {(() => {
                          // Verifica si existe palabras_clave
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
                            // Manejar tanto arrays como strings JSON
                            (Array.isArray(publicacion.archivos) ?
                              publicacion.archivos.map((archivo, index) => (
                                <span key={index} className='flex items-center border-b-4 mb-3 pl-2 border-basenaranja rounded-[20px]'>
                                  <IoDocumentOutline className='text-baseazul mr-2' />
                                  {typeof archivo === 'object' ? archivo.name || archivo.filename : archivo}
                                </span>
                              ))
                              : (
                                // Si es un string, intentar parsear como JSON
                                (() => {
                                  try {
                                    const parsedFiles = JSON.parse(publicacion.archivos);
                                    return Array.isArray(parsedFiles) ?
                                      parsedFiles.map((archivo, index) => (
                                        <span key={index} className='flex items-center border-b-4 mb-3 pl-2 border-basenaranja rounded-[20px]'>
                                          <IoDocumentOutline className='text-baseazul mr-2' />
                                          {typeof archivo === 'object' ? archivo.name || archivo.filename : archivo}
                                        </span>
                                      ))
                                      : <span className='text-basenaranja'>Formato de archivos inválido</span>;
                                  } catch (e) {
                                    // Si no es JSON válido, mostrar como string simple
                                    return (
                                      <span className='flex items-center border-b-4 mb-3 pl-2 border-basenaranja rounded-[20px]'>
                                        <IoDocumentOutline className='text-baseazul mr-2' />
                                        {publicacion.archivos}
                                      </span>
                                    );
                                  }
                                })()
                              )
                            )
                            ) : (
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
      </div>

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

                  <div className='w-[20%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Fecha publicada</label>
                    <input
                      type="text"
                      value={formData.date}
                      readOnly
                      className="input-fecha"
                    />
                  </div>

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
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

      {isPrivateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-privados rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col overflow-hidden bg-baseblanco">
            <div className="px-4 py-3 flex justify-center items-center">
              <h2 className="text-3xl text-baseazul font-semibold text-gray-800">
                Nuevo Artículo Privado
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <form className="space-y-4">
                <div className='flex gap-3'>

                  <div className='w-[20%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Fecha publicada</label>
                    <input
                      type="text"
                      value={formData.date}
                      readOnly
                      className="input-fecha"
                    />
                  </div>

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
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

      {/* Modales para editar las publicaciones */}

      {isEditPublicModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-publicaciones rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col overflow-hidden">
            <div className="px-4 py-3 flex justify-center items-center">
              <h2 className="text-3xl text-baseazul font-semibold text-gray-800">
                Editar Artículo Público
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <form className="space-y-4">
                <div className='flex gap-3'>
                  <div className='w-[20%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Fecha publicada</label>
                    <input
                      type="text"
                      value={editFormData.date}
                      readOnly
                      className="input-fecha"
                    />
                  </div>

                  <div className="w-[50%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Tema</label>
                    <input
                      type="text"
                      name="topic"
                      value={editFormData.topic}
                      onChange={(e) => setEditFormData({ ...editFormData, topic: e.target.value })}
                      placeholder="Escribe el tema"
                      className="input-tema"
                    />
                  </div>

                  <div className="w-[30%]">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                    <div className="relative">
                      <div className="main" onClick={toggleEditDropdown}>
                        {editSelectedCategory || 'Selecciona la categoría'}
                        <input type="checkbox" className="inp" checked={isEditDropdownOpen} onChange={toggleEditDropdown} />
                        <div className="bar">
                          <span className="top bar-list"></span>
                          <span className="middle bar-list"></span>
                          <span className="bottom bar-list"></span>
                        </div>

                        {isEditDropdownOpen && (
                          <div className="menu-container">
                            <div className="menu-scroll">
                              {categories.map((categoria, index) => (
                                <div
                                  key={index}
                                  className="menu-list"
                                  onClick={() => selectEditCategory(categoria)}
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
                      value={editFormData.description || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
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
                        value={editKeyword}
                        onChange={(e) => setEditKeyword(e.target.value)}
                        placeholder="Añadir palabra clave"
                        className="input-palabra"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEditKeyword())}
                      />
                      <button
                        type="button"
                        onClick={handleAddEditKeyword}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        <CgAdd className='text-xl' />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {editFormData.keywords.map((kw, index) => (
                        <span key={index} className="bg-baseazul inline-flex items-center text-xs px-3 py-1 bg-gray-100 rounded-[20px] text-baseblanco">
                          {kw}
                          <button
                            type="button"
                            onClick={() => handleRemoveEditKeyword(index)}
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
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="Ingresa una URL"
                        className="input-url"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEditUrl())}
                      />
                      <button
                        type="button"
                        onClick={handleAddEditUrl}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        <CgAdd className='text-xl' />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {editFormData.urls.map((linkUrl, index) => (
                        <div key={index} className="flex items-center justify-between py-1 px-3 bg-gray-50 rounded text-sm">
                          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 truncate hover:underline">
                            {linkUrl}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveEditUrl(index)}
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
                          onChange={handleEditFileChange}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          disabled={editFormData.files.length >= 2}
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
                    {editFormData.files.map((file, index) => (
                      <div key={index} className="file-item">
                        <GrDocumentUpdate className="file-icon text-xl" />
                        <span className="file-name">{typeof file === 'string' ? file : file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditFile(index)}
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
              <button className='cancelar' onClick={closeEditPublicModal}>
                Cancelar
              </button>
              <button className='guardar' onClick={() => handleUpdatePublic(currentPublication.id_publico)}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privado */}


      {isEditPrivateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-privados rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col overflow-hidden bg-baseblanco">
            <div className="px-4 py-3 flex justify-center items-center">
              <h2 className="text-3xl text-baseazul font-semibold text-gray-800">
                Editar Artículo Privado
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <form className="space-y-4">
                <div className='flex gap-3'>
                  <div className='w-[20%]'>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Fecha publicada</label>
                    <input
                      type="text"
                      value={editFormData.date}
                      readOnly
                      className="input-fecha"
                    />
                  </div>

                  <div className="w-[50%]">
                    <label className="block text-[14px] font-bold text-gray-700 mb-1">Tema</label>
                    <input
                      type="text"
                      name="topic"
                      value={editFormData.topic}
                      onChange={(e) => setEditFormData({ ...editFormData, topic: e.target.value })}
                      placeholder="Escribe el tema"
                      className="input-tema"
                    />
                  </div>

                  <div className="w-[30%]">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                    <div className="relative">
                      <div className="main" onClick={toggleEditDropdown}>
                        {editSelectedCategory || 'Selecciona la categoría'}
                        <input type="checkbox" className="inp" checked={isEditDropdownOpen} onChange={toggleEditDropdown} />
                        <div className="bar">
                          <span className="top bar-list"></span>
                          <span className="middle bar-list"></span>
                          <span className="bottom bar-list"></span>
                        </div>

                        {isEditDropdownOpen && (
                          <div className="menu-container">
                            <div className="menu-scroll">
                              {categories.map((categoria, index) => (
                                <div
                                  key={index}
                                  className="menu-list"
                                  onClick={() => selectEditCategory(categoria)}
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
                      value={editFormData.description || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
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
                        value={editKeyword}
                        onChange={(e) => setEditKeyword(e.target.value)}
                        placeholder="Añadir palabra clave"
                        className="editar-palabra"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEditKeyword())}
                      />
                      <button
                        type="button"
                        onClick={handleAddEditKeyword}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        <CgAdd className='text-xl' />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {editFormData.keywords.map((kw, index) => (
                        <span key={index} className="bg-baseazul inline-flex items-center text-xs px-3 py-1 bg-gray-100 rounded-[20px] text-baseblanco">
                          {kw}
                          <button
                            type="button"
                            onClick={() => handleRemoveEditKeyword(index)}
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
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="Ingresa una URL"
                        className="editar-url"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEditUrl())}
                      />
                      <button
                        type="button"
                        onClick={handleAddEditUrl}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        <CgAdd className='text-xl' />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {editFormData.urls.map((linkUrl, index) => (
                        <div key={index} className="flex items-center justify-between py-1 px-3 bg-gray-50 rounded text-sm">
                          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 truncate hover:underline">
                            {linkUrl}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveEditUrl(index)}
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
                          onChange={handleEditFileChange}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          disabled={editFormData.files.length >= 2}
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
                    {editFormData.files.map((file, index) => (
                      <div key={index} className="file-item">
                        <GrDocumentUpdate className="file-icon text-xl" />
                        <span className="file-name">{typeof file === 'string' ? file : file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditFile(index)}
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
              <button className='cancelar' onClick={closeEditPrivateModal}>
                Cancelar
              </button>
              <button className='guardar' onClick={() => handleUpdatePrivate(currentPublication.id_privado)}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AlimentadorPublicaciones;