'use client';

import React, { useState, useCallback } from 'react';
import { scenarios, calculateScore, getDetailedFeedback, calculateExposureScore } from '../utils/simulatorUtils';
import ImageProcessor from './ImageProcessor';

const DSLRSimulator2 = () => {
  const [settings, setSettings] = useState({
    iso: 100,
    aperture: 1.4,
    shutterSpeed: '1/400'
  });
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');

  const currentScenario = scenarios[currentScenarioIndex];

  const changeSetting = useCallback((setting, direction) => {
    const values = {
      iso: [100, 200, 400, 800, 1600, 3200, 6400],
      aperture: [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22],
      shutterSpeed: ['1/4000', '1/2000', '1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15', '1/8', '1/4', '1/2', '1']
    };
    
    setSettings(prev => {
      const currentIndex = values[setting].indexOf(prev[setting]);
      const newIndex = direction === 'up' 
        ? Math.min(values[setting].length - 1, currentIndex + 1)
        : Math.max(0, currentIndex - 1);
      return { ...prev, [setting]: values[setting][newIndex] };
    });
  }, []);

  const nextScenario = useCallback(() => {
    setCurrentScenarioIndex((prevIndex) => (prevIndex + 1) % scenarios.length);
    setScore(null);
    setFeedback('');
  }, []);

  const takePicture = useCallback(() => {
    const settingsScore = calculateScore(settings, currentScenario.idealSettings);
    const exposureScore = calculateExposureScore(settings, currentScenario.baseEV);
    const combinedScore = Math.round((settingsScore + exposureScore) / 2);
    const detailedFeedback = getDetailedFeedback(settings, currentScenario.idealSettings, currentScenario);
    setScore(combinedScore);
    setFeedback(detailedFeedback);
  }, [settings, currentScenario]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">DSLR Simulator</h1>
      
      <div className="mb-4 bg-yellow-100 p-3 rounded-lg flex justify-between items-center">
        <span>
          <span className="font-semibold">Scenario: </span>
          <span>{currentScenario.name}</span>
        </span>
        <button 
          onClick={nextScenario}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg"
        >
          Next Scenario
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <ImageProcessor settings={settings} scenario={currentScenario} />
        <div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            {['iso', 'aperture', 'shutterSpeed'].map((setting) => (
              <div key={setting} className="flex items-center justify-between mb-2">
                <span>{setting.charAt(0).toUpperCase() + setting.slice(1)}</span>
                <div>
                  <button 
                    onClick={() => changeSetting(setting, 'down')}
                    className="px-2 py-1 bg-gray-200 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-white">{settings[setting]}</span>
                  <button 
                    onClick={() => changeSetting(setting, 'up')}
                    className="px-2 py-1 bg-gray-200 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={takePicture}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Take Picture
          </button>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-100 p-4 rounded-lg">
        <h2 className="font-bold mb-2">Feedback</h2>
        {score !== null && <p className="mb-2">Score: {score}</p>}
        <p className="whitespace-pre-line">{feedback}</p>
      </div>
    </div>
  );
};

export default DSLRSimulator2;