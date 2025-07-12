import React from 'react';

const JobDescriptionInput = ({ jobDescription, onJobDescriptionChange }) => {
  return (
    <div className="mt-4">
      <textarea
        value={jobDescription}
        onChange={onJobDescriptionChange}
        placeholder="Paste the job description here..."
        rows={6}
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default JobDescriptionInput;
