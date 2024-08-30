const shapes = ['▲', '●', '■', '★', '♥', '♦', '♣', '♠'];
const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function createBoard() {
    const allShapes = [...shapes, ...shapes];
    const shuffledShapes = shuffleArray(allShapes);
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;

    shuffledShapes.forEach((shape, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.shape = shape;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.textContent = this.dataset.shape;  
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const shape1 = card1.dataset.shape;
    const shape2 = card2.dataset.shape;

    if (shape1 === shape2) {
        matchedPairs++;
        if (matchedPairs === shapes.length) {
            
            alert("Congratulations! You've won the game!");
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }

    flippedCards = [];
}


resetButton.addEventListener('click', createBoard);

createBoard();