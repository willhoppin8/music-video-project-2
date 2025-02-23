import { FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa';

const SocialLinks = () => {
  return (
    <div className="fixed bottom-4 right-4 flex gap-4 z-50">
      <a
        href="https://www.tiktok.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-white/70 transition-opacity cursor-pointer"
      >
        <FaTiktok size={24} />
      </a>
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-white/70 transition-opacity cursor-pointer"
      >
        <FaInstagram size={24} />
      </a>
      <a
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-white/70 transition-opacity cursor-pointer"
      >
        <FaYoutube size={24} />
      </a>
    </div>
  );
};

export default SocialLinks; 