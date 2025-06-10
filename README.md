# 🌲 Never Ending Dream - Telegram Mini App

A fully functional text adventure game built as a Telegram Mini App, featuring dynamic storytelling, adaptive gameplay, and comprehensive game mechanics.

## 🎮 Features

### Core Gameplay
- **Command-based Interface**: Type natural language commands to interact with the world
- **Dynamic World**: Forest environment that changes based on time, weather, and player actions
- **Survival Mechanics**: Manage health, hunger, thirst, and fatigue
- **Skill System**: Develop stealth, survival, knowledge, and diplomacy skills
- **Inventory Management**: Collect and use items throughout your journey

### Advanced Features
- **AI-Powered NPCs**: Intelligent creatures that react to your behavior and choices
- **Puzzle System**: Solve riddles, patterns, and philosophical challenges
- **Combat System**: Strategic battles with various forest creatures
- **Achievement System**: Unlock achievements and track your progress
- **Multiple Endings**: Discover different ways to escape the forest
- **Environmental Effects**: Day/night cycles, weather changes, and dynamic events

### Technical Features
- **Real-time Interactions**: Seamless command processing and response generation
- **Persistent State**: Save and load your progress automatically
- **Telegram Integration**: Full Mini App functionality with user authentication
- **Responsive Design**: Optimized for mobile and desktop play
- **Accessibility**: Support for reduced motion and high contrast modes

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Telegram Bot Token (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd never-ending-dream
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env`:
   ```env
   PORT=3000
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   SESSION_SECRET=your_session_secret_here
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

5. **Serve the frontend**
   ```bash
   # Using a simple HTTP server
   npx serve frontend -p 8080
   
   # Or using Python
   cd frontend && python -m http.server 8080
   ```

6. **Access the game**
   - Development: `http://localhost:8080`
   - Production: Your deployed frontend URL

## 📱 Telegram Mini App Setup

### 1. Create a Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Use `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token for your environment variables

### 2. Configure Mini App
1. Message BotFather with `/mybots`
2. Select your bot
3. Choose "Bot Settings" → "Mini App"
4. Set the Mini App URL to your frontend URL
5. Configure additional settings as needed

### 3. Deploy
1. Deploy your backend to a hosting service (Heroku, Vercel, etc.)
2. Deploy your frontend to a static hosting service
3. Update the API base URL in `frontend/app.js`
4. Update your Mini App URL in BotFather

## 🎯 Game Commands

### Basic Commands
- `look around` - Examine your surroundings
- `move north/south/east/west` - Move in a direction
- `pick up [item]` - Collect items
- `inventory` - Check what you're carrying
- `use [item]` - Use an item
- `talk [creature]` - Interact with NPCs

### Advanced Commands
- `status` - Check your health and stats
- `rest` - Rest to recover fatigue
- `eat [food]` - Consume food items
- `drink [water]` - Drink water
- `hide` - Use stealth
- `climb [object]` - Climb trees or structures
- `light [torch]` - Light sources
- `solve [puzzle]` - Attempt to solve puzzles

### Navigation
- `go [direction]` - Alternative to move
- `run [direction]` - Move quickly
- `map` - View discovered locations
- `hint` - Get puzzle hints

## 🏗️ Architecture

### Backend Structure
```
backend/
├── index.js              # Main server file
├── gameEngine.js         # Core game logic
├── stateManager.js       # User state persistence
├── npcAI.js             # NPC behavior and responses
├── puzzles.js           # Puzzle system
├── environment.js       # Weather and time systems
├── combat.js            # Combat mechanics
├── achievements.js      # Achievement system
├── telegramValidator.js # Telegram data validation
└── userStates/          # User save files
```

### Frontend Structure
```
frontend/
├── index.html           # Main HTML file
├── app.js              # Game application logic
├── styles.css          # Styling and animations
└── assets/
    └── sounds/         # Audio files
```

## 🔧 Configuration

### Backend Configuration
- **Port**: Set via `PORT` environment variable
- **Database**: File-based storage (userStates directory)
- **CORS**: Configured for Telegram domains
- **Rate Limiting**: Built-in protection against spam

### Frontend Configuration
- **API Base URL**: Update in `app.js` for production
- **Settings**: Stored in localStorage
- **Audio**: Configurable sound and music settings

## 🎨 Customization

### Adding New Locations
1. Edit `backend/gameEngine.js`
2. Add location to `locations` object
3. Define exits, creatures, items, and special properties

### Adding New Items
1. Edit `backend/gameEngine.js`
2. Add item to `items` object
3. Define type, effects, and uses

### Adding New NPCs
1. Edit `backend/npcAI.js`
2. Add NPC to `npcs` object
3. Define personality, responses, and quests

### Adding New Puzzles
1. Edit `backend/puzzles.js`
2. Add puzzle to `puzzles` object
3. Define type, solution, and hints

## 🧪 Testing

### Manual Testing
1. Start the backend server
2. Open the frontend in a browser
3. Test basic commands and game flow
4. Verify state persistence

### Automated Testing
```bash
# Run backend tests (if implemented)
cd backend && npm test

# Run frontend tests (if implemented)
cd frontend && npm test
```

## 📊 Analytics and Monitoring

### Built-in Analytics
- Command usage tracking
- Player progression metrics
- Achievement unlock rates
- Game completion statistics

### Monitoring
- Server health endpoint: `GET /health`
- User statistics: `GET /api/stats/:userId`
- Error logging and reporting

## 🔒 Security

### Telegram Integration
- HMAC-SHA256 signature validation
- User authentication via Telegram
- Rate limiting and abuse prevention

### Data Protection
- Secure session management
- Input validation and sanitization
- CORS protection

## 🚀 Deployment

### Backend Deployment
1. **Heroku**
   ```bash
   heroku create your-app-name
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   git push heroku main
   ```

2. **Vercel**
   ```bash
   vercel --prod
   ```

3. **Railway**
   ```bash
   railway login
   railway up
   ```

### Frontend Deployment
1. **Vercel**
   ```bash
   vercel frontend --prod
   ```

2. **Netlify**
   ```bash
   netlify deploy --prod --dir=frontend
   ```

3. **GitHub Pages**
   - Push to GitHub
   - Enable Pages in repository settings

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check if port 3000 is available
- Verify environment variables are set
- Check Node.js version (16+ required)

**Frontend can't connect to backend**
- Verify backend is running
- Check CORS configuration
- Update API base URL in frontend

**Telegram Mini App not working**
- Verify bot token is correct
- Check Mini App URL in BotFather
- Ensure HTTPS is used in production

**Game state not saving**
- Check file permissions for userStates directory
- Verify disk space is available
- Check for JavaScript errors in console

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## 📈 Performance Optimization

### Backend Optimizations
- File-based storage for simplicity
- Efficient state management
- Minimal API response size

### Frontend Optimizations
- Lazy loading of assets
- Efficient DOM updates
- Minimal re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Telegram for the Mini App platform
- The text adventure game community
- Contributors and beta testers

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the troubleshooting section

---

**Never Ending Dream** - Where every choice matters and every path leads to adventure! 🌲✨ 