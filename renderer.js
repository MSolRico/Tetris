// Obtener el canvas y su contexto
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startButton = document.getElementById('start-button');
const highScoresList = document.getElementById('high-scores-list');
const nextPieceCanvas = document.getElementById('nextPieceCanvas');
const nextPieceContext = nextPieceCanvas.getContext('2d');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const playerNameInput = document.getElementById('player-name');
const saveScoreButton = document.getElementById('save-score-button');
const playAgainButton = document.getElementById('play-again-button');

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const { ipcRenderer } = require('electron');

// Definir el tamaño de cada cuadrado en el tablero
const GRID_SIZE = 30;
// Calcular el número de columnas y filas
const COLS = canvas.width / GRID_SIZE;
const ROWS = canvas.height / GRID_SIZE;

// Las formas de las piezas de Tetris (tetrominos)
const PIECES = [
  // Forma I
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  // Forma J
  [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  // Forma L
  [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
  // Forma O
  [[1, 1], [1, 1]],
  // Forma S
  [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  // Forma T
  [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  // Forma Z
  [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
];

// Los colores correspondientes a cada pieza
const COLORS = [
  'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

// Variables del juego
let board = [];
let piece;
let nextPiece;
let score = 0;
let animationId; // Para controlar el bucle de animación
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let isGameOver = false;

// Mensajes personalizados para la pantalla de Game Over según la puntuación
const gameOverMessages = [
  { threshold: 50, message: "¡Ni para empezar!" },
  { threshold: 200, message: "¿Eso es todo lo que tienes?" },
  { threshold: 500, message: "Podría ser mejor..." },
  { threshold: 1000, message: "¡Bien jugado!" },
  { threshold: 2000, message: "¡Excelente!" },
  { threshold: Infinity, message: "¡Impresionante maestro Tetris!" },
];

// Inicializar el tablero con celdas vacías (0)
function createBoard() {
  for (let row = 0; row < ROWS; row++) {
    board[row] = new Array(COLS).fill(0);
  }
}

// Función para dibujar un cuadrado
function drawSquare(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  context.strokeStyle = 'black';
  context.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

// Dibujar el tablero completo
function drawBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] > 0) {
        drawSquare(col, row, COLORS[board[row][col] - 1]);
      }
    }
  }
}

// Clase para representar una pieza
class Piece {
  constructor(shape, color, id) {
    this.shape = shape;
    this.color = color;
    this.id = id;
    this.x = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);
    this.y = 0;
  }

  // Dibujar la pieza
  draw() {
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col]) {
          drawSquare(this.x + col, this.y + row, this.color);
        }
      }
    }
  }
}

// Dibuja la siguiente pieza en el canvas secundario
function drawNextPiece() {
    nextPieceContext.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    const shape = nextPiece.shape;
    const color = nextPiece.color;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] > 0) {
                // Dibuja la pieza en el canvas secundario, con un ajuste de posición
                nextPieceContext.fillStyle = color;
                nextPieceContext.fillRect(col * (GRID_SIZE / 1.5), row * (GRID_SIZE / 1.5), GRID_SIZE / 1.5, GRID_SIZE / 1.5);
                nextPieceContext.strokeStyle = 'black';
                nextPieceContext.strokeRect(col * (GRID_SIZE / 1.5), row * (GRID_SIZE / 1.5), GRID_SIZE / 1.5, GRID_SIZE / 1.5);
            }
        }
    }
}

// LÓGICA DEL JUEGO
function isColliding() {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] === 0) continue;
      const newX = piece.x + col;
      const newY = piece.y + row;
      if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
      if (newY < ROWS && board[newY][newX] !== 0) return true;
    }
  }
  return false;
}

function rotatePiece(pieceShape) {
  const rotatedShape = pieceShape[0].map((_, index) =>
    pieceShape.map(row => row[index])
  );
  return rotatedShape.map(row => row.reverse());
}

function checkLines() {
  let linesCleared = 0;
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every(cell => cell > 0)) {
      linesCleared++;
      board.splice(row, 1);
      board.unshift(new Array(COLS).fill(0));
      row++;
    }
  }
  return linesCleared;
}

function updateScore(linesCleared) {
  let points = 0;
  switch (linesCleared) {
    case 1: points = 100; break;
    case 2: points = 300; break;
    case 3: points = 500; break;
    case 4: points = 800; break;
  }
  score += points;
  scoreElement.innerText = score;
}

function getRandomPiece() {
    const randomPieceIndex = Math.floor(Math.random() * PIECES.length);
    const shape = PIECES[randomPieceIndex];
    const color = COLORS[randomPieceIndex];
    return new Piece(shape, color, randomPieceIndex + 1);
}

function createNewPiece() {
  // Si ya hay una siguiente pieza, la usamos
  if (nextPiece) {
    piece = nextPiece;
  } else {
    // Si no, generamos una pieza inicial para el juego
    piece = getRandomPiece();
  }

  // Generamos la siguiente pieza y la guardamos en la cola
  nextPiece = getRandomPiece();

  if (isColliding()) {
    isGameOver = true;
    ipcRenderer.send('show-notification', 'Fin del juego', `Tu puntuación final es: ${score}`);
    showStartScreen();
  }
}

// BUCLE PRINCIPAL DEL JUEGO
function gameLoop(time = 0) {
  // Si el juego ha terminado, no hacemos nada más
  if (isGameOver) {
    return;
  }

  const deltaTime = time - lastTime;
  lastTime = time;
  
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    piece.y++;
    if (isColliding()) {
      piece.y--;
      // Fijar la pieza al tablero
      for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
          if (piece.shape[row][col] > 0) {
            board[piece.y + row][piece.x + col] = piece.id;
          }
        }
      }
      
      const linesCleared = checkLines();
      updateScore(linesCleared);
      
      createNewPiece();
      
      // Lógica de Game Over después de crear la nueva pieza
      if (isColliding()) {
        isGameOver = true;
        
        // Detén el bucle inmediatamente
        cancelAnimationFrame(animationId); 

        // Luego, muestra la notificación y la pantalla de Game Over
        ipcRenderer.send('show-notification', 'Fin del juego', `Tu puntuación final es: ${score}`);
        showGameOverScreen();
        return; // Sal del bucle inmediatamente
      }
    }
    dropCounter = 0;
  }
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  piece.draw();
  drawNextPiece();
  
  animationId = requestAnimationFrame(gameLoop);
}

// GESTIÓN DE PUNTUACIONES ALTAS
function getHighScores() {
  const scores = JSON.parse(localStorage.getItem('highScores')) || [];
  return scores.sort((a, b) => b.score - a.score).slice(0, 5);
}

function saveHighScore(name, score) {
  const scores = getHighScores();
  scores.push({ name, score });
  const sortedScores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  localStorage.setItem('highScores', JSON.stringify(sortedScores));
}

function renderHighScores() {
  const scores = getHighScores();
  highScoresList.innerHTML = '';
  scores.forEach((s, index) => {
    const listItem = document.createElement('li');
    listItem.innerText = `${index + 1}. ${s.name}: ${s.score}`;
    highScoresList.appendChild(listItem);
  });
}

// GESTIÓN DE LA PANTALLA
function showStartScreen() {
  startScreen.classList.remove('screen-hidden');
  startScreen.classList.add('screen-visible');
  gameScreen.classList.remove('screen-visible');
  gameScreen.classList.add('screen-hidden');
  gameOverScreen.classList.remove('screen-visible');
  gameOverScreen.classList.add('screen-hidden');
  renderHighScores();
}

function showGameScreen() {
  startScreen.classList.remove('screen-visible');
  startScreen.classList.add('screen-hidden');
  gameScreen.classList.remove('screen-hidden');
  gameScreen.classList.add('screen-visible');
  gameOverScreen.classList.remove('screen-visible');
  gameOverScreen.classList.add('screen-hidden');
}

function showGameOverScreen() {
  gameScreen.classList.remove('screen-visible');
  gameScreen.classList.add('screen-hidden');
  startScreen.classList.remove('screen-visible');
  startScreen.classList.add('screen-hidden');
  gameOverScreen.classList.remove('screen-hidden');
  gameOverScreen.classList.add('screen-visible');
  
  finalScoreElement.innerText = score;

  // Encuentra el mensaje adecuado basado en la puntuación
  let gameOverMessage = "¡Fin de la Partida!"; // Mensaje por defecto
  for (const messageConfig of gameOverMessages) {
    if (score < messageConfig.threshold) {
      gameOverMessage = messageConfig.message;
      break;
    }
  }

  // Busca un elemento con el id 'game-over-message' en tu HTML
    const gameOverMessageElement = gameOverScreen.querySelector('.header .game-over-message');  if (gameOverMessageElement) {
    gameOverMessageElement.innerText = gameOverMessage;
  } 
}

// EVENT LISTENERS
startButton.addEventListener('click', () => {
  showGameScreen();
  startNewGame();
});

document.addEventListener('keydown', event => {
  // Si el juego ha terminado, no se puede mover la pieza
  if (isGameOver) {
    return;
  }
  
  if (event.key === 'ArrowLeft') {
    piece.x--;
    if (isColliding()) piece.x++;
  } else if (event.key === 'ArrowRight') {
    piece.x++;
    if (isColliding()) piece.x--;
  } else if (event.key === 'ArrowDown') {
    piece.y++;
    if (isColliding()) piece.y--;
  } else if (event.key === 'ArrowUp') {
    const originalShape = piece.shape;
    piece.shape = rotatePiece(originalShape);
    if (isColliding()) piece.shape = originalShape;
  }
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  piece.draw();
});

saveScoreButton.addEventListener('click', () => {
  const playerName = playerNameInput.value || "Jugador";
  saveHighScore(playerName, score);
  showStartScreen();
});

playAgainButton.addEventListener('click', () => {
  showGameScreen();
  startNewGame();
});

// Función para reiniciar el juego
function startNewGame() {
  isGameOver = false;
  score = 0;
  scoreElement.innerText = score;
  createBoard();
  createNewPiece();
  gameLoop();
}

// Muestra la pantalla de inicio al cargar la aplicación
showStartScreen();