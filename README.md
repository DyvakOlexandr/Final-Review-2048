# 2048 Game with Smooth Animations

 - [DEMO LINK](https://DyvakOlexandr.github.io/Final-Review-2048/)

## Project Overview

An elegant implementation of the classic 2048 puzzle game with smooth tile animations. This project demonstrates advanced frontend development skills including DOM manipulation, CSS animations, and game logic implementation.

## Features

- **Smooth Tile Animations**: Tiles slide gracefully across the board during moves
- **Merge Animations**: Special effects when tiles combine
- **Responsive Design**: Optimized for both desktop and mobile play
- **Modern UI**: Clean, gradient-based design with visual feedback

## Technologies Used

- **HTML5**: Semantic markup for game structure
- **CSS3**: Advanced animations and responsive design
- **JavaScript**: Pure JS implementation without frameworks
- **Custom Game Engine**: Self-implemented game logic

## Implementation Highlights

### Smooth Animation System

The game features a sophisticated animation system that:
- Tracks each tile's position before and after moves
- Animates tiles from their previous positions to new ones
- Creates a natural flow that helps players understand game mechanics

```javascript
// Sample of animation logic
function renderGrid() {
  // Save old tile positions before updating
  const oldPositions = new Map(tileMap);

  // Get new positions
  tileMap = saveTilePositions();

  // Create or update tiles with animations
  for (const [tileId, tile] of tileMap.entries()) {
    // ... animation logic

    // Animate to the new position
    tileElement.style.transition = 'all 0.2s ease';
    tileElement.style.left = `${left}px`;
    tileElement.style.top = `${top}px`;
  }
}
```

### CSS Animation Techniques

The project demonstrates advanced CSS animation techniques:
- Transform-based animations for performance
- Multiple animation types (slide, scale, pop)
- Proper timing and easing functions

```css
/* Animation for merged tiles */
@keyframes tileScale {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.tile-merged {
  animation: tileScale 0.2s ease;
}
```

## How to Play

1. Use arrow keys to move tiles
2. Tiles with the same value merge when they collide
3. Reach the 2048 tile to win!

## Future Enhancements

- High score persistence
- Game state saving
- Additional game modes
- More animation effects

## Try It Out

[Play the Game] -(https://DyvakOlexandr.github.io/Final-Review-2048/)

---

## About the Developer

As a passionate frontend developer, I focus on creating intuitive user interfaces with smooth animations and responsive design. This project demonstrates my skills in JavaScript, CSS animations, and game development.

Feel free to contact me for collaborations or opportunities!
