import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='min-h-screen flex justify-center items-center bg-white'>
       <div className='max-w-xl w-full'>
         {children}
       </div>
    </div>
  )
}

export default layout