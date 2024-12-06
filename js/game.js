// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;

// Game state variables
let gameInterval = null;
let isGameStarted = false;
let isPaused = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameSpeed = 100;
const MIN_GAME_SPEED = 50;

// DOM elements
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const gameOverElement = document.querySelector('.game-over');
const pauseElement = document.querySelector('.pause-text');
const startMessage = document.querySelector('.start-message');

// Game objects
const snake = new Snake(gridSize);
const food = new Food(gridSize, canvas.width, canvas.height);
const controls = new Controls(snake);
const particleSystem = new ParticleSystem();
const soundManager = new SoundManager();
const achievements = new Achievements();

function gameLoop() {
    if (isPaused) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    snake.move();
    
    if (snake.checkCollision()) {
        handleGameOver();
        return;
    }
    
    // Check food collision
    if (snake.body[0].x === food.position.x && snake.body[0].y === food.position.y) {
        snake.grow();
        score += food.isBonus ? 5 : 1;
        updateScoreDisplay(score);
        soundManager.play(food.isBonus ? 'bonus' : 'eat');
        
        particleSystem.createParticles(
            food.position.x * gridSize + gridSize/2,
            food.position.y * gridSize + gridSize/2,
            food.isBonus ? "#ffd700" : "#ffff00"
        );
        
        food.spawn(snake);
        increaseSpeed();
        
        // Achievement checks
        if (score >= 100) achievements.updateAchievement('score100');
        else if (score >= 50) achievements.updateAchievement('score50');
        
        if (gameSpeed <= MIN_GAME_SPEED) {
            achievements.updateAchievement('speedDemon');
        }
    } else {
        snake.body.pop();
    }
    
    // Draw everything
    food.draw(ctx);
    snake.draw(ctx);
}

function handleGameOver() {
    clearInterval(gameInterval);
    gameInterval = null;
    gameOverElement.style.display = 'block';
    soundManager.play('gameOver');
    isGameStarted = false;
}

function resetGame() {
    snake.reset();
    food.spawn(snake);
    score = 0;
    gameSpeed = 100;
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
    gameOverElement.style.display = 'none';
    startMessage.style.display = 'none';
    pauseElement.style.display = 'none';
    isPaused = false;
}

// Event listeners
document.addEventListener("keydown", function(e) {
    if (e.key === " ") {
        e.preventDefault(); // Prevent page scrolling
        if (!isGameStarted) {
            isGameStarted = true;
            resetGame();
            gameInterval = setInterval(gameLoop, gameSpeed);
        } else {
            isPaused = !isPaused;
            pauseElement.style.display = isPaused ? 'block' : 'none';
        }
    }
});

// Initialize game
window.addEventListener('load', () => {
    resetGame();
    startMessage.style.display = 'block';
}); 