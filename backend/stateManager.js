const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const STATE_DIR = path.join(__dirname, 'userStates');

// Ensure state directory exists
async function ensureStateDir() {
  try {
    await fs.access(STATE_DIR);
  } catch {
    await fs.mkdir(STATE_DIR, { recursive: true });
  }
}

// Default game state
function getDefaultState() {
  return {
    // Core state
    location: 'clearing',
    inventory: [],
    discovered: [],
    flags: {},
    
    // Survival mechanics
    hunger: 0,
    fatigue: 0,
    health: 100,
    thirst: 0,
    
    // Game progression
    commandsUsed: 0,
    timeSpent: 0,
    dayCount: 1,
    time: 'day',
    weather: 'clear',
    
    // Advanced mechanics
    skills: {
      stealth: 0,
      survival: 0,
      knowledge: 0,
      diplomacy: 0
    },
    
    // Relationships and NPCs
    npcRelations: {},
    quests: {},
    
    // Game settings
    difficulty: 'casual',
    onboarded: false,
    
    // Timestamps
    lastAction: Date.now(),
    gameStart: Date.now(),
    
    // Hidden mechanics
    karma: 0,
    secrets: [],
    achievements: []
  };
}

// Get user state from file
async function getUserState(userId) {
  try {
    await ensureStateDir();
    const filePath = path.join(STATE_DIR, `${userId}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    const state = JSON.parse(data);
    
    // Migrate old state format if needed
    return migrateState(state);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default state
      return getDefaultState();
    }
    console.error('Error reading user state:', error);
    return getDefaultState();
  }
}

// Save user state to file
async function saveUserState(userId, state) {
  try {
    await ensureStateDir();
    const filePath = path.join(STATE_DIR, `${userId}.json`);
    
    // Add metadata
    const stateWithMeta = {
      ...state,
      lastSaved: Date.now(),
      version: '1.0.0'
    };
    
    await fs.writeFile(filePath, JSON.stringify(stateWithMeta, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving user state:', error);
    return false;
  }
}

// Reset user state
async function resetUserState(userId) {
  try {
    await ensureStateDir();
    const filePath = path.join(STATE_DIR, `${userId}.json`);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, which is fine for reset
      return true;
    }
    console.error('Error resetting user state:', error);
    return false;
  }
}

// Migrate state from old format to new format
function migrateState(state) {
  const defaultState = getDefaultState();
  
  // If state is missing essential fields, merge with default
  if (!state.location || !state.inventory) {
    return { ...defaultState, ...state };
  }
  
  // Add new fields that might be missing
  const migratedState = { ...defaultState, ...state };
  
  // Ensure all required arrays exist
  if (!migratedState.discovered) migratedState.discovered = [];
  if (!migratedState.flags) migratedState.flags = {};
  if (!migratedState.skills) migratedState.skills = defaultState.skills;
  if (!migratedState.npcRelations) migratedState.npcRelations = {};
  if (!migratedState.quests) migratedState.quests = {};
  if (!migratedState.secrets) migratedState.secrets = [];
  if (!migratedState.achievements) migratedState.achievements = [];
  
  return migratedState;
}

// Get all user states (for admin purposes)
async function getAllUserStates() {
  try {
    await ensureStateDir();
    const files = await fs.readdir(STATE_DIR);
    const states = {};
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const userId = file.replace('.json', '');
        states[userId] = await getUserState(userId);
      }
    }
    
    return states;
  } catch (error) {
    console.error('Error getting all user states:', error);
    return {};
  }
}

// Clean up old user states (older than 30 days)
async function cleanupOldStates() {
  try {
    await ensureStateDir();
    const files = await fs.readdir(STATE_DIR);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(STATE_DIR, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime.getTime() < thirtyDaysAgo) {
          await fs.unlink(filePath);
          console.log(`Cleaned up old state file: ${file}`);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up old states:', error);
  }
}

// Get user statistics
async function getUserStats(userId) {
  try {
    const state = await getUserState(userId);
    return {
      userId,
      gameProgress: Math.round((state.discovered.length / 15) * 100),
      timeSpent: state.timeSpent,
      commandsUsed: state.commandsUsed,
      itemsCollected: state.inventory.length,
      locationsVisited: state.discovered.length,
      achievements: state.achievements.length,
      lastActive: state.lastAction,
      difficulty: state.difficulty
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

// Schedule cleanup every 24 hours
setInterval(cleanupOldStates, 24 * 60 * 60 * 1000);

module.exports = {
  getUserState,
  saveUserState,
  resetUserState,
  getAllUserStates,
  getUserStats,
  getDefaultState,
  cleanupOldStates
}; 