import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ value, onChange, placeholder, rows = 4, className }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`border rounded-md p-2 w-full resize-none ${className}`}
    />
  );
};

export default TextArea;