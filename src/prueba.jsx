import React from 'react'

const Prueba = () => {
  return (
    <div className='w-screen h-screen bg-baseblanco'>
        <div className='w-screen h-[400px] bg-baseazul flex'>
            <div className='w-[50%] h-[100%] bg-basenaranja justify-center'>
                <div className='bg-baseazul h-[40%] flex justify-center'>
                    <img src="./public/Logo.png" className='w-[200px] h-[150px]' alt="Logo" />
                </div>

                <div className='bg-coloralternodos h-[60%]'>
                    <img src="https://ufd.mx/wp-content/uploads/2021/03/Sin-ti%C2%A6utulo-8.jpg" alt="" className='w-[200px] h-[200px]' />
                </div>
            </div>
            <div className='w-[50%]'>
                <div className='bg-baseblanco w-[100%] h-[50%]'>
                    derecha arriba
                </div>
                <div className='bg-coloralternotres  w-[100%] h-[50%]'>
                    derecha abajo
                </div>
            </div>
        </div>
    </div>
  )
}

export default Prueba