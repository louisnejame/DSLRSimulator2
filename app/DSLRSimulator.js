import React, { useState, useEffect } from 'react';
import { Camera, Aperture, Clock, Zap, RefreshCw, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
      <Alert className="mb-4">
        <AlertTitle>Current Scenario:</AlertTitle>
        <AlertDescription>{currentScenario.name}</AlertDescription>
      </Alert>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>f/{settings.aperture}</div>
            <div>{formatShutterSpeed(settings.shutterSpeed)}</div>
            <div>ISO {settings.iso}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <Button onClick={() => changeSetting('aperture', 'up')} className="w-full mb-2">▲</Button>
              <Aperture className="mb-2" />
              <Button onClick={() => changeSetting('aperture', 'down')} className="w-full">▼</Button>
            </div>
            <div className="flex flex-col items-center">
              <Button onClick={() => changeSetting('shutterSpeed', 'up')} className="w-full mb-2">▲</Button>
              <Clock className="mb-2" />
              <Button onClick={() => changeSetting('shutterSpeed', 'down')} className="w-full">▼</Button>
            </div>
            <div className="flex flex-col items-center">
              <Button onClick={() => changeSetting('iso', 'up')} className="w-full mb-2">▲</Button>
              <Zap className="mb-2" />
              <Button onClick={() => changeSetting('iso', 'down')} className="w-full">▼</Button>
            </div>
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
        <Button onClick={takePicture} className="flex-1 mr-2">
          <Camera className="mr-2" /> Take Picture
        </Button>
        <Button onClick={retryScenario} className="mr-2">
          <RefreshCw className="mr-2" /> Retry
        </Button>
        <Button onClick={nextScenario}>
          <ArrowRight className="mr-2" /> Next
        </Button>
      </div>
      {feedback && (
        <Alert>
          <AlertTitle>Feedback:</AlertTitle>
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DSLRSimulator;