import { Check, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BaseLabelRequired } from "./base/BaseLabelRequired";

export default function FirstShotHit({
  firstShotHit,
  onFirstShotHitChange,
}: {
  firstShotHit: boolean;
  onFirstShotHitChange: (firstShotHit: boolean) => void;
}) {
  const { theme } = useTheme();

  return (
    <div className="pb-2">
      <BaseLabelRequired>First Shot Hit</BaseLabelRequired>
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => onFirstShotHitChange(true)}
          className={`relative p-1 rounded-xl border-2 transition-all ${
            firstShotHit === true
              ? theme === "dark"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-indigo-500 bg-indigo-50"
              : theme === "dark"
                ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <Check
            className={`w-5 h-5 mx-auto mb-2 ${firstShotHit === true ? "text-indigo-500" : theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}
          />
          <span className="text-sm font-medium">Yes</span>
          {firstShotHit === true && <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />}
        </button>

        <button
          type="button"
          onClick={() => onFirstShotHitChange(false)}
          className={`relative p-1 rounded-xl border-2 transition-all ${
            firstShotHit === false
              ? theme === "dark"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-indigo-500 bg-indigo-50"
              : theme === "dark"
                ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <X
            className={`w-5 h-5 mx-auto mb-2 ${firstShotHit === false ? "text-indigo-500" : theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}
          />
          <span className="text-sm font-medium">No</span>
          {firstShotHit === false && <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />}
        </button>
      </div>
    </div>
  );
}
