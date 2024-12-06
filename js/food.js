class Food {
    constructor(gridSize, canvasWidth, canvasHeight) {
        this.gridSize = gridSize;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.position = this.getRandomPosition();
        this.isBonus = false;
        this.bonusTimer = null;
        this.bonusSpawnTimer = null;
        this.bonusAnimationFrame = 0;
        this.initBonusSpawnTimer();
    }

    getRandomPosition() {
        const cols = Math.floor(this.canvasWidth / this.gridSize);
        const rows = Math.floor(this.canvasHeight / this.gridSize);
        return {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
    }

    spawn(snake) {
        let newPosition;
        do {
            newPosition = this.getRandomPosition();
        } while (snake.body.some(segment => 
            segment.x === newPosition.x && segment.y === newPosition.y
        ));
        this.position = newPosition;
    }

    initBonusSpawnTimer() {
        // Clear any existing timer
        if (this.bonusSpawnTimer) {
            clearInterval(this.bonusSpawnTimer);
        }
        
        // Set up new timer to check every 10 seconds
        this.bonusSpawnTimer = setInterval(() => {
            if (!this.isBonus) {
                console.log("Checking bonus spawn chance...");
                if (Math.random() < 0.5) { // 50% chance
                    console.log("Spawning bonus food!");
                    this.isBonus = true;
                    
                    // Set timer to remove bonus food after 5 seconds
                    if (this.bonusTimer) {
                        clearTimeout(this.bonusTimer);
                    }
                    this.bonusTimer = setTimeout(() => {
                        console.log("Removing bonus food");
                        this.isBonus = false;
                        this.spawn(snake);
                    }, 5000);
                }
            }
        }, 10000);
    }

    draw(ctx) {
        const x = this.position.x * this.gridSize + this.gridSize/2;
        const y = this.position.y * this.gridSize + this.gridSize/2;
        
        if (this.isBonus) {
            // Bonus food animation
            this.bonusAnimationFrame = (this.bonusAnimationFrame + 0.1) % (Math.PI * 2);
            const scale = 1 + Math.sin(this.bonusAnimationFrame) * 0.2;
            
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 15;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.gridSize/2 * scale);
            gradient.addColorStop(0, '#fff7cc');
            gradient.addColorStop(0.5, '#ffd700');
            gradient.addColorStop(1, '#ffcc00');
            
            ctx.fillStyle = gradient;
            
            ctx.beginPath();
            ctx.arc(x, y, this.gridSize/2 * scale, 0, Math.PI * 2);
            ctx.fill();
            
            // Add sparkle effect
            ctx.fillStyle = "#fff";
            const time = Date.now() / 200;
            for (let i = 0; i < 4; i++) {
                const angle = (time + i * Math.PI/2) % (Math.PI * 2);
                ctx.beginPath();
                ctx.arc(
                    x + Math.cos(angle) * this.gridSize/3,
                    y + Math.sin(angle) * this.gridSize/3,
                    2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        } else {
            // Regular food
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ff0000';
            
            ctx.beginPath();
            ctx.arc(x, y, this.gridSize/2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
} 