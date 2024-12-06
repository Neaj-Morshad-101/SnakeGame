class Controls {
    constructor(snake) {
        this.snake = snake;
        this.KEY_MAPPINGS = {
            UP: ['w', 'W', 'ArrowUp'],
            DOWN: ['s', 'S', 'ArrowDown'],
            LEFT: ['a', 'A', 'ArrowLeft'],
            RIGHT: ['d', 'D', 'ArrowRight']
        };
        this.DIRECTIONS = {
            UP: { x: 0, y: -1 },
            DOWN: { x: 0, y: 1 },
            LEFT: { x: -1, y: 0 },
            RIGHT: { x: 1, y: 0 }
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            for (const [dirName, keys] of Object.entries(this.KEY_MAPPINGS)) {
                if (keys.includes(e.key)) {
                    const newDir = this.DIRECTIONS[dirName];
                    this.snake.setDirection(newDir);
                    break;
                }
            }
        });
    }
} 