export default function LLMButton({ name, value,onClick, isSelected, label, isDisabled }) {
    const buttonClasses = `md:min-h-24 min-h-10 rounded-[10px] disabled:border-secondary-bg disabled:text-[#b5b5b5]
    ${isSelected ? 'bg-secondary' : 'border-2 border-solid border-secondary'}`;

    return (
        <button
            type="button"
            name="LLM"
            value={value}
            onClick={(event) => onClick(event)}
            className={buttonClasses}
            disabled={isDisabled}
        >
            {label}
        </button>
    );
}

export const llmOptions = [
    { value: 'hindi', label: 'Hindi' },
    { value: 'odia', label: 'Odia', disabled: false },
    { value: 'punjabi', label: 'Punjabi', disabled: false },
  ];
