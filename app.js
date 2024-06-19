const boardWidth = parseInt(prompt("横の長さを入力してください:"));
const boardHeight = parseInt(prompt("縦の長さを入力してください:"));
const mineCount = Math.round(boardWidth * boardHeight * 0.3);

let board = [];
let mines = [];
let flags = [];
let openedCells = 0;

function initBoard() {
    const boardElement = document.getElementById("board");
    boardElement.style.gridTemplateColumns = `repeat(${boardWidth}, 30px)`;

    for (let i = 0; i < boardHeight; i++) {
        board[i] = [];
        for (let j = 0; j < boardWidth; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("click", handleCellClick);
            cell.addEventListener("contextmenu", handleRightClick);
            boardElement.appendChild(cell);
            board[i][j] = 0;
        }
    }

    placeMines();
    updateCellValues();
}

function placeMines() {
    while (mines.length < mineCount) {
        const row = Math.floor(Math.random() * boardHeight);
        const col = Math.floor(Math.random() * boardWidth);
        if (!board[row][col]) {
            board[row][col] = -1;
            mines.push({ row, col });
        }
    }
}

function updateCellValues() {
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            if (board[i][j] !== -1) {
                let mineCount = 0;
                for (let x = Math.max(0, i - 1); x <= Math.min(boardHeight - 1, i + 1); x++) {
                    for (let y = Math.max(0, j - 1); y <= Math.min(boardWidth - 1, j + 1); y++) {
                        if (board[x][y] === -1) {
                            mineCount++;
                        }
                    }
                }
                board[i][j] = mineCount;
            }
        }
    }
}

function handleCellClick(e) {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    if (board[row][col] === -1) {
        gameOver();
    } else {
        openCell(row, col);
    }
}

function handleRightClick(e) {
    e.preventDefault();
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if (cell.classList.contains("flag")) {
        cell.classList.remove("flag");
        flags = flags.filter(flag => flag.row !== row || flag.col !== col);
    } else {
        cell.classList.add("flag");
        flags.push({ row, col });
    }
}

function openCell(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell.classList.contains("opened") && !cell.classList.contains("flag")) {
        cell.classList.add("opened");
        openedCells++;
        cell.textContent = board[row][col] || "";

        if (board[row][col] === 0) {
            for (let x = Math.max(0, row - 1); x <= Math.min(boardHeight - 1, row + 1); x++) {
                for (let y = Math.max(0, col - 1); y <= Math.min(boardWidth - 1, col + 1); y++) {
                    if (x !== row || y !== col) {
                        openCell(x, y);
                    }
                }
            }
        }

        if (openedCells === boardWidth * boardHeight - mineCount) {
            gameWon();
        }
    }
}

function gameOver() {
    for (const { row, col } of mines) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add("mine");
    }
    alert("Game Over!");
}

function gameWon() {
    for (const { row, col } of mines) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add("flag");
    }
    alert("Congratulations! You won!");
}

initBoard();
