import { countries } from "../data/countries";

/**
 * Component for rendering country selection buttons
 */
export default function CountrySelector({ onCountrySelect, selectedCountry }) {
  return (
    <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
      {countries.map((country) => (
        <button
          key={country.name}
          className={`text-left text-lg transition-colors cursor-pointer
            ${country.completed ? 'font-bold text-white' : 'text-white/70'}`}
          onClick={() => onCountrySelect(country.name)}
        >
          {country.name}
        </button>
      ))}
    </div>
  );
} 