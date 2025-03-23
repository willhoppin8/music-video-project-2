import React from 'react';
import { COLORS } from '../constants/colors';
import { IoClose } from 'react-icons/io5';

export default function CountryModal({ countryName, onClose }) {
  if (!countryName) return null;

  // Helper function to format country name for display (replace underscores with spaces)
  const formatCountryName = (name) => {
    return name.replace(/_/g, ' ');
  };

  return (
    <>
      {/* Invisible overlay that blocks raycasting in the modal area */}
      <div className="fixed inset-0 w-full md:w-1/3 md:min-w-[235px] md:sm:min-w-[275px] md:right-0 md:top-0 md:bottom-0 z-[100]">
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] md:h-[calc(100%-200px)] md:my-[100px] md:mr-4 pointer-events-auto" />
      </div>
      
      {/* Visible modal content */}
      <div className="fixed inset-0 w-full md:w-1/3 md:min-w-[235px] md:sm:min-w-[275px] md:right-0 md:top-0 md:bottom-0 z-[101] pointer-events-none">
        <div 
          style={{ backgroundColor: `${COLORS.DARK_STATE}B3` }} 
          className="backdrop-blur-sm h-[50vh] md:h-[calc(100%-200px)] md:my-[100px] md:mr-4 rounded-t-2xl md:rounded-2xl absolute bottom-0 left-0 right-0 md:relative md:bottom-auto md:top-0 pointer-events-auto modal-content"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 cursor-pointer opacity-100 hover:opacity-70 transition-all duration-200"
            style={{ color: COLORS.SELECTED_TEXT }}
          >
            <IoClose size={26} className="sm:w-8 sm:h-8" />
          </button>
          <h2 
            className="text-[22px] sm:text-[22px] font-bold px-6 sm:px-8 py-6 break-words hyphens-auto pr-12 sm:pr-16 max-w-[calc(100%-24px)] sm:max-w-[calc(100%-40px)]" 
            style={{ color: COLORS.SELECTED_TEXT }}
            lang="en"
          >
            {formatCountryName(countryName)}
          </h2>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p 
              className="text-base italic"
              style={{ color: COLORS.SELECTED_TEXT }}
            >
              no content yet...
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 