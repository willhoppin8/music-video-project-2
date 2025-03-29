import { countries } from "../data/countries";
import { COLORS } from "../constants/colors";

export default function ProgressTracker() {
  const completedCount = countries.filter(country => country.completed).length;
  const totalCount = countries.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="fixed bottom-3.5 left-4 z-50">
      <div style={{ color: `${COLORS.LIGHT_STATE}70` }} className="text-3xl font-normal">
        <span style={{ color: COLORS.SELECTED_TEXT }} className="font-bold">{completedCount}</span>
        <span className="mx-0.5">/</span>
        {totalCount}
      </div>
      <div style={{ color: `${COLORS.LIGHT_STATE}70` }} className="text-sm italic">
        {percentage}% complete
      </div>
    </div>
  );
} 