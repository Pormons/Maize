import React from 'react';
import { FaCircle } from "react-icons/fa6";

function ResultList({ results }) {
  // Predefined color map for specific labels
  const colorMap = {
    'Healthy': 'text-green-500',
    'Common Rust': 'text-amber-500',
    'Northern Leaf Blight': 'text-red-500',
    'Gray Leaf Spot': 'text-blue-500'
  };

  const labelMap = {
    'healthy': 'Healthy',
    'corn_rust': 'Common Rust',
    'leaf_blight': 'Northern Leaf Blight',
    'leaf_spot': 'Gray Leaf Spot'
  }

  // Function to determine color based on label and confidence threshold
  function getColor(label) {
    return colorMap[label]
  }

  return (
    <ul className="space-y-3">
      {results.length == 0 && (
        <li className="flex items-center">
          <div className="flex text-sm text-center justify-between items-center w-full">
            <span className="font-medium text-xs text-center text-gray-900">  Non Detected</span>
          </div>
        </li>
      )}

      {results.map((result, index) => {
        const colorClass = getColor(labelMap[result.class]);
        return (
          <li key={index} className="flex items-center">
            <FaCircle className={`w-4 h-4 mr-3 ${colorClass}`} />
            <div className="flex text-sm justify-between items-center w-full">
              <span className="font-medium text-xs text-gray-900">{labelMap[result.class]}</span>
              <span className={`${colorClass} `}>
                {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default ResultList;

