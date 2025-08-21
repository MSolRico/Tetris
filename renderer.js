// Obtener el canvas y su contexto
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
let score = 0;
let animationId; // Para controlar el bucle de animación

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

// Inicializar el tablero con celdas vacías (0)
function createBoard() {
  for (let row = 0; row < ROWS; row++) {
    board[row] = [];
    for (let col = 0; col < COLS; col++) {
      board[row][col] = 0;
    }
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
  constructor(shape, color) {
    this.shape = shape;
    this.color = color;
    this.x = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2); // Posición inicial X
    this.y = 0; // Posición inicial Y
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

function createNewPiece() {
  const randomPieceIndex = Math.floor(Math.random() * PIECES.length);
  const shape = PIECES[randomPieceIndex];
  const color = COLORS[randomPieceIndex];
  piece = new Piece(shape, color);

  if (isColliding()) {
    console.log("¡Fin del juego!");
    cancelAnimationFrame(animationId); // ¡DETENER EL BUCLE!
    // Lógica para mostrar "Game Over"
    ipcRenderer.send('show-notification', 'Fin del juego', `Tu puntuación final es: ${score}`);
  }
}

// BUCLE PRINCIPAL DEL JUEGO
function gameLoop(time = 0) {
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
            board[piece.y + row][piece.x + col] = PIECES.indexOf(piece.shape) + 1;
          }
        }
      }
      
      const linesCleared = checkLines();
      updateScore(linesCleared);
      
      createNewPiece();
    }
    dropCounter = 0;
  }
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  piece.draw();
  
  animationId = requestAnimationFrame(gameLoop);
}

// CONTROL DE TECLADO
document.addEventListener('keydown', event => {
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

// INICIAR EL JUEGO
createBoard();
createNewPiece();
gameLoop();