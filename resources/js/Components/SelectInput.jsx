import React, { forwardRef, useEffect, useRef } from 'react';

const SelectInput = forwardRef(({ className = '', isFocused = false, options = [], ...props }, ref) => {
  const inputRef = ref || useRef();

  useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className="relative">
      <select
        {...props}
        className={
          'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
          className
        }
        ref={inputRef}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default SelectInput;
