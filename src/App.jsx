import { useState } from "react";
import GlobeScene from "./components/GlobeScene";
import CountrySelector from "./components/CountrySelector";

/**
 * Main App component that renders the UI and 3D globe.
 */
function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <CountrySelector onCountrySelect={setSelectedCountry} />
      <div className="w-full h-full">
        <GlobeScene selectedCountry={selectedCountry} />
      </div>
    </div>
  );
}

export default App;
