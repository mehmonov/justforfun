const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const restartButton = document.getElementById('restartButton');

canvas.width = 620;
canvas.height = 480;

let score = 0;
let gameSpeed = 2;
const gravity = 0.5;
const jumpForce = -8;
const pipeWidth = 50;
const pipeGap = 150;

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0
};

let pipes = [];
let gameRunning = true;

function drawBird() {
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(bird.x + bird.width/2, bird.y + bird.height/2, bird.width/2, 0, Math.PI * 2);
    ctx.fill();
}

function drawPipe(pipe) {
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
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
    const birdRight = bird.x + bird.width;
    const birdBottom = bird.y + bird.height;
    
    if (birdRight > pipe.x && bird.x < pipe.x + pipeWidth) {
        if (bird.y < pipe.top || birdBottom > pipe.bottom) {
            return true;
        }
    }
    
    if (bird.y < 0 || birdBottom > canvas.height) {
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
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clearCanvas();
    drawBird();
    pipes.forEach(drawPipe);
}

function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

function restartGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.classList.add('hidden');
    gameRunning = true;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        bird.velocity = jumpForce;
    }
});

document.addEventListener('click', () => {
    if (gameRunning) {
        bird.velocity = jumpForce;
    }
});

restartButton.addEventListener('click', restartGame);

gameLoop();
