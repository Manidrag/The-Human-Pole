// poll-frontend/src/components/PollList.js
import React, { useState, useEffect } from 'react';
import PollSummary from './PollSummary';

const PollList = ({ onSelectPoll }) => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('https://backend-note-7mgo.onrender.com/api/polls');
        if (response.ok) {
          const data = await response.json();
          setPolls(data);
        } else {
          console.error('Error fetching polls');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Active Polls</h2>
      {polls.length === 0 ? (
        <p>No active polls available.</p>
      ) : (
        <ul className="space-y-4">
          {polls.map((poll) => (
            <li key={poll._id} className="p-4 bg-white shadow rounded-md">
              <h3 className="text-xl font-semibold">{poll.question}</h3>
              <PollSummary poll={poll} />
              <button
                onClick={() => onSelectPoll(poll)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
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
