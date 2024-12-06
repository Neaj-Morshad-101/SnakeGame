class Achievements {
    constructor() {
        this.achievements = {
            firstBonus: false,
            score50: false,
            score100: false,
            highScoreBeaten: false,
            speedDemon: false
        };
        this.achievementElement = document.querySelector('.achievement');
    }

    updateAchievement(type) {
        if (!this.achievements[type]) {
            this.achievements[type] = true;
            let message = '';
            
            switch(type) {
                case 'firstBonus':
                    message = 'First Bonus Food Eaten!';
                    break;
                case 'score50':
                    message = 'Score 50!';
                    break;
                case 'score100':
                    message = 'Score 100!';
                    break;
                case 'highScoreBeaten':
                    message = 'New High Score!';
                    break;
                case 'speedDemon':
                    message = 'Speed Demon!';
                    break;
            }
            
            this.showAchievement(message);
        }
    }

    showAchievement(message) {
        this.achievementElement.textContent = message;
        this.achievementElement.style.opacity = '1';

        setTimeout(() => {
            this.achievementElement.style.opacity = '0';
        }, 3000);
    }
}