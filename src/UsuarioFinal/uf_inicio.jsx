import React, { useState } from 'react'
import '../StylesUsuarioFinal/uf_inicio.css'

const UFInicio = () => {

  // Función de filtro de búsqueda
  const [filtroPublicacion, setfiltroPublicacion] = useState('');
  const handleInputChange = (e) => {
    setfiltroPublicacion(e.target.value);
  };

  const clearInput = () => {
    setfiltroPublicacion('');
  };

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
              <input required type="text" name="text" autoComplete="on" className="input" value={filtroPublicacion} onChange={handleInputChange} />
              <label className="enter-label">Realizar Busqueda . . .</label>
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

        {/* Boton de filtro */}
        <div>
          <button className="filter-uf">
            <svg viewBox="0 0 512 512" height="1em">
              <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
            </svg>
          </button>
        </div>

      </div>

      {/* Preguntas frecuentes */}
      <div className='w-[100%] h-[10%] flex items-center justify-center'>
        <button className='pf-uf'>
          Asistencia Rápida
        </button>
      </div>

      {/* Resultador */}
      <div className='w-[100%] h-[50%]'>

      </div>

    </div>
  )
}

export default UFInicio