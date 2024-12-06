class Achievements {
    constructor() {
        this.achievements = {
            firstBonus: { 
                name: "Bonus Hunter", 
                description: "Collect your first bonus food",
                unlocked: false 
            },
            score50: { 
                name: "Half Century", 
                description: "Reach a score of 50",
                unlocked: false 
            },
            score100: { 
                name: "Century Master", 
                description: "Reach a score of 100",
                unlocked: false 
            },
            highScoreBeaten: { 
                name: "Record Breaker", 
                description: "Beat the high score",
                unlocked: false 
            },
            speedDemon: { 
                name: "Speed Demon", 
                description: "Reach maximum speed",
                unlocked: false 
            },
            bonusStreak: { 
                name: "Bonus Streak", 
                description: "Collect 3 bonus foods",
                unlocked: false 
            }
        };
        
        this.notificationQueue = [];
        this.isShowingNotification = false;
        this.loadAchievements();
    }

    loadAchievements() {
        const savedAchievements = JSON.parse(localStorage.getItem('snakeAchievements')) || {};
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].unlocked = savedAchievements[key] || false;
        });
    }

    saveAchievements() {
        const savedAchievements = Object.fromEntries(
            Object.entries(this.achievements).map(([k, v]) => [k, v.unlocked])
        );
        localStorage.setItem('snakeAchievements', JSON.stringify(savedAchievements));
    }

    updateAchievement(key) {
        if (!this.achievements[key] || this.achievements[key].unlocked) return;
        
        this.achievements[key].unlocked = true;
        this.saveAchievements();
        this.queueNotification(this.achievements[key].name);
    }

    queueNotification(achievementName) {
        this.notificationQueue.push(achievementName);
        if (!this.isShowingNotification) {
            this.showNextNotification();
        }
    }

    showNextNotification() {
        if (this.notificationQueue.length === 0) {
            this.isShowingNotification = false;
            return;
        }

        this.isShowingNotification = true;
        const achievementName = this.notificationQueue.shift();
        const achievementElement = document.querySelector('.achievement');
        
        achievementElement.textContent = `Achievement Unlocked: ${achievementName}`;
        achievementElement.style.opacity = '1';
        achievementElement.style.transform = 'translateY(20px)';

        setTimeout(() => {
            achievementElement.style.opacity = '0';
            achievementElement.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                this.showNextNotification();
            }, 500); // Wait for fade out animation
        }, 3000); // Show for 3 seconds
    }

    getUnlockedCount() {
        return Object.values(this.achievements)
            .filter(achievement => achievement.unlocked).length;
    }

    getTotalCount() {
        return Object.keys(this.achievements).length;
    }

    reset() {
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].unlocked = false;
        });
        this.saveAchievements();
        this.notificationQueue = [];
        this.isShowingNotification = false;
    }
}

const achievements = new Achievements(); 