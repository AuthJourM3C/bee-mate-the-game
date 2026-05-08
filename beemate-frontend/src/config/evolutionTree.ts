import type { Character } from '../types';

/**
 * Complete evolution tree for BeeMate characters
 * 3 paths: Audio, Balanced, Image
 * 3 levels implemented for prototype
 */
export const EVOLUTION_TREE: Record<string, Character> = {
  pollini: {
    id: 'pollini',
    name: 'Pollini',
    level: 1,
    tier: 'Starter',
    type: 'Nature',
    title: 'Περίεργος εξερευνητής...',
    description: 'Γεια! Είμαι η Pollini, μια μελισσούλα που αγαπάει πολύ τη φύση! 🌿🐝. Όμως τελευταία, κάτι δεν πάει καλά... Ο αέρας είναι βαρύς και τα λουλούδια στεναχωριούνται! 😟🌸Χρειάζομαι τη βοήθειά σου! Πάρε φωτογραφίες, μάζεψε ήχους και μαζί θα γίνουμε η καλύτερη ομάδα εξερευνητών! Έτοιμος/η; \n Η αποστολή ξεκινάει ΤΩΡΑ!',
    flavorText: 'Όσο περισσότερα ανακαλύψουμε, τόσο πιο δυνατή γίνομαι! 💪',
    rarity: '⭐',
    habitat: 'Gardens · Parks · Schools',
    stats: { detection: 20, environmental: 10, speed: 30, power: 15, resonance: 10 },
    statLabels: { detection: 'Ικανότητα ανίχνευσης', environmental: 'Environmental', speed: 'Ταχύτητα', power: 'Δύναμη' },
    evolutionThreshold: 20,
    evolvesTo: { audio: 'buzztone', balanced: 'equabee', image: 'snaplet' },
    powerUpMessages: [
      'Η Pollini παρατήρησε το περιβάλλον προσεκτικά...',
      'Ο κόσμος αποκάλυψε τα κρυμμένα του σήματα!'
    ],
    avatarUrl: '/assets/characters/pollini/avatar.png',
    cardUrl: '/assets/characters/pollini/card.png'
  },
  buzztone: {
    id: 'buzztone',
    name: 'BuzzTone',
    level: 2,
    tier: 'Audio Path',
    type: 'Sound / Electric',
    title: 'Sound Scout',
    description: 'Η BuzzTone έχει αναπτύξει οξυμένη ακοή. Μπορεί να εντοπίσει πηγές ρύπανσης από τα ηχητικά τους μοτίβα — κινητήρες, μηχανές και αστικό θόρυβο.',
    flavorText: '"Άκου προσεκτικά... η πόλη ψιθυρίζει τα μυστικά της."',
    rarity: '⭐⭐',
    habitat: 'Cities · Roads · Industrial zones',
    stats: { listeningPower: 55, frequencyDetection: 48, noisePollutionSense: 50, speed: 45, resonanceEnergy: 40 },
    statLabels: { listeningPower: 'Δύναμη ακοής', frequencyDetection: 'Ανίχνευση συχνοτήτων', noisePollutionSense: 'Ανίχνευση ηχορύπανσης', speed: 'Ταχύτητα (Πτήση)', resonanceEnergy: 'Ενέργεια συντονισμού' },
    evolutionThreshold: 50,
    evolvesTo: { audio: 'resonapis', balanced: 'synthera', image: 'synthera' },
    powerUpMessages: [
      'Η BuzzTone άκουσε κάτι στον θόρυβο...',
      'Η Pollini εξελίχθηκε σε BuzzTone!!!'
    ],
    avatarUrl: '/assets/characters/buzztone/avatar.png',
    cardUrl: '/assets/characters/buzztone/card.png'
  },
  snaplet: {
    id: 'snaplet',
    name: 'Snaplet',
    level: 2,
    tier: 'Image Path',
    type: 'Nature / Light',
    title: 'Photo Deviant',
    description: 'Η Snaplet προστατεύει τη φύση βλέποντας αυτό που οι άλλοι χάνουν. Οπτική ανίχνευση πηγών περιβαλλοντικής ρύπανσης μέσω λεπτομερούς ανάλυσης φωτογραφιών.',
    flavorText: '"Μια εικόνα αποτυπώνει αυτό που τα λόγια δεν μπορούν να εξηγήσουν."',
    rarity: '⭐⭐',
    habitat: 'Πάρκα · Χώροι απορριμμάτων · Δρόμοι',
    stats: { visualDetection: 58, environmentalScan: 45, sightSpeed: 52, lensClarity: 50, visionRange: 42 },
    statLabels: { visualDetection: 'Οπτική ανίχνευση', environmentalScan: 'Περιβαλλοντική σάρωση', sightSpeed: 'Ταχύτητα όρασης', lensClarity: 'Διαύγεια φακού', visionRange: 'Εύρος όρασης' },
    evolutionThreshold: 50,
    evolvesTo: { audio: 'synthera', balanced: 'synthera', image: 'photomelis' },
    powerUpMessages: [
      'Οι εικόνες αποκάλυψαν κρυμμένη ρύπανση!',
      'Η Pollini εξελίχθηκε σε Snaplet!!!'
    ],
    avatarUrl: '/assets/characters/snaplet/avatar.png',
    cardUrl: '/assets/characters/snaplet/card.png'
  },
  equabee: {
    id: 'equabee',
    name: 'Equabee',
    level: 2,
    tier: 'Balanced Path',
    type: 'Nature / Harmony',
    title: 'Balance Keeper',
    description: 'Η Equabee έχει καταπληκτική όραση και ακοή. Είναι εξαιρετική στο να ανιχνεύει περιβαλλοντικές απειλές.',
    flavorText: '"Η αληθινή επίγνωση πηγάζει από την ισορροπία."',
    rarity: '⭐⭐',
    habitat: 'Forests · Rivers · Cities',
    stats: { detection: 50, environmental: 50, speed: 48, power: 45, harmony: 55 },
    statLabels: { detection: 'Ικανότητα ανίχνευσης', environmental: 'Περιβαλλοντική σάρωση', speed: 'Ταχύτητα (Πτήση)', power: 'Δύναμη', harmony: 'Ισορροπία' },
    evolutionThreshold: 50,
    evolvesTo: { audio: 'synthera', balanced: 'synthera', image: 'synthera' },
    powerUpMessages: [
      'Η Equabee βρήκε την ισορροπία στο χάος...',
      'Η Pollini εξελίχθηκε σε Equabee!!!'
    ],
    avatarUrl: '/assets/characters/equabee/avatar.png',
    cardUrl: '/assets/characters/equabee/card.png'
  },
  resonapis: {
    id: 'resonapis',
    name: 'Resonapis',
    level: 3,
    tier: 'Audio Path',
    type: 'Sound / Electric',
    title: 'Resonance Guardian',
    description: 'Η Resonapis μπορεί να ανιχνεύσει τους πιο ανεπαίσθητους ήχους. Η ακοή της ξεπερνά τα συνηθισμένα όρια.',
    flavorText: '"Κάθε συχνότητα λέει μια ιστορία του περιβάλλοντος."',
    rarity: '⭐⭐⭐',
    habitat: 'Forests · Rivers · Cities',
    stats: { listeningPower: 78, frequencyDetection: 72, noisePollutionSense: 80, speed: 60, resonanceEnergy: 70 },
    statLabels: { listeningPower: 'Δύναμη ακοής', frequencyDetection: 'Ανίχνευση συχνοτήτων', noisePollutionSense: 'Ανίχνευση ηχορύπανσης', speed: 'Ταχύτητα (Πτήση)', resonanceEnergy: 'Ενέργεια συντονισμού' },
    evolutionThreshold: 100,
    evolvesTo: { audio: 'echomelis', balanced: 'echomelis', image: 'echomelis' },
    powerUpMessages: [
      'Οι συχνότητες ευθυγραμμίστηκαν...',
      'Η BuzzTone εξελίχθηκε σε Resonapis!!!'
    ],
    avatarUrl: '/assets/characters/resonapis/avatar.png',
    cardUrl: '/assets/characters/resonapis/card.png'
  },
  photomelis: {
    id: 'photomelis',
    name: 'Photomelis',
    level: 3,
    tier: 'Image Path',
    type: 'Nature / Light',
    title: 'Light Guardian',
    description: 'Η Photomelis βλέπει τη ρύπανση σε κάθε φάσμα φωτός. Η προηγμένη οπτική της αποκαλύπτει αυτό που είναι αόρατο στο γυμνό μάτι.',
    flavorText: '"Το φως αποκαλύπτει την αλήθεια εκεί που οι σκιές κρύβουν τη ρύπανση."',
    rarity: '⭐⭐⭐',
    habitat: 'Forests · Rivers · Cities',
    stats: { visualDetection: 82, environmentalScan: 70, sightSpeed: 75, lensClarity: 78, visionRange: 68 },
    statLabels: { visualDetection: 'Οπτική ανίχνευση', environmentalScan: 'Περιβαλλοντική σάρωση', sightSpeed: 'Ταχύτητα όρασης', lensClarity: 'Διαύγεια φακού', visionRange: 'Εύρος όρασης' },
    evolutionThreshold: 100,
    evolvesTo: { audio: 'gaia-prism', balanced: 'gaia-prism', image: 'gaia-prism' },
    powerUpMessages: [
      'Ο φακός εστίασε στην αλήθεια...',
      'Η Snaplet εξελίχθηκε σε Photomelis!!!'
    ],
    avatarUrl: '/assets/characters/photomelis/avatar.png',
    cardUrl: '/assets/characters/photomelis/card.png'
  },
  synthera: {
    id: 'synthera',
    name: 'Synthera',
    level: 3,
    tier: 'Balanced Path',
    type: 'Nature / Harmony',
    title: 'Synthesis Guardian',
    description: 'Η Synthera συνδυάζει όλες τις αισθήσεις σε μία ενοποιημένη επίγνωση. Η τέλεια ισορροπία όρασης και ακοής δημιουργεί απαράμιλλη ανίχνευση.',
    flavorText: '"Στην αρμονία, όλα τα σήματα γίνονται καθαρά."',
    rarity: '⭐⭐⭐',
    habitat: 'All environments',
    stats: { detection: 72, environmental: 75, speed: 65, power: 68, harmony: 80 },
    statLabels: { detection: 'Ικανότητα ανίχνευσης', environmental: 'Περιβαλλοντική σάρωση', speed: 'Ταχύτητα (Πτήση)', power: 'Δύναμη', harmony: 'Ισορροπία' },
    evolutionThreshold: 100,
    evolvesTo: { audio: 'gaia-resonance', balanced: 'gaia-resonance', image: 'gaia-prism' },
    powerUpMessages: [
      'Όλες οι αισθήσεις ενώθηκαν σε μία...',
      'Η Equabee εξελίχθηκε σε Synthera!!!'
    ],
    avatarUrl: '/assets/characters/synthera/avatar.png',
    cardUrl: '/assets/characters/synthera/card.png'
  }
};

/**
 * Get character by ID
 */
export const getCharacter = (id: string): Character => {
  return EVOLUTION_TREE[id] || EVOLUTION_TREE.pollini;
};

/**
 * Get the evolution chain for a character (ancestors)
 */
export const getEvolutionChain = (characterId: string): Character[] => {
  const chain: Character[] = [];
  const character = EVOLUTION_TREE[characterId];
  if (!character) return [EVOLUTION_TREE.pollini];

  chain.push(EVOLUTION_TREE.pollini);

  if (character.level >= 2 && characterId !== 'pollini') {
    const level2Chars = Object.values(EVOLUTION_TREE).filter(c => c.level === 2);
    for (const l2 of level2Chars) {
      if (l2.id === characterId || Object.values(l2.evolvesTo).includes(characterId)) {
        if (l2.id !== 'pollini') chain.push(l2);
        break;
      }
    }
  }

  if (character.level >= 3 && characterId !== 'pollini') {
    chain.push(character);
  }

  if (chain.length === 1 && character.level === 2) {
    chain.push(character);
  }

  return chain;
};