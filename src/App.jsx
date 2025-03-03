import { useState } from "react";
import GlobeScene from "./components/GlobeScene";
import CountrySelector from "./components/CountrySelector";
import SocialLinks from "./components/SocialLinks";
import ProgressTracker from "./components/ProgressTracker";
import CountryModal from "./components/CountryModal";

/**
 * Main App component that renders the UI and 3D globe.
 */
function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPreference, setModalPreference] = useState(true); // true = auto-open, false = keep closed

  const handleCountrySelect = (country) => {
    // If clicking the same country, unfocus it
    if (selectedCountry === country) {
      setSelectedCountry(null);
      setIsModalOpen(false);
    } else {
      // If clicking a different country, select it
      setSelectedCountry(country);
      // Only open modal if user preference is to show it
      if (modalPreference) {
        setIsModalOpen(true);
      }
    }
  };

  const toggleModal = () => {
    const newIsOpen = !isModalOpen;
    setIsModalOpen(newIsOpen);
    // Update modal preference when user manually toggles
    setModalPreference(newIsOpen);
  };

  return (
    <div className="w-screen h-screen relative">
      <div className="w-full h-full">
        <GlobeScene selectedCountry={selectedCountry} onCountrySelect={handleCountrySelect} />
      </div>
      <CountrySelector onCountrySelect={handleCountrySelect} selectedCountry={selectedCountry} />
      <ProgressTracker />
      <SocialLinks />
      <CountryModal 
        countryName={selectedCountry} 
        onClose={toggleModal}
        isOpen={isModalOpen}
      />
    </div>
  );
}

export default App;
