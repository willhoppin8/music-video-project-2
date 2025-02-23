import { countries } from "../data/countries";
import { MATRIX_COLORS } from "../constants/colors";

/**
 * Component for rendering country selection buttons
 */
export default function CountrySelector({ onCountrySelect, selectedCountry }) {
  return (
    <div className="fixed inset-0 z-10 overflow-hidden">
      <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
        <div className="min-h-full flex items-center">
          <div className="w-full pl-8 py-8">
            {countries.map((country) => (
              <div key={country.name} className="flex items-center gap-2 mb-2">
                <span 
                  style={country.name === selectedCountry ? { color: MATRIX_COLORS.LIGHT_GREEN } : { opacity: 0 }}
                  className="text-sm"
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
        </div>
      </div>
    </div>
  );
} 