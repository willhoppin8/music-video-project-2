import { countries } from "../data/countries";

/**
 * Component for rendering country selection buttons
 */
export default function CountrySelector({ onCountrySelect }) {
  return (
    <div className="flex gap-4 my-6">
      {countries.map((country) => (
        <button
          key={country.name}
          className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => onCountrySelect(country.name)}
        >
          {country.name}
        </button>
      ))}
    </div>
  );
} 