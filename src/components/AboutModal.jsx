import React from 'react';
import { COLORS } from '../constants/colors';
import { IoClose } from 'react-icons/io5';

export default function AboutModal({ onClose }) {
  return (
    <>
      {/* Invisible overlay that blocks raycasting in the modal area */}
      <div className="fixed inset-0 w-full md:w-1/3 md:min-w-[235px] md:sm:min-w-[275px] md:right-0 md:top-0 md:bottom-0 z-[100] pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[33.33vh] md:h-[calc(100%-200px)] md:my-[100px] md:mr-4 pointer-events-auto" />
      </div>
      
      {/* Visible modal content */}
      <div 
        style={{ backgroundColor: `${COLORS.DARK_STATE}B3` }} 
        className="backdrop-blur-sm h-[33.33vh] md:h-[calc(100%-200px)] md:my-[100px] md:mr-4 rounded-t-2xl md:rounded-2xl fixed inset-x-0 bottom-0 md:inset-x-auto md:right-4 md:inset-y-0 md:my-auto md:w-[calc(33.333333%-1rem)] md:min-w-[235px] md:sm:min-w-[275px] pointer-events-auto modal-content z-[101]"
      >
        <button 
          onClick={onClose}
          className="absolute top-[21px] right-6 cursor-pointer opacity-100 hover:opacity-70 transition-all duration-200"
          style={{ color: COLORS.SELECTED_TEXT }}
        >
          <IoClose size={26} className="sm:w-8 sm:h-8" />
        </button>
        <h2 
          className="text-[18px] sm:text-[22px] font-bold px-4 sm:px-8 py-4 sm:py-6 break-words hyphens-auto pr-12 sm:pr-16 max-w-[calc(100%-24px)] sm:max-w-[calc(100%-40px)] mt-[5px]" 
          style={{ color: COLORS.SELECTED_TEXT }}
        >
          about the project
        </h2>
        <div className="px-4 sm:px-8 overflow-y-auto h-[calc(100%-80px)]">
          <p 
            className="text-base mb-4"
            style={{ color: COLORS.SELECTED_TEXT }}
          >
            the <span className="font-bold">open mic project</span> aims to create music videos in every country around the world.
          </p>
          <p 
            className="text-base"
            style={{ color: COLORS.SELECTED_TEXT }}
          >
            featuring local artists and showcasing diverse musical traditions, this global initiative connects cultures through the universal language of music.
          </p>
        </div>
      </div>
    </>
  );
} 