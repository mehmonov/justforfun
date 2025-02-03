   let currentLevel = 1;
        let sequence = [];
        let userInput = [];
        
        function createBoard(size) {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.className = `grid gap-2 p-4 bg-white rounded-lg shadow-lg grid-cols-${size}`;
            
            gameBoard.innerHTML = '';
            for(let i = 0; i < size*size; i++) {
                const cell = document.createElement('div');
                cell.className = 'cell w-16 h-16 bg-blue-200 rounded-lg hover:bg-blue-300';
                cell.dataset.index = i;
                cell.addEventListener('click', handleClick);
                gameBoard.appendChild(cell);
            }
        }

        function generateSequence() {
            sequence = [];
            for(let i = 0; i < currentLevel + 1; i++) {
                sequence.push(Math.floor(Math.random() * (currentLevel + 1) * (currentLevel + 1)));
            }
            showSequence();
        }

        function showSequence() {
            let i = 0;
            const cells = document.querySelectorAll('.cell');
            const interval = setInterval(() => {
                if(i >= sequence.length) {
                    clearInterval(interval);
                    return;
                }
                const index = sequence[i];
                cells[index].classList.add('active');
                setTimeout(() => {
                    cells[index].classList.remove('active');
                }, 500);
                i++;
            }, 1000);
        }

        function handleClick(e) {
            const clickedIndex = parseInt(e.target.dataset.index);
            userInput.push(clickedIndex);
            e.target.classList.add('active');
            setTimeout(() => e.target.classList.remove('active'), 200);
            
            checkInput();
        }

        function checkInput() {
            const isCorrect = userInput.every((val, i) => val === sequence[i]);
            
            if(!isCorrect) {
                document.getElementById('message').classList.remove('hidden');
                setTimeout(() => {
                    userInput = [];
                    document.getElementById('message').classList.add('hidden');
                    generateSequence();
                }, 1000);
                return;
            }
            
            if(userInput.length === sequence.length) {
                currentLevel++;
                document.getElementById('level').textContent = currentLevel;
                userInput = [];
                setTimeout(() => {
                    createBoard(currentLevel + 1);
                    generateSequence();
                }, 1000);
            }
        }

        
        createBoard(2); 
        setTimeout(generateSequence, 1000);
