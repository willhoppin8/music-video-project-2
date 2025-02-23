import { countries } from "../data/countries";
import { MATRIX_COLORS } from "../constants/colors";

/**
 * Component for rendering country selection buttons
 */
export default function CountrySelector({ onCountrySelect, selectedCountry }) {
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

  return (
    <div className="fixed inset-0 z-10 overflow-hidden">
      <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
        <div className="min-h-full flex items-center">
          <div className="w-full pl-8 py-8">
            {Object.entries(groupedCountries).map(([letter, letterCountries], index) => (
              <div key={letter}>
                {/* Add divider if not the first group */}
                {index > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 opacity-0">▶</span>
                    <div className="h-px w-32 bg-white mt-[3px] mb-2" />
                  </div>
                )}
                {letterCountries.map((country) => (
                  <div key={country.name} className="flex items-center gap-2 mb-1">
                    <span 
                      style={country.name === selectedCountry ? { color: MATRIX_COLORS.LIGHT_GREEN } : { opacity: 0 }}
                      className="text-sm w-4"
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