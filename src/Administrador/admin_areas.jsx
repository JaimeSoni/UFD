import React from 'react'
import '../StylesAdmin/admin_areas.css'
import { useState } from "react";

{/* Iconos */}
import { FaHome } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { RxLapTimer } from "react-icons/rx";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaUsers } from "react-icons/fa";

const AdminAreas = () => {

  // Función Modal
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const openModalEdit = () => setIsEditOpen(true);
  const closeModalEdit = () => setIsEditOpen(false);

  // Funcion de la X en los filtros
  const [filtroArea, setfiltroArea] = useState ('');
  const handleInputChange = (e) => {
    setfiltroArea(e.target.value);
  };

  const clearInput = () => {
    setfiltroArea('');
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
              <RxLapTimer className="action-icon" color="#353866" />
              <span className="action-content" data-content="Mis Accesos" />
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
            <h1 id='titulo-areas'>Áreas Registradas</h1>

            <button onClick={openModal}>
              <span className="box">
              Registrar Área
              </span>
            </button>
          </div>

          {/* Buscador */}
          <div className='w-[100%] h-[10%] flex items-center justify-center'>
            <div className="search-panels-filtro">
              <div className="search-group">
                <input required type="text" name="text" autoComplete="on" className="input" value={filtroArea} onChange={handleInputChange} />
                <label className="enter-label">Filtrar Área</label>
                <div className="btn-box">
                  <button className="btn-search">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /><circle id="svg-circle" cx={208} cy={208} r={144} /></svg>
                  </button>
                </div>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={clearInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" id="cleare-line" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div id='tabla' className='w-[92%] h-[65%] mt-7'>
            <table className='w-[100%]'>
            <thead>
              <tr>
                <th className='border-2 border-basenaranja w-[10%]'>ID Área</th>
                <th className='border-2 border-basenaranja w-[20%]'>Área</th>
                <th className='border-2 border-basenaranja w-[20%]'>Usuario</th>
                <th className='border-2 border-basenaranja w-[20%]'>Contraseña</th>
                <th className='border-2 border-basenaranja w-[30%]'>Acción</th>
              </tr>
            </thead>
            <tbody>
              <td className='border-2 border-basenaranja'>121</td>
              <td className='border-2 border-basenaranja'>Administración</td>
              <td className='border-2 border-basenaranja'>Jaime Soni</td>
              <td className='border-2 border-basenaranja'>123456789</td>
              <td className='border-2 border-basenaranja w-[100%]'>
                {/* Boton editar */}
                <div className='flex'>
                <button className="Btn w-[50%]" onClick={openModalEdit}>Editar
                  <svg className="svg" viewBox="0 0 512 512">
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" /></svg>
                </button>

                {/* Option del estado */}

                <fieldset id="switch" className="radio w-[50%] flex items-center">
                  <input name="switch" id="on" type="radio" />
                  <label htmlFor="on" className='text-[18px]'>Activo</label>
                  <br />
                  <input name="switch" id="off" type="radio" />
                  <label htmlFor="off" className='text-[18px]'>Inactivo</label>
                </fieldset>
                </div>

              </td>
            </tbody>
            </table>
          </div>
        </div>

        {/* Modal Registrar */}
          {isOpen && (
            <div id="modal" className="fixed inset-0 flex justify-center items-center">
              <div className="">

                <div className='x flex items-center justify-end pr-3 pt-2'>
                  <button className="BotonCerrar" onClick={closeModal}>
                  <IoIosCloseCircleOutline className='text-2xl' />
                  </button>
                </div>

                <div className='Registrar'>
                  <h1>Registrar Nueva Área</h1>
                </div>

                <div className='Inputs'>
  <div className="input-container">
    <input required type="text" name="idarea" autoComplete="off" className="InputRegistro1" />
    <label className="LabelRegistro1">ID Área</label>
  </div>

  <div className="input-container">
    <input required type="text" name="area" autoComplete="off" className="InputRegistro2" />
    <label className="LabelRegistro2">Área</label>
  </div>

  <div className="input-container">
    <input required type="text" name="usuario" autoComplete="off" className="InputRegistro3" />
    <label className="LabelRegistro3">Usuario</label>
  </div>

  <div className="input-container">
    <input required type="password" name="constraseña" autoComplete="off" className="InputRegistro4" />
    <label className="LabelRegistro4">Contraseña</label>
  </div>
</div>

                <div className='BotonRegistro flex items-center justify-center'>
                  <button>
                    <a href="#"><span>Registrar</span></a> 
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Modal editar */}
          {isEditOpen && (
            <div id="modal" className="fixed inset-0 flex justify-center items-center">
              <div className="">

                <div className='x flex items-center justify-end pr-3 pt-2'>
                  <button className="BotonCerrar" onClick={closeModalEdit}>
                  <IoIosCloseCircleOutline className='text-2xl' />
                  </button>
                </div>

                <div className='Registrar'>
                  <h1>Editar Área</h1>
                </div>

                <div className='Inputs'>
  <div className="input-container">
    <input required type="text" name="idarea" autoComplete="off" className="InputRegistro1" />
    <label className="LabelRegistro1">ID Área</label>
  </div>

  <div className="input-container">
    <input required type="text" name="area" autoComplete="off" className="InputRegistro2" />
    <label className="LabelRegistro2">Área</label>
  </div>

  <div className="input-container">
    <input required type="text" name="usuario" autoComplete="off" className="InputRegistro3" />
    <label className="LabelRegistro3">Usuario</label>
  </div>

  <div className="input-container">
    <input required type="password" name="constraseña" autoComplete="off" className="InputRegistro4" />
    <label className="LabelRegistro4">Contraseña</label>
  </div>
</div>

                <div className='BotonRegistro flex items-center justify-center'>
                  <button>
                    <a href="#"><span>Guardar</span></a> 
                  </button>
                </div>

              </div>  
            </div>
          )}



      </div>
    </div>
  )
}

export default AdminAreas