// NPC definitions and AI logic
const npcs = {
  owl: {
    name: "Wise Owl",
    personality: "wise",
    mood: "neutral",
    knowledge: ["forest_lore", "navigation", "secrets"],
    responses: {
      default: "The owl hoots softly, watching you with ancient eyes.",
      friendly: "The owl seems to trust you. It offers a gentle hoot of greeting.",
      hostile: "The owl's feathers bristle as it regards you with suspicion.",
      night: "In the moonlight, the owl's eyes glow with ancient wisdom. 'Beware the shadows,' it whispers.",
      day: "The owl perches in the sunlight, its feathers ruffled. 'The forest holds many secrets,' it says."
    },
    quests: {
      find_berries: {
        description: "The owl is hungry. It would appreciate some berries.",
        reward: "owl_friendship",
        completed: false
      }
    }
  },
  
  squirrel: {
    name: "Playful Squirrel",
    personality: "playful",
    mood: "friendly",
    knowledge: ["food_locations", "shortcuts"],
    responses: {
      default: "The squirrel chitters excitedly and hops around.",
      friendly: "The squirrel runs up to you, clearly happy to see you!",
      hostile: "The squirrel backs away, its tail twitching nervously.",
      scared: "The squirrel hides behind a tree, peeking out cautiously."
    },
    quests: {
      find_nuts: {
        description: "The squirrel is looking for nuts to store for winter.",
        reward: "squirrel_help",
        completed: false
      }
    }
  },
  
  wolf: {
    name: "Forest Wolf",
    personality: "predatory",
    mood: "cautious",
    knowledge: ["danger", "territory"],
    responses: {
      default: "The wolf's yellow eyes watch you warily from the shadows.",
      friendly: "The wolf's ears perk up, and it approaches slowly.",
      hostile: "The wolf bares its teeth and growls menacingly.",
      scared: "The wolf whimpers and retreats into the darkness."
    },
    quests: {
      prove_strength: {
        description: "The wolf challenges you to prove your strength.",
        reward: "wolf_respect",
        completed: false
      }
    }
  },
  
  mysterious_figure: {
    name: "Mysterious Figure",
    personality: "enigmatic",
    mood: "neutral",
    knowledge: ["ancient_secrets", "magic", "true_ending"],
    responses: {
      default: "The figure stands silently, its face hidden in shadow.",
      friendly: "The figure's posture relaxes slightly. 'You show promise,' it says.",
      hostile: "The figure's stance becomes defensive. 'You are not ready,' it warns.",
      revealed: "The figure removes its hood, revealing ancient eyes. 'You seek the Dream Crystal...'"
    },
    quests: {
      solve_riddle: {
        description: "The figure offers a riddle: 'What walks on four legs in the morning, two legs at noon, and three legs in the evening?'",
        answer: "human",
        reward: "crystal_clue",
        completed: false
      }
    }
  },
  
  fisherman: {
    name: "Old Fisherman",
    personality: "wise",
    mood: "content",
    knowledge: ["fishing", "river_lore", "weather"],
    responses: {
      default: "The fisherman nods in greeting, continuing to tend to his line.",
      friendly: "The fisherman smiles warmly. 'The river has been good to me today,' he says.",
      helpful: "The fisherman offers you some advice about the river's currents.",
      weather_warning: "The fisherman looks at the sky. 'Storm's coming. Best find shelter.'"
    },
    quests: {
      catch_fish: {
        description: "The fisherman could use help catching fish for his family.",
        reward: "fishing_rod",
        completed: false
      }
    }
  },
  
  otter: {
    name: "Playful Otter",
    personality: "playful",
    mood: "happy",
    knowledge: ["swimming", "river_secrets"],
    responses: {
      default: "The otter splashes in the water, clearly enjoying itself.",
      friendly: "The otter swims over to you, chittering happily.",
      playful: "The otter does a backflip in the water, showing off.",
      helpful: "The otter gestures toward something in the water."
    },
    quests: {
      play_game: {
        description: "The otter wants to play a game of hide and seek.",
        reward: "otter_friendship",
        completed: false
      }
    }
  },
  
  guardian_spirit: {
    name: "Guardian Spirit",
    personality: "protective",
    mood: "neutral",
    knowledge: ["ancient_history", "temple_secrets"],
    responses: {
      default: "The spirit's ethereal form flickers as it regards you.",
      friendly: "The spirit's glow becomes warmer. 'You are welcome here,' it says.",
      hostile: "The spirit's form darkens. 'You are not worthy,' it intones.",
      respectful: "The spirit nods approvingly. 'You show respect for the ancient ways.'"
    },
    quests: {
      prove_worthiness: {
        description: "The spirit requires proof of your worthiness to enter the temple.",
        reward: "temple_access",
        completed: false
      }
    }
  },
  
  bat: {
    name: "Cave Bat",
    personality: "nocturnal",
    mood: "sleepy",
    knowledge: ["cave_system", "darkness"],
    responses: {
      default: "The bat hangs upside down, watching you with beady eyes.",
      friendly: "The bat chirps softly, seeming curious about you.",
      scared: "The bat flutters nervously, disturbed by your presence.",
      helpful: "The bat gestures with its wing toward a dark passage."
    },
    quests: {
      find_insects: {
        description: "The bat is hungry and looking for insects to eat.",
        reward: "bat_guidance",
        completed: false
      }
    }
  },
  
  cave_troll: {
    name: "Cave Troll",
    personality: "aggressive",
    mood: "hostile",
    knowledge: ["cave_treasures", "combat"],
    responses: {
      default: "The troll grunts and brandishes a club menacingly.",
      hostile: "The troll roars and charges at you!",
      intimidated: "The troll hesitates, unsure about attacking.",
      defeated: "The troll whimpers and retreats into the darkness."
    },
    quests: {
      defeat_troll: {
        description: "The troll blocks your path and must be dealt with.",
        reward: "troll_treasure",
        completed: false
      }
    }
  },
  
  fairy: {
    name: "Forest Fairy",
    personality: "mischievous",
    mood: "curious",
    knowledge: ["magic", "forest_secrets", "portals"],
    responses: {
      default: "The fairy flits around you, leaving trails of sparkles.",
      friendly: "The fairy giggles and offers you a magical blessing.",
      playful: "The fairy plays tricks, making flowers bloom around you.",
      helpful: "The fairy points toward a hidden path with her wand."
    },
    quests: {
      fairy_riddle: {
        description: "The fairy offers a riddle: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?'",
        answer: "echo",
        reward: "fairy_magic",
        completed: false
      }
    }
  },
  
  dryad: {
    name: "Ancient Dryad",
    personality: "wise",
    mood: "peaceful",
    knowledge: ["nature", "healing", "forest_lore"],
    responses: {
      default: "The dryad's bark-like skin rustles as she moves gracefully.",
      friendly: "The dryad smiles warmly. 'The forest welcomes you, child,' she says.",
      healing: "The dryad's touch brings warmth and healing to your wounds.",
      wisdom: "The dryad shares ancient wisdom about the forest's secrets."
    },
    quests: {
      heal_forest: {
        description: "The dryad asks for help healing a wounded part of the forest.",
        reward: "dryad_blessing",
        completed: false
      }
    }
  },
  
  water_nymph: {
    name: "Water Nymph",
    personality: "alluring",
    mood: "mysterious",
    knowledge: ["water_magic", "underwater_secrets"],
    responses: {
      default: "The nymph's voice echoes like flowing water as she speaks.",
      friendly: "The nymph's eyes sparkle like the water. 'You have a pure heart,' she says.",
      mysterious: "The nymph sings a haunting melody that seems to call to you.",
      helpful: "The nymph offers guidance about the underwater realm."
    },
    quests: {
      underwater_treasure: {
        description: "The nymph knows of a treasure hidden beneath the waterfall.",
        reward: "water_magic",
        completed: false
      }
    }
  },
  
  temple_guardian: {
    name: "Temple Guardian",
    personality: "dutiful",
    mood: "stern",
    knowledge: ["temple_history", "ancient_rituals"],
    responses: {
      default: "The guardian stands motionless, watching you with ancient eyes.",
      respectful: "The guardian's expression softens slightly. 'You show proper respect.'",
      stern: "The guardian's voice booms. 'You must prove your worth!'",
      approved: "The guardian steps aside. 'You may enter the temple.'"
    },
    quests: {
      temple_trial: {
        description: "The guardian requires you to complete a trial of wisdom.",
        reward: "temple_entrance",
        completed: false
      }
    }
  },
  
  ancient_one: {
    name: "The Ancient One",
    personality: "transcendent",
    mood: "contemplative",
    knowledge: ["creation", "dreams", "reality"],
    responses: {
      default: "The Ancient One's form seems to shift between reality and dream.",
      enlightened: "The Ancient One smiles. 'You have come far, seeker of truth.'",
      revealing: "The Ancient One shares the secret of the Dream Crystal.",
      final: "The Ancient One gestures toward the portal. 'Your journey continues...'"
    },
    quests: {
      final_understanding: {
        description: "The Ancient One requires you to understand the true nature of reality.",
        reward: "dream_crystal",
        completed: false
      }
    }
  },
  
  dream_weaver: {
    name: "Dream Weaver",
    personality: "ethereal",
    mood: "dreamy",
    knowledge: ["dreams", "imagination", "possibility"],
    responses: {
      default: "The Dream Weaver's form seems to be made of starlight and imagination.",
      welcoming: "The Dream Weaver's voice is like music. 'Welcome to the realm of dreams.'",
      inspiring: "The Dream Weaver shows you visions of infinite possibilities.",
      transformative: "The Dream Weaver helps you understand the power of dreams."
    },
    quests: {
      weave_dream: {
        description: "The Dream Weaver asks you to create a dream of your own.",
        reward: "reality_shard",
        completed: false
      }
    }
  }
};

// Get NPC response based on current state and interaction
async function getNPCResponse(state, npcName, userInput = '') {
  const npc = npcs[npcName];
  if (!npc) {
    return "You don't see anyone by that name here.";
  }
  
  // Get relationship level
  const relationship = state.npcRelations[npcName] || 0;
  
  // Determine mood based on relationship and context
  let mood = npc.mood;
  if (relationship > 50) mood = 'friendly';
  if (relationship < -20) mood = 'hostile';
  
  // Check for specific conditions
  if (state.time === 'night' && npc.responses.night) {
    return npc.responses.night;
  }
  
  if (state.time === 'day' && npc.responses.day) {
    return npc.responses.day;
  }
  
  // Check for quest-related responses
  if (userInput && npc.quests) {
    for (const [questId, quest] of Object.entries(npc.quests)) {
      if (userInput.toLowerCase().includes(quest.answer?.toLowerCase())) {
        return handleQuestCompletion(state, npcName, questId, quest);
      }
    }
  }
  
  // Check for specific keywords in user input
  if (userInput) {
    const response = checkKeywordResponses(npc, userInput, state);
    if (response) return response;
  }
  
  // Return mood-based response
  return npc.responses[mood] || npc.responses.default;
}

// Handle quest completion
function handleQuestCompletion(state, npcName, questId, quest) {
  const newState = { ...state };
  
  // Mark quest as completed
  if (!newState.quests[npcName]) newState.quests[npcName] = {};
  newState.quests[npcName][questId] = { completed: true, reward: quest.reward };
  
  // Give reward
  switch (quest.reward) {
    case 'owl_friendship':
      newState.npcRelations.owl = (newState.npcRelations.owl || 0) + 30;
      return "The owl hoots gratefully and offers you its friendship. It will help guide you through the forest.";
      
    case 'squirrel_help':
      newState.npcRelations.squirrel = (newState.npcRelations.squirrel || 0) + 20;
      return "The squirrel chitters happily and shows you a shortcut through the trees!";
      
    case 'wolf_respect':
      newState.npcRelations.wolf = (newState.npcRelations.wolf || 0) + 25;
      return "The wolf nods in respect. It will no longer attack you and may even help in combat.";
      
    case 'crystal_clue':
      newState.flags.hasCrystalClue = true;
      return "The figure nods approvingly. 'The Dream Crystal lies within the temple, but only those who understand the nature of reality may claim it.'";
      
    case 'fishing_rod':
      newState.inventory.push('fishing_rod');
      return "The fisherman thanks you and gives you a fishing rod as a reward.";
      
    case 'otter_friendship':
      newState.npcRelations.otter = (newState.npcRelations.otter || 0) + 15;
      return "The otter splashes happily and becomes your friend. It will help you find underwater secrets.";
      
    case 'temple_access':
      newState.flags.hasTempleAccess = true;
      return "The spirit's form brightens. 'You have proven yourself worthy. The temple is open to you.'";
      
    case 'bat_guidance':
      newState.npcRelations.bat = (newState.npcRelations.bat || 0) + 10;
      return "The bat chirps gratefully and will guide you through dark passages.";
      
    case 'troll_treasure':
      newState.inventory.push('golden_coin');
      return "The defeated troll drops a golden coin. You've earned its treasure!";
      
    case 'fairy_magic':
      newState.skills.magic = Math.min(100, newState.skills.magic + 10);
      return "The fairy giggles and grants you magical abilities. You feel power flowing through you.";
      
    case 'dryad_blessing':
      newState.skills.healing = Math.min(100, newState.skills.healing + 15);
      return "The dryad's blessing fills you with healing energy. You can now heal yourself and others.";
      
    case 'water_magic':
      newState.skills.water_magic = Math.min(100, (newState.skills.water_magic || 0) + 20);
      return "The nymph teaches you the secrets of water magic. You can now breathe underwater.";
      
    case 'dream_crystal':
      newState.inventory.push('dream_crystal');
      return "The Ancient One smiles. 'You have achieved true understanding. The Dream Crystal is yours.'";
      
    case 'reality_shard':
      newState.inventory.push('reality_shard');
      return "The Dream Weaver applauds. 'You have created something beautiful. This shard of reality is your reward.'";
      
    default:
      return "The quest is completed, but the reward is unclear.";
  }
}

// Check for keyword-based responses
function checkKeywordResponses(npc, userInput, state) {
  const input = userInput.toLowerCase();
  
  // Greeting responses
  if (input.includes('hello') || input.includes('hi') || input.includes('greetings')) {
    return npc.responses.friendly || npc.responses.default;
  }
  
  // Help requests
  if (input.includes('help') || input.includes('assist')) {
    return npc.responses.helpful || npc.responses.default;
  }
  
  // Weather-related
  if (input.includes('weather') || input.includes('storm')) {
    if (npc.name === "Old Fisherman") {
      return npc.responses.weather_warning || npc.responses.default;
    }
  }
  
  // Magic-related
  if (input.includes('magic') || input.includes('spell')) {
    if (npc.name === "Forest Fairy" || npc.name === "Water Nymph") {
      return npc.responses.mysterious || npc.responses.default;
    }
  }
  
  // Wisdom requests
  if (input.includes('wisdom') || input.includes('advice')) {
    if (npc.personality === 'wise') {
      return npc.responses.wisdom || npc.responses.default;
    }
  }
  
  // Healing requests
  if (input.includes('heal') || input.includes('hurt') || input.includes('wound')) {
    if (npc.name === "Ancient Dryad") {
      return npc.responses.healing || npc.responses.default;
    }
  }
  
  return null;
}

// Update NPC relationships based on interactions
function updateNPCRelations(state, npcName) {
  const newState = { ...state };
  
  if (!newState.npcRelations[npcName]) {
    newState.npcRelations[npcName] = 0;
  }
  
  // Small relationship boost for talking
  newState.npcRelations[npcName] = Math.min(100, newState.npcRelations[npcName] + 1);
  
  return newState;
}

// Get available quests for an NPC
function getAvailableQuests(npcName, state) {
  const npc = npcs[npcName];
  if (!npc || !npc.quests) return [];
  
  const availableQuests = [];
  
  for (const [questId, quest] of Object.entries(npc.quests)) {
    const isCompleted = state.quests[npcName]?.[questId]?.completed || false;
    
    if (!isCompleted) {
      availableQuests.push({
        id: questId,
        description: quest.description,
        reward: quest.reward
      });
    }
  }
  
  return availableQuests;
}

// Check if NPC has special knowledge
function hasSpecialKnowledge(npcName, knowledgeType) {
  const npc = npcs[npcName];
  return npc && npc.knowledge && npc.knowledge.includes(knowledgeType);
}

// Get NPC mood based on relationship
function getNPCMood(npcName, relationship) {
  const npc = npcs[npcName];
  if (!npc) return 'neutral';
  
  if (relationship > 50) return 'friendly';
  if (relationship > 20) return 'positive';
  if (relationship < -20) return 'hostile';
  if (relationship < 0) return 'negative';
  
  return npc.mood;
}

module.exports = {
  getNPCResponse,
  updateNPCRelations,
  getAvailableQuests,
  hasSpecialKnowledge,
  getNPCMood,
  npcs
}; 