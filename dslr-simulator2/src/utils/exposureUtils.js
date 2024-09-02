export const calculateLV = (aperture, shutterSpeed, iso) => {
  const shutterSpeedValue = parseShutterSpeed(shutterSpeed);
  return Math.log2((aperture * aperture) / shutterSpeedValue / (iso / 100));
};

const parseShutterSpeed = (shutterSpeed) => {
  if (shutterSpeed.includes('/')) {
    const [numerator, denominator] = shutterSpeed.split('/').map(Number);
    return numerator / denominator;
  }
  return Number(shutterSpeed);
};

export const getScenarioLV = (scenario) => {
  const scenarioLVMap = {
    'Sunset landscape at the beach': 12,
    'Night street photography': 3,
    'Sports action shot': 13,
    // Add more scenarios and their ideal LV values as needed
  };
  return scenarioLVMap[scenario] || 10; // Default to 10 if scenario not found
};