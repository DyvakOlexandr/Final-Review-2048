/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use strict';

const Game = require('../modules/Game.class');

// Write your code here
const game = new Game();

// We'll use this to track the tiles and their positions
let tileMap = new Map();
let tileIdCounter = 1;

game.onChange = (newGrid) => {
  renderGrid(); // функция, которая отрисует изменения с анимацией
};

const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCells = document.querySelectorAll('.field-cell');

// Змінні для клавіш
const KEY_LEFT = 'ArrowLeft';
const KEY_RIGHT = 'ArrowRight';
const KEY_UP = 'ArrowUp';
const KEY_DOWN = 'ArrowDown';

// eslint-disable-next-line no-unused-vars
let previousGrid = JSON.parse(JSON.stringify(game.getState()));

// Function to track the tile positions before a move
function saveTilePositions() {
  const grid = game.getState();
  const positions = new Map();

  // Track position of each non-zero value in the grid
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = grid[row][col];

      if (value !== 0) {
        // Find or create a unique ID for this tile
        let tileId;

        for (const [id, tile] of tileMap.entries()) {
          if (tile.row === row && tile.col === col && tile.value === value) {
            tileId = id;
            break;
          }
        }

        if (!tileId) {
          tileId = `tile-${tileIdCounter++}`;
        }

        positions.set(tileId, {
          row, col, value,
        });
      }
    }
  }

  return positions;
}

function renderGrid() {
  const grid = game.getState();

  // Save old tile positions before updating
  const oldPositions = new Map(tileMap);

  // Get new positions
  tileMap = saveTilePositions();

  // Remove all tile elements from the DOM
  document.querySelectorAll('.tile').forEach(tile => {
    tile.remove();
  });

  // Create or update tiles with animations
  for (const [tileId, tile] of tileMap.entries()) {
    const { row, col, value } = tile;

    // Create the tile element if it doesn't exist
    const tileElement = document.createElement('div');

    tileElement.id = tileId;
    tileElement.className = `tile tile-${value}`;
    tileElement.textContent = value;

    // Position the tile
    // eslint-disable-next-line max-len
    const cellElement = document.querySelector(`.field-cell[data-row="${row}"][data-col="${col}"]`);
    const cellRect = cellElement.getBoundingClientRect();
    // eslint-disable-next-line max-len
    const fieldRect = document.querySelector('.game-field').getBoundingClientRect();

    // Position relative to the game field
    const left = cellRect.left - fieldRect.left;
    const top = cellRect.top - fieldRect.top;

    // Check if this tile existed in a different position before
    let fromLeft = left;
    let fromTop = top;
    let isNew = true;

    for (const [oldId, oldTile] of oldPositions.entries()) {
      if (oldId === tileId) {
        const oldCellElement = document.querySelector(`.field-cell[data-row="${oldTile.row}"][data-col="${oldTile.col}"]`);

        if (oldCellElement) {
          const oldRect = oldCellElement.getBoundingClientRect();

          fromLeft = oldRect.left - fieldRect.left;
          fromTop = oldRect.top - fieldRect.top;
          isNew = false;
        }
        break;
      }
    }

    // Apply initial position
    tileElement.style.position = 'absolute';
    tileElement.style.width = `${cellElement.offsetWidth}px`;
    tileElement.style.height = `${cellElement.offsetHeight}px`;
    tileElement.style.fontSize = `${value >= 128 ? '1.8rem' : '2rem'}`;
    tileElement.style.display = 'flex';
    tileElement.style.justifyContent = 'center';
    tileElement.style.alignItems = 'center';
    tileElement.style.borderRadius = '10px';
    tileElement.style.fontWeight = 'bold';
    tileElement.style.zIndex = '10';

    // Set color based on value (match your CSS classes)
    switch (value) {
      case 2:
        tileElement.style.background = 'linear-gradient(135deg, #eee4da, #ede0c8)';
        tileElement.style.color = '#776e65';
        break;
      case 4:
        tileElement.style.background = 'linear-gradient(135deg, #ede0c8, #f2b179)';
        tileElement.style.color = '#776e65';
        break;
      case 8:
        tileElement.style.background = 'linear-gradient(135deg, #f2b179, #f59563)';
        tileElement.style.color = '#f9f6f2';
        break;
      case 16:
        tileElement.style.background = 'linear-gradient(135deg, #f59563, #f67c5f)';
        tileElement.style.color = '#f9f6f2';
        break;
      case 32:
        tileElement.style.background = 'linear-gradient(135deg, #f67c5f, #f65e3b)';
        tileElement.style.color = '#f9f6f2';
        break;
      case 64:
        tileElement.style.background = 'linear-gradient(135deg, #f65e3b, #edcf72)';
        tileElement.style.color = '#f9f6f2';
        break;
      case 128:
        tileElement.style.background = 'linear-gradient(135deg, #edcf72, #edcc61)';
        tileElement.style.color = '#f9f6f2';
        break;
      case 256:
        tileElement.style.background = 'linear-gradient(135deg, #edcc61, #edc850)';
        tileElement.style.color = '#f9f6f2';
        break;
      case 512:
        tileElement.style.background = 'linear-gradient(135deg, #edc850, #edc53f)';
        tileElement.style.color = '#f9f6f2';
        break;
      case 1024:
        tileElement.style.background = 'linear-gradient(135deg, #edc53f, #edc22e)';
        tileElement.style.color = '#f9f6f2';
        tileElement.style.fontSize = '1.5rem';
        break;
      case 2048:
        tileElement.style.background = 'linear-gradient(135deg, #edc22e, #ffd700)';
        tileElement.style.color = '#f9f6f2';
        tileElement.style.fontSize = '1.5rem';
        break;
    }

    // Position from the previous location if it's not a new tile
    if (!isNew) {
      tileElement.style.left = `${fromLeft}px`;
      tileElement.style.top = `${fromTop}px`;
      tileElement.style.transition = 'none';
    } else {
      tileElement.style.left = `${left}px`;
      tileElement.style.top = `${top}px`;
      tileElement.style.transform = 'scale(0)';
    }

    // Append the tile to the game field
    document.querySelector('.game-field').appendChild(tileElement);

    // Force reflow
    void tileElement.offsetWidth;

    // Animate to the new position
    tileElement.style.transition = 'all 0.2s ease';
    tileElement.style.left = `${left}px`;
    tileElement.style.top = `${top}px`;
    tileElement.style.transform = 'scale(1)';

    // Check for merged tiles (value increased)
    for (const [oldId, oldTile] of oldPositions.entries()) {
      if (oldTile.row === row && oldTile.col === col && oldTile.value < value) {
        // This is a merged tile
        setTimeout(() => {
          tileElement.style.transform = 'scale(1.2)';

          setTimeout(() => {
            tileElement.style.transform = 'scale(1)';
          }, 100);
        }, 200); // Wait for the movement to complete
        break;
      }
    }
  }

  // Update cell classes but don't show content (tiles will show the values)
  fieldCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = grid[row][col];

    // Clear cell text content since we're using overlaid tiles
    cell.textContent = '';
    cell.className = 'field-cell';
  });

  previousGrid = JSON.parse(JSON.stringify(grid));
  scoreElement.textContent = game.getScore();
}

// eslint-disable-next-line no-shadow
function handleKeyPress(event) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  // Get positions before the move
  const oldPositions = saveTilePositions();

  // Використання змінних для перевірки натиснутих клавіш
  let moved = false;

  switch (event.key) {
    case KEY_LEFT:
      moved = game.moveLeft();
      break;
    case KEY_RIGHT:
      moved = game.moveRight();
      break;
    case KEY_UP:
      moved = game.moveUp();
      break;
    case KEY_DOWN:
      moved = game.moveDown();
      break;
    default:
      return;
  }

  // Only render if there was a valid move
  if (moved) {
    renderGrid();
    checkGameStatus();
  }
}

function checkGameStatus() {
  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');
  }

  // Reset tile tracking
  tileMap = new Map();
  tileIdCounter = 1;

  renderGrid();
});

document.addEventListener('keydown', handleKeyPress);
