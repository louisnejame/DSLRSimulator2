import React, { useEffect, useRef } from 'react';

const ImageProcessor = ({ imageUrl, settings, scenario }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      applyEffects(ctx, settings, scenario);
    };
  }, [imageUrl, settings, scenario]);

  const applyEffects = (ctx, settings, scenario) => {
    const { width, height } = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // ISO effect (increases brightness and noise)
    const isoFactor = Math.log2(settings.iso / 100);
    
    // Aperture effect (affects depth of field, but we'll simplify to just brightness)
    const apertureFactor = Math.log2(settings.aperture / 1.4);
    
    // Shutter speed effect (motion blur and exposure)
    const shutterSpeedValue = parseFloat(settings.shutterSpeed.replace('1/', ''));
    const shutterSpeedFactor = Math.log2(400 / shutterSpeedValue);

    // Combined exposure factor
    const exposureFactor = isoFactor - apertureFactor + shutterSpeedFactor;

    for (let i = 0; i < data.length; i += 4) {
      // Adjust brightness based on combined exposure factor
      data[i] = Math.min(255, data[i] * Math.pow(2, exposureFactor));     // Red
      data[i + 1] = Math.min(255, data[i + 1] * Math.pow(2, exposureFactor)); // Green
      data[i + 2] = Math.min(255, data[i + 2] * Math.pow(2, exposureFactor)); // Blue

      // Add noise based on ISO
      if (settings.iso > 100) {
        const noise = (Math.random() - 0.5) * isoFactor * 10;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return <canvas ref={canvasRef} className="w-full h-auto rounded-lg" />;
};

export default ImageProcessor;