// Combat system and creature encounters
const creatures = {
  wolf: {
    name: "Forest Wolf",
    health: 50,
    attack: 15,
    defense: 8,
    speed: 12,
    behavior: "aggressive",
    drops: ["wolf_fang", "wolf_pelt"],
    xp: 25,
    description: "A fierce wolf with sharp teeth and hungry eyes.",
    weaknesses: ["fire", "loud_noises"],
    strengths: ["pack_tactics", "night_vision"],
    special_abilities: ["howl", "pack_call"]
  },
  
  cave_troll: {
    name: "Cave Troll",
    health: 100,
    attack: 25,
    defense: 15,
    speed: 5,
    behavior: "territorial",
    drops: ["troll_club", "troll_skin"],
    xp: 50,
    description: "A massive troll with thick skin and a heavy club.",
    weaknesses: ["light", "fire"],
    strengths: ["strength", "durability"],
    special_abilities: ["smash", "regeneration"]
  },
  
  bat: {
    name: "Cave Bat",
    health: 20,
    attack: 8,
    defense: 3,
    speed: 18,
    behavior: "cautious",
    drops: ["bat_wing"],
    xp: 10,
    description: "A small bat that hangs from the cave ceiling.",
    weaknesses: ["light", "loud_noises"],
    strengths: ["flight", "echolocation"],
    special_abilities: ["sonic_scream", "flight"]
  },
  
  mysterious_figure: {
    name: "Mysterious Figure",
    health: 75,
    attack: 20,
    defense: 12,
    speed: 10,
    behavior: "defensive",
    drops: ["mysterious_cloak", "ancient_scroll"],
    xp: 40,
    description: "A shadowy figure whose face is hidden in darkness.",
    weaknesses: ["light", "truth"],
    strengths: ["stealth", "magic"],
    special_abilities: ["shadow_step", "mind_control"]
  },
  
  guardian_spirit: {
    name: "Guardian Spirit",
    health: 80,
    attack: 18,
    defense: 10,
    speed: 15,
    behavior: "protective",
    drops: ["spirit_essence"],
    xp: 35,
    description: "An ethereal spirit that guards ancient places.",
    weaknesses: ["holy_weapons", "respect"],
    strengths: ["magic", "intangibility"],
    special_abilities: ["spirit_form", "ancient_magic"]
  },
  
  water_nymph: {
    name: "Water Nymph",
    health: 60,
    attack: 12,
    defense: 8,
    speed: 14,
    behavior: "alluring",
    drops: ["nymph_tear", "water_crystal"],
    xp: 30,
    description: "A beautiful nymph with water flowing around her.",
    weaknesses: ["fire", "dehydration"],
    strengths: ["water_control", "charm"],
    special_abilities: ["water_burst", "charm_person"]
  },
  
  fairy: {
    name: "Forest Fairy",
    health: 30,
    attack: 10,
    defense: 5,
    speed: 20,
    behavior: "mischievous",
    drops: ["fairy_dust", "enchanted_flower"],
    xp: 20,
    description: "A tiny fairy with sparkling wings.",
    weaknesses: ["iron", "cold"],
    strengths: ["magic", "flight"],
    special_abilities: ["fairy_dust", "illusion"]
  },
  
  dryad: {
    name: "Ancient Dryad",
    health: 90,
    attack: 16,
    defense: 12,
    speed: 8,
    behavior: "peaceful",
    drops: ["dryad_bark", "healing_sap"],
    xp: 45,
    description: "A tree-like being with ancient wisdom.",
    weaknesses: ["fire", "axes"],
    strengths: ["healing", "nature_magic"],
    special_abilities: ["heal", "entangle"]
  },
  
  temple_guardian: {
    name: "Temple Guardian",
    health: 120,
    attack: 22,
    defense: 18,
    speed: 10,
    behavior: "dutiful",
    drops: ["guardian_armor", "temple_key"],
    xp: 60,
    description: "A powerful guardian with ancient armor.",
    weaknesses: ["magic", "wisdom"],
    strengths: ["strength", "protection"],
    special_abilities: ["shield_bash", "divine_protection"]
  },
  
  ancient_one: {
    name: "The Ancient One",
    health: 200,
    attack: 30,
    defense: 25,
    speed: 15,
    behavior: "transcendent",
    drops: ["dream_crystal", "reality_shard"],
    xp: 100,
    description: "A being of pure energy and ancient power.",
    weaknesses: ["understanding", "truth"],
    strengths: ["reality_manipulation", "immortality"],
    special_abilities: ["reality_shift", "dream_walking"]
  }
};

// Calculate combat stats
function calculateCombat(playerState, creatureName) {
  const creature = creatures[creatureName];
  if (!creature) {
    return {
      canFight: false,
      message: "There's nothing to fight here."
    };
  }
  
  // Calculate player combat stats
  const playerStats = {
    health: playerState.health || 100,
    attack: 10 + (playerState.skills?.combat || 0),
    defense: 5 + (playerState.skills?.defense || 0),
    speed: 10 + (playerState.skills?.agility || 0)
  };
  
  // Check if player has weapons
  const weapons = playerState.inventory.filter(item => 
    item.includes('sword') || item.includes('axe') || item.includes('staff') || 
    item.includes('bow') || item.includes('dagger')
  );
  
  if (weapons.length > 0) {
    playerStats.attack += weapons.length * 5;
  }
  
  // Check if player has armor
  const armor = playerState.inventory.filter(item => 
    item.includes('armor') || item.includes('shield') || item.includes('helmet')
  );
  
  if (armor.length > 0) {
    playerStats.defense += armor.length * 3;
  }
  
  return {
    canFight: true,
    playerStats,
    creatureStats: creature,
    message: `You prepare to fight the ${creature.name}.`
  };
}

// Process combat
function processCombat(playerState, creatureName, action) {
  const combatData = calculateCombat(playerState, creatureName);
  
  if (!combatData.canFight) {
    return {
      success: false,
      message: combatData.message,
      newState: playerState
    };
  }
  
  const newState = { ...playerState };
  const creature = combatData.creatureStats;
  let message = "";
  let combatResult = null;
  
  switch (action) {
    case "attack":
      combatResult = performAttack(combatData.playerStats, creature, newState);
      break;
      
    case "defend":
      combatResult = performDefense(combatData.playerStats, creature, newState);
      break;
      
    case "flee":
      combatResult = performFlee(combatData.playerStats, creature, newState);
      break;
      
    case "use_item":
      combatResult = performItemUse(newState, creature);
      break;
      
    case "talk":
      combatResult = performNegotiation(newState, creature);
      break;
      
    default:
      return {
        success: false,
        message: "Invalid combat action. Try: attack, defend, flee, use item, or talk.",
        newState: playerState
      };
  }
  
  // Apply combat results
  newState.health = combatResult.playerHealth;
  newState.combatState = combatResult.combatState;
  
  // Update skills based on combat
  if (!newState.skills) newState.skills = {};
  if (!newState.skills.combat) newState.skills.combat = 0;
  newState.skills.combat = Math.min(100, newState.skills.combat + 1);
  
  return {
    success: true,
    message: combatResult.message,
    newState: newState,
    combatResult: combatResult
  };
}

// Perform attack
function performAttack(playerStats, creature, playerState) {
  const attackRoll = Math.random() * 20 + playerStats.attack;
  const defenseRoll = Math.random() * 20 + creature.defense;
  
  if (attackRoll > defenseRoll) {
    const damage = Math.max(1, attackRoll - defenseRoll);
    creature.health = Math.max(0, creature.health - damage);
    
    let message = `You hit the ${creature.name} for ${Math.round(damage)} damage!`;
    
    if (creature.health <= 0) {
      message += `\n\n🎉 You defeated the ${creature.name}!`;
      
      // Give rewards
      if (creature.drops) {
        for (const drop of creature.drops) {
          playerState.inventory.push(drop);
        }
        message += `\nYou found: ${creature.drops.join(', ')}`;
      }
      
      if (creature.xp) {
        playerState.xp = (playerState.xp || 0) + creature.xp;
        message += `\nYou gained ${creature.xp} experience points!`;
      }
      
      return {
        playerHealth: playerState.health,
        creatureHealth: 0,
        message: message,
        combatState: "victory"
      };
    } else {
      // Creature counter-attack
      const counterAttack = performCounterAttack(playerStats, creature, playerState);
      message += `\n\n${counterAttack.message}`;
      
      return {
        playerHealth: counterAttack.playerHealth,
        creatureHealth: creature.health,
        message: message,
        combatState: counterAttack.playerHealth <= 0 ? "defeat" : "ongoing"
      };
    }
  } else {
    const message = `Your attack misses the ${creature.name}!`;
    
    // Creature counter-attack
    const counterAttack = performCounterAttack(playerStats, creature, playerState);
    
    return {
      playerHealth: counterAttack.playerHealth,
      creatureHealth: creature.health,
      message: message + "\n\n" + counterAttack.message,
      combatState: counterAttack.playerHealth <= 0 ? "defeat" : "ongoing"
    };
  }
}

// Perform defense
function performDefense(playerStats, creature, playerState) {
  const defenseBonus = 5;
  const attackRoll = Math.random() * 20 + creature.attack;
  const defenseRoll = Math.random() * 20 + playerStats.defense + defenseBonus;
  
  if (attackRoll > defenseRoll) {
    const damage = Math.max(1, (attackRoll - defenseRoll) * 0.5); // Reduced damage when defending
    playerState.health = Math.max(0, playerState.health - damage);
    
    return {
      playerHealth: playerState.health,
      creatureHealth: creature.health,
      message: `You block the ${creature.name}'s attack, taking only ${Math.round(damage)} damage.`,
      combatState: playerState.health <= 0 ? "defeat" : "ongoing"
    };
  } else {
    return {
      playerHealth: playerState.health,
      creatureHealth: creature.health,
      message: `You successfully block the ${creature.name}'s attack!`,
      combatState: "ongoing"
    };
  }
}

// Perform flee
function performFlee(playerStats, creature, playerState) {
  const fleeRoll = Math.random() * 20 + playerStats.speed;
  const pursuitRoll = Math.random() * 20 + creature.speed;
  
  if (fleeRoll > pursuitRoll) {
    return {
      playerHealth: playerState.health,
      creatureHealth: creature.health,
      message: `You successfully flee from the ${creature.name}!`,
      combatState: "fled"
    };
  } else {
    // Failed to flee, take damage
    const damage = Math.max(1, creature.attack * 0.5);
    playerState.health = Math.max(0, playerState.health - damage);
    
    return {
      playerHealth: playerState.health,
      creatureHealth: creature.health,
      message: `You fail to escape! The ${creature.name} catches you and deals ${Math.round(damage)} damage.`,
      combatState: playerState.health <= 0 ? "defeat" : "ongoing"
    };
  }
}

// Perform item use
function performItemUse(playerState, creature) {
  // Check for useful items
  const usefulItems = playerState.inventory.filter(item => 
    item.includes('potion') || item.includes('scroll') || item.includes('bomb') ||
    item.includes('torch') || item.includes('crystal')
  );
  
  if (usefulItems.length === 0) {
    return {
      playerHealth: playerState.health,
      creatureHealth: creature.health,
      message: "You don't have any useful items to use in combat.",
      combatState: "ongoing"
    };
  }
  
  // Use the first useful item
  const item = usefulItems[0];
  const itemIndex = playerState.inventory.indexOf(item);
  playerState.inventory.splice(itemIndex, 1);
  
  let message = "";
  let effect = null;
  
  switch (item) {
    case "health_potion":
      playerState.health = Math.min(100, playerState.health + 30);
      message = "You drink a health potion and feel much better!";
      break;
      
    case "fire_bomb":
      if (creature.weaknesses.includes("fire")) {
        creature.health = Math.max(0, creature.health - 25);
        message = `The fire bomb is especially effective against the ${creature.name}!`;
      } else {
        creature.health = Math.max(0, creature.health - 15);
        message = `You throw a fire bomb at the ${creature.name}!`;
      }
      break;
      
    case "torch":
      if (creature.weaknesses.includes("light")) {
        creature.health = Math.max(0, creature.health - 10);
        message = `The light from the torch hurts the ${creature.name}!`;
      } else {
        message = "You brandish the torch, but it has no special effect.";
      }
      break;
      
    case "magic_scroll":
      creature.health = Math.max(0, creature.health - 20);
      message = `You cast a spell from the magic scroll, damaging the ${creature.name}!`;
      break;
      
    default:
      message = `You use the ${item}, but it has no effect in combat.`;
  }
  
  // Creature counter-attack if still alive
  if (creature.health > 0) {
    const counterAttack = performCounterAttack({ defense: 5 }, creature, playerState);
    message += "\n\n" + counterAttack.message;
    
    return {
      playerHealth: counterAttack.playerHealth,
      creatureHealth: creature.health,
      message: message,
      combatState: counterAttack.playerHealth <= 0 ? "defeat" : "ongoing"
    };
  } else {
    message += `\n\n🎉 You defeated the ${creature.name}!`;
    
    // Give rewards
    if (creature.drops) {
      for (const drop of creature.drops) {
        playerState.inventory.push(drop);
      }
      message += `\nYou found: ${creature.drops.join(', ')}`;
    }
    
    return {
      playerHealth: playerState.health,
      creatureHealth: 0,
      message: message,
      combatState: "victory"
    };
  }
}

// Perform negotiation
function performNegotiation(playerState, creature) {
  const diplomacySkill = playerState.skills?.diplomacy || 0;
  const negotiationRoll = Math.random() * 20 + diplomacySkill;
  
  // Some creatures can't be negotiated with
  if (creature.behavior === "aggressive" || creature.behavior === "territorial") {
    return {
      playerHealth: playerState.health,
      creatureHealth: creature.health,
      message: `The ${creature.name} is too aggressive to negotiate with!`,
      combatState: "ongoing"
    };
  }
  
  if (negotiationRoll >= 15) {
    // Successful negotiation
    playerState.skills.diplomacy = Math.min(100, diplomacySkill + 5);
    
    return {
      playerHealth: playerState.health,
      creatureHealth: creature.health,
      message: `You successfully negotiate with the ${creature.name}. It allows you to pass peacefully.`,
      combatState: "negotiated"
    };
  } else {
    // Failed negotiation, creature attacks
    const counterAttack = performCounterAttack({ defense: 5 }, creature, playerState);
    
    return {
      playerHealth: counterAttack.playerHealth,
      creatureHealth: creature.health,
      message: `Your negotiation attempt fails, and the ${creature.name} attacks!`,
      combatState: counterAttack.playerHealth <= 0 ? "defeat" : "ongoing"
    };
  }
}

// Perform counter attack
function performCounterAttack(playerStats, creature, playerState) {
  const attackRoll = Math.random() * 20 + creature.attack;
  const defenseRoll = Math.random() * 20 + playerStats.defense;
  
  if (attackRoll > defenseRoll) {
    const damage = Math.max(1, attackRoll - defenseRoll);
    playerState.health = Math.max(0, playerState.health - damage);
    
    return {
      playerHealth: playerState.health,
      message: `The ${creature.name} attacks you for ${Math.round(damage)} damage!`
    };
  } else {
    return {
      playerHealth: playerState.health,
      message: `The ${creature.name}'s attack misses you!`
    };
  }
}

// Check for random encounters
function checkRandomEncounter(state) {
  const currentLocation = state.location;
  const time = state.time;
  const weather = state.weather;
  
  // Base encounter chance
  let encounterChance = 0.1; // 10% base chance
  
  // Modify based on time
  if (time === 'night') encounterChance += 0.1;
  if (time === 'midnight') encounterChance += 0.15;
  
  // Modify based on weather
  if (weather === 'fog') encounterChance += 0.1;
  if (weather === 'storm') encounterChance += 0.05;
  
  // Modify based on location
  const locationModifiers = {
    'deep_forest': 0.15,
    'dark_cave': 0.2,
    'ancient_ruins': 0.1,
    'mysterious_grove': 0.05
  };
  
  if (locationModifiers[currentLocation]) {
    encounterChance += locationModifiers[currentLocation];
  }
  
  // Check for encounter
  if (Math.random() < encounterChance) {
    return getRandomCreature(currentLocation, time, weather);
  }
  
  return null;
}

// Get random creature for encounter
function getRandomCreature(location, time, weather) {
  const locationCreatures = {
    'clearing': ['wolf', 'squirrel'],
    'deep_forest': ['wolf', 'mysterious_figure'],
    'river_bank': ['otter'],
    'ancient_ruins': ['guardian_spirit'],
    'dark_cave': ['bat', 'cave_troll'],
    'mysterious_grove': ['fairy', 'dryad'],
    'waterfall': ['water_nymph'],
    'temple_entrance': ['temple_guardian'],
    'inner_temple': ['ancient_one']
  };
  
  const availableCreatures = locationCreatures[location] || [];
  
  if (availableCreatures.length === 0) return null;
  
  // Filter creatures based on time and weather
  const filteredCreatures = availableCreatures.filter(creatureName => {
    const creature = creatures[creatureName];
    
    // Nocturnal creatures only appear at night
    if (creature.behavior === "nocturnal" && time !== 'night' && time !== 'midnight') {
      return false;
    }
    
    // Some creatures are affected by weather
    if (weather === 'storm' && creature.behavior === "cautious") {
      return false;
    }
    
    return true;
  });
  
  if (filteredCreatures.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * filteredCreatures.length);
  return filteredCreatures[randomIndex];
}

module.exports = {
  calculateCombat,
  processCombat,
  checkRandomEncounter,
  creatures
}; 