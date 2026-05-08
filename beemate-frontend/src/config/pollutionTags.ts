/** Predefined pollution source context tags */
export const POLLUTION_TAGS = [
  { id: 'traffic', label: 'Traffic', icon: '🚗', description: 'Cars, trucks, motorcycles' },
  { id: 'construction', label: 'Construction', icon: '🏗️', description: 'Building sites, machinery' },
  { id: 'waste', label: 'Waste / Bins', icon: '🗑️', description: 'Overflowing bins, litter' },
  { id: 'industrial', label: 'Industrial', icon: '🏭', description: 'Factories, smokestacks' },
  { id: 'burning', label: 'Burning', icon: '🔥', description: 'Open fires, burning waste' },
  { id: 'other', label: 'Other', icon: '❓', description: 'Other pollution source' }
] as const;

export type PollutionTagId = typeof POLLUTION_TAGS[number]['id'];