import React from 'react';
import { COLORS } from '../constants/colors';
import { IoClose } from 'react-icons/io5';

export default function AboutModal({ onClose }) {
  return (
    <>
      {/* Invisible overlay that blocks raycasting in the modal area */}
      <div className="fixed inset-0 w-full md:w-[42%] md:min-w-[235px] md:sm:min-w-[275px] md:right-0 md:top-0 md:bottom-0 z-[100] pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] md:h-[calc(100%-200px)] md:my-[100px] md:mr-4 pointer-events-auto" />
      </div>
      
      {/* Visible modal content */}
      <div 
        style={{ backgroundColor: `${COLORS.DARK_STATE}CC` }} 
        className="backdrop-blur-sm h-[50vh] md:h-[calc(100%-200px)] md:my-[100px] md:mr-4 rounded-t-2xl md:rounded-2xl fixed inset-x-0 bottom-0 md:inset-x-auto md:right-4 md:inset-y-0 md:my-auto md:w-[calc(42%-1rem)] md:min-w-[235px] md:sm:min-w-[275px] pointer-events-auto modal-content z-[101] overflow-hidden"
      >
        {/* Fixed header with gradient */}
        <div className="absolute top-0 left-0 right-0 z-10" style={{ backgroundColor: `${COLORS.DARK_STATE}CC` }}>
          <div className="relative pt-1">
            <button 
              onClick={onClose}
              className="absolute top-[17px] right-6 cursor-pointer opacity-100 hover:opacity-70 transition-all duration-200 z-20"
              style={{ color: COLORS.SELECTED_TEXT }}
            >
              <IoClose size={24} className="sm:w-6 sm:h-6" />
            </button>
            <h2 
              className="text-[18px] sm:text-[20px] font-bold px-4 sm:px-8 pb-1 mt-[10px] break-words hyphens-auto pr-12 sm:pr-16 max-w-[calc(100%-24px)] sm:max-w-[calc(100%-40px)] lowercase" 
              style={{ color: COLORS.SELECTED_TEXT }}
            >
              about the o.m.p.
            </h2>
          </div>
          <div 
            className="h-[30px] w-full absolute left-0 right-0" 
            style={{ 
              background: `linear-gradient(to bottom, ${COLORS.DARK_STATE}CC 0%, ${COLORS.DARK_STATE}00 100%)`,
              bottom: '-30px'
            }}
          />
        </div>
        
        {/* Scrollable content */}
        <div className="h-full overflow-y-auto scrollbar-hide pt-[30px] relative">
          <div className="px-4 sm:px-8 flex flex-col pb-[40px]">
            <p 
              className="text-sm sm:text-base mb-4 mt-10"
              style={{ color: COLORS.SELECTED_TEXT }}
            >
              the <span className="font-bold">open mic project</span> is creating a global collection of original music videos, producing one video in every country and select territories around the world.
            </p>
            <p 
              className="text-sm sm:text-base mb-4"
              style={{ color: COLORS.SELECTED_TEXT }}
            >
              each video highlights a local artist or group, celebrating their unique creativity and musical style.
            </p>
            <p 
              className="text-sm sm:text-base"
              style={{ color: COLORS.SELECTED_TEXT }}
            >
              the mission is to build a diverse, authentic showcase of talent that connects people worldwide through music.
            </p>
            
            <p 
              className="text-xs sm:text-sm text-center mt-6 mb-3"
              style={{ color: COLORS.SELECTED_TEXT }}
            >
              by <a href="https://www.osmo.vc/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">osmo</a>
            </p>
          </div>
        </div>
        
        {/* Bottom gradient overlay */}
        <div 
          className="h-[45px] w-full absolute left-0 right-0 bottom-0 z-10" 
          style={{ 
            background: `linear-gradient(to top, ${COLORS.DARK_STATE}CC 0%, ${COLORS.DARK_STATE}00 100%)`,
            pointerEvents: 'none'
          }}
        />
      </div>
    </>
  );
} 