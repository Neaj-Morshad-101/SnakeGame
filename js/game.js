// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;

// Game state variables
let gameInterval;
let isGameStarted = false;
let isPaused = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameSpeed = 100; // Initial speed
const MIN_GAME_SPEED = 50; // Maximum speed (lower number = faster)

// DOM elements
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const gameOverElement = document.querySelector('.game-over');
const pauseElement = document.querySelector('.pause-text');

// Game objects
const snake = new Snake(gridSize);
const food = new Food(gridSize, canvas.width, canvas.height);
const controls = new Controls(snake);
const particleSystem = new ParticleSystem();
const soundManager = new SoundManager();
const achievements = new Achievements();

// Game loop
function gameLoop() {
    if (isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.move();
    if (snake.collidesWith(food.position)) {
        snake.grow();
        score += food.isBonus ? 5 : 1;
        scoreElement.textContent = `Score: ${score}`;
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreElement.textContent = `High Score: ${highScore}`;
            achievements.updateAchievement('highScoreBeaten');
        }
        
        if (score >= 100) achievements.updateAchievement('score100');
        else if (score >= 50) achievements.updateAchievement('score50');

        food.spawn(snake);
        soundManager.play('eat');
        particleSystem.createParticles(
            food.position.x * gridSize + gridSize / 2,
            food.position.y * gridSize + gridSize / 2,
            '#ffffff'
        );

        // Increase speed
        if (gameSpeed > MIN_GAME_SPEED) {
            gameSpeed = Math.max(MIN_GAME_SPEED, gameSpeed - 2);
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
        
        if (gameSpeed <= MIN_GAME_SPEED) {
            achievements.updateAchievement('speedDemon');
        }
    }

    snake.draw(ctx);
    food.draw(ctx);
    particleSystem.update();
    particleSystem.draw(ctx);

    // Check for game over
    if (snake.collidesWith(snake.body[0])) {
        handleGameOver();
    }
}

// Handle game over
function handleGameOver() {
    clearInterval(gameInterval);
    gameInterval = null;
    gameOverElement.style.display = 'block';
    soundManager.play('gameOver');
    isGameStarted = false;
}

// Reset game state
function resetGame() {
    snake.body = [{ x: 10, y: 10 }];
    snake.direction = { x: 1, y: 0 };
    food.spawn(snake);
    gameOverElement.style.display = 'none';
    pauseElement.style.display = 'none';
    isPaused = false;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
    gameSpeed = 100;
}

// Event listeners
document.addEventListener("keydown", function (e) {
    if (e.key === " ") {
        if (!isGameStarted) {
            resetGame();
            gameInterval = setInterval(gameLoop, gameSpeed);
            isGameStarted = true;
        } else {
            isPaused = !isPaused;
            pauseElement.style.display = isPaused ? 'block' : 'none';
        }
    } else if (e.key === 'M' || e.key === 'm') {
        soundManager.toggleMute();
    }
});

// Initialize game
window.addEventListener('load', () => {
    resetGame();
}); 