import React, { forwardRef, useEffect, useRef } from 'react';

const DateInput = forwardRef(({ className = '', isFocused = false, ...props }, ref) => {
  const inputRef = ref || useRef();

  useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className="relative">
      <input
        {...props}
        type="date"
        className={
          'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
          className
        }
        ref={inputRef}
      />
    </div>
  );
});

export default DateInput;
