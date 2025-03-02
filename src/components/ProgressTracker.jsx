import { countries } from "../data/countries";
import { COLORS } from "../constants/colors";

export default function ProgressTracker() {
  const completedCount = countries.filter(country => country.completed).length;
  const totalCount = countries.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="fixed top-4 right-4 z-50 text-right">
      <div style={{ color: `${COLORS.LIGHT_STATE}70` }} className="text-4xl font-normal">
        <span style={{ color: COLORS.SELECTED }} className="font-bold">{completedCount}</span>
        <span className="mx-0.5">/</span>
        {totalCount}
      </div>
      <div style={{ color: `${COLORS.LIGHT_STATE}70` }} className="text-lg italic">
        {percentage}% complete
      </div>
    </div>
  );
} 