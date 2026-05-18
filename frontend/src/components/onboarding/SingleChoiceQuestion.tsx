interface SingleChoiceQuestionProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function SingleChoiceQuestion({
  options,
  selected,
  onSelect,
}: SingleChoiceQuestionProps) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            checked={selected === option}
            onChange={() => onSelect(option)}
            className="w-4 h-4 accent-brand-red cursor-pointer"
          />
          <span className="text-gray-200 group-hover:text-white transition-colors">
            {option}
          </span>
        </label>
      ))}
    </div>
  );
}
