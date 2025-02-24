import React from 'react';
import { MATRIX_COLORS } from '../constants/colors';
import { IoClose } from 'react-icons/io5';
import { IoInformationCircle } from 'react-icons/io5';

export default function CountryModal({ countryName, onClose, isOpen }) {
  if (!countryName) return null;

  return (
    <>
      {isOpen ? (
        <div className="fixed top-0 right-0 bottom-0 w-1/3 min-w-[235px] sm:min-w-[275px] z-50">
          <div className="bg-black/70 backdrop-blur-sm h-[calc(100%-200px)] my-[100px] mr-4 rounded-2xl relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 cursor-pointer opacity-100 hover:opacity-70 transition-all duration-200"
              style={{ color: MATRIX_COLORS.LIGHT_GREEN }}
            >
              <IoClose size={26} className="sm:w-8 sm:h-8" />
            </button>
            <h2 
              className="text-[16px] sm:text-[22px] font-bold px-6 sm:px-8 py-6 break-words hyphens-auto pr-[65px]" 
              style={{ color: MATRIX_COLORS.LIGHT_GREEN }}
              lang="en"
            >
              {countryName}
            </h2>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p 
                className="text-base italic"
                style={{ color: MATRIX_COLORS.LIGHT_GREEN }}
              >
                no content yet...
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={onClose}
          className="group fixed top-[100px] right-4 flex items-center gap-2 z-50 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-xl cursor-pointer transition-all"
        >
          <div className="opacity-100 group-hover:opacity-70 transition-all duration-200">
            <span 
              className="text-[18px] font-bold"
              style={{ color: MATRIX_COLORS.LIGHT_GREEN }}
            >
              {countryName}
            </span>
          </div>
          <div className="opacity-100 group-hover:opacity-70 transition-all duration-200">
            <div style={{ color: MATRIX_COLORS.LIGHT_GREEN }}>
              <IoInformationCircle size={24} />
            </div>
          </div>
        </button>
      )}
    </>
  );
} 