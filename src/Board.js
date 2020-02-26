import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());
  const winningBoard = makeWinningBoard();

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // create array-of-arrays of true/false values
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        let isLit = chanceLightStartsOn > Math.random();
        row.push(isLit);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  /** create winning board for comparison if user has won */
  function makeWinningBoard() {
    let winningBoard = [];
    let row = (new Array(ncols)).fill(false);
    for (let i = 0; i < nrows; i++) {
      winningBoard.push(row);
    }
    return winningBoard;
  }

  // check the board in state to determine whether the player has won.
  // Return true if player has won.
  function hasWon() {
    return JSON.stringify(winningBoard) === JSON.stringify(board)
  }

  /** Function to clip cells around on board */
  function flipCellsAround(coord) {

    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => {
        return row.map(val => {
          return val;
        });
      });

      // const boardCopy = [
      // [false, true, false, false, true, false],
      // [true, false, true, true, false, false],
      // [true, true, false, true, true, true],
      // [false, true, true, false, false, true],
      // [false, false, false, false, false, true],
      // [false, false, true, false, false, true]
      // ]

      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);

      // TODO: return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>You've won!</div>
  }

  return (
    // make table board
    <table className='Board'>
      <tbody>
        {
          board.map((row, y) => {
            return <tr key={y} >{
              row.map((cell, x) => {
                return (
                  <Cell
                    flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
                    isLit={board[y][x]}
                    key={`${y}-${x}`} />
                );
              })
            }
            </tr>
          })
        }
      </tbody>
    </table>
  );

  // return <Cell flipsCellsAroundMe={evt => flipCellsAround(`${y}-${x}`)} isLit={true} />

}

export default Board;
