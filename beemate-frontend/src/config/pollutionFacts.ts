/** Educational facts shown during processing - targeted at children 9-13 */
export const POLLUTION_FACTS = [
  'Vehicle exhaust produces about 60% of air pollution in cities. 🚗',
  'Trees can absorb up to 22 kg of carbon dioxide per year! 🌳',
  'Indoor air can be 2 to 5 times more polluted than outdoor air. 🏠',
  'Bees are excellent indicators of air quality — they are very sensitive to pollution! 🐝',
  'Walking or cycling instead of driving helps reduce air pollution. 🚶\u200d♀️🚴',
  'Burning waste releases toxic chemicals that can travel hundreds of kilometers. 🔥',
  'A single bus can replace 40 cars on the road, greatly reducing emissions. 🚌',
  'Planting just one tree can absorb 10 kg of pollutants from the air each year. 🌱',
  'Air pollution affects over 90% of the world\'s population. 🌍',
  'Construction sites produce dust particles that can cause breathing problems. 🏗️',
  'Electric cars produce zero direct emissions while driving. ⚡',
  'Recycling one aluminum can saves enough energy to run a TV for 3 hours. ♻️',
  'Wind turbines generate clean electricity without producing air pollution. 💨',
  'Solar panels can power entire buildings with zero emissions! ☀️',
  'Even small actions like turning off lights help reduce power plant emissions. 💡',
  'Noise pollution from traffic can affect wildlife behavior and migration. 🦅',
  'Rain can wash pollutants from the air, but then it enters our water! 🌧️',
  'Green rooftops in cities can reduce air pollution and cool buildings naturally. 🏢'
];

/** Get a random pollution fact */
export const getRandomFact = (): string => {
  return POLLUTION_FACTS[Math.floor(Math.random() * POLLUTION_FACTS.length)];
};