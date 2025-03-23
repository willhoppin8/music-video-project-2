import { useState } from "react";
import GlobeScene from "./components/GlobeScene";
import SearchBar from "./components/SearchBar";
import SocialLinks from "./components/SocialLinks";
import ProgressTracker from "./components/ProgressTracker";
import CountryModal from "./components/CountryModal";

/**
 * Main App component that renders the UI and 3D globe.
 */
function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (country) => {
    // If clicking the same country, unfocus it
    if (selectedCountry === country) {
      setSelectedCountry(null);
    } else {
      // If clicking a different country, select it
      setSelectedCountry(country);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <GlobeScene selectedCountry={selectedCountry} onCountrySelect={handleCountrySelect} />
      </div>
      <SearchBar onCountrySelect={handleCountrySelect} selectedCountry={selectedCountry} />
      <ProgressTracker />
      <SocialLinks />
      <CountryModal 
        countryName={selectedCountry} 
        onClose={() => setSelectedCountry(null)}
      />
    </div>
  );
}

export default App;
