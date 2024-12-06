class Snake {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = null;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
    }

    setDirection(newDirection) {
        // Prevent 180-degree turns
        if (this.nextDirection) return;
        if (newDirection.x !== -this.direction.x || newDirection.y !== -this.direction.y) {
            this.nextDirection = newDirection;
        }
    }

    move() {
        if (this.nextDirection) {
            this.direction = this.nextDirection;
            this.nextDirection = null;
        }

        const newHead = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };

        // Wrap around canvas bounds
        const maxX = Math.floor(this.canvasWidth / this.gridSize);
        const maxY = Math.floor(this.canvasHeight / this.gridSize);

        if (newHead.x < 0) newHead.x = maxX - 1;
        if (newHead.x >= maxX) newHead.x = 0;
        if (newHead.y < 0) newHead.y = maxY - 1;
        if (newHead.y >= maxY) newHead.y = 0;

        this.body.unshift(newHead);
        this.body.pop();
    }

    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push({ ...tail });
    }

    collidesWith(position) {
        return this.body.some((segment, index) => {
            // Skip head collision check when checking self-collision
            if (position === this.body[0] && index === 0) return false;
            return segment.x === position.x && segment.y === position.y;
        });
    }

    draw(ctx) {
        // Draw body segments
        for (let i = this.body.length - 1; i >= 1; i--) {
            const prev = this.body[i - 1];
            const curr = this.body[i];
            const next = this.body[i + 1] || curr;
            
            ctx.save();
            ctx.translate(
                curr.x * this.gridSize + this.gridSize/2, 
                curr.y * this.gridSize + this.gridSize/2
            );
            
            // Calculate angle based on previous and next segments
            const angle = Math.atan2(
                next.y - prev.y,
                next.x - prev.x
            );
            ctx.rotate(angle);
            
            // Draw body segment
            const gradient = ctx.createLinearGradient(-this.gridSize/2, 0, this.gridSize/2, 0);
            gradient.addColorStop(0, '#00ff44');
            gradient.addColorStop(0.5, '#00cc33');
            gradient.addColorStop(1, '#00aa33');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.gridSize/2, this.gridSize/3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }

        // Draw head
        if (this.body.length > 0) {
            this.drawHead(ctx);
        }
    }

    drawHead(ctx) {
        const head = this.body[0];
        const neck = this.body[1] || head;
        
        ctx.save();
        ctx.translate(
            head.x * this.gridSize + this.gridSize/2, 
            head.y * this.gridSize + this.gridSize/2
        );
        
        const angle = Math.atan2(
            head.y - neck.y,
            head.x - neck.x
        );
        ctx.rotate(angle);
        
        // Head gradient
        const gradient = ctx.createRadialGradient(0, 0, this.gridSize/4, 0, 0, this.gridSize);
        gradient.addColorStop(0, '#00ff44');
        gradient.addColorStop(0.6, '#00cc33');
        gradient.addColorStop(1, '#00aa33');
        
        ctx.fillStyle = gradient;
        
        // Draw head shape
        ctx.beginPath();
        ctx.arc(-this.gridSize/4, 0, this.gridSize/2, -Math.PI/2, Math.PI/2);
        ctx.quadraticCurveTo(this.gridSize/2, this.gridSize/2, this.gridSize/2, 0);
        ctx.quadraticCurveTo(this.gridSize/2, -this.gridSize/2, -this.gridSize/4, -this.gridSize/2);
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(this.gridSize/4, -this.gridSize/4, 3, 3, 0, 0, Math.PI * 2);
        ctx.ellipse(this.gridSize/4, this.gridSize/4, 3, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    reset() {
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = null;
    }
} 