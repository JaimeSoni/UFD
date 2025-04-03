import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login_ufd.css';
import axios from 'axios';

// Iconos
import { FaUserCircle } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md"; 

const LoginUFD = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Realizar la petición al backend para autenticar
      const response = await axios.post('http://localhost/UFD/src/login.php', {
        username,
        password
      });
      
      if (response.data.success) {
        // Guardar datos del usuario y estado de autenticación
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify({
          id: response.data.user.id,
          username: response.data.user.nombre_usuario,
          rol: response.data.user.rol,
          id_area: response.data.user.id_area
        }));
        
        // Redireccionar según el rol del usuario
        if (response.data.user.rol === 'Administrador') {
          navigate('/admin_inicio');
        } else if (response.data.user.rol === 'Alimentador') {
          navigate('/alimentador_inicio');
        }
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <div className='flex w-screen'>
        {/* Lado izquierdo con logo */}
        <div className='w-[50%] h-screen bg-baseazul flex items-center justify-center'>
          <img src="./public/Logo.png" alt="Logo" />
        </div>

        {/* Lado derecho con formulario de sesion */}
        <div className='w-[50%] h-screen bg-basenaranja flex items-center justify-center'>
          <form className="form_main" onSubmit={handleSubmit}>
            <p className="heading">Acceso UFD Sistema</p>
            {error && <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>}
            <div className="inputContainer">
              <FaUserCircle className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input 
                type="text" 
                className="inputField" 
                placeholder="Área" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="inputContainer">
              <MdOutlinePassword className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input 
                type="password" 
                className="inputField" 
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button id="button" type="submit">Acceder</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginUFD;