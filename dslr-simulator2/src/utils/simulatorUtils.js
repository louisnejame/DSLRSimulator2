export const scenarios = [
  {
    id: 1,
    name: 'Sunset landscape at the beach',
    imageUrl: '/images/sunset-beach.jpg',
    idealSettings: { iso: 100, aperture: 11, shutterSpeed: '1/125' },
    baseEV: 8
  },
  {
    id: 2,
    name: 'Night street photography',
    imageUrl: '/images/night-street.jpg',
    idealSettings: { iso: 3200, aperture: 2.8, shutterSpeed: '1/60' },
    baseEV: 3
  },
  {
    id: 3,
    name: 'Sports action shot',
    imageUrl: '/images/sports-action.jpg',
    idealSettings: { iso: 800, aperture: 4, shutterSpeed: '1/1000' },
    baseEV: 12
  },
  // Add more scenarios as needed
];

export const getIdealSettings = (scenario) => scenario.idealSettings;

export const calculateScore = (userSettings, idealSettings) => {
  const isoScore = 100 - Math.abs(userSettings.iso - idealSettings.iso) / idealSettings.iso * 100;
  const apertureScore = 100 - Math.abs(userSettings.aperture - idealSettings.aperture) / idealSettings.aperture * 100;
  const shutterSpeedScore = 100 - Math.abs(parseFloat(userSettings.shutterSpeed.slice(2)) - parseFloat(idealSettings.shutterSpeed.slice(2))) / parseFloat(idealSettings.shutterSpeed.slice(2)) * 100;

  return Math.round((isoScore + apertureScore + shutterSpeedScore) / 3);
};

export const getDetailedFeedback = (userSettings, idealSettings, scenario) => {
  let feedback = `For the "${scenario.name}" scenario:\n`;

  feedback += `ISO: ${getFeedbackForSetting('iso', userSettings.iso, idealSettings.iso)}\n`;
  feedback += `Aperture: ${getFeedbackForSetting('aperture', userSettings.aperture, idealSettings.aperture)}\n`;
  feedback += `Shutter Speed: ${getFeedbackForSetting('shutterSpeed', userSettings.shutterSpeed, idealSettings.shutterSpeed)}\n`;

  return feedback;
};

const getFeedbackForSetting = (setting, userValue, idealValue) => {
  const difference = setting === 'shutterSpeed' 
    ? Math.abs(parseFloat(userValue.slice(2)) - parseFloat(idealValue.slice(2)))
    : Math.abs(userValue - idealValue);

  if (difference === 0) return "Perfect choice!";
  
  const direction = userValue > idealValue ? "too high" : "too low";
  
  switch(setting) {
    case 'iso':
      return `Your ISO is ${direction}. ${direction === "too high" ? "This might introduce unnecessary noise." : "You might need more light sensitivity for this scene."}`;
    case 'aperture':
      return `Your aperture is ${direction}. ${direction === "too high" ? "This might result in too much of the scene being in focus." : "This might result in too shallow depth of field for this scene."}`;
    case 'shutterSpeed':
      return `Your shutter speed is ${direction}. ${direction === "too high" ? "This might freeze motion unnecessarily." : "This might introduce unwanted motion blur."}`;
    default:
      return "";
  }
};

export const calculateExposureScore = (settings, baseEV) => {
  const apertureStop = Math.log2(settings.aperture * settings.aperture);
  const shutterStop = Math.log2(parseFloat(settings.shutterSpeed.slice(2)));
  const isoStop = Math.log2(settings.iso / 100);
  const exposureValue = baseEV - (apertureStop - shutterStop - isoStop);
  
  // Perfect exposure is 0, we'll give full score for ±1/3 stop
  const exposureScore = Math.max(0, 100 - Math.abs(exposureValue) * 300);
  return Math.round(exposureScore);
};