const { getNPCResponse, updateNPCRelations } = require('./npcAI');
const { checkPuzzle, getPuzzleHint, generatePuzzle } = require('./puzzles');
const { processWeather, updateTime } = require('./environment');
const { calculateCombat, processCombat } = require('./combat');
const { checkAchievements, unlockAchievement } = require('./achievements');

// Game world data
const locations = {
  clearing: {
    name: "Sunlit Clearing",
    description: "A peaceful clearing bathed in golden sunlight. Ancient trees surround you, their branches swaying gently in the breeze. A worn path leads north, while a narrow trail winds eastward.",
    exits: { north: 'deep_forest', east: 'river_bank', west: 'mysterious_grove' },
    creatures: ['owl', 'squirrel'],
    items: ['stick', 'berries'],
    hidden: ['ancient_rune'],
    weather_effects: { rain: "Raindrops patter on the leaves above, creating a soothing rhythm." },
    time_effects: { night: "Moonlight filters through the canopy, casting silver shadows." }
  },
  
  deep_forest: {
    name: "Deep Forest",
    description: "The forest grows dense here, with towering trees blocking most sunlight. The air is thick with the scent of moss and earth. Strange whispers seem to echo from the shadows.",
    exits: { south: 'clearing', east: 'ancient_ruins', west: 'dark_cave' },
    creatures: ['wolf', 'mysterious_figure'],
    items: ['mushroom', 'old_key'],
    hidden: ['shadow_path'],
    weather_effects: { fog: "Thick fog rolls through the trees, making it difficult to see." },
    time_effects: { night: "The darkness is almost complete, broken only by occasional moonlight." }
  },
  
  river_bank: {
    name: "River Bank",
    description: "A clear stream flows gently here, its waters sparkling in the light. The sound of flowing water is calming. You can see fish swimming beneath the surface.",
    exits: { west: 'clearing', north: 'waterfall', south: 'marsh' },
    creatures: ['fisherman', 'otter'],
    items: ['fresh_water', 'fish'],
    hidden: ['underwater_cave'],
    weather_effects: { storm: "The river swells with rainwater, becoming dangerous to cross." }
  },
  
  ancient_ruins: {
    name: "Ancient Ruins",
    description: "Crumbling stone structures rise from the forest floor, covered in moss and vines. Ancient symbols are carved into the weathered stone. The air feels heavy with history.",
    exits: { west: 'deep_forest', north: 'temple_entrance' },
    creatures: ['guardian_spirit'],
    items: ['ancient_scroll', 'golden_coin'],
    hidden: ['secret_chamber'],
    puzzles: ['symbol_puzzle'],
    time_effects: { night: "The ruins glow with an eerie blue light." }
  },
  
  dark_cave: {
    name: "Dark Cave",
    description: "A narrow opening in the rock face leads into darkness. The air is cool and damp. Strange sounds echo from within.",
    exits: { east: 'deep_forest', down: 'cave_system' },
    creatures: ['bat', 'cave_troll'],
    items: ['torch', 'crystal'],
    hidden: ['treasure_chest'],
    requires: { light: true }
  },
  
  mysterious_grove: {
    name: "Mysterious Grove",
    description: "A circle of ancient trees stands here, their trunks twisted into strange shapes. The air hums with magical energy. Time seems to move differently here.",
    exits: { east: 'clearing', north: 'fairy_ring' },
    creatures: ['fairy', 'dryad'],
    items: ['magical_herb', 'enchanted_flower'],
    hidden: ['portal'],
    puzzles: ['fairy_riddle'],
    time_effects: { night: "The grove glows with ethereal light." }
  },
  
  waterfall: {
    name: "Hidden Waterfall",
    description: "A magnificent waterfall cascades down a rocky cliff, creating a rainbow in the mist. The sound is deafening but beautiful.",
    exits: { south: 'river_bank', behind: 'cave_behind_waterfall' },
    creatures: ['water_nymph'],
    items: ['pure_water', 'rainbow_crystal'],
    hidden: ['underwater_tunnel'],
    weather_effects: { storm: "The waterfall becomes a raging torrent." }
  },
  
  temple_entrance: {
    name: "Temple Entrance",
    description: "Massive stone doors stand before you, covered in intricate carvings. The air is thick with ancient magic. This feels like the heart of the mystery.",
    exits: { south: 'ancient_ruins', enter: 'inner_temple' },
    creatures: ['temple_guardian'],
    items: ['temple_key'],
    puzzles: ['door_puzzle'],
    requires: { temple_key: true }
  },
  
  inner_temple: {
    name: "Inner Temple",
    description: "A vast chamber filled with golden light. Ancient murals tell stories of the forest's creation. At the center stands a glowing portal.",
    exits: { exit: 'temple_entrance', portal: 'dream_realm' },
    creatures: ['ancient_one'],
    items: ['dream_crystal'],
    puzzles: ['final_puzzle'],
    ending: true
  },
  
  dream_realm: {
    name: "Dream Realm",
    description: "You've entered a realm of pure imagination. Reality bends and shifts around you. This is where dreams and reality meet.",
    exits: { return: 'inner_temple' },
    creatures: ['dream_weaver'],
    items: ['reality_shard'],
    ending: true,
    secret_ending: true
  }
};

// Items database
const items = {
  stick: {
    name: "Stick",
    description: "A sturdy wooden stick, useful for walking or as a weapon.",
    type: "tool",
    weight: 1,
    uses: ["weapon", "tool"],
    effects: { damage: 5 }
  },
  
  berries: {
    name: "Wild Berries",
    description: "Bright red berries that look edible.",
    type: "food",
    weight: 0.5,
    effects: { hunger: -20, health: 5 }
  },
  
  torch: {
    name: "Torch",
    description: "A wooden torch that provides light in dark places.",
    type: "tool",
    weight: 2,
    uses: ["light", "weapon"],
    effects: { light: true, damage: 3 }
  },
  
  ancient_scroll: {
    name: "Ancient Scroll",
    description: "A parchment covered in mysterious symbols. It seems to contain ancient knowledge.",
    type: "knowledge",
    weight: 0.5,
    effects: { knowledge: 10 },
    puzzle_clue: true
  },
  
  temple_key: {
    name: "Temple Key",
    description: "An ornate key made of gold, covered in intricate engravings.",
    type: "key",
    weight: 1,
    uses: ["unlock"]
  },
  
  dream_crystal: {
    name: "Dream Crystal",
    description: "A crystal that seems to contain fragments of dreams and memories.",
    type: "magical",
    weight: 1,
    effects: { dream_power: true },
    ending_item: true
  }
};

// Main command handler
async function handleCommand(command, state, userId) {
  const tokens = command.trim().toLowerCase().split(' ');
  let response = '';
  let newState = { ...state };
  let gameOver = false;
  let ending = null;
  
  // Update command count and last action
  newState.commandsUsed = (newState.commandsUsed || 0) + 1;
  newState.lastAction = Date.now();
  
  // Onboarding check
  if (!newState.flags.onboarded) {
    response = `🌲 Welcome to Never Ending Dream! 🌲

You find yourself in a mysterious forest with no memory of how you got here. Your goal is to escape this dream-like realm.

BASIC COMMANDS:
• move/go/run [direction] - Move in a direction (north, south, east, west)
• look/examine [object] - Examine your surroundings or objects
• pick up [item] - Collect items
• inventory/inv - Check what you're carrying
• talk/speak [creature] - Interact with creatures
• use [item] - Use an item
• help - Show available commands

Try typing: look around`;
    
    newState.flags.onboarded = true;
    return { response, newState, gameOver, ending };
  }
  
  // Update time and weather
  newState = updateTime(newState);
  newState = processWeather(newState);
  
  // Process command
  const commandResult = await processCommand(tokens, newState, userId);
  response = commandResult.response;
  newState = commandResult.newState;
  gameOver = commandResult.gameOver;
  ending = commandResult.ending;
  
  // Update survival mechanics
  newState = updateSurvivalMechanics(newState);
  
  // Check for achievements
  const achievementResult = checkAchievements(newState, userId);
  if (achievementResult.unlocked) {
    response += `\n\n🏆 ACHIEVEMENT UNLOCKED: ${achievementResult.name} - ${achievementResult.description}`;
    newState.achievements.push(achievementResult.name);
  }
  
  // Check for game over conditions
  if (newState.health <= 0) {
    response += "\n\n💀 You have succumbed to the forest's dangers. The dream ends here...";
    gameOver = true;
    ending = "death";
  }
  
  // Check for victory conditions
  if (newState.location === 'dream_realm' && newState.inventory.some(item => item === 'dream_crystal')) {
    response += "\n\n🌟 You've found the Dream Crystal and reached the Dream Realm! You've discovered the true ending!";
    gameOver = true;
    ending = "true_ending";
  } else if (newState.location === 'inner_temple' && newState.inventory.some(item => item === 'dream_crystal')) {
    response += "\n\n✨ You've escaped the forest! But there's still more to discover...";
    gameOver = true;
    ending = "normal_ending";
  }
  
  return { response, newState, gameOver, ending };
}

// Process individual commands
async function processCommand(tokens, state, userId) {
  const command = tokens[0];
  const args = tokens.slice(1);
  
  switch (command) {
    case 'move':
    case 'go':
    case 'run':
    case 'walk':
      return handleMovement(args, state);
      
    case 'look':
    case 'examine':
    case 'inspect':
      return handleLook(args, state);
      
    case 'pick':
    case 'take':
    case 'grab':
      return handlePickup(args, state);
      
    case 'inventory':
    case 'inv':
    case 'items':
      return handleInventory(state);
      
    case 'use':
    case 'activate':
      return handleUse(args, state);
      
    case 'talk':
    case 'speak':
    case 'ask':
      return handleTalk(args, state);
      
    case 'drop':
    case 'discard':
      return handleDrop(args, state);
      
    case 'eat':
    case 'consume':
      return handleEat(args, state);
      
    case 'drink':
      return handleDrink(args, state);
      
    case 'rest':
    case 'sleep':
      return handleRest(state);
      
    case 'hide':
    case 'stealth':
      return handleStealth(state);
      
    case 'climb':
      return handleClimb(args, state);
      
    case 'light':
    case 'ignite':
      return handleLight(args, state);
      
    case 'solve':
    case 'answer':
      return handleSolve(args, state);
      
    case 'hint':
    case 'help':
      return handleHint(state);
      
    case 'status':
    case 'stats':
      return handleStatus(state);
      
    case 'map':
      return handleMap(state);
      
    default:
      return {
        response: `I don't understand "${command}". Try: move, look, pick up, inventory, talk, use, or help for more commands.`,
        newState: state
      };
  }
}

// Movement handler
function handleMovement(args, state) {
  if (!args.length) {
    return {
      response: "Where would you like to go? Try: move north, go south, run east, etc.",
      newState: state
    };
  }
  
  const direction = args[0];
  const currentLocation = locations[state.location];
  
  if (!currentLocation.exits[direction]) {
    return {
      response: `You can't go ${direction} from here. Available exits: ${Object.keys(currentLocation.exits).join(', ')}`,
      newState: state
    };
  }
  
  const newLocationId = currentLocation.exits[direction];
  const newLocation = locations[newLocationId];
  
  // Check requirements
  if (newLocation.requires) {
    for (const [req, value] of Object.entries(newLocation.requires)) {
      if (req === 'light' && value && !state.inventory.some(item => items[item]?.effects?.light)) {
        return {
          response: "It's too dark to go that way. You need a light source.",
          newState: state
        };
      }
      if (req === 'temple_key' && value && !state.inventory.includes('temple_key')) {
        return {
          response: "The temple doors are locked. You need a key to enter.",
          newState: state
        };
      }
    }
  }
  
  // Update state
  const newState = { ...state };
  newState.location = newLocationId;
  
  // Add to discovered locations
  if (!newState.discovered.includes(newLocationId)) {
    newState.discovered.push(newLocationId);
  }
  
  // Generate location description
  let description = newLocation.description;
  
  // Add weather effects
  if (newLocation.weather_effects && newLocation.weather_effects[state.weather]) {
    description += `\n\n${newLocation.weather_effects[state.weather]}`;
  }
  
  // Add time effects
  if (newLocation.time_effects && newLocation.time_effects[state.time]) {
    description += `\n\n${newLocation.time_effects[state.time]}`;
  }
  
  // Add creatures
  if (newLocation.creatures && newLocation.creatures.length > 0) {
    description += `\n\nYou see: ${newLocation.creatures.join(', ')}`;
  }
  
  // Add items
  if (newLocation.items && newLocation.items.length > 0) {
    description += `\n\nItems here: ${newLocation.items.join(', ')}`;
  }
  
  return {
    response: description,
    newState: newState
  };
}

// Look handler
function handleLook(args, state) {
  const currentLocation = locations[state.location];
  
  if (!args.length || args[0] === 'around') {
    let description = currentLocation.description;
    
    // Add weather and time effects
    if (currentLocation.weather_effects && currentLocation.weather_effects[state.weather]) {
      description += `\n\n${currentLocation.weather_effects[state.weather]}`;
    }
    if (currentLocation.time_effects && currentLocation.time_effects[state.time]) {
      description += `\n\n${currentLocation.time_effects[state.time]}`;
    }
    
    // Add exits
    description += `\n\nExits: ${Object.keys(currentLocation.exits).join(', ')}`;
    
    // Add creatures and items
    if (currentLocation.creatures && currentLocation.creatures.length > 0) {
      description += `\n\nYou see: ${currentLocation.creatures.join(', ')}`;
    }
    if (currentLocation.items && currentLocation.items.length > 0) {
      description += `\n\nItems here: ${currentLocation.items.join(', ')}`;
    }
    
    return { response: description, newState: state };
  }
  
  // Look at specific object
  const target = args.join(' ');
  
  // Check if it's an item in inventory
  if (state.inventory.includes(target)) {
    const item = items[target];
    return {
      response: `${item.name}: ${item.description}`,
      newState: state
    };
  }
  
  // Check if it's an item in the location
  if (currentLocation.items && currentLocation.items.includes(target)) {
    const item = items[target];
    return {
      response: `${item.name}: ${item.description}`,
      newState: state
    };
  }
  
  // Check if it's a creature
  if (currentLocation.creatures && currentLocation.creatures.includes(target)) {
    return {
      response: `You examine the ${target}. It seems to be watching you...`,
      newState: state
    };
  }
  
  return {
    response: `You don't see a "${target}" here.`,
    newState: state
  };
}

// Pickup handler
function handlePickup(args, state) {
  if (!args.length) {
    return {
      response: "What would you like to pick up?",
      newState: state
    };
  }
  
  const itemName = args.join(' ');
  const currentLocation = locations[state.location];
  
  if (!currentLocation.items || !currentLocation.items.includes(itemName)) {
    return {
      response: `There's no "${itemName}" here to pick up.`,
      newState: state
    };
  }
  
  const newState = { ...state };
  newState.inventory.push(itemName);
  
  // Remove from location
  const locationIndex = currentLocation.items.indexOf(itemName);
  currentLocation.items.splice(locationIndex, 1);
  
  return {
    response: `You picked up the ${itemName}.`,
    newState: newState
  };
}

// Inventory handler
function handleInventory(state) {
  if (!state.inventory.length) {
    return {
      response: "Your inventory is empty.",
      newState: state
    };
  }
  
  const inventoryList = state.inventory.map(item => {
    const itemData = items[item];
    return `• ${itemData.name}: ${itemData.description}`;
  }).join('\n');
  
  return {
    response: `Inventory:\n${inventoryList}`,
    newState: state
  };
}

// Use handler
function handleUse(args, state) {
  if (!args.length) {
    return {
      response: "What would you like to use?",
      newState: state
    };
  }
  
  const itemName = args.join(' ');
  
  if (!state.inventory.includes(itemName)) {
    return {
      response: `You don't have a "${itemName}" to use.`,
      newState: state
    };
  }
  
  const item = items[itemName];
  const newState = { ...state };
  
  // Apply item effects
  if (item.effects) {
    for (const [effect, value] of Object.entries(item.effects)) {
      if (effect === 'hunger') newState.hunger = Math.max(0, newState.hunger + value);
      if (effect === 'health') newState.health = Math.min(100, newState.health + value);
      if (effect === 'thirst') newState.thirst = Math.max(0, newState.thirst + value);
    }
  }
  
  // Handle special items
  if (itemName === 'torch') {
    newState.flags.hasLight = true;
    return {
      response: "You light the torch. It provides warm, flickering light.",
      newState: newState
    };
  }
  
  return {
    response: `You use the ${itemName}.`,
    newState: newState
  };
}

// Talk handler
async function handleTalk(args, state) {
  if (!args.length) {
    return {
      response: "Who would you like to talk to?",
      newState: state
    };
  }
  
  const target = args.join(' ');
  const currentLocation = locations[state.location];
  
  if (!currentLocation.creatures || !currentLocation.creatures.includes(target)) {
    return {
      response: `There's no "${target}" here to talk to.`,
      newState: state
    };
  }
  
  const response = await getNPCResponse(state, target, args.slice(1));
  const newState = updateNPCRelations(state, target);
  
  return {
    response: response,
    newState: newState
  };
}

// Drop handler
function handleDrop(args, state) {
  if (!args.length) {
    return {
      response: "What would you like to drop?",
      newState: state
    };
  }
  
  const itemName = args.join(' ');
  
  if (!state.inventory.includes(itemName)) {
    return {
      response: `You don't have a "${itemName}" to drop.`,
      newState: state
    };
  }
  
  const newState = { ...state };
  const itemIndex = newState.inventory.indexOf(itemName);
  newState.inventory.splice(itemIndex, 1);
  
  // Add to current location
  const currentLocation = locations[state.location];
  if (!currentLocation.items) currentLocation.items = [];
  currentLocation.items.push(itemName);
  
  return {
    response: `You dropped the ${itemName}.`,
    newState: newState
  };
}

// Eat handler
function handleEat(args, state) {
  if (!args.length) {
    return {
      response: "What would you like to eat?",
      newState: state
    };
  }
  
  const itemName = args.join(' ');
  
  if (!state.inventory.includes(itemName)) {
    return {
      response: `You don't have a "${itemName}" to eat.`,
      newState: state
    };
  }
  
  const item = items[itemName];
  
  if (item.type !== 'food') {
    return {
      response: `You can't eat the ${itemName}.`,
      newState: state
    };
  }
  
  const newState = { ...state };
  const itemIndex = newState.inventory.indexOf(itemName);
  newState.inventory.splice(itemIndex, 1);
  
  // Apply food effects
  if (item.effects) {
    for (const [effect, value] of Object.entries(item.effects)) {
      if (effect === 'hunger') newState.hunger = Math.max(0, newState.hunger + value);
      if (effect === 'health') newState.health = Math.min(100, newState.health + value);
    }
  }
  
  return {
    response: `You eat the ${itemName}. It tastes delicious and restores your energy.`,
    newState: newState
  };
}

// Drink handler
function handleDrink(args, state) {
  if (!args.length) {
    return {
      response: "What would you like to drink?",
      newState: state
    };
  }
  
  const itemName = args.join(' ');
  
  if (!state.inventory.includes(itemName)) {
    return {
      response: `You don't have a "${itemName}" to drink.`,
      newState: state
    };
  }
  
  const item = items[itemName];
  
  if (!item.name.toLowerCase().includes('water')) {
    return {
      response: `You can't drink the ${itemName}.`,
      newState: state
    };
  }
  
  const newState = { ...state };
  const itemIndex = newState.inventory.indexOf(itemName);
  newState.inventory.splice(itemIndex, 1);
  
  // Apply drink effects
  if (item.effects) {
    for (const [effect, value] of Object.entries(item.effects)) {
      if (effect === 'thirst') newState.thirst = Math.max(0, newState.thirst + value);
      if (effect === 'health') newState.health = Math.min(100, newState.health + value);
    }
  }
  
  return {
    response: `You drink the ${itemName}. It's refreshing and quenches your thirst.`,
    newState: newState
  };
}

// Rest handler
function handleRest(state) {
  const newState = { ...state };
  
  // Reduce fatigue and hunger
  newState.fatigue = Math.max(0, newState.fatigue - 30);
  newState.hunger = Math.min(100, newState.hunger + 10);
  
  // Advance time
  newState.time = newState.time === 'day' ? 'night' : 'day';
  if (newState.time === 'day') newState.dayCount++;
  
  return {
    response: "You rest for a while. You feel more refreshed, though you're getting hungry.",
    newState: newState
  };
}

// Stealth handler
function handleStealth(state) {
  const newState = { ...state };
  newState.skills.stealth = Math.min(100, newState.skills.stealth + 5);
  
  return {
    response: "You move quietly through the shadows, improving your stealth skills.",
    newState: newState
  };
}

// Climb handler
function handleClimb(args, state) {
  if (!args.length) {
    return {
      response: "What would you like to climb?",
      newState: state
    };
  }
  
  const target = args.join(' ');
  
  if (target.includes('tree')) {
    const newState = { ...state };
    newState.skills.survival = Math.min(100, newState.skills.survival + 3);
    
    return {
      response: "You climb the tree carefully. From up here, you can see more of the forest.",
      newState: newState
    };
  }
  
  return {
    response: `You can't climb the ${target}.`,
    newState: state
  };
}

// Light handler
function handleLight(args, state) {
  if (!args.length) {
    return {
      response: "What would you like to light?",
      newState: state
    };
  }
  
  const target = args.join(' ');
  
  if (target === 'torch' && state.inventory.includes('torch')) {
    const newState = { ...state };
    newState.flags.hasLight = true;
    
    return {
      response: "You light the torch. It provides warm, flickering light.",
      newState: newState
    };
  }
  
  return {
    response: `You can't light the ${target}.`,
    newState: state
  };
}

// Solve handler
function handleSolve(args, state) {
  if (!args.length) {
    return {
      response: "What would you like to solve?",
      newState: state
    };
  }
  
  const puzzleInput = args.join(' ');
  const currentLocation = locations[state.location];
  
  if (!currentLocation.puzzles) {
    return {
      response: "There's nothing to solve here.",
      newState: state
    };
  }
  
  const puzzleResult = checkPuzzle(state, currentLocation.puzzles[0], puzzleInput);
  const newState = { ...state, ...puzzleResult.stateUpdate };
  
  return {
    response: puzzleResult.message,
    newState: newState
  };
}

// Hint handler
function handleHint(state) {
  const currentLocation = locations[state.location];
  
  if (currentLocation.puzzles) {
    const hint = getPuzzleHint(state, currentLocation.puzzles[0]);
    return {
      response: `Hint: ${hint}`,
      newState: state
    };
  }
  
  return {
    response: "No hints available here. Try exploring or talking to creatures.",
    newState: state
  };
}

// Status handler
function handleStatus(state) {
  const status = `
📊 STATUS:
Health: ${state.health}/100
Hunger: ${state.hunger}/100
Thirst: ${state.thirst}/100
Fatigue: ${state.fatigue}/100

🎯 SKILLS:
Stealth: ${state.skills.stealth}
Survival: ${state.skills.survival}
Knowledge: ${state.skills.knowledge}
Diplomacy: ${state.skills.diplomacy}

🌍 ENVIRONMENT:
Time: ${state.time}
Weather: ${state.weather}
Day: ${state.dayCount}

📍 LOCATION: ${locations[state.location].name}
`;
  
  return {
    response: status,
    newState: state
  };
}

// Map handler
function handleMap(state) {
  const discoveredLocations = state.discovered.map(loc => locations[loc].name);
  const currentLocation = locations[state.location].name;
  
  let map = "🗺️ DISCOVERED LOCATIONS:\n";
  discoveredLocations.forEach(loc => {
    if (loc === currentLocation) {
      map += `📍 ${loc} (You are here)\n`;
    } else {
      map += `• ${loc}\n`;
    }
  });
  
  return {
    response: map,
    newState: state
  };
}

// Update survival mechanics
function updateSurvivalMechanics(state) {
  const newState = { ...state };
  
  // Increase hunger and thirst over time
  newState.hunger = Math.min(100, newState.hunger + 2);
  newState.thirst = Math.min(100, newState.thirst + 3);
  newState.fatigue = Math.min(100, newState.fatigue + 1);
  
  // Health effects from hunger/thirst
  if (newState.hunger > 80) {
    newState.health = Math.max(0, newState.health - 1);
  }
  if (newState.thirst > 80) {
    newState.health = Math.max(0, newState.health - 2);
  }
  
  return newState;
}

module.exports = {
  handleCommand,
  locations,
  items
}; 