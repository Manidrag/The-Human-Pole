import React, { useState } from 'react';
import PollCreator from './component/PollCreator';
import Poll from './component/Poll';
import PollList from './component/PollList';

function App() {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'create', or 'view'

  const handlePollCreated = (poll) => {
    setCurrentPoll(poll);
    setView('list'); 
  };

  const handlePollSelect = (poll) => {
    setCurrentPoll(poll);
    setView('view');
  };

  return (
    <div className="App p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Polling App</h1>
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setView('create')}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Create Poll
        </button>
        <button
          onClick={() => setView('list')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Active Polls
        </button>
      </div>
      {view === 'create' && <PollCreator onPollCreated={handlePollCreated} />}
      {view === 'list' && <PollList onSelectPoll={handlePollSelect} />}
      {view === 'view' && currentPoll && <Poll poll={currentPoll} />}
    </div>
  );
}

export default App;
