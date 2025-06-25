import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router-dom';

function Dashboard({ setToken }) {
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const getUploadedResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/user_resumes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedResumes(res.data.resumes || []);
    } catch (err) {
      console.error('Could not fetch resumes:', err);
    }
  };

  useEffect(() => {
    getUploadedResumes();
  }, []);

  const onJDChange = (e) => {
    setJobDesc(e.target.value);
  };

  const handleMatch = async () => {
    if (!selectedFiles?.length || !jobDesc.trim()) {
      alert('Missing input. Upload at least one resume and enter job description.');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const parsedResumes = [];

      for (let file of selectedFiles) {
        const formData = new FormData();
        formData.append('resume', file);

        const res = await axios.post('http://localhost:5000/api/upload_resume', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        parsedResumes.push(res.data.resume_text);
      }

      const payload = {
        resumes: parsedResumes,
        job_description: jobDesc,
      };

      const matchRes = await axios.post('http://localhost:5000/api/screen_resume', payload);
      setResults(matchRes.data.results);
      getUploadedResumes();
    } catch (err) {
      console.error('Error while processing resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen px-4 py-8">
      {/* Logout */}
      <div className="flex justify-end max-w-4xl mx-auto mb-4">
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 text-center">
          Resume Screener
        </h1>

        <FileUploader onFileUpload={setSelectedFiles} />

        <textarea
          placeholder="Paste the JD here..."
          value={jobDesc}
          onChange={onJDChange}
          rows={6}
          className="w-full mt-4 p-4 border border-gray-300 rounded-lg focus:outline-none"
        />

        <div className="flex justify-center">
          <button
            onClick={handleMatch}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-full transition duration-300"
          >
            Submit
          </button>
        </div>

        {isLoading && <p className="mt-6 text-center text-lg">Loading... ⏳</p>}

        {!isLoading && results.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {results.map((res, idx) => {
              const medal = ['🥇', '🥈', '🥉'][idx] || '';

              return (
                <div
                  key={idx}
                  className="p-6 bg-white border-l-8 border-blue-400 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-blue-600 mb-2">
                    {medal} Resume {idx + 1}
                  </h2>
                  <p className="text-gray-700 text-lg">
                    Match Score:{' '}
                    <span className="text-green-600 font-bold text-2xl">
                      {res.match_percentage.toFixed(2)}%
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Preview: {res.resume_text.slice(0, 80)}...
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* List of resumes already uploaded */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Uploaded Resumes</h2>
          {!uploadedResumes.length ? (
            <p className="text-gray-600">No resumes uploaded yet.</p>
          ) : (
            <ul className="list-disc pl-6 text-gray-700">
              {uploadedResumes.map((res, i) => (
                <li key={i} className="mb-2">
                  <span className="font-semibold">{res.filename}</span> — Uploaded on:{' '}
                  {new Date(res.parsed_at).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
