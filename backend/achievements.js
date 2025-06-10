// Achievement system
const achievements = {
  // Exploration achievements
  first_steps: {
    name: "First Steps",
    description: "Take your first steps into the forest",
    condition: (state) => state.commandsUsed >= 1,
    reward: "explorer_badge",
    points: 10
  },
  
  pathfinder: {
    name: "Pathfinder",
    description: "Discover 5 different locations",
    condition: (state) => state.discovered.length >= 5,
    reward: "compass",
    points: 25
  },
  
  explorer: {
    name: "Explorer",
    description: "Discover 10 different locations",
    condition: (state) => state.discovered.length >= 10,
    reward: "map_fragment",
    points: 50
  },
  
  master_explorer: {
    name: "Master Explorer",
    description: "Discover all locations in the forest",
    condition: (state) => state.discovered.length >= 15,
    reward: "master_map",
    points: 100
  },
  
  // Combat achievements
  first_blood: {
    name: "First Blood",
    description: "Win your first combat encounter",
    condition: (state) => state.combatWins >= 1,
    reward: "warrior_badge",
    points: 15
  },
  
  wolf_slayer: {
    name: "Wolf Slayer",
    description: "Defeat 5 wolves",
    condition: (state) => (state.creaturesDefeated?.wolf || 0) >= 5,
    reward: "wolf_fang_necklace",
    points: 30
  },
  
  troll_hunter: {
    name: "Troll Hunter",
    description: "Defeat a cave troll",
    condition: (state) => (state.creaturesDefeated?.cave_troll || 0) >= 1,
    reward: "troll_club",
    points: 75
  },
  
  spirit_walker: {
    name: "Spirit Walker",
    description: "Defeat a guardian spirit",
    condition: (state) => (state.creaturesDefeated?.guardian_spirit || 0) >= 1,
    reward: "spirit_essence",
    points: 60
  },
  
  // Collection achievements
  collector: {
    name: "Collector",
    description: "Collect 10 different items",
    condition: (state) => state.uniqueItemsCollected >= 10,
    reward: "collector_bag",
    points: 40
  },
  
  hoarder: {
    name: "Hoarder",
    description: "Collect 25 different items",
    condition: (state) => state.uniqueItemsCollected >= 25,
    reward: "magical_backpack",
    points: 80
  },
  
  treasure_hunter: {
    name: "Treasure Hunter",
    description: "Find a hidden treasure",
    condition: (state) => state.hiddenTreasuresFound >= 1,
    reward: "treasure_map",
    points: 35
  },
  
  // Skill achievements
  skilled_survivor: {
    name: "Skilled Survivor",
    description: "Reach level 10 in survival skill",
    condition: (state) => (state.skills?.survival || 0) >= 10,
    reward: "survival_manual",
    points: 30
  },
  
  master_survivor: {
    name: "Master Survivor",
    description: "Reach level 50 in survival skill",
    condition: (state) => (state.skills?.survival || 0) >= 50,
    reward: "master_survival_gear",
    points: 100
  },
  
  stealth_master: {
    name: "Stealth Master",
    description: "Reach level 25 in stealth skill",
    condition: (state) => (state.skills?.stealth || 0) >= 25,
    reward: "shadow_cloak",
    points: 60
  },
  
  wise_sage: {
    name: "Wise Sage",
    description: "Reach level 30 in knowledge skill",
    condition: (state) => (state.skills?.knowledge || 0) >= 30,
    reward: "ancient_tome",
    points: 70
  },
  
  diplomat: {
    name: "Diplomat",
    description: "Reach level 20 in diplomacy skill",
    condition: (state) => (state.skills?.diplomacy || 0) >= 20,
    reward: "peace_treaty",
    points: 50
  },
  
  // Puzzle achievements
  puzzle_solver: {
    name: "Puzzle Solver",
    description: "Solve your first puzzle",
    condition: (state) => (state.completedPuzzles?.length || 0) >= 1,
    reward: "puzzle_master_badge",
    points: 25
  },
  
  riddle_master: {
    name: "Riddle Master",
    description: "Solve 5 different riddles",
    condition: (state) => (state.riddlesSolved || 0) >= 5,
    reward: "riddle_book",
    points: 60
  },
  
  pattern_recognition: {
    name: "Pattern Recognition",
    description: "Solve 3 pattern-based puzzles",
    condition: (state) => (state.patternPuzzlesSolved || 0) >= 3,
    reward: "pattern_analyzer",
    points: 45
  },
  
  // Social achievements
  friend_maker: {
    name: "Friend Maker",
    description: "Befriend 3 different NPCs",
    condition: (state) => {
      const friendlyNPCs = Object.values(state.npcRelations || {}).filter(relation => relation > 20);
      return friendlyNPCs.length >= 3;
    },
    reward: "friendship_bracelet",
    points: 35
  },
  
  peacekeeper: {
    name: "Peacekeeper",
    description: "Resolve 5 conflicts without violence",
    condition: (state) => (state.peacefulResolutions || 0) >= 5,
    reward: "peace_medal",
    points: 50
  },
  
  // Survival achievements
  survivor: {
    name: "Survivor",
    description: "Survive for 5 in-game days",
    condition: (state) => (state.dayCount || 1) >= 5,
    reward: "survival_kit",
    points: 40
  },
  
  endurance_runner: {
    name: "Endurance Runner",
    description: "Survive for 10 in-game days",
    condition: (state) => (state.dayCount || 1) >= 10,
    reward: "endurance_medal",
    points: 75
  },
  
  weather_master: {
    name: "Weather Master",
    description: "Experience all types of weather",
    condition: (state) => (state.weatherExperienced?.length || 0) >= 6,
    reward: "weather_charm",
    points: 55
  },
  
  // Time achievements
  night_owl: {
    name: "Night Owl",
    description: "Spend 10 actions during nighttime",
    condition: (state) => (state.nightActions || 0) >= 10,
    reward: "night_vision_potion",
    points: 30
  },
  
  early_bird: {
    name: "Early Bird",
    description: "Spend 10 actions during dawn",
    condition: (state) => (state.dawnActions || 0) >= 10,
    reward: "morning_energy_boost",
    points: 25
  },
  
  // Special achievements
  dream_walker: {
    name: "Dream Walker",
    description: "Enter the Dream Realm",
    condition: (state) => state.location === 'dream_realm',
    reward: "dream_walking_ability",
    points: 150
  },
  
  reality_weaver: {
    name: "Reality Weaver",
    description: "Obtain the Reality Shard",
    condition: (state) => state.inventory.includes('reality_shard'),
    reward: "reality_manipulation",
    points: 200
  },
  
  crystal_keeper: {
    name: "Crystal Keeper",
    description: "Obtain the Dream Crystal",
    condition: (state) => state.inventory.includes('dream_crystal'),
    reward: "dream_mastery",
    points: 250
  },
  
  true_ending: {
    name: "True Ending",
    description: "Discover the true ending of the story",
    condition: (state) => state.ending === 'true_ending',
    reward: "eternal_dreamer",
    points: 500
  },
  
  // Hidden achievements
  secret_finder: {
    name: "Secret Finder",
    description: "Discover a hidden secret",
    condition: (state) => (state.secrets?.length || 0) >= 1,
    reward: "secret_knowledge",
    points: 100,
    hidden: true
  },
  
  speed_runner: {
    name: "Speed Runner",
    description: "Complete the game in under 50 commands",
    condition: (state) => state.ending && (state.commandsUsed || 0) <= 50,
    reward: "speed_runner_badge",
    points: 300,
    hidden: true
  },
  
  pacifist: {
    name: "Pacifist",
    description: "Complete the game without defeating any creatures",
    condition: (state) => state.ending && (state.combatWins || 0) === 0,
    reward: "pacifist_medal",
    points: 400,
    hidden: true
  },
  
  completionist: {
    name: "Completionist",
    description: "Unlock all non-hidden achievements",
    condition: (state) => {
      const unlockedAchievements = state.achievements?.length || 0;
      const totalNonHidden = Object.values(achievements).filter(a => !a.hidden).length;
      return unlockedAchievements >= totalNonHidden;
    },
    reward: "completionist_crown",
    points: 1000,
    hidden: true
  }
};

// Check for achievements
function checkAchievements(state, userId) {
  const newState = { ...state };
  const newlyUnlocked = [];
  
  // Initialize achievements array if it doesn't exist
  if (!newState.achievements) {
    newState.achievements = [];
  }
  
  // Check each achievement
  for (const [achievementId, achievement] of Object.entries(achievements)) {
    // Skip if already unlocked
    if (newState.achievements.includes(achievementId)) {
      continue;
    }
    
    // Check if achievement condition is met
    if (achievement.condition(newState)) {
      newState.achievements.push(achievementId);
      newlyUnlocked.push(achievement);
      
      // Apply achievement reward
      applyAchievementReward(newState, achievement);
    }
  }
  
  return {
    unlocked: newlyUnlocked.length > 0,
    achievements: newlyUnlocked,
    newState: newState
  };
}

// Apply achievement reward
function applyAchievementReward(state, achievement) {
  switch (achievement.reward) {
    case "explorer_badge":
      state.skills.exploration = Math.min(100, (state.skills.exploration || 0) + 5);
      break;
      
    case "compass":
      state.inventory.push("compass");
      break;
      
    case "map_fragment":
      state.inventory.push("map_fragment");
      break;
      
    case "master_map":
      state.inventory.push("master_map");
      state.flags.hasCompleteMap = true;
      break;
      
    case "warrior_badge":
      state.skills.combat = Math.min(100, (state.skills.combat || 0) + 10);
      break;
      
    case "wolf_fang_necklace":
      state.inventory.push("wolf_fang_necklace");
      state.skills.intimidation = Math.min(100, (state.skills.intimidation || 0) + 5);
      break;
      
    case "troll_club":
      state.inventory.push("troll_club");
      break;
      
    case "spirit_essence":
      state.inventory.push("spirit_essence");
      state.skills.magic = Math.min(100, (state.skills.magic || 0) + 15);
      break;
      
    case "collector_bag":
      state.inventory.push("collector_bag");
      state.flags.increasedInventory = true;
      break;
      
    case "magical_backpack":
      state.inventory.push("magical_backpack");
      state.flags.largeInventory = true;
      break;
      
    case "treasure_map":
      state.inventory.push("treasure_map");
      break;
      
    case "survival_manual":
      state.inventory.push("survival_manual");
      state.skills.survival = Math.min(100, (state.skills.survival || 0) + 10);
      break;
      
    case "master_survival_gear":
      state.inventory.push("master_survival_gear");
      state.flags.masterSurvivor = true;
      break;
      
    case "shadow_cloak":
      state.inventory.push("shadow_cloak");
      state.skills.stealth = Math.min(100, (state.skills.stealth || 0) + 15);
      break;
      
    case "ancient_tome":
      state.inventory.push("ancient_tome");
      state.skills.knowledge = Math.min(100, (state.skills.knowledge || 0) + 20);
      break;
      
    case "peace_treaty":
      state.inventory.push("peace_treaty");
      state.skills.diplomacy = Math.min(100, (state.skills.diplomacy || 0) + 15);
      break;
      
    case "puzzle_master_badge":
      state.skills.puzzle_solving = Math.min(100, (state.skills.puzzle_solving || 0) + 10);
      break;
      
    case "riddle_book":
      state.inventory.push("riddle_book");
      break;
      
    case "pattern_analyzer":
      state.inventory.push("pattern_analyzer");
      break;
      
    case "friendship_bracelet":
      state.inventory.push("friendship_bracelet");
      break;
      
    case "peace_medal":
      state.inventory.push("peace_medal");
      break;
      
    case "survival_kit":
      state.inventory.push("survival_kit");
      break;
      
    case "endurance_medal":
      state.inventory.push("endurance_medal");
      break;
      
    case "weather_charm":
      state.inventory.push("weather_charm");
      break;
      
    case "night_vision_potion":
      state.inventory.push("night_vision_potion");
      break;
      
    case "morning_energy_boost":
      state.inventory.push("morning_energy_boost");
      break;
      
    case "dream_walking_ability":
      state.flags.canDreamWalk = true;
      break;
      
    case "reality_manipulation":
      state.flags.canManipulateReality = true;
      break;
      
    case "dream_mastery":
      state.flags.dreamMaster = true;
      break;
      
    case "eternal_dreamer":
      state.flags.eternalDreamer = true;
      break;
      
    case "secret_knowledge":
      state.skills.knowledge = Math.min(100, (state.skills.knowledge || 0) + 25);
      break;
      
    case "speed_runner_badge":
      state.flags.speedRunner = true;
      break;
      
    case "pacifist_medal":
      state.flags.pacifist = true;
      break;
      
    case "completionist_crown":
      state.flags.completionist = true;
      break;
  }
}

// Unlock specific achievement
function unlockAchievement(state, achievementId) {
  const achievement = achievements[achievementId];
  if (!achievement) {
    return {
      success: false,
      message: "Achievement not found."
    };
  }
  
  if (state.achievements && state.achievements.includes(achievementId)) {
    return {
      success: false,
      message: "Achievement already unlocked."
    };
  }
  
  const newState = { ...state };
  if (!newState.achievements) newState.achievements = [];
  
  newState.achievements.push(achievementId);
  applyAchievementReward(newState, achievement);
  
  return {
    success: true,
    message: `Achievement unlocked: ${achievement.name} - ${achievement.description}`,
    newState: newState
  };
}

// Get achievement progress
function getAchievementProgress(state) {
  const progress = {};
  
  for (const [achievementId, achievement] of Object.entries(achievements)) {
    const isUnlocked = state.achievements && state.achievements.includes(achievementId);
    
    progress[achievementId] = {
      name: achievement.name,
      description: achievement.description,
      unlocked: isUnlocked,
      points: achievement.points,
      hidden: achievement.hidden || false
    };
  }
  
  return progress;
}

// Get total achievement points
function getTotalAchievementPoints(state) {
  if (!state.achievements) return 0;
  
  return state.achievements.reduce((total, achievementId) => {
    const achievement = achievements[achievementId];
    return total + (achievement ? achievement.points : 0);
  }, 0);
}

// Get achievement statistics
function getAchievementStats(state) {
  const totalAchievements = Object.keys(achievements).length;
  const unlockedAchievements = state.achievements ? state.achievements.length : 0;
  const totalPoints = getTotalAchievementPoints(state);
  
  return {
    total: totalAchievements,
    unlocked: unlockedAchievements,
    locked: totalAchievements - unlockedAchievements,
    progress: Math.round((unlockedAchievements / totalAchievements) * 100),
    points: totalPoints
  };
}

module.exports = {
  checkAchievements,
  unlockAchievement,
  getAchievementProgress,
  getTotalAchievementPoints,
  getAchievementStats,
  achievements
}; 