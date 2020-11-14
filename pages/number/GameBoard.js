import Tile from './Tile'


export default class Board {
  static size = 4
  static fourProbability = 0.1
  static deltaX = [-1, 0, 1, 0]
  static deltaY = [0, -1, 0, 1]

  constructor() {
    this.tiles = []
    this.cells = []

    for (let i = 0; i < Board.size; ++i) {
      this.cells[i] = [this.addTile(), this.addTile(), this.addTile(), this.addTile()];
    }
    this.addRandomTile();
    this.setPositions();
    this.won = false;
  }

  addTile() {
    const res = new Tile(...arguments);
    this.tiles.push(res);
    return res;
  }

  addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < Board.size; ++r) {
      for (let c = 0; c < Board.size; ++c) {
        if (this.cells[r][c].value === 0) {
          emptyCells.push({
            r: r,
            c: c
          });
        }
      }
    }
    let index = Math.floor(Math.random() * emptyCells.length);
    let cell = emptyCells[index];
    let newValue = Math.random() < Board.fourProbability ? 4 : 2;
    this.cells[cell.r][cell.c] = this.addTile(newValue);
  }

  setPositions() {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        tile.oldRow = tile.row;
        tile.oldColumn = tile.column;
        tile.row = rowIndex;
        tile.column = columnIndex;
        tile.markForDeletion = false;
      });
    });
  }

  moveLeft() {
    let hasChanged = false;
    for (let row = 0; row < Board.size; ++row) {
      let currentRow = this.cells[row].filter(function (tile) {
        return tile.value !== 0;
      });
      let resultRow = [];
      for (let target = 0; target < Board.size; ++target) {
        let targetTile = currentRow.length ? currentRow.shift() : this.addTile();
        if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
          let tile1 = targetTile;
          targetTile = this.addTile(targetTile.value);
          tile1.mergedInto = targetTile;
          let tile2 = currentRow.shift();
          tile2.mergedInto = targetTile;
          targetTile.value += tile2.value;
        }
        resultRow[target] = targetTile;
        this.won = this.won || (targetTile.value === 2048);
        hasChanged = hasChanged || (targetTile.value !== this.cells[row][target].value);
      }
      this.cells[row] = resultRow;
    }
    return hasChanged;
  }

  move(direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles();
    for (let i = 0; i < direction; ++i) {
      this.cells = this.rotateLeft(this.cells);
    }
    let hasChanged = this.moveLeft();
    for (let i = direction; i < 4; ++i) {
      this.cells = this.rotateLeft(this.cells);
    }
    if (hasChanged) {
      this.addRandomTile()
    }
    this.setPositions()
    return this;
  }

  clearOldTiles() {
    this.tiles = this.tiles.filter((tile) => {
      return tile.markForDeletion === false;
    });
    this.tiles.forEach((tile) => {
      tile.markForDeletion = true;
    })
  }

  hasWon() {
    return this.won
  }

  hasLost() {
    let canMove = false;
    for (let row = 0; row < Board.size; ++row) {
      for (let column = 0; column < Board.size; ++column) {
        canMove = canMove || (this.cells[row][column].value === 0);
        for (let dir = 0; dir < 4; ++dir) {
          let newRow = row + Board.deltaX[dir];
          let newColumn = column + Board.deltaY[dir];
          if (newRow < 0 || newRow >= Board.size || newColumn < 0 || newColumn >= Board.size) {
            continue;
          }
          canMove = canMove || (this.cells[row][column].value === this.cells[newRow][newColumn].value);
        }
      }
    }
    return !canMove;
  };

  rotateLeft(matrix) {
    let rows = matrix.length;
    let columns = matrix[0].length;
    let res = [];
    for (let row = 0; row < rows; ++row) {
        res.push([]);
        for (let column = 0; column < columns; ++column) {
            res[row][column] = matrix[column][columns - row - 1];
        }
    }
    return res;
};
}