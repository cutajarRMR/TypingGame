// Sound system for the game
class SoundManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    // Play a tone with specified frequency and duration
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Correct answer sound - bubble pop
    playCorrect() {
        if (!this.enabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // First pop
        this.playTone(800, 0.1, 'sine');
        
        // Second pop (higher)
        setTimeout(() => {
            this.playTone(1000, 0.1, 'sine');
        }, 50);
    }

    // Incorrect answer sound - gentle bloop
    playIncorrect() {
        if (!this.enabled || !this.audioContext) return;

        this.playTone(200, 0.2, 'sine');
    }

    // Pearl collection sound
    playPearlCollect() {
        if (!this.enabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // Sparkle sound
        this.playTone(1200, 0.15, 'triangle');
        setTimeout(() => {
            this.playTone(1600, 0.1, 'triangle');
        }, 80);
    }

    // Streak bonus sound
    playStreak() {
        if (!this.enabled || !this.audioContext) return;

        const frequencies = [523, 659, 784, 1047]; // C, E, G, C (major chord)
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.2, 'triangle');
            }, index * 80);
        });
    }

    // Level up celebration sound
    playLevelUp() {
        if (!this.enabled || !this.audioContext) return;

        const melody = [523, 587, 659, 784, 880, 1047]; // C D E G A C
        
        melody.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.15, 'square');
            }, index * 100);
        });
    }

    // Treasure chest unlock sound
    playTreasure() {
        if (!this.enabled || !this.audioContext) return;

        // Magical unlock sound
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.playTone(800 + (i * 100), 0.1, 'triangle');
            }, i * 50);
        }
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Check if sound is enabled
    isEnabled() {
        return this.enabled;
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();
