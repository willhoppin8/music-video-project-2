import { useState, useEffect } from "react";
import { countries } from "../data/countries";
import { COLORS } from "../constants/colors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({ onCountrySelect, selectedCountry }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-6 left-6 z-50 search-container">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <FontAwesomeIcon icon={faSearch} className="text-[#F8D557]/50" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Take me to..."
          className="w-[200px] pl-10 pr-4 py-2 rounded-xl bg-[#140100] border border-[#F8D557]/30 text-[#F8D557] placeholder-[#F8D557]/50 focus:outline-none focus:border-[#F8D557]/70 focus:ring-0"
        />
      </div>

      {showResults && filteredCountries.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-[200px] max-h-[300px] overflow-y-auto rounded-xl bg-[#140100] border border-[#F8D557]/30 scrollbar-hide">
          {filteredCountries.map((country) => (
            <button
              key={country.name}
              onClick={() => {
                onCountrySelect(country.name);
                setSearchTerm("");
                setShowResults(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-[#F8D557]/10 transition-colors cursor-pointer ${
                country.name === selectedCountry ? 'text-[#F8D557]' : 'text-[#F8D557]/70'
              }`}
            >
              {country.name.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 