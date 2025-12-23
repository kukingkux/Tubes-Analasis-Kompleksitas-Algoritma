let boardRows = 10;
let boardCols = 10;
let BOARD_SIZE = 100;

const snakeLadderMap = {
  4: 14,
  9: 31,
  17: 7,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  54: 34,
  62: 19,
  64: 60,
  71: 91,
  87: 24,
  93: 73,
  95: 75,
  99: 78,
};

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function simulateIterative() {
  let position = 0;
  let steps = 0;

  while (position < BOARD_SIZE) {
    position += rollDice();

    if (snakeLadderMap[position]) {
      position = snakeLadderMap[position];
    }

    steps++;
  }

  return steps;
}

function simulateRecursive(position = 0) {
  if (position >= BOARD_SIZE) {
    return 0;
  }

  let newPosition = position + rollDice();

  if (snakeLadderMap[newPosition]) {
    newPosition = snakeLadderMap[newPosition];
  }

  return 1 + simulateRecursive(newPosition);
}

document
  .getElementById("randomize")
  .addEventListener("click", randomizeObstacles);
document
  .getElementById("run-iterative")
  .addEventListener("click", runIterative);
document
  .getElementById("run-recursive")
  .addEventListener("click", runRecursive);

document
  .getElementById("start-visualization")
  .addEventListener("click", startVisualization);

document
  .getElementById("input-panjang")
  .addEventListener("input", updateBoardSize);
document
  .getElementById("input-lebar")
  .addEventListener("input", updateBoardSize);

function updateBoardSize() {
  boardRows = parseInt(document.getElementById("input-panjang").value) || 10;
  boardCols = parseInt(document.getElementById("input-lebar").value) || 10;
  BOARD_SIZE = boardRows * boardCols;
  renderBoard();
}

function randomizeObstacles() {
  snakeLadderMap = {};
  for (let i = 0; i < Math.min(10, BOARD_SIZE - 1); i++) {
    let start = Math.floor(Math.random() * (BOARD_SIZE - 1)) + 2;
    let end = Math.floor(Math.random() * (BOARD_SIZE - 1)) + 2;
    snakeLadderMap[start] = end;
  }
  document.getElementById("results").innerText = "Obstacles randomized.";
  renderBoard();
}

function runIterative() {
  let totalSteps = 0;
  const runs = 1000;
  for (let i = 0; i < runs; i++) {
    totalSteps += simulateIterative();
  }
  const average = totalSteps / runs;
  document.getElementById(
    "results"
  ).innerText = `Iterative: Average steps ${average.toFixed(2)}`;
}

function runRecursive() {
  let totalSteps = 0;
  const runs = 1000;
  for (let i = 0; i < runs; i++) {
    totalSteps += simulateRecursive();
  }
  const average = totalSteps / runs;
  document.getElementById(
    "results"
  ).innerText = `Recursive: Average steps ${average.toFixed(2)}`;
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  board.style.width = "800px";
  board.style.height = "800px";

  const cellWidth = 800 / boardCols;
  const cellHeight = 800 / boardRows;

  for (let row = boardRows; row >= 1; row--) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    for (let col = 1; col <= boardCols; col++) {
      let num;
      if (row % 2 === 1) {
        // odd row, left to right
        num = (row - 1) * boardCols + col;
      } else {
        // even row, right to left
        num = (row - 1) * boardCols + (boardCols - col + 1);
      }

      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${num}`;
      cell.innerText = num;
      cell.style.width = cellWidth + "px";
      cell.style.height = cellHeight + "px";

      // checkerboard
      let isGray =
        (row % 2 === 1 && col % 2 === 1) || (row % 2 === 0 && col % 2 === 0);
      cell.style.background = isGray ? "#d9d9d9" : "#3594ac";

      // ladders green
      if (snakeLadderMap[num] && snakeLadderMap[num] > num) {
        cell.style.background = "#b8de99";
      }

      // snakes orange
      if (snakeLadderMap[num] && snakeLadderMap[num] < num) {
        cell.style.background = "#e6a458";
      }

      rowDiv.appendChild(cell);
    }

    board.appendChild(rowDiv);
  }
}

function updatePlayer(position) {
  document.querySelectorAll(".player").forEach((c) => {
    c.classList.remove("player");
    c.style.background = ""; // reset
    c.style.color = "black";
  });

  const cell = document.getElementById(`cell-${position}`);
  if (cell) {
    cell.classList.add("player");
    cell.style.background = "#f1f1f1";
    cell.style.color = "black";
  }
}

async function startVisualization() {
  let position = 0;
  renderBoard();

  while (position < BOARD_SIZE) {
    await delay(500);

    position += rollDice();

    if (snakeLadderMap[position]) {
      position = snakeLadderMap[position];
    }

    updatePlayer(position);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

renderBoard();
