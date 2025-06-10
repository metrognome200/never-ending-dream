// Never Ending Dream - Telegram Mini App
class NeverEndingDream {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.userId = null;
        this.gameState = null;
        this.isLoading = false;
        this.settings = {
            sound: true,
            music: true,
            animations: true
        };
        
        // API Configuration - automatically detect environment
        this.apiBase = this.detectApiBase();
        
        this.init();
    }
    
    detectApiBase() {
        // Check if we're in development or production
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        } else {
            // In production (Vercel), API is at the same domain
            return window.location.origin;
        }
    }
    
    async init() {
        try {
            // Initialize Telegram Web App
            this.tg.ready();
            this.tg.expand();
            
            // Get user ID from Telegram or generate demo ID
            this.userId = this.tg.initDataUnsafe?.user?.id || 
                         this.tg.initDataUnsafe?.user?.id || 
                         'demo-user-' + Date.now();
            
            // Load settings from localStorage
            this.loadSettings();
            
            // Initialize UI
            this.initializeUI();
            
            // Load game state
            await this.loadGameState();
            
            // Hide loading screen and show game
            this.hideLoadingScreen();
            
            // Start ambient sound
            this.startAmbientSound();
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize game. Please refresh and try again.');
        }
    }
    
    initializeUI() {
        // Cache DOM elements
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            gameContainer: document.getElementById('game-container'),
            outputContent: document.getElementById('output-content'),
            commandInput: document.getElementById('command-input'),
            sendBtn: document.getElementById('send-btn'),
            menuBtn: document.getElementById('menu-btn'),
            menuOverlay: document.getElementById('menu-overlay'),
            closeMenu: document.getElementById('close-menu'),
            statusBar: document.getElementById('status-bar'),
            healthDisplay: document.getElementById('health-display'),
            hungerDisplay: document.getElementById('hunger-display'),
            thirstDisplay: document.getElementById('thirst-display'),
            fatigueDisplay: document.getElementById('fatigue-display'),
            confirmDialog: document.getElementById('confirm-dialog'),
            confirmTitle: document.getElementById('confirm-title'),
            confirmMessage: document.getElementById('confirm-message'),
            confirmYes: document.getElementById('confirm-yes'),
            confirmNo: document.getElementById('confirm-no'),
            achievementPopup: document.getElementById('achievement-popup'),
            achievementTitle: document.getElementById('achievement-title'),
            achievementDescription: document.getElementById('achievement-description'),
            gameOverScreen: document.getElementById('game-over-screen'),
            gameOverTitle: document.getElementById('game-over-title'),
            gameOverMessage: document.getElementById('game-over-message'),
            finalCommands: document.getElementById('final-commands'),
            finalLocations: document.getElementById('final-locations'),
            finalAchievements: document.getElementById('final-achievements'),
            restartGame: document.getElementById('restart-game'),
            viewStats: document.getElementById('view-stats'),
            resetGame: document.getElementById('reset-game'),
            exportSave: document.getElementById('export-save'),
            importSave: document.getElementById('import-save'),
            soundToggle: document.getElementById('sound-toggle'),
            musicToggle: document.getElementById('music-toggle'),
            animationsToggle: document.getElementById('animations-toggle'),
            playerStats: document.getElementById('player-stats'),
            skillsDisplay: document.getElementById('skills-display'),
            achievementsDisplay: document.getElementById('achievements-display')
        };
        
        // Bind event listeners
        this.bindEventListeners();
        
        // Initialize quick commands
        this.initializeQuickCommands();
    }
    
    bindEventListeners() {
        // Command input
        this.elements.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendCommand();
            }
        });
        
        this.elements.sendBtn.addEventListener('click', () => {
            this.sendCommand();
        });
        
        // Menu
        this.elements.menuBtn.addEventListener('click', () => {
            this.showMenu();
        });
        
        this.elements.closeMenu.addEventListener('click', () => {
            this.hideMenu();
        });
        
        // Confirmation dialog
        this.elements.confirmYes.addEventListener('click', () => {
            this.handleConfirmAction();
        });
        
        this.elements.confirmNo.addEventListener('click', () => {
            this.hideConfirmDialog();
        });
        
        // Game over screen
        this.elements.restartGame.addEventListener('click', () => {
            this.restartGame();
        });
        
        this.elements.viewStats.addEventListener('click', () => {
            this.showStats();
        });
        
        // Menu actions
        this.elements.resetGame.addEventListener('click', () => {
            this.showConfirmDialog(
                'Reset Game',
                'Are you sure you want to reset your game? All progress will be lost.',
                'reset'
            );
        });
        
        this.elements.exportSave.addEventListener('click', () => {
            this.exportSaveData();
        });
        
        this.elements.importSave.addEventListener('click', () => {
            this.importSaveData();
        });
        
        // Settings
        this.elements.soundToggle.addEventListener('change', (e) => {
            this.settings.sound = e.target.checked;
            this.saveSettings();
        });
        
        this.elements.musicToggle.addEventListener('change', (e) => {
            this.settings.music = e.target.checked;
            this.saveSettings();
            if (this.settings.music) {
                this.startAmbientSound();
            } else {
                this.stopAmbientSound();
            }
        });
        
        this.elements.animationsToggle.addEventListener('change', (e) => {
            this.settings.animations = e.target.checked;
            this.saveSettings();
        });
        
        // Close overlays when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target === this.elements.menuOverlay) {
                this.hideMenu();
            }
            if (e.target === this.elements.confirmDialog) {
                this.hideConfirmDialog();
            }
            if (e.target === this.elements.gameOverScreen) {
                // Don't close game over screen by clicking outside
            }
        });
    }
    
    initializeQuickCommands() {
        const quickCmds = document.querySelectorAll('.quick-cmd');
        quickCmds.forEach(cmd => {
            cmd.addEventListener('click', () => {
                const command = cmd.dataset.command;
                this.elements.commandInput.value = command;
                this.sendCommand();
            });
        });
    }
    
    async loadGameState() {
        try {
            const response = await fetch(`${this.apiBase}/api/state/${this.userId}`);
            if (response.ok) {
                const data = await response.json();
                this.gameState = data.state;
                this.updateUI();
                
                // Show welcome message if new game
                if (!this.gameState.flags?.onboarded) {
                    this.appendOutput("🌲 Welcome to Never Ending Dream! 🌲\n\nYou find yourself in a mysterious forest with no memory of how you got here. Your goal is to escape this dream-like realm.\n\nType 'help' to see available commands.");
                }
            } else {
                throw new Error('Failed to load game state');
            }
        } catch (error) {
            console.error('Error loading game state:', error);
            this.showError('Failed to load game state. Starting new game...');
            this.gameState = null;
        }
    }
    
    async sendCommand() {
        if (this.isLoading) return;
        
        const command = this.elements.commandInput.value.trim();
        if (!command) return;
        
        this.isLoading = true;
        this.elements.commandInput.disabled = true;
        this.elements.sendBtn.disabled = true;
        
        try {
            // Show command in output
            this.appendOutput(`> ${command}`, 'command');
            
            // Send command to backend
            const response = await fetch(`${this.apiBase}/api/command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.userId,
                    command: command,
                    initData: this.tg.initData
                })
            });
            
            if (!response.ok) {
                throw new Error('Network error');
            }
            
            const data = await response.json();
            
            // Update game state
            this.gameState = data.state;
            
            // Show response
            this.appendOutput(data.response, 'response');
            
            // Update UI
            this.updateUI();
            
            // Check for game over
            if (data.gameOver) {
                this.handleGameOver(data.ending);
            }
            
            // Play sound effects
            this.playSound('click');
            
        } catch (error) {
            console.error('Error sending command:', error);
            this.appendOutput('❌ An error occurred. Please try again.', 'error');
        } finally {
            this.isLoading = false;
            this.elements.commandInput.disabled = false;
            this.elements.sendBtn.disabled = false;
            this.elements.commandInput.value = '';
            this.elements.commandInput.focus();
        }
    }
    
    appendOutput(text, type = 'normal') {
        const output = this.elements.outputContent;
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.textContent = text;
        
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        
        // Add typing animation if enabled
        if (this.settings.animations && type === 'response') {
            this.animateTyping(line);
        }
    }
    
    animateTyping(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 30);
    }
    
    updateUI() {
        if (!this.gameState) return;
        
        // Update status bar
        this.elements.healthDisplay.textContent = this.gameState.health || 100;
        this.elements.hungerDisplay.textContent = this.gameState.hunger || 0;
        this.elements.thirstDisplay.textContent = this.gameState.thirst || 0;
        this.elements.fatigueDisplay.textContent = this.gameState.fatigue || 0;
        
        // Update status bar colors based on values
        this.updateStatusColors();
        
        // Update menu if open
        if (!this.elements.menuOverlay.classList.contains('hidden')) {
            this.updateMenu();
        }
    }
    
    updateStatusColors() {
        const health = this.gameState.health || 100;
        const hunger = this.gameState.hunger || 0;
        const thirst = this.gameState.thirst || 0;
        const fatigue = this.gameState.fatigue || 0;
        
        // Health color
        if (health < 25) {
            this.elements.healthDisplay.style.color = '#f44336';
        } else if (health < 50) {
            this.elements.healthDisplay.style.color = '#ff9800';
        } else {
            this.elements.healthDisplay.style.color = '#4caf50';
        }
        
        // Hunger color
        if (hunger > 80) {
            this.elements.hungerDisplay.style.color = '#f44336';
        } else if (hunger > 60) {
            this.elements.hungerDisplay.style.color = '#ff9800';
        } else {
            this.elements.hungerDisplay.style.color = '#ffffff';
        }
        
        // Thirst color
        if (thirst > 80) {
            this.elements.thirstDisplay.style.color = '#f44336';
        } else if (thirst > 60) {
            this.elements.thirstDisplay.style.color = '#ff9800';
        } else {
            this.elements.thirstDisplay.style.color = '#ffffff';
        }
        
        // Fatigue color
        if (fatigue > 80) {
            this.elements.fatigueDisplay.style.color = '#f44336';
        } else if (fatigue > 60) {
            this.elements.fatigueDisplay.style.color = '#ff9800';
        } else {
            this.elements.fatigueDisplay.style.color = '#ffffff';
        }
    }
    
    showMenu() {
        this.elements.menuOverlay.classList.remove('hidden');
        this.updateMenu();
    }
    
    hideMenu() {
        this.elements.menuOverlay.classList.add('hidden');
    }
    
    updateMenu() {
        if (!this.gameState) return;
        
        // Update player stats
        this.updatePlayerStats();
        
        // Update skills
        this.updateSkills();
        
        // Update achievements
        this.updateAchievements();
        
        // Update settings
        this.elements.soundToggle.checked = this.settings.sound;
        this.elements.musicToggle.checked = this.settings.music;
        this.elements.animationsToggle.checked = this.settings.animations;
    }
    
    updatePlayerStats() {
        const stats = this.gameState;
        const statsHTML = `
            <div class="stat-item">
                <span class="stat-label">Location:</span>
                <span class="stat-value">${this.getLocationName(stats.location)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Day:</span>
                <span class="stat-value">${stats.dayCount || 1}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Time:</span>
                <span class="stat-value">${stats.time || 'day'}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Weather:</span>
                <span class="stat-value">${stats.weather || 'clear'}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Commands Used:</span>
                <span class="stat-value">${stats.commandsUsed || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Locations Visited:</span>
                <span class="stat-value">${stats.discovered?.length || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Items Collected:</span>
                <span class="stat-value">${stats.inventory?.length || 0}</span>
            </div>
        `;
        
        this.elements.playerStats.innerHTML = statsHTML;
    }
    
    updateSkills() {
        const skills = this.gameState.skills || {};
        const skillsHTML = Object.entries(skills).map(([skill, level]) => `
            <div class="skill-item">
                <span class="skill-label">${this.capitalizeFirst(skill)}:</span>
                <span class="skill-value">${level}</span>
            </div>
        `).join('');
        
        this.elements.skillsDisplay.innerHTML = skillsHTML || '<p>No skills yet</p>';
    }
    
    updateAchievements() {
        const achievements = this.gameState.achievements || [];
        const achievementsHTML = achievements.length > 0 
            ? achievements.map(achievement => `
                <div class="achievement-item">
                    <span class="achievement-label">🏆 ${achievement}</span>
                </div>
            `).join('')
            : '<p>No achievements yet</p>';
        
        this.elements.achievementsDisplay.innerHTML = achievementsHTML;
    }
    
    getLocationName(locationId) {
        const locationNames = {
            'clearing': 'Sunlit Clearing',
            'deep_forest': 'Deep Forest',
            'river_bank': 'River Bank',
            'ancient_ruins': 'Ancient Ruins',
            'dark_cave': 'Dark Cave',
            'mysterious_grove': 'Mysterious Grove',
            'waterfall': 'Hidden Waterfall',
            'temple_entrance': 'Temple Entrance',
            'inner_temple': 'Inner Temple',
            'dream_realm': 'Dream Realm'
        };
        
        return locationNames[locationId] || locationId;
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    showConfirmDialog(title, message, action) {
        this.elements.confirmTitle.textContent = title;
        this.elements.confirmMessage.textContent = message;
        this.elements.confirmDialog.classList.remove('hidden');
        this.confirmAction = action;
    }
    
    hideConfirmDialog() {
        this.elements.confirmDialog.classList.add('hidden');
        this.confirmAction = null;
    }
    
    async handleConfirmAction() {
        if (!this.confirmAction) return;
        
        switch (this.confirmAction) {
            case 'reset':
                await this.resetGame();
                break;
            default:
                console.log('Unknown confirm action:', this.confirmAction);
        }
        
        this.hideConfirmDialog();
    }
    
    async resetGame() {
        try {
            const response = await fetch(`${this.apiBase}/api/reset/${this.userId}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                this.gameState = null;
                this.elements.outputContent.innerHTML = '';
                await this.loadGameState();
                this.appendOutput('🎮 Game reset successfully! Starting fresh...', 'system');
            } else {
                throw new Error('Failed to reset game');
            }
        } catch (error) {
            console.error('Error resetting game:', error);
            this.showError('Failed to reset game. Please try again.');
        }
    }
    
    exportSaveData() {
        if (!this.gameState) {
            this.showError('No save data to export');
            return;
        }
        
        const saveData = {
            gameState: this.gameState,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const dataStr = JSON.stringify(saveData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `never-ending-dream-save-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    importSaveData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const saveData = JSON.parse(text);
                
                if (saveData.version !== '1.0.0') {
                    this.showError('Incompatible save file version');
                    return;
                }
                
                // Send save data to backend
                const response = await fetch(`${this.apiBase}/api/import-save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: this.userId,
                        saveData: saveData.gameState
                    })
                });
                
                if (response.ok) {
                    await this.loadGameState();
                    this.appendOutput('💾 Save data imported successfully!', 'system');
                } else {
                    throw new Error('Failed to import save data');
                }
                
            } catch (error) {
                console.error('Error importing save data:', error);
                this.showError('Failed to import save data. Please check the file format.');
            }
        };
        
        input.click();
    }
    
    handleGameOver(ending) {
        const endings = {
            'death': {
                title: 'Game Over',
                message: 'You have succumbed to the forest\'s dangers. The dream ends here...'
            },
            'normal_ending': {
                title: 'Escape!',
                message: 'You\'ve escaped the forest! But there\'s still more to discover...'
            },
            'true_ending': {
                title: 'True Ending',
                message: 'You\'ve found the Dream Crystal and reached the Dream Realm! You\'ve discovered the true ending!'
            }
        };
        
        const endingData = endings[ending] || {
            title: 'Game Over',
            message: 'Your adventure has ended.'
        };
        
        this.elements.gameOverTitle.textContent = endingData.title;
        this.elements.gameOverMessage.textContent = endingData.message;
        
        // Update final stats
        this.elements.finalCommands.textContent = this.gameState.commandsUsed || 0;
        this.elements.finalLocations.textContent = this.gameState.discovered?.length || 0;
        this.elements.finalAchievements.textContent = this.gameState.achievements?.length || 0;
        
        // Show game over screen
        this.elements.gameOverScreen.classList.remove('hidden');
    }
    
    async restartGame() {
        await this.resetGame();
        this.elements.gameOverScreen.classList.add('hidden');
    }
    
    showStats() {
        // This could open a detailed statistics view
        this.hideMenu();
        this.appendOutput('📊 Statistics feature coming soon!', 'system');
    }
    
    showError(message) {
        this.appendOutput(`❌ ${message}`, 'error');
    }
    
    hideLoadingScreen() {
        this.elements.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.elements.loadingScreen.style.display = 'none';
            this.elements.gameContainer.classList.remove('hidden');
        }, 500);
    }
    
    startAmbientSound() {
        if (!this.settings.music) return;
        
        const ambientSound = document.getElementById('ambient-sound');
        if (ambientSound) {
            ambientSound.volume = 0.3;
            ambientSound.play().catch(e => {
                console.log('Could not play ambient sound:', e);
            });
        }
    }
    
    stopAmbientSound() {
        const ambientSound = document.getElementById('ambient-sound');
        if (ambientSound) {
            ambientSound.pause();
            ambientSound.currentTime = 0;
        }
    }
    
    playSound(soundType) {
        if (!this.settings.sound) return;
        
        let soundElement;
        switch (soundType) {
            case 'click':
                soundElement = document.getElementById('click-sound');
                break;
            case 'achievement':
                soundElement = document.getElementById('achievement-sound');
                break;
            default:
                return;
        }
        
        if (soundElement) {
            soundElement.volume = 0.5;
            soundElement.currentTime = 0;
            soundElement.play().catch(e => {
                console.log('Could not play sound:', e);
            });
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('never-ending-dream-settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('never-ending-dream-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    showAchievementPopup(title, description) {
        this.elements.achievementTitle.textContent = title;
        this.elements.achievementDescription.textContent = description;
        this.elements.achievementPopup.classList.remove('hidden');
        
        this.playSound('achievement');
        
        // Hide after 3 seconds
        setTimeout(() => {
            this.elements.achievementPopup.classList.add('hidden');
        }, 3000);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new NeverEndingDream();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause music
        if (window.game && window.game.settings.music) {
            window.game.stopAmbientSound();
        }
    } else {
        // Page is visible, resume music
        if (window.game && window.game.settings.music) {
            window.game.startAmbientSound();
        }
    }
});

// Handle beforeunload
window.addEventListener('beforeunload', () => {
    if (window.game) {
        window.game.stopAmbientSound();
    }
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 