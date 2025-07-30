import type { ChangeEvent } from "react";

interface TextAreaWithCounterProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  required?: boolean;
}

const TextAreaWithCounter = ({
  id,
  value,
  onChange,
  maxLength,
  placeholder,
  required,
}: TextAreaWithCounterProps) => {
  // Count line breaks as \r\n (2 characters) to match Ruby/Rails backend
  const lineBreaks = (value.match(/\n/g) ?? []).length;
  const characterCount = value.length + lineBreaks;
  const isNearLimit = characterCount >= maxLength * 0.8;
  const isAtLimit = characterCount >= maxLength;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newLineBreaks = (newValue.match(/\n/g) ?? []).length;
    const newCharacterCount = newValue.length + newLineBreaks;

    // Only update if within limit
    if (newCharacterCount <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        rows={5}
        className="input-field min-h-[120px]"
      />
      <div
        className={`mt-1 text-right text-xs ${
          isAtLimit
            ? "text-error-600 font-medium"
            : isNearLimit
              ? "text-warning-600"
              : "text-neutral-500"
        } transition-colors`}
      >
        {characterCount}/{maxLength} characters
      </div>
    </div>
  );
};

export default TextAreaWithCounter;
