import React, { useState } from 'react';
import { COLORS } from '../constants/colors';
import { IoClose } from 'react-icons/io5';
import { countries } from '../data/countries';
import { FaSpotify, FaGlobe } from 'react-icons/fa';

export default function CountryModal({ countryName, onClose }) {
  if (!countryName) return null;
  
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // Find the country data
  const country = countries.find(c => c.name === countryName);
  const isCompleted = country?.completed || false;

  // Helper function to format country name for display (replace underscores with spaces and make lowercase)
  const formatCountryName = (name) => {
    return name.replace(/_/g, ' ').toLowerCase();
  };
  
  // Handle video click
  const handleVideoClick = () => {
    setIsVideoOpen(true);
  };

  // Placeholder artist info (would come from your data source)
  const artistInfo = {
    name: "Rick Astley",
    date: "April 15, 2023",
    spotifyUrl: "https://open.spotify.com/artist/0gxyHStUsqpMadRV0Di1Qt",
    websiteUrl: "https://www.rickastley.co.uk/"
  };

  return (
    <>
      {/* Invisible overlay that blocks raycasting in the modal area */}
      <div className="fixed inset-0 w-full md:w-1/3 md:min-w-[235px] md:sm:min-w-[275px] md:right-0 md:top-0 md:bottom-0 z-[100] pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] md:h-[calc(100%-200px)] md:my-[100px] md:mr-4 pointer-events-auto" />
      </div>
      
      {/* Visible modal content */}
      <div 
        style={{ backgroundColor: `${COLORS.DARK_STATE}B3` }} 
        className="backdrop-blur-sm h-[50vh] md:h-[calc(100%-200px)] md:my-[100px] md:mr-4 rounded-t-2xl md:rounded-2xl fixed inset-x-0 bottom-0 md:inset-x-auto md:right-4 md:inset-y-0 md:my-auto md:w-[calc(33.333333%-1rem)] md:min-w-[235px] md:sm:min-w-[275px] pointer-events-auto modal-content z-[101] overflow-y-auto scrollbar-hide"
      >
        <button 
          onClick={onClose}
          className="absolute top-[21px] right-6 cursor-pointer opacity-100 hover:opacity-70 transition-all duration-200"
          style={{ color: COLORS.SELECTED_TEXT }}
        >
          <IoClose size={26} className="sm:w-8 sm:h-8" />
        </button>
        <h2 
          className="text-[18px] sm:text-[22px] font-bold px-4 sm:px-8 py-4 sm:py-6 break-words hyphens-auto pr-12 sm:pr-16 max-w-[calc(100%-24px)] sm:max-w-[calc(100%-40px)] whitespace-nowrap overflow-hidden text-ellipsis mt-[5px]" 
          style={{ color: COLORS.SELECTED_TEXT }}
          lang="en"
        >
          {formatCountryName(countryName)}
        </h2>
        
        {isCompleted ? (
          <div className="px-4 sm:px-8 flex flex-col">
            <div className="mb-4">
              {isVideoOpen ? (
                <div className="w-full rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                    title={`Open Mic Project - ${formatCountryName(countryName)}`}
                    className="w-full aspect-video rounded-lg" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div 
                  className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer drop-shadow-[0_0_8px_rgba(255,127,17,0.5)]"
                  onClick={handleVideoClick}
                >
                  <img 
                    src={`https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`} 
                    alt={`Open Mic Project - ${formatCountryName(countryName)}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div 
                      className="w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-l-[25px] border-l-[#F8D557] drop-shadow-[0_0_10px_rgba(248,213,87,0.7)] rounded-sm"
                      style={{ 
                        filter: 'url(#rounded-triangle)',
                        transform: 'scale(1.35)' 
                      }}
                    ></div>
                    <svg width="0" height="0">
                      <filter id="rounded-triangle">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="rounded-triangle" />
                      </filter>
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            {/* Artist info */}
            <div className="mb-4" style={{ color: COLORS.SELECTED_TEXT }}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-base font-bold">{artistInfo.name}</p>
                  <p className="text-sm italic">{artistInfo.date}</p>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={artistInfo.spotifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#F8D557] hover:opacity-70 transition-opacity"
                  >
                    <FaSpotify size={20} />
                  </a>
                  <a 
                    href={artistInfo.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#F8D557] hover:opacity-70 transition-opacity"
                  >
                    <FaGlobe size={20} />
                  </a>
                </div>
              </div>
            </div>
            
            {/* TikTok videos */}
            <p className="text-sm font-semibold mb-2" style={{ color: COLORS.SELECTED_TEXT }}>Behind the scenes</p>
            <div className="grid grid-cols-3 gap-2 mb-[20px]">
              {[1, 2, 3].map((index) => (
                <a 
                  key={index}
                  href="https://www.tiktok.com/@rickastleyofficial/video/7477170509688442134?is_from_webapp=1&sender_device=pc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-black drop-shadow-[0_0_8px_rgba(255,127,17,0.5)]">
                    <img 
                      src={`https://picsum.photos/150/300?random=${index}`} 
                      alt={`TikTok ${index}`}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex justify-center items-center">
                      <div 
                        className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-[#F8D557] drop-shadow-[0_0_10px_rgba(248,213,87,0.7)] rounded-sm"
                        style={{ 
                          filter: 'url(#rounded-triangle-small)',
                          transform: 'scale(1.35)' 
                        }}
                      ></div>
                    </div>
                  </div>
                </a>
              ))}
              <svg width="0" height="0">
                <filter id="rounded-triangle-small">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="rounded-triangle-small" />
                </filter>
              </svg>
            </div>
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p 
              className="text-base italic"
              style={{ color: COLORS.SELECTED_TEXT }}
            >
              coming soon...
            </p>
          </div>
        )}
      </div>
    </>
  );
} 