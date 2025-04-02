import React, { useState, useEffect } from 'react'
import '../StylesAlimentador/alimentador_recopilacion.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios if not already installed

{/* Iconos Menu */ }
import { FaHome } from "react-icons/fa";
import { BiSolidCollection } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

// Iconos Recopilacion
import { VscFileSubmodule } from "react-icons/vsc";
import { GrDocumentUpdate } from "react-icons/gr";
import { CiLink } from "react-icons/ci";
import { TbTextRecognition } from "react-icons/tb";

const AlimentadorRecopilacion = () => {
  const navigate = useNavigate();
  
  // Estado para almacenar los datos del dashboard
  const [dashboardData, setDashboardData] = useState({
    publicaciones: 0,
    categorias: 0,
    temas: 0,
    documentos: 0,
    enlaces: 0,
    palabrasClave: 0
  });
  
  // Estado para controlar cuando está cargando
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Función para obtener los datos del dashboard
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener el conteo de artículos públicos
        const publicArticlesResponse = await axios.get('http://localhost/UFD/src/BackEnd/obtener_publicaciones.php');
        const publicArticlesCount = publicArticlesResponse.data.count || 0;
        
        // Obtener el conteo de artículos privados
        const privateArticlesResponse = await axios.get('http://localhost/UFD/src/BackEnd/obtener_publicaciones_privadas.php');
        const privateArticlesCount = privateArticlesResponse.data.count || 0;
        
        // Sumar ambos tipos de artículos para el total de publicaciones
        const totalPublications = publicArticlesCount + privateArticlesCount;
        
        // Actualizar el estado con los datos obtenidos
        setDashboardData(prev => ({
          ...prev,
          publicaciones: totalPublications
          // Nota: Aquí deberías agregar llamadas similares para las otras estadísticas
          // (categorias, temas, documentos, enlaces, palabrasClave)
        }));
        
        setIsLoading(false);
        
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
        setIsLoading(false);
      }
    };

    // Obtener datos al montar el componente
    fetchDashboardData();
    
    // Opcional: actualizar datos periódicamente
    const intervalId = setInterval(fetchDashboardData, 60000); // cada minuto
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  // Definición de las tarjetas del dashboard para reutilización
  const dashboardCards = [
    {
      id: 'publicaciones',
      icon: <IoMdCloudUpload className='w-[50px] h-[50px] ml-[65px] text-basenaranja' />,
      title: 'Publicaciones',
      value: dashboardData.publicaciones,
      text: 'publicaciones actualmente'
    },
    {
      id: 'categorias',
      icon: <TbCategoryPlus className='w-[40px] h-[40px] ml-[58px] text-basenaranja' />,
      title: 'Categorías',
      value: dashboardData.categorias,
      text: 'categorías actualmente'
    },
    {
      id: 'temas',
      icon: <VscFileSubmodule className='w-[40px] h-[40px] ml-[45px] text-basenaranja' />,
      title: 'Temas',
      value: dashboardData.temas,
      text: 'temas actualmente'
    },
    {
      id: 'documentos',
      icon: <GrDocumentUpdate className='w-[35px] h-[35px] ml-[65px] text-basenaranja' />,
      title: 'Documentos',
      value: dashboardData.documentos,
      text: 'documentos actualmente'
    },
    {
      id: 'enlaces',
      icon: <CiLink className='w-[40px] h-[40px] ml-[40px] text-basenaranja' />,
      title: 'Enlaces',
      value: dashboardData.enlaces,
      text: 'enlaces actualmente'
    },
    {
      id: 'palabrasClave',
      icon: <TbTextRecognition className='w-[40px] h-[40px] ml-[70px] text-basenaranja' />,
      title: 'Palabras Clave',
      value: dashboardData.palabrasClave,
      text: 'palabras clave actualmente'
    }
  ];

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

            <Link to={'/alimentador_login'} onClick={handleLogout} className="action" type="button">
              <RiLogoutCircleLine className="action-icon" color="#353866" />
              <span className="action-content" data-content="Salir" />
            </Link>

          </div>
        </div>

        <div className='w-[94%] h-screen'>
          {/* Titulo */}
          <div className='titulo-recopilacion w-[100%] h-[15%]'>
            <h1 className='titulo-recopilaciones'>Recopilaciones del Usuario</h1>
          </div>

          {/* Contenido del Dashboard */}
          {isLoading ? (
            <div className="w-full h-[80%] flex items-center justify-center">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="w-full h-[80%]">
              {/* Primera fila de tarjetas */}
              <div className='w-[100%] h-[40%] flex justify-center'>
                <div className="cards w-[75%] h-[65%] mt-10">
                  {dashboardCards.slice(0, 3).map(card => (
                    <div key={card.id} className="card resumen">
                      <div>
                        {card.icon}
                        <p className="tip">{card.title}</p>
                        <p className="second-text">{card.value} {card.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Segunda fila de tarjetas */}
              <div className='w-[100%] h-[40%] flex justify-center'>
                <div className="cards w-[75%] h-[65%] mt-10">
                  {dashboardCards.slice(3, 6).map(card => (
                    <div key={card.id} className="card resumen">
                      <div>
                        {card.icon}
                        <p className="tip">{card.title}</p>
                        <p className="second-text">{card.value} {card.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlimentadorRecopilacion