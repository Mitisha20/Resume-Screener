import React from 'react';

const MatchPercentage = ({ matchPercentage }) => {
  if (matchPercentage == null) return null;

  return (
    <div className="mt-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800">
        Match Score:&nbsp;
        <span className="text-green-600 font-bold">
          {matchPercentage.toFixed(2)}%
        </span>
      </h2>
    </div>
  );
};

export default MatchPercentage;
