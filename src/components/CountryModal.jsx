import React from 'react';
import { MATRIX_COLORS } from '../constants/colors';
import { IoClose } from 'react-icons/io5';

export default function CountryModal({ countryName, onClose }) {
  if (!countryName) return null;

  return (
    <div className="fixed top-0 right-0 bottom-0 w-1/3 min-w-[275px] z-50">
      <div className="bg-black/70 backdrop-blur-sm h-[calc(100%-200px)] my-[100px] mr-4 rounded-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 cursor-pointer hover:text-opacity-70 transition-opacity"
          style={{ color: MATRIX_COLORS.LIGHT_GREEN }}
        >
          <IoClose size={32} />
        </button>
        <h2 
          className="text-[22px] font-bold px-8 py-6 break-words hyphens-auto pr-[65px]" 
          style={{ color: MATRIX_COLORS.LIGHT_GREEN }}
          lang="en"
        >
          {countryName}
        </h2>
      </div>
    </div>
  );
} 