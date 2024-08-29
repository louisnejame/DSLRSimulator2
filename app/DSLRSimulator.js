'use client'

import React, { useState, useEffect } from 'react';

const scenarios = [
  {
    name: "Headshot portrait in bright sunlight",
    ideal: { aperture: 8, shutterSpeed: 1/250, iso: 100 },
    image: "/api/placeholder/800/600"
  },
  {
    name: "Action shot of a football player at night",
    ideal: { aperture: 2.8, shutterSpeed: 1/1000, iso: 3200 },
    image: "/api/placeholder/800/600"
  },
  // Add more scenarios here...
];

const DSLRSimulator = () => {
  const [settings, setSettings] = useState({ aperture: 5.6, shutterSpeed: 1/125, iso: 400 });
  const [currentScenario, setCurrentScenario] = useState(scenarios[0]);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [imageStyle, setImageStyle] = useState({});

  const changeSetting = (setting, direction) => {
    const values = {
      aperture: [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22],
      shutterSpeed: [1/4000, 1/2000, 1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15, 1/8, 1/4, 1/2, 1],
      iso: [100, 200, 400, 800, 1600, 3200, 6400]
    };
    
    const currentIndex = values[setting].indexOf(settings[setting]);
    let newIndex = direction === 'up' ? Math.max(0, currentIndex - 1) : Math.min(values[setting].length - 1, currentIndex + 1);
    
    setSettings(prev => ({ ...prev, [setting]: values[setting][newIndex] }));
  };

  const formatShutterSpeed = (speed) => speed < 1 ? `1/${1/speed}` : `${speed}"`;

  const calculateScore = () => {
    const ideal = currentScenario.ideal;
    let totalScore = 0;

    const scoreSetting = (setting) => {
      const diff = Math.abs(Math.log2(settings[setting]) - Math.log2(ideal[setting]));
      if (diff === 0) return 10;
      if (diff <= 1) return 5;
      if (diff <= 2) return 2;
      return 0;
    };

    totalScore += scoreSetting('aperture');
    totalScore += scoreSetting('shutterSpeed');
    totalScore += scoreSetting('iso');

    return totalScore;
  };

  const generateFeedback = () => {
    const ideal = currentScenario.ideal;
    let feedback = [];

    if (settings.aperture < ideal.aperture) {
      feedback.push("Consider using a smaller aperture (higher f-number) for better depth of field.");
    } else if (settings.aperture > ideal.aperture) {
      feedback.push("A wider aperture (lower f-number) might help in this scenario.");
    }

    if (settings.shutterSpeed < ideal.shutterSpeed) {
      feedback.push("Try a faster shutter speed to freeze motion.");
    } else if (settings.shutterSpeed > ideal.shutterSpeed) {
      feedback.push("A slower shutter speed might be better for this shot.");
    }

    if (settings.iso < ideal.iso) {
      feedback.push("You might need a higher ISO for better exposure in this lighting condition.");
    } else if (settings.iso > ideal.iso) {
      feedback.push("Consider lowering the ISO to reduce noise if possible.");
    }

    return feedback.join(' ');
  };

  const processImage = () => {
    const blurAmount = Math.max(0, 5 - Math.log2(settings.aperture));
    const brightnessAdjustment = Math.log2(settings.iso / 100) * 10;
    const motionBlur = Math.max(0, Math.log2(settings.shutterSpeed) + 6);

    setImageStyle({
      filter: `blur(${blurAmount}px) brightness(${100 + brightnessAdjustment}%)`,
      transform: `scale(1.${motionBlur}) rotateZ(${motionBlur}deg)`,
      transition: 'all 0.3s ease-in-out'
    });
  };

  const takePicture = () => {
    const newScore = calculateScore();
    setScore(newScore);
    setFeedback(generateFeedback());
    processImage();
  };

  const nextScenario = () => {
    const currentIndex = scenarios.indexOf(currentScenario);
    const nextIndex = (currentIndex + 1) % scenarios.length;
    setCurrentScenario(scenarios[nextIndex]);
    setScore(null);
    setFeedback('');
    setImageStyle({});
  };

  const retryScenario = () => {
    setSettings({ aperture: 5.6, shutterSpeed: 1/125, iso: 400 });
    setScore(null);
    setFeedback('');
    setImageStyle({});
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <div className="mb-4 bg-blue-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold">Current Scenario:</h2>
        <p>{currentScenario.name}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>f/{settings.aperture}</div>
            <div>{formatShutterSpeed(settings.shutterSpeed)}</div>
            <div>ISO {settings.iso}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['aperture', 'shutterSpeed', 'iso'].map((setting) => (
              <div key={setting} className="flex flex-col items-center">
                <button onClick={() => changeSetting(setting, 'up')} className="w-full mb-2 bg-blue-500 text-white p-2 rounded">▲</button>
                <span className="mb-2">{setting.charAt(0).toUpperCase() + setting.slice(1)}</span>
                <button onClick={() => changeSetting(setting, 'down')} className="w-full bg-blue-500 text-white p-2 rounded">▼</button>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <img src={currentScenario.image} alt="Scene" className="w-full h-full object-cover rounded-lg" style={imageStyle} />
          {score !== null && (
            <div className="absolute top-2 right-2 bg-white rounded-full p-2 font-bold text-lg">
              Score: {score}/30
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={takePicture} className="flex-1 mr-2 bg-green-500 text-white p-2 rounded">Take Picture</button>
        <button onClick={retryScenario} className="mr-2 bg-yellow-500 text-white p-2 rounded">Retry</button>
        <button onClick={nextScenario} className="bg-blue-500 text-white p-2 rounded">Next</button>
      </div>
      {feedback && (
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-bold">Feedback:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default DSLRSimulator;