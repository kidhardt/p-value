import React, { useState } from 'react';

interface TooltipProps {
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative flex items-center ml-1.5"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-400 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {show && (
        <div className="absolute bottom-full mb-2 w-64 p-2 text-sm text-white bg-gray-800 rounded-md shadow-lg z-10">
          {text}
        </div>
      )}
    </div>
  );
};
