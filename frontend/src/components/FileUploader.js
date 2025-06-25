import React, { useState } from 'react';

const FileUploader = ({ onFileUpload }) => {
  const [label, setLabel] = useState('');

  const handleChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      setLabel(selected.map(f => f.name).join(', '));
      onFileUpload(selected);
    }
  };

  return (
    <label className="cursor-pointer block border-2 border-dashed border-blue-400 rounded-lg p-6 text-center bg-white hover:border-purple-400 transition">
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        multiple
        className="hidden"
      />
      <p className="text-gray-700">
        Click to upload or drag & drop your resume here
      </p>
      {label && (
        <p className="text-green-600 mt-2">✅ {label} uploaded</p>
      )}
    </label>
  );
};

export default FileUploader;
