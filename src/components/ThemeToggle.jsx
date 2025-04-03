import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { COLORS } from '../constants/colors';

export default function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <>
      {/* Mobile: Right of search bar */}
      <div className="fixed top-[66px] right-[21px] md:hidden z-[110]">
        <button 
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:opacity-70 cursor-pointer"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <FaMoon 
              size={22}
              style={{ 
                color: COLORS.SELECTED_TEXT,
                filter: 'drop-shadow(0 0 3px rgba(248,213,87,0.7))'
              }}
            />
          ) : (
            <FaSun 
              size={22} 
              style={{ 
                color: COLORS.SELECTED_TEXT,
                filter: 'drop-shadow(0 0 3px rgba(248,213,87,0.7))'
              }}
            />
          )}
        </button>
      </div>

      {/* Desktop: Right corner of screen */}
      <div className="fixed top-[21px] right-[21px] hidden md:block z-[110]">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:opacity-70 cursor-pointer"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <FaMoon 
              size={24}
              style={{ 
                color: COLORS.SELECTED_TEXT,
                filter: 'drop-shadow(0 0 3px rgba(248,213,87,0.7))'
              }}
            />
          ) : (
            <FaSun 
              size={24} 
              style={{ 
                color: COLORS.SELECTED_TEXT,
                filter: 'drop-shadow(0 0 3px rgba(248,213,87,0.7))'
              }}
            />
          )}
        </button>
      </div>
    </>
  );
} 