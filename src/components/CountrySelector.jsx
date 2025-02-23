import { countries } from "../data/countries";
import { MATRIX_COLORS } from "../constants/colors";
import { useRef } from "react";

/**
 * Component for rendering country selection buttons
 */
export default function CountrySelector({ onCountrySelect, selectedCountry }) {
  const letterRefs = useRef({});
  const containerRef = useRef(null);

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
    <div className="fixed inset-0 z-10 overflow-hidden">
      {/* Alphabet Navigation */}
      <div className="absolute left-6 top-0 bottom-0 w-6 flex items-center">
        <div className="w-full py-8 flex flex-col items-center">
          {Object.keys(groupedCountries).map((letter) => (
            <button
              key={letter}
              onClick={() => scrollToLetter(letter)}
              className="text-2xl text-white/70 hover:text-white mb-2 cursor-pointer"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Country List */}
      <div ref={containerRef} className="absolute inset-0 overflow-y-auto scrollbar-hide ml-9">
        <div className="min-h-full flex items-center">
          <div className="w-full pl-6 py-8">
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