class ParticleSystem {
    constructor() {
        this.particles = [];
        this.gravity = 0.2;
        this.friction = 0.98;
    }

    createParticles(x, y, color = "#ffff00") {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= 0.02;  // Fade out
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.life = 1.0;  // Full opacity
    }
}