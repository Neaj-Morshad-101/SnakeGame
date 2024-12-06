class Snake {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = null;
        const canvas = document.getElementById('gameCanvas');
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
    }

    draw(ctx) {
        for (let i = 1; i < this.body.length - 1; i++) {
            const prev = this.body[i - 1];
            const curr = this.body[i];
            const next = this.body[i + 1];
            
            ctx.save();
            ctx.translate(
                curr.x * this.gridSize + this.gridSize/2, 
                curr.y * this.gridSize + this.gridSize/2
            );
            
            const angle = Math.atan2(
                next.y - prev.y,
                next.x - prev.x
            );
            ctx.rotate(angle);
            
            const gradient = ctx.createLinearGradient(0, -this.gridSize/2, 0, this.gridSize/2);
            gradient.addColorStop(0, "#00ff44");  // Bright green
            gradient.addColorStop(0.3, "#00cc33"); // Mid green
            gradient.addColorStop(0.7, "#00aa33"); // Darker green
            gradient.addColorStop(1, "#008833");   // Darkest green
            ctx.fillStyle = gradient;
            
            const segmentLength = this.gridSize;
            const segmentWidth = this.gridSize * 0.8;
            
            ctx.beginPath();
            ctx.moveTo(-segmentLength/2, 0);
            
            ctx.bezierCurveTo(
                -segmentLength/2, -segmentWidth/2,
                segmentLength/2, -segmentWidth/2,
                segmentLength/2, 0
            );
            
            ctx.bezierCurveTo(
                segmentLength/2, segmentWidth/2,
                -segmentLength/2, segmentWidth/2,
                -segmentLength/2, 0
            );
            
            ctx.fill();
            
            ctx.fillStyle = "#00cc33";
            const scaleSize = this.gridSize/5;
            const rows = 3;
            const cols = 4;
            
            for(let row = 0; row < rows; row++) {
                for(let col = 0; col < cols; col++) {
                    const x = (col - cols/2) * scaleSize + (row % 2) * (scaleSize/2);
                    const y = (row - rows/2) * scaleSize;
                    
                    ctx.beginPath();
                    ctx.ellipse(x, y, scaleSize/2, scaleSize/3, 0, 0, Math.PI);
                    ctx.fill();
                }
            }
            
            const highlightGradient = ctx.createLinearGradient(
                0, -segmentWidth/2, 
                0, segmentWidth/4
            );
            highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
            highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = highlightGradient;
            
            ctx.beginPath();
            ctx.ellipse(0, -segmentWidth/4, segmentLength/2, segmentWidth/3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }

        const head = this.body[0];
        const neck = this.body[1];
        
        ctx.save();
        ctx.translate(head.x * this.gridSize + this.gridSize/2, head.y * this.gridSize + this.gridSize/2);
        
        const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);
        ctx.rotate(headAngle);
        
        const headGradient = ctx.createRadialGradient(
            0, 0, this.gridSize/4, 
            0, 0, this.gridSize
        );
        headGradient.addColorStop(0, "#00ff44");
        headGradient.addColorStop(1, "#00aa33");
        ctx.fillStyle = headGradient;
        
        ctx.beginPath();
        ctx.arc(-this.gridSize/4, 0, this.gridSize/2, -Math.PI/2, Math.PI/2);
        ctx.quadraticCurveTo(this.gridSize/2, this.gridSize/2, this.gridSize/2, 0);
        ctx.quadraticCurveTo(this.gridSize/2, -this.gridSize/2, -this.gridSize/4, -this.gridSize/2);
        ctx.fill();
        
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(this.gridSize/6, -this.gridSize/4, 3, 0, Math.PI * 2);
        ctx.arc(this.gridSize/6, this.gridSize/4, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = "#ff3366";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.gridSize/2, 0);
        const tongueLength = this.gridSize/2;
        const tongueTime = Date.now() / 200;
        const tongueWave = Math.sin(tongueTime) * 2;
        ctx.lineTo(this.gridSize/2 + tongueLength * 0.7, tongueWave);
        ctx.lineTo(this.gridSize/2 + tongueLength, -tongueWave * 2);
        ctx.stroke();
        
        ctx.restore();
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

        const maxX = Math.floor(this.canvasWidth / this.gridSize);
        const maxY = Math.floor(this.canvasHeight / this.gridSize);

        if (newHead.x < 0) newHead.x = maxX - 1;
        if (newHead.x >= maxX) newHead.x = 0;
        if (newHead.y < 0) newHead.y = maxY - 1;
        if (newHead.y >= maxY) newHead.y = 0;

        this.body.unshift(newHead);
    }

    grow() {
        return;
    }

    checkCollision() {
        const head = this.body[0];
        return this.body.slice(1).some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }

    reset() {
        const startX = Math.floor((this.canvasWidth / this.gridSize) / 2);
        const startY = Math.floor((this.canvasHeight / this.gridSize) / 2);
        this.body = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = null;
    }

    setDirection(newDir) {
        if (!(newDir.x === -this.direction.x && newDir.y === -this.direction.y)) {
            this.nextDirection = newDir;
        }
    }
} 