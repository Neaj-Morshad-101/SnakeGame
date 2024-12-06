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
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = this.volume;
                sound.load();
                sound.onerror = () => {
                    console.warn('Sound loading failed, continuing without sound');
                };
            }
        });

        const savedMuteState = localStorage.getItem('snakeSoundMuted');
        if (savedMuteState !== null) {
            this.isMuted = JSON.parse(savedMuteState);
            this.updateMuteState();
        }
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (!this.isMuted && sound && sound.readyState >= 2) {
            try {
                sound.currentTime = 0;
                sound.play().catch(err => {
                    console.warn('Sound play failed:', err);
                });
            } catch (err) {
                console.warn('Sound play error:', err);
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