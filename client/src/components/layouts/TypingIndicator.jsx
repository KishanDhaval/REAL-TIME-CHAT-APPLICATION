import React from "react";

const TypingIndicator = ({ isTyping }) => {
  return (
    <div className="typing-indicator bg-zinc-300 px-4">
      {isTyping && (
        <div className="flex items-center space-x-1">
          <span className="dot bg-gray-500"></span>
          <span className="dot bg-gray-500"></span>
          <span className="dot bg-gray-500"></span>
        </div>
      )}
      <style jsx>{`
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: blink 1.4s infinite both;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%,
          80%,  
          100% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
