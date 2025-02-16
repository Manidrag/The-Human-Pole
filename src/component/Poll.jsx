import React, { useState, useEffect } from 'react';
import EmailPrompt from './EmailPrompt';

const Poll = ({ poll }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [pollData, setPollData] = useState(poll);
  const [userEmail, setUserEmail] = useState(null);

  // Vote on a poll option
  const vote = async () => {
    if (selectedOption === null) {
      alert("Please select an option first");
      return;
    }
    try {
      const response = await fetch(`https://backend-note-7mgo.onrender.com/api/polls/${poll._id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify({ optionIndex: selectedOption })
      });
      if (response.ok) {
        const updatedPoll = await response.json();
        setPollData(updatedPoll);
      } else {
        const error = await response.json();
        alert(error.error || "Error voting");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Cancel the poll (only for the creator)
  const cancelPoll = async () => {
    try {
      const response = await fetch(`https://backend-note-7mgo.onrender.com/api/polls/${poll._id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-creator-email': userEmail
        }
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setPollData(data.poll); // Update poll data (isActive becomes false)
      } else {
        const error = await response.json();
        alert(error.error || "Error cancelling poll");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Auto-refresh poll data every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/polls/${poll._id}`);
        if (response.ok) {
          const updatedPoll = await response.json();
          setPollData(updatedPoll);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [poll._id]);

  const totalVotes = pollData.options.reduce((acc, option) => acc + option.votes, 0);

  // If no user email yet, prompt for it.
  if (!userEmail) {
    return <EmailPrompt onEmailSubmitted={setUserEmail} />;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{pollData.question}</h2>
      <div className="space-y-4">
        {pollData.options.map((option, index) => {
          const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
          return (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                name="option"
                value={index}
                onChange={() => setSelectedOption(index)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label className="ml-2 text-gray-700">
                {option.option} - <span className="font-semibold">{option.votes}</span> votes {totalVotes > 0 && `(${percentage}%)`}
              </label>
            </div>
          );
        })}
      </div>
      {pollData.isActive ? (
        <>
          <button
            onClick={vote}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md"
          >
            Vote
          </button>
          {pollData.creatorEmail === userEmail && (
            <button
              onClick={cancelPoll}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md"
            >
              Cancel Poll
            </button>
          )}
        </>
      ) : (
        <p className="mt-6 text-center text-red-500 font-bold">This poll has been closed.</p>
      )}
    </div>
  );
};

export default Poll;
