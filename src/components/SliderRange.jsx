import React, { useState } from 'react';

const SliderRange = ({ id, label, initialValue = 50, onChange }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <label htmlFor={id} className="block text-sm font-medium text-black mb-2">
        {label}: {value}%
      </label>
      <input
        type="range"
        id={id}
        name={id}
        min="10"
        max="100"
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>10%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default SliderRange;

