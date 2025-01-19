import React from 'react';

const Loader = () => {
  return (
    <div className={`flex m-auto`}>
      <div className="w-3 h-3 mx-1 bg-teal-500 rounded-full animate-bounce delay-0"></div>
      <div className="w-3 h-3 mx-1 bg-teal-500 rounded-full animate-bounce delay-200"></div>
      <div className="w-3 h-3 mx-1 bg-teal-500 rounded-full animate-bounce delay-400"></div>
      <div className="w-3 h-3 mx-1 bg-teal-500 rounded-full animate-bounce delay-500"></div>

      <style jsx>{`
        @keyframes bounce {
          to {
            transform: translateY(-20px);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s infinite alternate;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Loader;
