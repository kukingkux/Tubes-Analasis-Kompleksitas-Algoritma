const BOARD_SIZE = 100;

const ORIGINAL_SNAKE_LADDER_MAP = {
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

let snakeLadderMap = { ...ORIGINAL_SNAKE_LADDER_MAP };

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
  .getElementById("run-iterative")
  .addEventListener("click", runIterative);
document
  .getElementById("run-recursive")
  .addEventListener("click", runRecursive);

function runIterative() {
  let totalSteps = 0;
  const runs =
    parseInt(document.getElementById("simulation-runs").value) || 1000;
  const startTime = performance.now();
  for (let i = 0; i < runs; i++) {
    totalSteps += simulateIterative();
  }
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  const average = totalSteps / runs;
  document.getElementById(
    "results"
  ).innerText = `Iterative: Average steps ${average.toFixed(
    2
  )}, Time: ${executionTime.toFixed(2)} ms`;
}

function runRecursive() {
  let totalSteps = 0;
  const runs =
    parseInt(document.getElementById("simulation-runs").value) || 1000;
  const startTime = performance.now();
  for (let i = 0; i < runs; i++) {
    totalSteps += simulateRecursive();
  }
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  const average = totalSteps / runs;
  document.getElementById(
    "results"
  ).innerText = `Recursive: Average steps ${average.toFixed(
    2
  )}, Time: ${executionTime.toFixed(2)} ms`;
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  board.style.width = "800px";
  board.style.height = "800px";

  const cellWidth = 80;
  const cellHeight = 80;

  for (let row = 10; row >= 1; row--) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    for (let col = 1; col <= 10; col++) {
      let num;
      if (row % 2 === 1) {
        // odd row, left to right
        num = (row - 1) * 10 + col;
      } else {
        // even row, right to left
        num = (row - 1) * 10 + (10 - col + 1);
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
      const baseBg = isGray ? "#d9d9d9" : "#3594ac";
      cell.style.background = baseBg;
      // store original background and text color so we can restore them later
      cell.dataset.origBg = baseBg;
      cell.dataset.origColor = "#000000";

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
    // restore stored original styles so layout/colors remain consistent
    if (c.dataset.origBg) c.style.background = c.dataset.origBg;
    else c.style.removeProperty("background");
    if (c.dataset.origColor) c.style.color = c.dataset.origColor;
    else c.style.removeProperty("color");
  });

  const cell = document.getElementById(`cell-${position}`);
  if (cell) {
    cell.classList.add("player");
    cell.style.background = "#ffffff";
    cell.style.color = "#1f1f1f";
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
