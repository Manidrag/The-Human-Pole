import React, { useState } from 'react';

const EmailPrompt = ({ onEmailSubmitted }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter a valid email address.');
      return;
    }
    onEmailSubmitted(email);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-4">Enter Your Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmailPrompt;
