import { useState } from "react";
import GlobeScene from "./components/GlobeScene";
import SearchBar from "./components/SearchBar";
import SocialLinks from "./components/SocialLinks";
import ProgressTracker from "./components/ProgressTracker";
import CountryModal from "./components/CountryModal";
import AboutModal from "./components/AboutModal";
import { COLORS } from "./constants/colors";

/**
 * Main App component that renders the UI and 3D globe.
 */
function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleCountrySelect = (country) => {
    // Close About modal if open
    if (showAboutModal) {
      setShowAboutModal(false);
    }
    
    // If clicking the same country, unfocus it
    if (selectedCountry === country) {
      setSelectedCountry(null);
    } else {
      // If clicking a different country, select it
      setSelectedCountry(country);
    }
  };

  const handleShowAbout = () => {
    // Close Country modal if open
    if (selectedCountry) {
      setSelectedCountry(null);
    }
    setShowAboutModal(true);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <GlobeScene selectedCountry={selectedCountry} onCountrySelect={handleCountrySelect} />
      </div>
      <SearchBar 
        onCountrySelect={handleCountrySelect} 
        selectedCountry={selectedCountry}
        onShowAbout={handleShowAbout}
        showAboutModal={showAboutModal}
      />
      <ProgressTracker />
      <SocialLinks />
      
      {/* About button at bottom center */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-[50]">
        <button
          onClick={handleShowAbout}
          style={{ color: COLORS.SELECTED_TEXT }}
          className="text-sm underline cursor-pointer"
        >
          about
        </button>
      </div>
      
      {selectedCountry && (
        <CountryModal 
          countryName={selectedCountry} 
          onClose={() => setSelectedCountry(null)}
        />
      )}
      
      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}
    </div>
  );
}

export default App;
