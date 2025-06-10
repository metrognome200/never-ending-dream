const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { handleCommand } = require('./gameEngine');
const { getUserState, saveUserState, resetUserState } = require('./stateManager');
const { validateTelegramData } = require('./telegramValidator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://web.telegram.org', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main command endpoint
app.post('/api/command', async (req, res) => {
  try {
    const { userId, command, initData } = req.body;
    
    if (!userId || !command) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId and command' 
      });
    }

    // Validate Telegram data if provided
    if (initData && !validateTelegramData(initData)) {
      return res.status(401).json({ 
        error: 'Invalid Telegram data' 
      });
    }

    let state = await getUserState(userId);
    const result = await handleCommand(command, state, userId);
    
    await saveUserState(userId, result.newState);
    
    res.json({
      response: result.response,
      state: result.newState,
      gameOver: result.gameOver || false,
      ending: result.ending || null
    });
  } catch (error) {
    console.error('Command error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Get user state endpoint
app.get('/api/state/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const state = await getUserState(userId);
    res.json({ state });
  } catch (error) {
    console.error('State retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve state' });
  }
});

// Reset user state endpoint
app.post('/api/reset/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await resetUserState(userId);
    res.json({ message: 'Game state reset successfully' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ error: 'Failed to reset state' });
  }
});

// Get game statistics endpoint
app.get('/api/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const state = await getUserState(userId);
    
    const stats = {
      locationsVisited: state.discovered.length,
      itemsCollected: state.inventory.length,
      timeSpent: state.timeSpent || 0,
      commandsUsed: state.commandsUsed || 0,
      currentLocation: state.location,
      gameProgress: calculateProgress(state)
    };
    
    res.json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

function calculateProgress(state) {
  const totalLocations = 15; // Total locations in the game
  const visited = state.discovered.length;
  return Math.round((visited / totalLocations) * 100);
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Never Ending Dream backend running on port ${PORT}`);
  console.log(`📱 Ready for Telegram Mini App integration`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
}); 