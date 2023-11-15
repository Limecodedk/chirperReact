import React, { forwardRef, useEffect, useRef } from 'react';

const TextArea = forwardRef(({ className = '', isFocused = false, ...props }, ref) => {
  const textAreaRef = ref || useRef();

  useEffect(() => {
    if (isFocused) {
      textAreaRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className="relative">
      <textarea
        {...props}
        className={
          'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
          className
        }
        ref={textAreaRef}
      />
    </div>
  );
});

export default TextArea;
