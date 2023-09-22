class Game {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.text = document.getElementById('text');
        this.gameOver = false;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.snake = [
            { x: this.width / 2, y: this.height / 2 },
            { x: this.width / 2 - 25, y: this.height / 2 },
            { x: this.width / 2 - 50, y: this.height / 2 },
            { x: this.width / 2 - 75, y: this.height / 2 },
            { x: this.width / 2 - 100, y: this.height / 2 },
        ];
        this.food = this.createFood();
        this.score = 0;
        this.dir = 'right';
        this.snakeColor = '#0bde00';
        this.foodColor = '#ff4040';

        addEventListener('keydown', (e) => {
            const directions = {
                37: 'left',
                39: 'right',
                38: 'up',
                40: 'down',
            };

            const newDir = directions[e.keyCode];
            if (newDir && newDir !== this.oppositeDirection(this.dir)) {
                this.dir = newDir;
            }
        });
    }

    oppositeDirection(dir) {
        const opposites = {
            left: 'right',
            right: 'left',
            up: 'down',
            down: 'up',
        };
        return opposites[dir];
    }

    drawSnake() {
        for (let i = 1; i < this.snake.length; i++) {
            this.ctx.fillStyle = this.snakeColor;
            this.ctx.fillRect(this.snake[i].x, this.snake[i].y, 25, 25);
        }
    }

    drawFood() {
        this.ctx.fillStyle = this.foodColor;
        this.ctx.fillRect(this.food.x, this.food.y, 25, 25);
    }

    createFood() {
        let foodX, foodY;

        foodX = Math.floor(Math.random() * (this.width / 20)) * 20;
        foodY = Math.floor(Math.random() * (this.height / 20)) * 20;

        return { x: foodX, y: foodY };
    }

    updateSnake() {
        let headX = this.snake[0].x;
        let headY = this.snake[0].y;
    
        if (this.dir === 'right') {
            headX += 5;
        } else if (this.dir === 'left') {
            headX -= 5;
        } else if (this.dir === 'down') {
            headY += 5;
        } else if (this.dir === 'up') {
            headY -= 5;
        }
    
        if (headX <= 0) {
            headX = this.width;
        } else if (headX > this.width) {
            headX = 0;
        }
    
        if (headY <= 0) {
            headY = this.height;
        } else if (headY > this.height) {
            headY = 0;
        }
    
        this.snake.unshift({ x: headX, y: headY });
        this.removeTail();
    }

    removeTail() {
        if (this.snake.length > 1) {
            this.snake.pop();
        }
    }    

    checkCollision() {
        const headX = this.snake[0].x;
        const headY = this.snake[0].y;
        const foodX = this.food.x;
        const foodY = this.food.y;

        for (let i = 1; i < this.snake.length; i++) {
            if (headX === this.snake[i].x && headY === this.snake[i].y) {
                this.gameOver = true;
                const self = this;
                setTimeout(() => {
                    self.text.innerText = 'Game over!';
                    setTimeout(() => {
                        window.location.reload();
                    }, 1200);
                }, 10);
                return;
            }
        }

        if (headX < foodX + 25 && headX + 25 > foodX && headY < foodY + 25 && headY + 25 > foodY) {
            this.score++;
            this.text.innerText = `Score: ${this.score}`;

            for (let i = 0; i < 5; i++) {
                this.snake.push({ x: 0, y: 0 });
            }

            this.food = this.createFood();
        }
    }

    loop() {
        if (this.gameOver) {
            return;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
    
        this.updateSnake();
        this.checkCollision();

        this.drawSnake();
        this.drawFood();
    
        requestAnimationFrame(this.loop.bind(this));
    }
}

const game = new Game();
game.loop();
