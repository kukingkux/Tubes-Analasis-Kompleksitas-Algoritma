const BOARD_SIZE = 100;

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

function randomizeObstacles() {
  snakeLadderMap = {};
  for (let i = 0; i < 10; i++) {
    let start = Math.floor(Math.random() * 98) + 2;
    let end = Math.floor(Math.random() * 98) + 2;
    snakeLadderMap[start] = end;
  }
  document.getElementById("results").innerText = "Obstacles randomized.";
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
