import { useState, useEffect } from "react";
import { countries } from "../data/countries";
import { COLORS } from "../constants/colors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({ onCountrySelect, selectedCountry, onShowAbout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Calculate country stats
  const totalCount = countries.length;
  const completedCount = countries.filter(country => country.completed).length;

  // Helper function to format country name for display (replace underscores with spaces and make lowercase)
  const formatCountryName = (name) => {
    return name.replace(/_/g, ' ').toLowerCase();
  };

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Filter out the selected country from the initial list
      setFilteredCountries(countries.filter(country => country.name !== selectedCountry));
    } else {
      const filtered = countries.filter(country =>
        formatCountryName(country.name).includes(searchTerm.toLowerCase()) && 
        country.name !== selectedCountry
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, selectedCountry]); // Also depend on selectedCountry

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
    <div className="fixed top-[21px] left-[21px] right-[75px] md:right-auto md:w-[300px] z-[110] search-container" onClick={(e) => e.stopPropagation()}>
      {/* Project stats text */}
      <div className="mb-3 text-center md:text-left md:pl-[5px]">
        <p style={{ color: COLORS.SELECTED_TEXT }} className="text-[17px] max-[500px]:text-[17px] min-[500px]:text-xl md:text-[28px] font-medium">
          <span className="md:block">{totalCount} countries.</span>
          <span className="md:inline md:block"><span className="md:hidden mr-[4px]"></span>{totalCount} music videos.</span>
        </p>
      </div>
      
      <div className="relative mt-1 md:mt-4">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <FontAwesomeIcon icon={faSearch} className="text-[#F8D557]/50" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          onClick={(e) => e.stopPropagation()}
          placeholder="take me to..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#140100]/45 backdrop-blur-sm border border-[#F8D557]/30 text-[#F8D557] placeholder-[#F8D557]/50 focus:outline-none focus:border-[#F8D557]/70 focus:ring-0"
        />
      </div>

      {showResults && filteredCountries.length > 0 && (
        <div className="absolute top-full left-0 right-0 md:right-auto md:w-[300px] mt-3 max-h-[240px] md:max-h-[300px] overflow-y-auto rounded-xl bg-[#140100]/60 backdrop-blur-sm border border-[#F8D557]/30 scrollbar-hide" onClick={(e) => e.stopPropagation()}>
          {filteredCountries.map((country) => (
            <button
              key={country.name}
              onClick={(e) => {
                e.stopPropagation();
                onCountrySelect(country.name);
                setSearchTerm("");
                setShowResults(false);
              }}
              className={`w-full px-4 py-1 md:py-2 text-left hover:bg-[#F8D557]/10 transition-colors cursor-pointer ${
                country.name === selectedCountry ? 'text-[#F8D557]' : 'text-[#F8D557]/70'
              }`}
            >
              {formatCountryName(country.name)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 