import { facts } from '../data/pollutionFacts.js';

/**
 * Get a random pollution fact
 */
export const getRandomFact = (req, res) => {
  const randomIndex = Math.floor(Math.random() * facts.length);
  res.json({
    success: true,
    data: { fact: facts[randomIndex], index: randomIndex },
    message: 'Random fact retrieved'
  });
};

/**
 * Get all pollution facts
 */
export const getAllFacts = (req, res) => {
  res.json({
    success: true,
    data: { facts, total: facts.length },
    message: 'All facts retrieved'
  });
};