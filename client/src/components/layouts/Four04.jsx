import React from 'react';
import pageNotFoundImg from '../../../public/404.1.png'
const Four04 = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-screen w-screen bg-zinc-900">
      {/* Left side: Image */}
      <div className="flex justify-center items-center w-full lg:w-1/2 h-1/2 lg:h-full">
        <img src={pageNotFoundImg} alt="404 Not Found" className="w-1/2 lg:w-10/12 object-contain" />
      </div>

      {/* Right side: Text */}
      <div className="flex flex-col gap-3 justify-center items-center w-full lg:w-1/2 text-center p-4 lg:p-10">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-blue-600">Awww...Don't Cry.</h1>
        <p className="text-xl lg:text-2xl text-gray-400 mb-2">It's just a  <span className='text-red-500'> 404 </span>Error!</p>
        <p className="text-md lg:text-lg text-zinc-400">
          What you are looking for may have been misplaced in long Term Memory.
        </p>
      </div>
    </div>
  );
};

export default Four04;
