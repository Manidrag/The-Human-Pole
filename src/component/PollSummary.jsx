// poll-frontend/src/components/PollSummary.js
import React from 'react';

const PollSummary = ({ poll }) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="mt-2">
      {poll.options.map((option, index) => {
        const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
        return (
          <div key={index} className="flex justify-between">
            <span className="text-gray-700">{option.option}</span>
            <span className="text-gray-700">{percentage}%</span>
          </div>
        );
      })}
      <div className="text-sm text-gray-500 mt-1">Total votes: {totalVotes}</div>
    </div>
  );
};

export default PollSummary;
