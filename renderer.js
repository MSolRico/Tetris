// Obtener el canvas y su contexto
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

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

let dropCounter = 0;
let dropInterval = 1000; // La pieza cae cada 1000 milisegundos (1 segundo)
let lastTime = 0;

// La función principal del juego que se ejecuta en un bucle
// Modifica la función gameLoop() en renderer.js
function gameLoop(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    piece.y++;
    if (isColliding()) {
      piece.y--; // Volver a la posición anterior
      // Fijar la pieza al tablero
      for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
          if (piece.shape[row][col] > 0) {
            board[piece.y + row][piece.x + col] = piece.shape[row][col] + 1; // +1 para asignar un color válido
          }
        }
      }
      createNewPiece(); // Crear una nueva pieza
    }
    dropCounter = 0;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  piece.draw();

  requestAnimationFrame(gameLoop);
}

// Función para crear una nueva pieza aleatoria
function createNewPiece() {
  const randomPieceIndex = Math.floor(Math.random() * PIECES.length);
  const shape = PIECES[randomPieceIndex];
  const color = COLORS[randomPieceIndex];
  piece = new Piece(shape, color);
}

// Iniciar el juego
createBoard();
createNewPiece();
gameLoop();

// Añadir un listener de eventos para el teclado
// Modifica el event listener para el teclado
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    piece.x--;
    if (isColliding()) {
      piece.x++;
    }
  } else if (event.key === 'ArrowRight') {
    piece.x++;
    if (isColliding()) {
      piece.x--;
    }
  } else if (event.key === 'ArrowDown') {
    piece.y++;
    if (isColliding()) {
      piece.y--;
    }
  } else if (event.key === 'ArrowUp') {
    const originalShape = piece.shape;
    piece.shape = rotatePiece(originalShape);
    
    // Si la rotación causa una colisión, se revierte
    if (isColliding()) {
      piece.shape = originalShape;
    }
  }
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  piece.draw();
});

// Verifica si la pieza actual colisiona con el tablero
function isColliding() {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      // Ignorar los espacios vacíos de la pieza
      if (piece.shape[row][col] === 0) {
        continue;
      }
      
      const newX = piece.x + col;
      const newY = piece.y + row;

      // Colisión con los bordes horizontales o verticales
      if (newX < 0 || newX >= COLS || newY >= ROWS) {
        return true;
      }

      // Colisión con piezas ya fijadas en el tablero
      // Asegurarse de que no estamos fuera de los límites de la matriz 'board'
      if (newY < ROWS && board[newY][newX] !== 0) {
        return true;
      }
    }
  }
  return false;
}

// Rota la matriz de la pieza 90 grados en sentido horario
function rotatePiece(pieceShape) {
  // Transponer la matriz (las filas se convierten en columnas)
  const rotatedShape = pieceShape[0].map((_, index) =>
    pieceShape.map(row => row[index])
  );
  
  // Invertir las filas para completar la rotación
  return rotatedShape.map(row => row.reverse());
}