import React, { useState, useEffect } from 'react';
import '../StylesAlimentador/alimentador_categorias.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { BiSolidCollection } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";
import { PiSmileySad } from "react-icons/pi";
import Swal from 'sweetalert2';

const AlimentadorCategorias = () => {
  const navigate = useNavigate();
  const [filtroPublicacion, setFiltroPublicacion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ nombre: '', descripcion: '' });
  const [editCategory, setEditCategory] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    // Cargar categorías desde la API
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/obtener_categorias.php');
      const data = await response.json();
      if (data.success) {
        setCategorias(data.categorias);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    setFiltroPublicacion(e.target.value);
  };

  const clearInput = () => {
    setFiltroPublicacion('');
  };

  const categoriasFiltradas = categorias.filter(cat =>
    filtroPublicacion && (
      cat.categoria.toLowerCase().includes(filtroPublicacion.toLowerCase()) ||
      cat.descripcion.toLowerCase().includes(filtroPublicacion.toLowerCase())
    )
  );

  const openNewModal = () => {
    setNewCategory({ nombre: '', descripcion: '' });
    setShowNewModal(true);
  };

  const closeNewModal = () => {
    setShowNewModal(false);
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setEditCategory({ nombre: category.categoria, descripcion: category.descripcion });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentCategory(null);
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleEditCategoryChange = (e) => {
    const { name, value } = e.target;
    setEditCategory(prev => ({ ...prev, [name]: value }));
  };

  const saveNewCategory = async () => {
    try {
      const response = await fetch('http://localhost/UFD/src/BackEnd/guardar_categoria.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      const data = await response.json();
      if (data.success) {
        fetchCategorias();
        closeNewModal();
        alertaGuardada();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al guardar la nueva categoría:", error);
    }
  };

  const saveEditCategory = async () => {
    try {
      const response = await fetch(`http://localhost/UFD/src/BackEnd/actualizar_categoria.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentCategory.id, ...editCategory }),
      });
      const data = await response.json();
      if (data.success) {
        fetchCategorias();
        closeEditModal();
        alertaEditada();

      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
    }
  };

  //Alerta
  const alertaGuardada = () => {
    Swal.fire({
      title: "Categoria Guardada Correctamente",
      icon: "success",
      color: '#000',
      confirmButtonColor: "#ED6B06",
      draggable: true
    });
  }

  const alertaEditada = () => {
    Swal.fire({
      title: "Categoria Editada Correctamente",
      icon: "success",
      color: '#000',
      confirmButtonColor: "#ED6B06",
      draggable: true
    });
  }


  return (
    <div>
      <div className='w-screen h-screen bg-baseazul flex'>
        <div className="w-[6%] h-screen bg-baseazul flex items-center justify-center relative">
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

        <div className='w-[94%] h-screen'>
          <div className='titulo w-[100%] h-[15%] flex items-center justify-center'>
            <h1 className='titulo-categorias'>Registro de Categorías</h1>
            <button className='button-categorias' onClick={openNewModal}>Nueva Categoría
              <span />
            </button>
          </div>

          <div className='buscador w-[100%] h-[10%] flex items-center justify-center'>
            <div className="search-panels-filtro">
              <div className="search-group">
                <input required type="text" name="text" autoComplete="on" className="input" value={filtroPublicacion} onChange={handleInputChange} />
                <label className="enter-label">Filtrar Categorías</label>
                <div className="btn-box">
                  <button className="btn-search">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                  </button>
                </div>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={clearInput}>
                    <svg xmlns="http://www.w                    .org/2000/svg" height="1em" viewBox="0 0 384 512">
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className='tabla-categorias w-[95%] h-[65%] mt-6 ml-6 '>
            {!filtroPublicacion ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-8xl mb-4 ">
                  <TbCategoryPlus className='text-baseblanco' />
                </div>
                <p className="text-xl font-bold text-baseblanco">Utilice el filtro para buscar las categorías.</p>
              </div>
            ) : categoriasFiltradas.length > 0 ? (
              <table className='w-[100%] bg-baseblanco'>
                <thead>
                  <tr>
                    <th className='border-2 border-basenaranja w-[20%]'>Categoría</th>
                    <th className='border-2 border-basenaranja w-[45%]'>Descripción</th>
                    <th className='border-2 border-basenaranja w-[15%]'>Publicaciones</th>
                    <th className='border-2 border-basenaranja w-[20%]'>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {categoriasFiltradas.map((cat, index) => (
                    <tr key={index}>
                      <td className='border-2 border-basenaranja'>{cat.categoria}</td>
                      <td className='border-2 border-basenaranja'>{cat.descripcion}</td>
                      <td className='border-2 border-basenaranja'>{cat.publicaciones} publicaciones</td>
                      <td className='border-2 border-basenaranja w-[100%]'>

                        {/* Botón Editar */}
                        <div className='flex justify-between'>
                          <button className="Btn w-[50%]" onClick={() => openEditModal(cat)}>Editar
                            <svg className="svg" id='svg-editar' viewBox="0 0 400 600">
                              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32z" />
                            </svg>
                          </button>

                          <button className="Btn w-[50%]">Bajar
                            <svg className="svg" id='svg-bajar' viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-8xl mb-4">
                  <PiSmileySad className='text-baseblanco' />
                </div>
                <p className="text-xl font-bold text-baseblanco">No se encontraron resultados para "{filtroPublicacion}"</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modal para Nueva Categoría */}
      {showNewModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="modal-categoriaNueva rounded-lg p-8 w-[40%] h-[65%]">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-3xl font-bold text-baseazul">Nueva Categoría</h2>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre de la categoría
              </label>
              <input
                className="nueva-categoria"
                type="text"
                name="nombre"
                placeholder="Ingrese el nombre de la categoría"
                value={newCategory.nombre}
                onChange={handleNewCategoryChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
              <textarea
                name="descripcion"
                placeholder="Ingrese la descripción de la categoría."
                className="descripcion-categoria w-full h-16 flex items-start justify-start px-2 py-1 text-sm rounded resize-none"
                value={newCategory.descripcion}
                onChange={handleNewCategoryChange}
              />
            </div>

            <div className="px-4 py-3 flex justify-end gap-2">
              <button className='nueva-categoriaCancelar' onClick={closeNewModal}>
                Cancelar
              </button>

              <button className='nueva-categoriaGuardar' onClick={saveNewCategory}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Categoría */}
      {showEditModal && currentCategory && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="modal-categoriaEditar rounded-lg p-8 w-[40%] h-[65%]">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-3xl font-bold text-baseazul">Editar Categoría</h2>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2"> Nombre de la categoría </label>
              <input
                className="input-editarCategotria"
                type="text"
                name="nombre"
                value={editCategory.nombre}
                onChange={handleEditCategoryChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
              <textarea
                name="descripcion"
                placeholder="Ingrese la descripción de la categoría."
                className="descripcion-editarCategoria w-full h-16 flex items-start justify-start px-2 py-1 text-sm rounded resize-none"
                value={editCategory.descripcion}
                onChange={handleEditCategoryChange}
              />
            </div>
            <div className="px-4 py-3 flex justify-end gap-2">
              <button className='cancelar-editarCategoria' onClick={closeEditModal}>
                Cancelar
              </button>

              <button className='guardar-editarCategoria' onClick={saveEditCategory}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlimentadorCategorias;