import React, { useState } from 'react';

const SubmitButton = ({ onSubmit, isLoading }) => {
  return (
    <button
      onClick={onSubmit}
      disabled={isLoading}
      className={`mt-6 w-full py-2 px-6 rounded-lg text-white font-semibold transition ${
        isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isLoading ? 'Submitting...' : 'Submit'}
    </button>
  );
};

export default SubmitButton;
