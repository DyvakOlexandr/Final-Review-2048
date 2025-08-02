"use strict";

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
const Game = require("../modules/Game.class");

// Write your code here
const game = new Game();

game.onChange = (newGrid) => {
  renderGrid(newGrid); // функция, которая отрисует изменения с анимацией
};

const startButton = document.querySelector(".button");
const scoreElement = document.querySelector(".game-score");
const messageStart = document.querySelector(".message-start");
const messageWin = document.querySelector(".message-win");
const messageLose = document.querySelector(".message-lose");
const fieldCells = document.querySelectorAll(".field-cell");
const tileLayer = document.querySelector(".tile-layer");

tileLayer.innerHTML = "";

// Змінні для клавіш
const KEY_LEFT = "ArrowLeft";
const KEY_RIGHT = "ArrowRight";
const KEY_UP = "ArrowUp";
const KEY_DOWN = "ArrowDown";

let previousGrid = JSON.parse(JSON.stringify(game.getState()));

function renderGrid() {
  const currentGrid = game.getState();
  const gameField = document.querySelector(".game-field");
  const duration = 250; // Тривалість анімації в мс

  // 1. Очищаємо основну сітку від попередніх значень
  fieldCells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "field-cell";
  });

  // 2. Збираємо інформацію про всі рухи та об'єднання
  const moves = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const prevValue = previousGrid[row][col];
      const currentValue = currentGrid[row][col];

      if (prevValue === 0) {
        continue;
      } // Немає плитки, яка б рухалася

      if (currentValue === prevValue) {
        // Плитка не змінилась, але можливо перемістилась
        const fromCoords = { row, col };
        const toCoords = findCoordinates(currentGrid, prevValue);

        if (
          toCoords &&
          (fromCoords.row !== toCoords.row || fromCoords.col !== toCoords.col)
        ) {
          moves.push({
            from: fromCoords,
            to: toCoords,
            value: prevValue,
          });
        }
      } else if (currentValue > prevValue) {
        // Плитка об'єдналася
        const fromCoords = { row, col };
        const toCoords = findCoordinates(currentGrid, currentValue);

        if (toCoords) {
          moves.push({
            from: fromCoords,
            to: toCoords,
            value: prevValue,
            isMerge: true,
          });
        }
      }
    }
  }

  // 3. Створюємо та анімуємо тимчасові плитки
  moves.forEach((move) => {
    const fromCell = fieldCells[move.from.row * 4 + move.from.col];
    const toCell = fieldCells[move.to.row * 4 + move.to.col];

    const tempTile = document.createElement("div");

    tempTile.textContent = move.value;
    tempTile.className = `field-cell field-cell--${move.value} tile-moving`;
    tempTile.style.transform = `translate(${fromCell.offsetLeft}px, ${fromCell.offsetTop}px)`;
    tempTile.style.transition = `transform ${duration}ms ease-in-out`;

    // Встановлюємо розмір та позицію, щоб вони збігалися з клітинкою
    tempTile.style.left = "0";
    tempTile.style.top = "0";
    tempTile.style.width = fromCell.offsetWidth + "px";
    tempTile.style.height = fromCell.offsetHeight + "px";

    gameField.appendChild(tempTile);

    // Примусовий reflow для початку анімації
    void tempTile.offsetWidth;

    // Запускаємо анімацію
    tempTile.style.transform = `translate(${toCell.offsetLeft}px, ${toCell.offsetTop}px)`;

    // Видаляємо тимчасову плитку після завершення анімації
    tempTile.addEventListener("transitionend", () => tempTile.remove(), {
      once: true,
    });

    setTimeout(() => {
      if (document.body.contains(tempTile)) {
        tempTile.remove();
      }
    }, duration + 50);
  });

  // 4. Оновлюємо основну сітку після завершення анімації
  setTimeout(() => {
    fieldCells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = currentGrid[row][col];
      const prevValue = previousGrid[row][col];

      cell.textContent = value === 0 ? "" : value;
      cell.className = `field-cell ${value ? `field-cell--${value}` : ""}`;

      // Анімація появи
      if (prevValue === 0 && value !== 0) {
        cell.classList.add("field-cell--new");
      }

      // Анімація об'єднання
      if (prevValue !== 0 && value > prevValue) {
        cell.classList.add("field-cell--merged");
      }
    });

    previousGrid = JSON.parse(JSON.stringify(currentGrid));
    scoreElement.textContent = game.getScore();
  }, duration);
}

// Допоміжна функція для пошуку координат плитки
function findCoordinates(grid, value) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === value) {
        return { row, col };
      }
    }
  }

  return null;
}

// eslint-disable-next-line no-shadow
function handleKeyPress(event) {
  if (game.getStatus() !== "playing") {
    return;
  }

  // Використання змінних для перевірки натиснутих клавіш
  switch (event.key) {
    case KEY_LEFT:
      game.moveLeft();
      break;
    case KEY_RIGHT:
      game.moveRight();
      break;
    case KEY_UP:
      game.moveUp();
      break;
    case KEY_DOWN:
      game.moveDown();
      break;
    default:
      return;
  }

  renderGrid();
  checkGameStatus();
}

function checkGameStatus() {
  if (game.getStatus() === "win") {
    messageWin.classList.remove("hidden");
  } else if (game.getStatus() === "lose") {
    messageLose.classList.remove("hidden");
  }
}

startButton.addEventListener("click", () => {
  if (startButton.classList.contains("start")) {
    game.start();
    startButton.classList.remove("start");
    startButton.classList.add("restart");
    startButton.textContent = "Restart";
    messageStart.classList.add("hidden");
  } else {
    game.restart();
    startButton.classList.remove("restart");
    startButton.classList.add("start");
    startButton.textContent = "Start";
    messageWin.classList.add("hidden");
    messageLose.classList.add("hidden");
    messageStart.classList.remove("hidden");
    document.querySelectorAll(".tile-moving").forEach((tile) => tile.remove());
  }
  renderGrid();
});

document.addEventListener("keydown", handleKeyPress);
