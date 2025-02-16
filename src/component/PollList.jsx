// poll-frontend/src/components/PollList.js
import React, { useState, useEffect } from 'react';
import PollSummary from './PollSummary';

const PollList = ({ onSelectPoll }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchPolls = async () => {
    // Only show loading on initial fetch
    if (!hasLoaded) setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/polls');
      if (response.ok) {
        const data = await response.json();
        // Sort polls descending by createdAt (newest first)
        const sortedPolls = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPolls(sortedPolls);
        if (!hasLoaded) {
          setHasLoaded(true);
        }
      } else {
        console.error('Error fetching polls:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      if (!hasLoaded) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
    const intervalId = setInterval(() => {
      fetchPolls();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [hasLoaded]);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Active Polls</h2>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : polls.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-semibold text-gray-600">No active polls available.</div>
        </div>
      ) : (
        <ul className="space-y-4">
          {polls.map((poll) => (
            <li key={poll._id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{poll.question}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Created by: {poll.creatorName}
              </p>
              <PollSummary poll={poll} />
              <button
                onClick={() => onSelectPoll(poll)}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Vote / View
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PollList;
