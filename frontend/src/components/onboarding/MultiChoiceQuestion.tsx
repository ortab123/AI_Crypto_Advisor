import { Input } from "../common/Input";

interface MultiChoiceQuestionProps {
  options: string[];
  selected: string[];
  customAsset: string;
  onToggle: (option: string) => void;
  onCustomAsset: (value: string) => void;
}

export function MultiChoiceQuestion({
  options,
  selected,
  customAsset,
  onToggle,
  onCustomAsset,
}: MultiChoiceQuestionProps) {
  const showCustomInput = selected.includes("Other...");

  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className="w-4 h-4 accent-brand-red cursor-pointer"
          />
          <span className="text-gray-200 group-hover:text-white transition-colors">
            {option}
          </span>
        </label>
      ))}
      {showCustomInput && (
        <div className="mt-1 ml-7">
          <Input
            placeholder="e.g. ADA, DOT,(max 3 coins, comma-separated)"
            value={customAsset}
            onChange={(e) => onCustomAsset(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
