import { countries } from "../data/countries";
import { MATRIX_COLORS } from "../constants/colors";
import { useRef, useEffect, useState } from "react";

/**
 * Component for rendering country selection buttons
 */
export default function CountrySelector({ onCountrySelect, selectedCountry }) {
  const letterRefs = useRef({});
  const containerRef = useRef(null);
  const [showLetterMenu, setShowLetterMenu] = useState(true);
  const [letterSize, setLetterSize] = useState(24); // Default size for text-2xl

  // Sort and group countries by first letter
  const groupedCountries = countries
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((acc, country) => {
      const firstLetter = country.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(country);
      return acc;
    }, {});

  // Lock body scroll and handle wheel events
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleWheel = (e) => {
      e.preventDefault();
      if (containerRef.current) {
        containerRef.current.scrollTop += e.deltaY;
      }
    };

    // Add wheel event listener to the component
    const component = document.querySelector('.country-selector-root');
    if (component) {
      component.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      document.body.style.overflow = 'auto';
      if (component) {
        component.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Update letter menu visibility and size based on screen height
  useEffect(() => {
    const updateLetterMenu = () => {
      const screenHeight = window.innerHeight;
      setShowLetterMenu(screenHeight >= 675);

      // Calculate letter size based on available height
      // Maximum height is what it currently is (24px for text-2xl)
      // We want 30px margins on top and bottom, and 8px between letters
      const totalLetters = Object.keys(groupedCountries).length;
      const availableHeight = screenHeight - 60; // 30px margin top and bottom
      const maxLetterHeight = Math.min(24, (availableHeight - (totalLetters - 1) * 8) / totalLetters);
      setLetterSize(Math.max(12, maxLetterHeight)); // Minimum size of 12px
    };

    updateLetterMenu();
    window.addEventListener('resize', updateLetterMenu);
    return () => window.removeEventListener('resize', updateLetterMenu);
  }, [groupedCountries]);

  const scrollToLetter = (letter) => {
    const element = letterRefs.current[letter];
    const container = containerRef.current;
    if (element && container) {
      const elementPosition = element.offsetTop;
      container.scrollTo({
        top: elementPosition - 75,
        behavior: 'smooth'
      });
      
      // Auto-select the first country in this letter group
      const firstCountryInGroup = groupedCountries[letter][0];
      if (firstCountryInGroup) {
        onCountrySelect(firstCountryInGroup.name);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-hidden country-selector-root">
      {/* Alphabet Navigation */}
      {showLetterMenu && (
        <div className="absolute left-4 top-0 bottom-0 w-8 flex items-center">
          <div className="w-full py-8 flex flex-col items-center">
            {Object.keys(groupedCountries).map((letter) => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                style={{
                  color: selectedCountry?.startsWith(letter) ? MATRIX_COLORS.LIGHT_GREEN : undefined,
                  fontSize: `${letterSize}px`,
                  height: `${letterSize + 8}px`, // Add 8px for margin
                }}
                className="text-white/70 hover:text-white cursor-pointer w-6 flex items-center justify-center"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Country List */}
      <div 
        ref={containerRef} 
        className={`absolute inset-0 overflow-y-auto scrollbar-hide ${showLetterMenu ? 'ml-12' : 'ml-4'}`}
      >
        <div className="min-h-full flex items-center">
          <div className="w-full pl-3 py-8">
            {Object.entries(groupedCountries).map(([letter, letterCountries], index) => (
              <div key={letter} ref={el => letterRefs.current[letter] = el}>
                {/* Add divider if not the first group */}
                {index > 0 && (
                  <div className="flex items-center">
                    <span className="w-4 opacity-0 mr-px">▶</span>
                    <div className="h-px w-32 bg-white mt-[3px] mb-2" />
                  </div>
                )}
                {letterCountries.map((country) => (
                  <div key={country.name} className="flex items-center mb-1">
                    <span 
                      style={country.name === selectedCountry ? { color: MATRIX_COLORS.LIGHT_GREEN } : { opacity: 0 }}
                      className="text-sm w-4 mr-px"
                    >
                      ▶
                    </span>
                    <button
                      style={country.name === selectedCountry ? { color: MATRIX_COLORS.LIGHT_GREEN } : undefined}
                      className={`text-left text-lg transition-colors cursor-pointer
                        ${country.completed ? 'font-bold text-white' : 'text-white/70'}`}
                      onClick={() => onCountrySelect(country.name)}
                    >
                      {country.name}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 