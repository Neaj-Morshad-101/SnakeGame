class SoundManager {
    constructor() {
        this.sounds = {
            eat: document.getElementById('eatSound'),
            bonus: document.getElementById('bonusSound'),
            gameOver: document.getElementById('gameOverSound')
        };
        this.isMuted = false;
        this.volume = 0.5;
        this.init();
    }

    init() {
        // Initialize all sounds
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = this.volume;
                // Preload sounds
                sound.load();
                // Add error handling
                sound.onerror = (e) => {
                    console.error('Error loading sound:', e);
                };
            }
        });

        // Restore mute state from localStorage if exists
        const savedMuteState = localStorage.getItem('snakeSoundMuted');
        if (savedMuteState !== null) {
            this.isMuted = JSON.parse(savedMuteState);
            this.updateMuteState();
        }
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (!this.isMuted && sound) {
            // Create a promise to handle sound playing
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Reset sound to start
                        sound.currentTime = 0;
                    })
                    .catch(error => {
                        console.warn('Sound play failed:', error);
                    });
            }
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateMuteState();
        // Save mute state to localStorage
        localStorage.setItem('snakeSoundMuted', JSON.stringify(this.isMuted));
    }

    updateMuteState() {
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.muted = this.isMuted;
            }
        });
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = this.volume;
            }
        });
    }

    preloadSounds() {
        return Promise.all(
            Object.values(this.sounds).map(sound => {
                if (sound) {
                    return sound.load();
                }
                return Promise.resolve();
            })
        );
    }

    cleanup() {
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
    }

    reset() {
        this.cleanup();
        this.init();
    }
}

// Create a single instance of SoundManager
const soundManager = new SoundManager(); 