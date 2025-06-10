// Puzzle definitions and logic
const puzzles = {
  symbol_puzzle: {
    name: "Ancient Symbol Puzzle",
    description: "Ancient symbols are carved into the stone. They seem to form a pattern.",
    type: "pattern",
    solution: ["moon", "star", "sun", "moon"],
    hints: [
      "Look at the symbols carefully. They repeat in a cycle.",
      "The pattern follows the rhythm of the heavens.",
      "Think about what rises and sets in the sky."
    ],
    reward: "ancient_scroll",
    location: "ancient_ruins"
  },
  
  fairy_riddle: {
    name: "Fairy's Riddle",
    description: "The fairy offers you a riddle to solve.",
    type: "riddle",
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "echo",
    hints: [
      "I repeat what you say, but I'm not a person.",
      "I live in mountains and valleys.",
      "I'm created by sound bouncing off surfaces."
    ],
    reward: "fairy_magic",
    location: "mysterious_grove"
  },
  
  door_puzzle: {
    name: "Temple Door Puzzle",
    description: "The temple doors are covered in ancient runes. You need to activate them in the correct order.",
    type: "sequence",
    solution: ["wisdom", "courage", "compassion", "truth"],
    hints: [
      "The runes represent virtues that a temple guardian must possess.",
      "Start with the virtue that leads to knowledge.",
      "End with the virtue that cannot be hidden."
    ],
    reward: "temple_entrance",
    location: "temple_entrance"
  },
  
  shadow_puzzle: {
    name: "Shadow Path Puzzle",
    description: "Shadows dance on the forest floor, forming a hidden path.",
    type: "observation",
    solution: "follow_shadows",
    hints: [
      "The shadows move with purpose.",
      "Follow where they lead, not where they are.",
      "Trust in the darkness to show you the way."
    ],
    reward: "shadow_path",
    location: "deep_forest"
  },
  
  water_puzzle: {
    name: "Water Reflection Puzzle",
    description: "The water's surface reflects something important, but only at certain times.",
    type: "timing",
    solution: "wait_for_reflection",
    hints: [
      "The water shows secrets when the light is right.",
      "Patience is key to seeing the truth.",
      "The reflection appears when day meets night."
    ],
    reward: "underwater_cave",
    location: "river_bank"
  },
  
  crystal_puzzle: {
    name: "Crystal Resonance Puzzle",
    description: "Crystals hum with magical energy. You need to find the right frequency.",
    type: "sound",
    solution: ["low", "high", "low", "high", "low"],
    hints: [
      "Listen to the crystals' song.",
      "The pattern follows the rhythm of your heartbeat.",
      "Alternate between high and low tones."
    ],
    reward: "crystal_key",
    location: "cave_system"
  },
  
  memory_puzzle: {
    name: "Memory Test",
    description: "The guardian tests your memory with a sequence of symbols.",
    type: "memory",
    solution: null, // Generated dynamically
    hints: [
      "Pay close attention to the sequence.",
      "The symbols will appear one by one.",
      "Repeat them in the exact order shown."
    ],
    reward: "memory_boost",
    location: "temple_entrance"
  },
  
  final_puzzle: {
    name: "The Final Understanding",
    description: "The Ancient One presents you with the ultimate test of wisdom.",
    type: "philosophy",
    question: "What is the nature of reality?",
    answers: {
      "dream": "Reality is a dream we all share.",
      "illusion": "What we see is merely an illusion.",
      "perspective": "Reality depends on how we choose to see it.",
      "creation": "We create our own reality through our thoughts."
    },
    correct_answer: "creation",
    hints: [
      "Think about what you've learned in your journey.",
      "Consider the power of imagination and belief.",
      "The answer lies in your own ability to shape the world around you."
    ],
    reward: "dream_crystal",
    location: "inner_temple"
  }
};

// Check if puzzle is solved
function checkPuzzle(state, puzzleId, userInput) {
  const puzzle = puzzles[puzzleId];
  if (!puzzle) {
    return {
      solved: false,
      message: "There's no puzzle here to solve.",
      stateUpdate: {}
    };
  }
  
  let solved = false;
  let message = "";
  let stateUpdate = {};
  
  switch (puzzle.type) {
    case "riddle":
      solved = checkRiddle(puzzle, userInput);
      break;
      
    case "pattern":
      solved = checkPattern(puzzle, userInput, state);
      break;
      
    case "sequence":
      solved = checkSequence(puzzle, userInput, state);
      break;
      
    case "observation":
      solved = checkObservation(puzzle, userInput, state);
      break;
      
    case "timing":
      solved = checkTiming(puzzle, userInput, state);
      break;
      
    case "sound":
      solved = checkSound(puzzle, userInput, state);
      break;
      
    case "memory":
      solved = checkMemory(puzzle, userInput, state);
      break;
      
    case "philosophy":
      solved = checkPhilosophy(puzzle, userInput, state);
      break;
  }
  
  if (solved) {
    message = `🎉 Puzzle solved! ${puzzle.reward ? `You receive: ${puzzle.reward}` : ''}`;
    stateUpdate = applyPuzzleReward(state, puzzle);
  } else {
    message = "That's not quite right. Try again or ask for a hint.";
  }
  
  return {
    solved,
    message,
    stateUpdate
  };
}

// Check riddle answers
function checkRiddle(puzzle, userInput) {
  const input = userInput.toLowerCase().trim();
  const answer = puzzle.answer.toLowerCase();
  
  // Check exact match
  if (input === answer) return true;
  
  // Check synonyms
  const synonyms = {
    "echo": ["reflection", "reverberation", "sound_bounce"],
    "shadow": ["shade", "darkness", "silhouette"],
    "dream": ["vision", "fantasy", "imagination"],
    "time": ["clock", "hour", "moment"]
  };
  
  if (synonyms[answer] && synonyms[answer].includes(input)) {
    return true;
  }
  
  return false;
}

// Check pattern puzzles
function checkPattern(puzzle, userInput, state) {
  const input = userInput.toLowerCase().split(' ');
  const solution = puzzle.solution;
  
  // Check if user has attempted this puzzle before
  if (!state.puzzleAttempts) state.puzzleAttempts = {};
  if (!state.puzzleAttempts[puzzle.name]) state.puzzleAttempts[puzzle.name] = [];
  
  state.puzzleAttempts[puzzle.name].push(input);
  
  // Check if pattern matches
  if (input.length === solution.length) {
    for (let i = 0; i < solution.length; i++) {
      if (input[i] !== solution[i]) return false;
    }
    return true;
  }
  
  return false;
}

// Check sequence puzzles
function checkSequence(puzzle, userInput, state) {
  const input = userInput.toLowerCase().split(' ');
  const solution = puzzle.solution;
  
  // Check if user has attempted this puzzle before
  if (!state.puzzleAttempts) state.puzzleAttempts = {};
  if (!state.puzzleAttempts[puzzle.name]) state.puzzleAttempts[puzzle.name] = [];
  
  state.puzzleAttempts[puzzle.name].push(input);
  
  // Check if sequence matches
  if (input.length === solution.length) {
    for (let i = 0; i < solution.length; i++) {
      if (input[i] !== solution[i]) return false;
    }
    return true;
  }
  
  return false;
}

// Check observation puzzles
function checkObservation(puzzle, userInput, state) {
  const input = userInput.toLowerCase();
  const solution = puzzle.solution;
  
  // Check if user has the required items or conditions
  if (solution === "follow_shadows" && state.time === "night") {
    return input.includes("follow") && input.includes("shadow");
  }
  
  if (solution === "look_up" && input.includes("look") && input.includes("up")) {
    return true;
  }
  
  if (solution === "listen_carefully" && input.includes("listen")) {
    return true;
  }
  
  return false;
}

// Check timing puzzles
function checkTiming(puzzle, userInput, state) {
  const input = userInput.toLowerCase();
  const solution = puzzle.solution;
  
  if (solution === "wait_for_reflection") {
    if (state.time === "dusk" || state.time === "dawn") {
      return input.includes("wait") || input.includes("reflection");
    }
  }
  
  if (solution === "wait_for_moonlight" && state.time === "night") {
    return input.includes("wait") || input.includes("moon");
  }
  
  return false;
}

// Check sound puzzles
function checkSound(puzzle, userInput, state) {
  const input = userInput.toLowerCase().split(' ');
  const solution = puzzle.solution;
  
  if (input.length === solution.length) {
    for (let i = 0; i < solution.length; i++) {
      if (input[i] !== solution[i]) return false;
    }
    return true;
  }
  
  return false;
}

// Check memory puzzles
function checkMemory(puzzle, userInput, state) {
  // Generate sequence if not already done
  if (!state.memorySequence) {
    state.memorySequence = generateMemorySequence();
  }
  
  const input = userInput.toLowerCase().split(' ');
  const sequence = state.memorySequence;
  
  if (input.length === sequence.length) {
    for (let i = 0; i < sequence.length; i++) {
      if (input[i] !== sequence[i]) return false;
    }
    return true;
  }
  
  return false;
}

// Check philosophy puzzles
function checkPhilosophy(puzzle, userInput, state) {
  const input = userInput.toLowerCase().trim();
  const correctAnswer = puzzle.correct_answer;
  
  // Check exact match
  if (input === correctAnswer) return true;
  
  // Check for key concepts
  const keyConcepts = {
    "creation": ["create", "make", "build", "form", "shape"],
    "dream": ["dream", "sleep", "fantasy", "illusion"],
    "perspective": ["view", "see", "look", "perceive", "understand"],
    "illusion": ["fake", "false", "unreal", "deception"]
  };
  
  if (keyConcepts[correctAnswer]) {
    return keyConcepts[correctAnswer].some(concept => input.includes(concept));
  }
  
  return false;
}

// Generate memory sequence
function generateMemorySequence() {
  const symbols = ["star", "moon", "sun", "tree", "water", "fire", "earth", "wind"];
  const sequence = [];
  
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    sequence.push(symbols[randomIndex]);
  }
  
  return sequence;
}

// Get puzzle hint
function getPuzzleHint(state, puzzleId) {
  const puzzle = puzzles[puzzleId];
  if (!puzzle) {
    return "There's no puzzle here to get a hint for.";
  }
  
  // Check if user has attempted the puzzle
  const attempts = state.puzzleAttempts?.[puzzle.name]?.length || 0;
  
  if (attempts === 0) {
    return puzzle.hints[0];
  } else if (attempts < 3) {
    return puzzle.hints[Math.min(attempts, puzzle.hints.length - 1)];
  } else {
    return "You've had enough hints. Try to figure it out yourself!";
  }
}

// Apply puzzle reward
function applyPuzzleReward(state, puzzle) {
  const newState = { ...state };
  
  switch (puzzle.reward) {
    case "ancient_scroll":
      newState.inventory.push("ancient_scroll");
      newState.skills.knowledge = Math.min(100, newState.skills.knowledge + 10);
      break;
      
    case "fairy_magic":
      newState.skills.magic = Math.min(100, (newState.skills.magic || 0) + 15);
      break;
      
    case "temple_entrance":
      newState.flags.hasTempleAccess = true;
      break;
      
    case "shadow_path":
      newState.discovered.push("shadow_path");
      break;
      
    case "underwater_cave":
      newState.discovered.push("underwater_cave");
      break;
      
    case "crystal_key":
      newState.inventory.push("crystal_key");
      break;
      
    case "memory_boost":
      newState.skills.memory = Math.min(100, (newState.skills.memory || 0) + 20);
      break;
      
    case "dream_crystal":
      newState.inventory.push("dream_crystal");
      break;
  }
  
  // Mark puzzle as completed
  if (!newState.completedPuzzles) newState.completedPuzzles = [];
  newState.completedPuzzles.push(puzzle.name);
  
  return newState;
}

// Generate dynamic puzzle
function generateDynamicPuzzle(location, difficulty) {
  const puzzleTypes = {
    "clearing": "observation",
    "deep_forest": "pattern",
    "river_bank": "timing",
    "ancient_ruins": "riddle",
    "dark_cave": "sound",
    "mysterious_grove": "riddle",
    "waterfall": "observation",
    "temple_entrance": "sequence",
    "inner_temple": "philosophy"
  };
  
  const type = puzzleTypes[location] || "riddle";
  
  switch (type) {
    case "riddle":
      return generateRiddle(difficulty);
    case "pattern":
      return generatePattern(difficulty);
    case "sequence":
      return generateSequence(difficulty);
    case "observation":
      return generateObservation(difficulty);
    default:
      return generateRiddle(difficulty);
  }
}

// Generate riddle
function generateRiddle(difficulty) {
  const riddles = {
    easy: [
      {
        question: "What has keys, but no locks; space, but no room; and you can enter, but not go in?",
        answer: "keyboard"
      },
      {
        question: "What gets wetter and wetter the more it dries?",
        answer: "towel"
      }
    ],
    medium: [
      {
        question: "The more you take, the more you leave behind. What am I?",
        answer: "footsteps"
      },
      {
        question: "What has cities, but no houses; forests, but no trees; and rivers, but no water?",
        answer: "map"
      }
    ],
    hard: [
      {
        question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
        answer: "fire"
      },
      {
        question: "What breaks when you say it?",
        answer: "silence"
      }
    ]
  };
  
  const level = difficulty === "casual" ? "easy" : difficulty === "survival" ? "medium" : "hard";
  const levelRiddles = riddles[level];
  return levelRiddles[Math.floor(Math.random() * levelRiddles.length)];
}

// Generate pattern
function generatePattern(difficulty) {
  const patterns = {
    easy: ["red", "blue", "red", "blue"],
    medium: ["up", "down", "left", "right", "up", "down"],
    hard: ["fire", "water", "earth", "air", "fire", "water", "earth"]
  };
  
  const level = difficulty === "casual" ? "easy" : difficulty === "survival" ? "medium" : "hard";
  return patterns[level];
}

// Generate sequence
function generateSequence(difficulty) {
  const sequences = {
    easy: ["one", "two", "three", "four"],
    medium: ["north", "south", "east", "west", "north"],
    hard: ["wisdom", "courage", "compassion", "truth", "wisdom", "courage"]
  };
  
  const level = difficulty === "casual" ? "easy" : difficulty === "survival" ? "medium" : "hard";
  return sequences[level];
}

// Generate observation
function generateObservation(difficulty) {
  const observations = {
    easy: "look_around",
    medium: "examine_closely",
    hard: "find_hidden"
  };
  
  const level = difficulty === "casual" ? "easy" : difficulty === "survival" ? "medium" : "hard";
  return observations[level];
}

module.exports = {
  checkPuzzle,
  getPuzzleHint,
  generateDynamicPuzzle,
  puzzles
}; 