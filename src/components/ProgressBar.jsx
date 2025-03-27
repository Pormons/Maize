import React from 'react';

const ProgressBar = ({ progress, height = 'h-5', backgroundColor = 'bg-gray-200', progressColor = 'bg-green-600' }) => {
    return (
        <div className={`w-full ${height} ${backgroundColor} rounded-full overflow-hidden`}>
            <div
                className={`${height} ${progressColor} transition-all duration-300 ease-in-out`}
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <span className="sr-only">{`${progress}% Complete`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;

