import { countries } from "../data/countries";
import { COLORS } from "../constants/colors";
import { useRef, useEffect, useState } from "react";

/**
 * Component for rendering country selection buttons
 */
export default function CountrySelector({ onCountrySelect, selectedCountry }) {
  const letterRefs = useRef({});
  const containerRef = useRef(null);
  const [showLetterMenu, setShowLetterMenu] = useState(true);
  const [letterSize, setLetterSize] = useState(24); // Default size for text-2xl

  // Helper function to get sortable name (removing 'The_' prefix)
  const getSortableName = (name) => {
    return name.startsWith('The_') ? name.slice(4) : name;
  };

  // Helper function to format country name for display (replace underscores with spaces)
  const formatCountryName = (name) => {
    const formattedName = name.replace(/_/g, ' ');
    const maxLength = "United States".length; // 13 characters
    return formattedName.length > maxLength 
      ? formattedName.slice(0, maxLength - 3) + '...'
      : formattedName;
  };

  // Sort and group countries by first letter (ignoring 'The_' prefix)
  const groupedCountries = countries
    .sort((a, b) => getSortableName(a.name).localeCompare(getSortableName(b.name)))
    .reduce((acc, country) => {
      // Use the first letter after 'The_' if present
      const firstLetter = getSortableName(country.name)[0].toUpperCase();
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

  const [currentLetter, setCurrentLetter] = useState('A');

  // Update current letter based on scroll position
  const updateCurrentLetter = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollPosition = container.scrollTop + 75; // Add offset to match scroll position
    let currentLetter = null;

    // Find the letter whose section is currently at the top
    for (const letter of Object.keys(groupedCountries)) {
      const element = letterRefs.current[letter];
      if (element && element.offsetTop <= scrollPosition) {
        currentLetter = letter;
      } else {
        break;
      }
    }

    setCurrentLetter(currentLetter);
  };

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateCurrentLetter);
      return () => container.removeEventListener('scroll', updateCurrentLetter);
    }
  }, []);

  const scrollToLetter = (letter) => {
    const element = letterRefs.current[letter];
    const container = containerRef.current;
    if (element && container) {
      const elementPosition = element.offsetTop;
      container.scrollTo({
        top: elementPosition - 75,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[300px] z-10 overflow-hidden country-selector-root">
      {/* Alphabet Navigation */}
      {showLetterMenu && (
        <div className="absolute left-4 top-0 bottom-0 w-8 flex items-center">
          <div className="w-full py-8 flex flex-col items-center">
            {Object.keys(groupedCountries).map((letter) => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                style={{
                  color: letter === currentLetter ? COLORS.SELECTED_TEXT : undefined,
                  fontSize: `${letterSize}px`,
                  height: `${letterSize + 8}px`, // Add 8px for margin
                }}
                className={`hover:text-[${COLORS.LIGHT_STATE}] text-[${COLORS.LIGHT_STATE}]/70 cursor-pointer w-6 flex items-center justify-center`}
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
        className={`absolute inset-0 overflow-y-auto scrollbar-hide ${showLetterMenu ? 'ml-12' : 'ml-2'}`}
      >
        <div className="min-h-full flex items-center">
          <div className={`w-full ${showLetterMenu ? 'pl-3 py-8' : 'pl-1 py-3'}`}>
            {Object.entries(groupedCountries).map(([letter, letterCountries], index) => (
              <div key={letter} ref={el => letterRefs.current[letter] = el}>
                {/* Add divider if not the first group */}
                {index > 0 && (
                  <div className="flex items-center">
                    <span className="w-4 opacity-0 mr-px">▶</span>
                    <div className={`h-px ${showLetterMenu ? 'w-32 mt-[3px] mb-2' : 'w-20 mt-[2px] mb-1'}`} style={{ backgroundColor: COLORS.LIGHT_STATE }} />
                  </div>
                )}
                {letterCountries.map((country) => (
                  <div key={country.name} className={`flex items-center ${showLetterMenu ? 'mb-1' : 'mb-0.5'}`}>
                    <span 
                      style={country.name === selectedCountry ? { color: COLORS.SELECTED_TEXT } : { opacity: 0 }}
                      className={`${showLetterMenu ? 'text-sm' : 'text-[10px]'} w-4 mr-px`}
                    >
                      ▶
                    </span>
                    <button
                      style={country.name === selectedCountry ? { color: COLORS.SELECTED_TEXT } : undefined}
                      className={`text-left transition-colors cursor-pointer ${showLetterMenu ? 'text-lg' : 'text-sm'}
                        ${country.completed ? `font-bold text-[${COLORS.LIGHT_STATE}]` : `text-[${COLORS.LIGHT_STATE}]/70`}`}
                      onClick={() => onCountrySelect(country.name)}
                    >
                      {formatCountryName(country.name)}
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