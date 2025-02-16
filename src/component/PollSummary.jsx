// poll-frontend/src/components/PollSummary.js
import React from 'react';

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-indigo-500'
];

const PollSummary = ({ poll }) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="p-4 bg-white rounded-lg shadow-inner">
      {poll.options.map((option, index) => {
        // Calculate percentage for each option
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const color = colors[index % colors.length];
        return (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-800">{option.option}</span>
              <span className="text-sm font-medium text-gray-600">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`${color} h-4 rounded-full transition-all duration-700 ease-in-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
      <div className="mt-4 text-center text-sm text-gray-600">Total votes: {totalVotes}</div>
    </div>
  );
};

export default PollSummary;
