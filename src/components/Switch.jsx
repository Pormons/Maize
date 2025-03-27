import React, { useState } from 'react';

const Switch = ({ id, label, initialState = false, onChange }) => {
    const [isChecked, setIsChecked] = useState(initialState);

    const handleToggle = () => {
        const newState = !isChecked;
        setIsChecked(newState);
        if (onChange) {
            onChange(newState);
        }
    };

    return (
        <div className="flex items-center w-full justify-between space-x-2">
            <span className="text-sm font-medium text-black">
                {label}
            </span>
            <button
                onClick={handleToggle}
                className="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in focus:outline-none focus:ring-offset-1 focus:ring-0 rounded-full"
                role="switch"
                aria-checked={isChecked}
                aria-label={label}
            >
                <div className={`block w-9 h-5 rounded-full ${isChecked ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                <div
                    className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${isChecked ? 'transform translate-x-4' : ''
                        }`}
                ></div>
            </button>
        </div>
    );
};

export default Switch;

