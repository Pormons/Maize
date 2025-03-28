import React from 'react';

const DiseaseDetails = ({ results }) => {
  // If no diseases, show "No Results" message
  if (!results || results.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <span className="font-extrabold text-zinc-800">No Results Yet</span>
      </div>
    );
  }

  return (
    <>
      {results.map((disease) => (
        <div key={disease.label} className="mb-2 last:mb-0">
            
          <h2 className="text-2xl font-extrabold mt-1 text-gray-900 mb-4">
            {disease.label}
          </h2>
          <div className="space-y-6">
            {/* Symptoms Section */}
            <div className="flex flex-col lg:flex-row lg:space-x-2">
              <div className="mb-4 lg:mb-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Symptoms
                </h3>
                <ul className="list-disc text-sm pl-5 text-gray-700">
                  {disease.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
              
              
              {/* Causes Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Causes
                </h3>
                <ul className="list-disc text-sm pl-5 text-gray-700">
                  {disease.cause.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prevention Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Prevention
              </h3>
              <p className="text-gray-700 text-sm mb-2">
                {disease.prevention.description}
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {disease.prevention.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Treatment Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Treatment
              </h3>
              <p className="text-gray-700 mb-2 text-sm">
                {disease.treatment.description}
              </p>
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                {disease.treatment.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default DiseaseDetails;