import React from 'react';

const ScenarioManager = ({ currentScenario, nextScenario, progress }) => {
  return (
    <div className="mb-4 bg-yellow-100 p-3 rounded-lg flex justify-between items-center">
      <div>
        <span className="font-semibold">Scenario: </span>
        <span>{currentScenario.name}</span>
      </div>
      <div className="flex items-center">
        <span className="mr-2">{progress > 0 ? '★'.repeat(progress) : ''}</span>
        <button 
          onClick={nextScenario}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg transition-colors hover:bg-blue-600"
        >
          Next Scenario
        </button>
      </div>
    </div>
  );
};

export default React.memo(ScenarioManager);