const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

let devicePixelRatio = window.devicePixelRatio || 1;

function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    canvas.width = containerWidth * devicePixelRatio;
    canvas.height = containerHeight * devicePixelRatio;
    
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = containerHeight + 'px';
    
    ctx.scale(devicePixelRatio, devicePixelRatio);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let score = 0;
let gameSpeed = 2;
const gravity = 0.5;
const jumpForce = -8;
const pipeWidth = 50;
const pipeGap = 150;

const bird = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    radius: 15
};

let pipes = [];
let gameRunning = false;
let gameStarted = false;

function drawBird() {
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(bird.x + 8, bird.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(bird.x + 12, bird.y);
    ctx.lineTo(bird.x + 20, bird.y);
    ctx.lineTo(bird.x + 12, bird.y + 5);
    ctx.closePath();
    ctx.fill();
}

function drawPipe(pipe) {
    const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
    gradient.addColorStop(0, '#27ae60');
    gradient.addColorStop(1, '#2ecc71');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    
    ctx.fillStyle = '#229954';
    ctx.fillRect(pipe.x - 2, pipe.top - 20, pipeWidth + 4, 20);
    ctx.fillRect(pipe.x - 2, pipe.bottom, pipeWidth + 4, 20);
}

function addPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap,
        counted: false
    });
}

function checkCollision(pipe) {
    const birdRight = bird.x + bird.radius;
    const birdLeft = bird.x - bird.radius;
    const birdTop = bird.y - bird.radius;
    const birdBottom = bird.y + bird.radius;
    
    if (birdRight > pipe.x && birdLeft < pipe.x + pipeWidth) {
        if (birdTop < pipe.top || birdBottom > pipe.bottom) {
            return true;
        }
    }
    
    if (birdTop < 0 || birdBottom > canvas.height) {
        return true;
    }
    
    return false;
}

function update() {
    if (!gameRunning) return;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= gameSpeed;

        if (!pipes[i].counted && pipes[i].x + pipeWidth < bird.x) {
            score++;
            scoreElement.textContent = score;
            pipes[i].counted = true;
        }

        if (checkCollision(pipes[i])) {
            gameOver();
            return;
        }

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        addPipe();
    }
}

function clearCanvas() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#4FC3F7');
    gradient.addColorStop(1, '#29B6F6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clearCanvas();
    pipes.forEach(drawPipe);
    drawBird();
}

function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

function startGame() {
    startScreen.classList.add('hidden');
    gameStarted = true;
    gameRunning = true;
    resetGame();
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.classList.add('hidden');
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function jump() {
    if (!gameStarted) {
        startGame();
    }
    if (gameRunning) {
        bird.velocity = jumpForce;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
        e.preventDefault();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
}, { passive: false });

canvas.addEventListener('click', (e) => {
    e.preventDefault();
    jump();
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

gameLoop();
