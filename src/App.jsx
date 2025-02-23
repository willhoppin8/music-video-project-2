import { useState } from "react";
import GlobeScene from "./components/GlobeScene";
import { countries } from "./data/countries";

/**
 * Main App component that renders the UI and 3D globe.
 */
function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">

      {/* Country selection buttons */}
      <div className="flex gap-4 my-6">
        {countries.map((country) => (
          <button
            key={country.name}
            className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setSelectedCountry(country.name)}
          >
            {country.name}
          </button>
        ))}
      </div>

      {/* 3D Globe Scene */}
      <div className="w-full h-full">
        <GlobeScene selectedCountry={selectedCountry} />
      </div>
    </div>
  );
}

export default App;
