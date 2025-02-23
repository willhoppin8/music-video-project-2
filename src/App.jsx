import { useState } from "react";
import GlobeScene from "./components/GlobeScene";
import CountrySelector from "./components/CountrySelector";
import SocialLinks from "./components/SocialLinks";

/**
 * Main App component that renders the UI and 3D globe.
 */
function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div className="w-screen h-screen relative">
      <div className="w-full h-full">
        <GlobeScene selectedCountry={selectedCountry} />
      </div>
      <CountrySelector onCountrySelect={setSelectedCountry} selectedCountry={selectedCountry} />
      <SocialLinks />
    </div>
  );
}

export default App;
