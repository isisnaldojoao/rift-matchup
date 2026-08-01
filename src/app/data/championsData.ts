import { champions as allChampionVariants, type Champion as FullChampion } from '../../../champions';

export interface MatchupDetails {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  winRate: string;
  runes: {
    primary: string;
    keystone: string;
    secondary: string;
  };
  startingItems: string[];
  coreBuild: string[];
  defensiveOption: string;
  tips: string[];
}

export type Champion = FullChampion;

const championIndex = new Map<string, FullChampion>();
for (const champ of allChampionVariants) {
  const normalizedName = champ.name.trim().toLowerCase();
  if (!championIndex.has(normalizedName)) {
    championIndex.set(normalizedName, champ);
  }
}

export const champions: Champion[] = Array.from(championIndex.values());

// Seeded popular matchups
export const seededMatchups: { [key: string]: MatchupDetails } = {
  'Ahri_Zed': {
    difficulty: 'Hard',
    winRate: '48.2%',
    runes: {
      primary: 'Inspiration',
      keystone: 'Glacial Augment',
      secondary: 'Resolve (Bone Plating)'
    },
    startingItems: ['Doran Shield', 'Health Potion'],
    coreBuild: ['Luden Companion', 'Zhonya Hourglass', 'Shadowflame'],
    defensiveOption: 'Seeker Armguard (early buy)',
    tips: [
      'Save your Charm (E) for when Zed uses his Death Mark (R). He always spawns directly behind your champion, so throw Charm backward instantly.',
      'Rush Seeker\'s Armguard or Ninja Tabi early. Minimizing his early flat armor penetration reduces his burst threat.',
      'Abuse your range advantage at level 1 and 2 with auto-attacks and Q. Do not let him thin the wave without trading.'
    ]
  },
  'Zed_Ahri': {
    difficulty: 'Easy',
    winRate: '51.8%',
    runes: {
      primary: 'Domination',
      keystone: 'Electrocute',
      secondary: 'Sorcery (Transcendence)'
    },
    startingItems: ['Doran Blade', 'Health Potion'],
    coreBuild: ['Opportunity', 'Hubris', 'Serylda Grudge'],
    defensiveOption: 'Edge of Night',
    tips: [
      'Bait out her Charm (E) before committing to a shadow swap (W) or ultimate engage.',
      'Use your W-E-Q combo to poke her from a distance. If she drops below 50% HP, you have lethal pressure with R.',
      'Roam to side lanes. Zed has much faster river rotations and skirmish damage than Ahri early on.'
    ]
  },
  'Aatrox_Jax': {
    difficulty: 'Hard',
    winRate: '47.9%',
    runes: {
      primary: 'Precision',
      keystone: 'Conqueror',
      secondary: 'Resolve (Second Wind)'
    },
    startingItems: ['Doran Shield', 'Health Potion'],
    coreBuild: ['Eclipse', 'Sundered Sky', 'Sterak Gage'],
    defensiveOption: 'Plated Steelcaps',
    tips: [
      'Jax can dodge your passive auto-attack heal using his Counter Strike (E). Do not auto-attack while his helicopter animation is spinning.',
      'Use your Q1 and Q2 sweet spots to poke him when he steps up. Save your Umbral Dash (E) to dash away when he jumps at you with Q.',
      'If he misses his jump (Q) or Counter Strike (E), you have a 12-second window where you win all trades.'
    ]
  },
  'Jax_Aatrox': {
    difficulty: 'Easy',
    winRate: '52.1%',
    runes: {
      primary: 'Precision',
      keystone: 'Lethal Tempo',
      secondary: 'Resolve (Bone Plating)'
    },
    startingItems: ['Doran Blade', 'Health Potion'],
    coreBuild: ['Trinity Force', 'Sundered Sky', 'Frozen Heart'],
    defensiveOption: 'Thornmail',
    tips: [
      'Save your Leap Strike (Q) to jump onto him when he channels his Q1 or Q2. Fight inside his sweet spot where his damage is lowest.',
      'Use Counter Strike (E) to block his passive enhanced auto-attack. He cannot trade back once you stun him.',
      'Build Executioner\'s Calling or Bramble Vest early to cut down his built-in healing.'
    ]
  },
  'Irelia_Renekton': {
    difficulty: 'Hard',
    winRate: '46.8%',
    runes: {
      primary: 'Precision',
      keystone: 'Conqueror',
      secondary: 'Resolve (Bone Plating)'
    },
    startingItems: ['Doran Blade', 'Health Potion'],
    coreBuild: ['Blade of the Ruined King', 'Wit End', 'Death Dance'],
    defensiveOption: 'Plated Steelcaps',
    tips: [
      'Play safe levels 1-2. Renekton\'s early fury trades are far stronger than yours.',
      'Never fight when his red bar is full (50+ fury) as his empowered stun will shred your health.',
      'Try to stack your passive on minions before engaging, and use Defiant Dance (W) to block his stun combo.'
    ]
  }
};

// Fallback generator for matchups that are not seeded
export function getDynamicMatchup(champ: Champion, enemy: Champion): MatchupDetails {
  const isHard = champ.role === 'Support' && enemy.role !== 'Support';
  const difficulty = isHard ? 'Hard' : (champ.name.length % 2 === 0 ? 'Medium' : 'Easy');
  const winRate = difficulty === 'Hard' ? '46.5%' : difficulty === 'Medium' ? '50.2%' : '53.1%';

  // Dynamic Runes
  let primary = 'Precision';
  let keystone = 'Conqueror';
  let secondary = 'Resolve (Bone Plating)';

  if (champ.primaryType === 'AP Magic') {
    primary = 'Sorcery';
    keystone = 'Comet';
    secondary = 'Inspiration (Biscuit)';
  } else if (champ.primaryType === 'Tank') {
    primary = 'Resolve';
    keystone = 'Grasp of the Undying';
    secondary = 'Precision (Tenacity)';
  }

  // Dynamic Items
  let start = 'Doran Blade';
  let core = ['Trinity Force', 'Sundered Sky', 'Sterak Gage'];
  let def = 'Plated Steelcaps';

  if (champ.primaryType === 'AP Magic') {
    start = 'Doran Ring';
    core = ['Luden Companion', 'Zhonya Hourglass', 'Rabadon Deathcap'];
    def = 'Banshee Veil';
  } else if (champ.primaryType === 'Tank') {
    start = 'Doran Shield';
    core = ['Sunfire Aegis', 'JakSho', 'Kaenic Rookern'];
    def = 'Thornmail';
  }

  // Tailored tips based on types
  const tips = [
    `Since you are playing ${champ.name} (${champ.primaryType}) into ${enemy.name} (${enemy.primaryType}), focus on capitalising on your items.`,
    enemy.primaryType === 'AP Magic'
      ? 'The enemy deals magic damage. Consider purchasing Magic Resistance (e.g. Hexdrinker or Negatron Cloak) early to survive lane burst.'
      : 'The enemy deals physical damage. Focus on building early armor (Plated Steelcaps or Warden Shroud) to shut down their trading.',
    'Control the minion wave. Slow push the wave when you have a wave size advantage and trade only when they try to secure cannon minions.'
  ];

  return {
    difficulty,
    winRate,
    runes: { primary, keystone, secondary },
    startingItems: [start, 'Health Potion'],
    coreBuild: core,
    defensiveOption: def,
    tips
  };
}

export function getMatchup(yourChampName: string, opponentChampName: string): MatchupDetails {
  const key = `${yourChampName}_${opponentChampName}`;
  if (seededMatchups[key]) {
    return seededMatchups[key];
  }
  
  const mine = champions.find(c => c.name === yourChampName) || { name: yourChampName, role: 'Mid', primaryType: 'AP Magic', icon: '' } as Champion;
  const theirs = champions.find(c => c.name === opponentChampName) || { name: opponentChampName, role: 'Mid', primaryType: 'AD Physical', icon: '' } as Champion;
  
  return getDynamicMatchup(mine, theirs);
}
