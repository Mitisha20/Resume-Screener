import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });

      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong.';
      alert('Registration failed: ' + msg);
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">Create Account</h2>

        <input
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
        />

        <input
          type="password"
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
        />

        <button
          onClick={registerUser}
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already registered?{' '}
          <Link to="/login" className="text-purple-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
