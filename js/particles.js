class ParticleSystem {
    constructor() {
        this.particles = [];
        this.gravity = 0.2;
        this.friction = 0.98;
    }

    createParticles(x, y, color, count = 10) {
        const colors = [color, '#ffffff', '#ffff00'];
        const sizes = [2, 3, 4];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 4;
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: size,
                alpha: 1,
                rotation: Math.random() * Math.PI * 2
            });
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Apply physics
            p.vy += this.gravity;
            p.vx *= this.friction;
            p.vy *= this.friction;
            
            // Update life and alpha
            p.life -= 0.02;
            p.alpha = p.life;
            
            // Rotate particle
            p.rotation += 0.1;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        ctx.save();
        
        this.particles.forEach(p => {
            ctx.save();
            
            // Set transparency
            ctx.globalAlpha = p.alpha;
            
            // Move to particle position and rotate
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            
            // Create gradient
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            // Draw particle
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
        
        ctx.restore();
    }

    createExplosion(x, y, color, particleCount = 20) {
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 1 + Math.random() * 3;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: color,
                size: 2 + Math.random() * 2,
                alpha: 1,
                rotation: Math.random() * Math.PI * 2
            });
        }
    }

    clear() {
        this.particles = [];
    }
}

const particleSystem = new ParticleSystem(); 