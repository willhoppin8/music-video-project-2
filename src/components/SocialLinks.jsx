import { FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa';
import { COLORS } from '../constants/colors';

const SocialLinks = () => {
  return (
    <div className="fixed bottom-4 right-4 flex gap-4 z-50">
      <a
        href="https://www.tiktok.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-70 transition-opacity cursor-pointer"
        style={{ color: COLORS.SELECTED_TEXT }}
      >
        <FaTiktok size={24} />
      </a>
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-70 transition-opacity cursor-pointer"
        style={{ color: COLORS.SELECTED_TEXT }}
      >
        <FaInstagram size={24} />
      </a>
      <a
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-70 transition-opacity cursor-pointer"
        style={{ color: COLORS.SELECTED_TEXT }}
      >
        <FaYoutube size={24} />
      </a>
    </div>
  );
};

export default SocialLinks; 