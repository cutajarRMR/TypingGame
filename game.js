// Game State
const gameState = {
    mode: 'letters', // 'letters', 'words', 'special', or 'password'
    level: 1,
    pearls: 0,
    highScore: 0,
    streak: 0,
    currentTarget: '',
    characterLevel: 1,
    wordDifficulty: 'easy',
    specialLevel: 1,
    passwordLevel: 1,
    totalCorrect: 0,
    totalAttempts: 0
};

// DOM Elements
let elements = {};

// Initialize the game
function init() {
    // Get DOM elements
    elements = {
        startScreen: document.getElementById('start-screen'),
        targetWord: document.getElementById('target-word'),
        typingInput: document.getElementById('typing-input'),
        pearlCount: document.querySelector('.pearl-count'),
        currentLevel: document.getElementById('current-level'),
        highScore: document.getElementById('high-score'),
        encouragement: document.getElementById('encouragement'),
        streakIndicator: document.getElementById('streak-indicator'),
        streakCount: document.querySelector('.streak-count'),
        modeIndicator: document.getElementById('mode-indicator'),
        soundToggle: document.getElementById('sound-toggle'),
        menuBtn: document.getElementById('menu-btn'),
        resetBtn: document.getElementById('reset-btn'),
        pearlContainer: document.getElementById('pearl-container'),
        celebrationLayer: document.getElementById('celebration-layer'),
        ollie: document.getElementById('ollie'),
        typedLetters: document.getElementById('typed-letters')
    };

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('typingGameHighScore');
    if (savedHighScore) {
        gameState.highScore = parseInt(savedHighScore);
        elements.highScore.textContent = gameState.highScore;
    }

    // Event listeners
    document.querySelectorAll('.start-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            startGame(mode);
        });
    });

    elements.typingInput.addEventListener('input', handleInput);
    elements.soundToggle.addEventListener('click', toggleSound);
    elements.menuBtn.addEventListener('click', backToMenu);
    elements.resetBtn.addEventListener('click', resetGame);

    // Focus input when clicking anywhere in ocean
    document.querySelector('.ocean-container').addEventListener('click', () => {
        elements.typingInput.focus();
    });
}

// Start the game with selected mode
function startGame(mode) {
    gameState.mode = mode;
    gameState.level = 1;
    gameState.pearls = 0;
    gameState.streak = 0;
    gameState.characterLevel = 1;
    gameState.wordDifficulty = 'easy';
    gameState.specialLevel = 1;
    gameState.passwordLevel = 1;
    gameState.totalCorrect = 0;
    gameState.totalAttempts = 0;

    elements.startScreen.classList.add('hidden');
    elements.typingInput.focus();

    updateDisplay();
    nextTarget();
}

// Generate next target (letter, word, special character, or password)
function nextTarget() {
    elements.typingInput.value = '';
    elements.typedLetters.textContent = '';

    if (gameState.mode === 'letters') {
        gameState.currentTarget = getRandomCharacter(gameState.characterLevel);
        elements.modeIndicator.textContent = 'Level 1 - Type the letter!';
    } else if (gameState.mode === 'words') {
        gameState.currentTarget = getRandomWord(gameState.wordDifficulty);
        elements.modeIndicator.textContent = 'Level 2 - Type the word!';
    } else if (gameState.mode === 'special') {
        gameState.currentTarget = getRandomSpecialCharacter(gameState.specialLevel);
        elements.modeIndicator.textContent = 'Level 3 - Type the special character!';
    } else if (gameState.mode === 'password') {
        gameState.currentTarget = generatePassword(gameState.passwordLevel);
        elements.modeIndicator.textContent = 'Level 4 - Type the hard password!';
    }

    elements.targetWord.textContent = gameState.currentTarget;
}

// Handle typing input
function handleInput(e) {
    const caseSensitiveModes = ['special', 'password'];
    const typed = caseSensitiveModes.includes(gameState.mode) ? e.target.value : e.target.value.toLowerCase();
    const target = caseSensitiveModes.includes(gameState.mode) ? gameState.currentTarget : gameState.currentTarget.toLowerCase();

    // Show what's been typed correctly
    if (gameState.mode === 'words') {
        let display = '';
        for (let i = 0; i < typed.length; i++) {
            if (i < target.length && typed[i] === target[i]) {
                display += typed[i];
            }
        }
        elements.typedLetters.textContent = display;
    }

    // Check if complete match
    if (typed === target) {
        handleCorrect();
    } else if (typed.length >= target.length) {
        // Typed too much without matching
        handleIncorrect();
    } else {
        // Check if current typing is on the right track
        if (!target.startsWith(typed)) {
            handleIncorrect();
        }
    }
}

// Handle correct answer
function handleCorrect() {
    gameState.totalCorrect++;
    gameState.totalAttempts++;
    gameState.streak++;

    // Calculate pearls based on difficulty and streak
    let pearlsEarned = 1;
    
    if (gameState.mode === 'words') {
        if (gameState.wordDifficulty === 'medium') pearlsEarned = 2;
        if (gameState.wordDifficulty === 'hard') pearlsEarned = 3;
    } else if (gameState.mode === 'password') {
        // Password mode awards pearls based on length and complexity
        pearlsEarned = Math.min(gameState.currentTarget.length, 10);
    }

    // Bonus for streak
    if (gameState.streak > 0 && gameState.streak % 5 === 0) {
        pearlsEarned += 5; // Starfish bonus
        showEncouragement('⭐ Streak Bonus! +5 Pearls!');
        soundManager.playStreak();
        createConfetti();
    } else {
        soundManager.playCorrect();
        showEncouragement(getRandomEncouragement());
    }

    gameState.pearls += pearlsEarned;

    // Visual feedback
    elements.typingInput.classList.add('correct');
    setTimeout(() => {
        elements.typingInput.classList.remove('correct');
    }, 500);

    // Animate pearls
    animatePearls(pearlsEarned);

    // Update display
    updateDisplay();

    // Check for level up
    checkLevelUp();

    // Check for treasure milestones
    checkTreasureMilestones();

    // Next target after delay
    setTimeout(() => {
        nextTarget();
    }, 800);
}

// Handle incorrect answer
function handleIncorrect() {
    gameState.totalAttempts++;
    gameState.streak = 0;

    soundManager.playIncorrect();
    
    elements.typingInput.classList.add('incorrect');
    setTimeout(() => {
        elements.typingInput.classList.remove('incorrect');
    }, 500);

    showEncouragement('Try again! 💙');
    
    // Clear input
    elements.typingInput.value = '';
    elements.typedLetters.textContent = '';

    updateDisplay();
}

// Show encouragement message
function showEncouragement(message) {
    elements.encouragement.textContent = message;
    elements.encouragement.classList.add('show');
    
    setTimeout(() => {
        elements.encouragement.classList.remove('show');
    }, 2000);
}

// Get random encouragement message
function getRandomEncouragement() {
    const messages = [
        'Great job! 🎉',
        'Perfect! 🌟',
        'You did it! 🐙',
        'Awesome! 🌊',
        'Super! 💎',
        'Well done! 🐠',
        'Fantastic! ⭐',
        'Keep going! 🐟',
        'Amazing! 🦀',
        'Wonderful! 🐚'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Animate pearls being collected
function animatePearls(count) {
    soundManager.playPearlCollect();
    
    const inputRect = elements.typingInput.getBoundingClientRect();
    const counterRect = elements.pearlCount.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const pearl = document.createElement('div');
            pearl.className = 'animated-pearl';
            pearl.textContent = '💎';
            
            // Start position (from input)
            pearl.style.left = inputRect.left + inputRect.width / 2 + 'px';
            pearl.style.top = inputRect.top + inputRect.height / 2 + 'px';
            
            // Calculate target position (pearl counter)
            const targetX = counterRect.left - inputRect.left;
            const targetY = counterRect.top - inputRect.top;
            
            pearl.style.setProperty('--target-x', targetX + 'px');
            pearl.style.setProperty('--target-y', targetY + 'px');
            
            elements.pearlContainer.appendChild(pearl);
            
            // Remove after animation
            setTimeout(() => {
                pearl.remove();
            }, 1500);
        }, i * 100);
    }
}

// Create confetti celebration
function createConfetti() {
    const confettiSymbols = ['⭐', '💎', '🐚', '🐠', '🌟'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = confettiSymbols[Math.floor(Math.random() * confettiSymbols.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-50px';
            
            elements.celebrationLayer.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }, i * 50);
    }
}

// Check for level up
function checkLevelUp() {
    const correctNeededForLevelUp = gameState.level * 10;
    
    if (gameState.totalCorrect >= correctNeededForLevelUp) {
        gameState.level++;
        
        // Progress difficulty
        if (gameState.mode === 'letters') {
            if (gameState.characterLevel < 6) {
                gameState.characterLevel++;
            }
        } else if (gameState.mode === 'special') {
            if (gameState.specialLevel < 4) {
                gameState.specialLevel++;
            }
        } else if (gameState.mode === 'password') {
            if (gameState.passwordLevel < 7) {
                gameState.passwordLevel++;
            }
        } else {
            if (gameState.level > 20 && gameState.wordDifficulty === 'easy') {
                gameState.wordDifficulty = 'medium';
            } else if (gameState.level > 40 && gameState.wordDifficulty === 'medium') {
                gameState.wordDifficulty = 'hard';
            }
        }
        
        soundManager.playLevelUp();
        showEncouragement('🎉 Level Up! Now Level ' + gameState.level + '!');
        createConfetti();
        
        updateDisplay();
    }
}

// Check for treasure milestones
function checkTreasureMilestones() {
    const milestones = [25, 50, 100, 150, 200, 300, 500];
    
    if (milestones.includes(gameState.pearls)) {
        soundManager.playTreasure();
        showEncouragement('🏆 Treasure Unlocked! ' + gameState.pearls + ' Pearls!');
        
        // Extra celebration
        setTimeout(() => {
            createConfetti();
        }, 300);
        setTimeout(() => {
            createConfetti();
        }, 600);
    }
}

// Update all display elements
function updateDisplay() {
    elements.pearlCount.textContent = gameState.pearls;
    elements.currentLevel.textContent = gameState.level;
    
    // Update streak indicator
    if (gameState.streak >= 3) {
        elements.streakCount.textContent = gameState.streak;
        elements.streakIndicator.classList.add('show');
    } else {
        elements.streakIndicator.classList.remove('show');
    }

    // Update high score
    if (gameState.pearls > gameState.highScore) {
        gameState.highScore = gameState.pearls;
        elements.highScore.textContent = gameState.highScore;
        localStorage.setItem('typingGameHighScore', gameState.highScore);
    }
}

// Toggle sound on/off
function toggleSound() {
    const enabled = soundManager.toggle();
    elements.soundToggle.textContent = enabled ? '🔊' : '🔇';
    
    if (enabled) {
        soundManager.playCorrect();
    }
}

// Back to menu
function backToMenu() {
    if (confirm('Go back to menu? Your current progress will be saved as high score.')) {
        elements.startScreen.classList.remove('hidden');
        elements.typingInput.value = '';
        elements.typedLetters.textContent = '';
    }
}

// Reset game
function resetGame() {
    if (confirm('Start a new game? Your current progress will be lost.')) {
        gameState.pearls = 0;
        gameState.level = 1;
        gameState.streak = 0;
        gameState.characterLevel = 1;
        gameState.wordDifficulty = 'easy';
        gameState.specialLevel = 1;
        gameState.passwordLevel = 1;
        gameState.totalCorrect = 0;
        gameState.totalAttempts = 0;
        
        updateDisplay();
        nextTarget();
        elements.typingInput.focus();
        
        showEncouragement("Let's go! 🐙");
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', init);
