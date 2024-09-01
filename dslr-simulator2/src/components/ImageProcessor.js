import React, { useEffect, useRef, useState } from 'react';

const ImageProcessor = ({ settings, scenario }) => {
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [exposureValue, setExposureValue] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      applyEffects(ctx, settings, scenario);
    };
    img.onerror = () => {
      console.error('Error loading image:', scenario.imageUrl);
      drawPlaceholder(ctx, canvas.width, canvas.height);
    };
    img.src = scenario.imageUrl;

    const exposure = calculateExposure(settings, scenario.baseEV);
    setExposureValue(exposure);
  }, [settings, scenario]);

  const applyEffects = (ctx, settings, scenario) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    applyExposureEffect(imageData, settings, scenario);
    applyNoiseEffect(imageData, settings.iso);
    ctx.putImageData(imageData, 0, 0);
    
    applyBlurEffect(ctx, settings.aperture);
    addTextOverlay(ctx, settings, scenario);
  };

  const applyExposureEffect = (imageData, settings, scenario) => {
    const exposure = calculateExposure(settings, scenario.baseEV);
    const factor = Math.pow(2, exposure);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * factor);
      data[i + 1] = Math.min(255, data[i + 1] * factor);
      data[i + 2] = Math.min(255, data[i + 2] * factor);
    }
  };

  const applyBlurEffect = (ctx, aperture) => {
    const blurAmount = Math.max(0, (22 - aperture) / 4);
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.filter = 'none';
  };

  const applyNoiseEffect = (imageData, iso) => {
    const data = imageData.data;
    const noiseAmount = (iso / 100) * 0.1;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * noiseAmount;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
  };

  const addTextOverlay = (ctx, settings, scenario) => {
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`ISO: ${settings.iso}`, 10, 20);
    ctx.fillText(`Aperture: f/${settings.aperture}`, 10, 40);
    ctx.fillText(`Shutter Speed: ${settings.shutterSpeed}`, 10, 60);
    ctx.fillText(`Scenario: ${scenario.name}`, 10, 80);
  };

  const calculateExposure = (settings, baseEV) => {
    const apertureStop = Math.log2(settings.aperture * settings.aperture);
    const shutterStop = Math.log2(parseFloat(settings.shutterSpeed.slice(2)));  // Remove the 1 / here
    const isoStop = Math.log2(settings.iso / 100);
    return baseEV - (apertureStop - shutterStop - isoStop);  // Changed + to - for shutterStop
  };

  const drawPlaceholder = (ctx, width, height) => {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, width, height * 0.7);
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, height * 0.7, width, height * 0.3);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 25, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <canvas ref={canvasRef} className="w-full rounded-lg mb-2" />
      {!imageLoaded && <p>Loading image...</p>}
      <div className="mt-2 bg-white p-2 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Exposure Meter:</span>
          <span>{exposureValue.toFixed(2)} EV</span>
        </div>
        <div className="relative h-4 bg-gray-300 rounded-full mt-1">
          <div 
            className="absolute top-0 bottom-0 bg-blue-500 rounded-full"
            style={{
              left: '50%',
              width: '4px',
              transform: `translateX(${Math.min(Math.max(exposureValue * 33.33, -100), 100)}%)`
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>-3</span>
          <span>-2</span>
          <span>-1</span>
          <span>0</span>
          <span>+1</span>
          <span>+2</span>
          <span>+3</span>
        </div>
      </div>
    </div>
  );
};

export default ImageProcessor;