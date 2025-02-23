import { countries } from "../data/countries";
import { MATRIX_COLORS } from "../constants/colors";

export default function ProgressTracker() {
  const completedCount = countries.filter(country => country.completed).length;
  const totalCount = countries.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="fixed top-4 right-4 z-50 text-right">
      <div className="text-4xl font-normal text-white/70">
        <span className="text-[#00FF41] font-bold">{completedCount}</span>
        <span className="mx-0.5">/</span>
        {totalCount}
      </div>
      <div className="text-lg italic text-white/70">
        {percentage}% complete
      </div>
    </div>
  );
} 