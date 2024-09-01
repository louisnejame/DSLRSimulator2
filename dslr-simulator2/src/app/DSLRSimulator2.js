import React, { useState } from 'react';

const DSLRSimulator2 = () => {
  const [settings, setSettings] = useState({
    iso: 100,
    aperture: 1.4,
    shutterSpeed: '1/400'
  });
  const [feedback, setFeedback] = useState('');
  const [scenario, setScenario] = useState('Sunset landscape at the beach');

  const changeSetting = (setting, direction) => {
    const values = {
      iso: [100, 200, 400, 800, 1600, 3200, 6400],
      aperture: [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22],
      shutterSpeed: ['1/4000', '1/2000', '1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15', '1/8', '1/4', '1/2', '1']
    };
    
    const currentIndex = values[setting].indexOf(settings[setting]);
    let newIndex = direction === 'up' ? Math.min(values[setting].length - 1, currentIndex + 1) 
                                      : Math.max(0, currentIndex - 1);
    
    setSettings(prev => ({ ...prev, [setting]: values[setting][newIndex] }));
  };

  const takePicture = () => {
    setFeedback('Picture taken with current settings!');
    // Here you would add logic to evaluate the settings and provide more detailed feedback
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h1 className="text-2xl font-bold">Canon Rebel T3i</h1>
        </div>
        <div className="flex items-center">
          <img src="/api/placeholder/40/40" alt="Profile" className="w-10 h-10 rounded-full mr-2" />
          <span>Profile Name</span>
        </div>
      </div>
      
      <div className="mb-4 bg-yellow-100 p-3 rounded-lg">
        <span className="font-semibold">Scenario: </span>
        <span>{scenario}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <img src="/api/placeholder/400/300" alt="Canon Rebel T3i" className="w-full rounded-lg" />
        </div>
        <div className="bg-blue-100 rounded-lg p-4 flex items-center justify-center">
          <span className="text-xl font-bold">OUTPUT IMAGE</span>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          {['iso', 'aperture', 'shutterSpeed'].map((setting) => (
            <div key={setting} className="flex items-center justify-between mb-2">
              <span className="w-24">{setting.charAt(0).toUpperCase() + setting.slice(1)}</span>
              <div className="flex items-center">
                <button onClick={() => changeSetting(setting, 'down')} className="px-2 py-1 bg-gray-200 rounded-l">{'<'}</button>
                <span className="px-4 py-1 bg-gray-100">{settings[setting]}</span>
                <button onClick={() => changeSetting(setting, 'up')} className="px-2 py-1 bg-gray-200 rounded-r">{'>'}</button>
              </div>
            </div>
          ))}
          <button onClick={takePicture} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg w-full">Take picture</button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Feedback</h2>
          <p>{feedback}</p>
        </div>
      </div>
    </div>
  );
};
export default DSLRSimulator2;