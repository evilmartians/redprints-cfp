import React from 'react';

interface TextAreaWithCounterProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  required?: boolean;
}

const TextAreaWithCounter: React.FC<TextAreaWithCounterProps> = ({
  id,
  value,
  onChange,
  maxLength,
  placeholder,
  required,
}) => {
  const characterCount = value.length;
  const isNearLimit = characterCount >= maxLength * 0.8;
  const isAtLimit = characterCount >= maxLength;

  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        rows={5}
        className="input-field min-h-[120px]"
      />
      <div
        className={`text-xs mt-1 text-right ${
          isAtLimit ? 'text-error-600 font-medium' :
          isNearLimit ? 'text-warning-600' :
          'text-neutral-500'
        } transition-colors`}
      >
        {characterCount}/{maxLength} characters
      </div>
    </div>
  );
};

export default TextAreaWithCounter;
