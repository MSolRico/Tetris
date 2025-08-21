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