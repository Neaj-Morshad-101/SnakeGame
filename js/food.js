class Food {
    constructor(gridSize, canvasWidth, canvasHeight) {
        this.gridSize = gridSize;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.position = this.getRandomPosition();
        this.isBonus = false;
        this.bonusTimer = null;
        this.bonusSpawnTimer = null;
        this.bonusCollected = 0;
        this.bonusAnimationFrame = 0;
        this.initBonusSpawnTimer();
    }

    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * (this.canvasWidth / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvasHeight / this.gridSize))
        };
    }

    initBonusSpawnTimer() {
        if (this.bonusSpawnTimer) {
            clearInterval(this.bonusSpawnTimer);
        }
        this.bonusSpawnTimer = setInterval(() => {
            if (!this.isBonus && Math.random() < 0.2) { // 20% chance every 10 seconds
                this.spawnBonus();
            }
        }, 10000);
    }

    spawn(snake) {
        let newPos;
        do {
            newPos = this.getRandomPosition();
        } while (snake.collidesWith(newPos));
        
        this.position = newPos;
        this.isBonus = false;
        if (this.bonusTimer) {
            clearTimeout(this.bonusTimer);
            this.bonusTimer = null;
        }
    }

    spawnBonus(snake) {
        this.isBonus = true;
        this.spawn(snake);
        
        if (this.bonusTimer) {
            clearTimeout(this.bonusTimer);
        }
        
        this.bonusTimer = setTimeout(() => {
            this.isBonus = false;
            this.spawn(snake);
        }, 5000);

        this.bonusCollected++;
        
        if (this.bonusCollected === 1) {
            achievements.updateAchievement('firstBonus');
        }
        if (this.bonusCollected >= 3) {
            achievements.updateAchievement('bonusStreak');
        }
    }

    draw(ctx) {
        const x = this.position.x * this.gridSize + this.gridSize/2;
        const y = this.position.y * this.gridSize + this.gridSize/2;
        
        if (this.isBonus) {
            // Bonus food animation
            this.bonusAnimationFrame = (this.bonusAnimationFrame + 0.1) % (Math.PI * 2);
            const scale = 1 + Math.sin(this.bonusAnimationFrame) * 0.2;
            
            // Glow effect
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 15;
            
            // Gradient for bonus food
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.gridSize/2 * scale);
            gradient.addColorStop(0, '#fff7cc');
            gradient.addColorStop(0.5, '#ffd700');
            gradient.addColorStop(1, '#ffcc00');
            
            ctx.fillStyle = gradient;
        } else {
            // Regular food
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ffffff';
        }

        ctx.beginPath();
        ctx.arc(x, y, this.gridSize/2 * (this.isBonus ? 1 + Math.sin(this.bonusAnimationFrame) * 0.2 : 1), 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    cleanup() {
        if (this.bonusTimer) {
            clearTimeout(this.bonusTimer);
            this.bonusTimer = null;
        }
        if (this.bonusSpawnTimer) {
            clearInterval(this.bonusSpawnTimer);
            this.bonusSpawnTimer = null;
        }
    }

    reset() {
        this.cleanup();
        this.bonusCollected = 0;
        this.isBonus = false;
        this.bonusAnimationFrame = 0;
        this.initBonusSpawnTimer();
    }
} 