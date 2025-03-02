import React from 'react';
import { COLORS } from '../constants/colors';
import { IoClose } from 'react-icons/io5';
import { IoInformationCircle } from 'react-icons/io5';

export default function CountryModal({ countryName, onClose, isOpen }) {
  if (!countryName) return null;

  // Helper function to format country name for display (replace underscores with spaces)
  const formatCountryName = (name) => {
    return name.replace(/_/g, ' ');
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed top-0 right-0 bottom-0 w-1/3 min-w-[235px] sm:min-w-[275px] z-50">
          <div style={{ backgroundColor: `${COLORS.DARK_STATE}B3` }} className="backdrop-blur-sm h-[calc(100%-200px)] my-[100px] mr-4 rounded-2xl relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 cursor-pointer opacity-100 hover:opacity-70 transition-all duration-200"
              style={{ color: COLORS.SELECTED }}
            >
              <IoClose size={26} className="sm:w-8 sm:h-8" />
            </button>
            <h2 
              className="text-[16px] sm:text-[22px] font-bold px-6 sm:px-8 py-6 break-words hyphens-auto pr-[65px]" 
              style={{ color: COLORS.SELECTED }}
              lang="en"
            >
              {formatCountryName(countryName)}
            </h2>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p 
                className="text-base italic"
                style={{ color: COLORS.SELECTED }}
              >
                no content yet...
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={onClose}
          style={{ backgroundColor: `${COLORS.DARK_STATE}B3` }}
          className="group fixed top-[100px] right-4 z-50 backdrop-blur-sm px-4 py-2 rounded-xl cursor-pointer transition-all min-w-[235px] sm:min-w-[275px] max-w-[33%]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="opacity-100 group-hover:opacity-70 transition-all duration-200 overflow-hidden mr-2 flex-1">
              <span 
                className="text-[18px] font-bold truncate block"
                style={{ color: COLORS.SELECTED }}
              >
                {formatCountryName(countryName)}
              </span>
            </div>
            <div className="opacity-100 group-hover:opacity-70 transition-all duration-200 flex-shrink-0">
              <div style={{ color: COLORS.SELECTED }}>
                <IoInformationCircle size={24} />
              </div>
            </div>
          </div>
        </button>
      )}
    </>
  );
} 