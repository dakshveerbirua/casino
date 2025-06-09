(() => {
  const form = document.getElementById('bombForm');
  const bombInput = document.getElementById('bombCountInput');
  const startBtn = document.getElementById('startBtn');
  const grid = document.getElementById('gameGrid');
  const message = document.getElementById('message');
  const restartBtn = document.getElementById('restartBtn');

  const GRID_SIZE = 5;
  const TILE_COUNT = GRID_SIZE * GRID_SIZE;

  let bombPositions = new Set();
  let revealed = new Array(TILE_COUNT).fill(false);
  let foundGems = 0;
  let totalGems = 0;
  let gameOver = false;

  // Create tiles for the grid
  function createTiles() {
    grid.innerHTML = '';
    for (let i = 0; i < TILE_COUNT; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tile';
      btn.setAttribute(
        'aria-label',
        `Tile ${Math.floor(i / GRID_SIZE) + 1} row, ${ (i % GRID_SIZE) + 1 } column. Not revealed.`
      );
      btn.dataset.index = i;
      btn.disabled = false;
      btn.addEventListener('click', onTileClick);
      grid.appendChild(btn);
    }
  }

  // Randomly place bombs on the board
  function createBoard(bombCount) {
    bombPositions.clear();
    while (bombPositions.size < bombCount) {
      bombPositions.add(Math.floor(Math.random() * TILE_COUNT));
    }
    totalGems = TILE_COUNT - bombCount;
  }

  // Handle tile click event
  function onTileClick(event) {
    if (gameOver) return;
    const btn = event.currentTarget;
    const idx = Number(btn.dataset.index);
    if (revealed[idx]) return;

    revealed[idx] = true;

    if (bombPositions.has(idx)) {
      btn.classList.add('revealed', 'bomb');
      btn.textContent = '💣';
      message.textContent = 'Boom! You hit a bomb. Game Over 💥';
      message.className = 'message lose';
      endGame(false);
    } else {
      btn.classList.add('revealed', 'gem');
      btn.textContent = '💎';
      foundGems++;
      btn.setAttribute(
        'aria-label',
        `Tile ${Math.floor(idx / GRID_SIZE) + 1} row, ${ (idx % GRID_SIZE) + 1 } column. Gem revealed.`
      );
      if (foundGems === totalGems) {
        message.textContent = 'Congratulations! You found all gems! 🏆';
        message.className = 'message win';
        endGame(true);
      }
    }
  }

  // Reveal all bombs and disable the grid when the game ends
  function endGame(won) {
    gameOver = true;
    // Reveal all bombs
    for (let pos of bombPositions) {
      if (!revealed[pos]) {
        const btn = grid.children[pos];
        btn.classList.add('revealed', 'bomb');
        btn.textContent = '💣';
        btn.setAttribute(
          'aria-label',
          `Tile ${Math.floor(pos / GRID_SIZE) + 1} row, ${ (pos % GRID_SIZE) + 1 } column. Bomb revealed.`
        );
        btn.disabled = true;
      }
    }
    // Disable all tiles
    Array.from(grid.children).forEach(btn => (btn.disabled = true));
    restartBtn.hidden = false;
  }

  // Reset and start a new game
  function resetGame() {
    revealed.fill(false);
    foundGems = 0;
    gameOver = false;
    message.textContent = '';
    message.className = 'message';
    createBoard(Number(bombInput.value));
    createTiles();
    grid.hidden = false;
    restartBtn.hidden = true;
    bombInput.disabled = true;
    startBtn.disabled = true;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const bombs = Number(bombInput.value);
    if (!bombs || bombs < 1 || bombs > 24) {
      alert('Please enter a valid number of bombs (1 to 24).');
      return;
    }
    resetGame();
  });

  restartBtn.addEventListener('click', () => {
    bombInput.disabled = false;
    startBtn.disabled = false;
    grid.hidden = true;
    restartBtn.hidden = true;
    message.textContent = '';
    message.className = 'message';
    grid.innerHTML = '';
  });

  // Initially hide game grid and restart button
  grid.hidden = true;
  restartBtn.hidden = true;
})();
