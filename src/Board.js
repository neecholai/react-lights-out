import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - difficultyRating: number of iterations away from won game
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

function Board({ nrows = 5, ncols = 5, difficultyRating = 10 }) {
  const [board, setBoard] = useState(initialBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function initialBoard() {
    let initialBoard = [];
    let row = (new Array(ncols)).fill(false);
    for (let i = 0; i < nrows; i++) {
      initialBoard.push(row);
    }

    function randomIndex(n){
      return Math.floor(Math.random() * n)
    }

    for (let i = 0; i < difficultyRating; i++) {
      initialBoard = flipCellsOnBoard(randomIndex(ncols), randomIndex(nrows), initialBoard);
    }
    return initialBoard;
  }


  // check the board in state to determine whether the player has won.
  // Return true if player has won.
  function hasWon() {
    return board.every(row => row.every(cell => !cell));
  }


  // function to flip cells on board
  function flipCellsOnBoard(y, x, board) {

    const flipCell = (y, x, boardCopy) => {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        boardCopy[y][x] = !boardCopy[y][x];
      };
    };

    // Make a (deep) copy of the oldBoard
    const boardCopy = board.map(row => [...row]);

    // in the copy, flip this cell and the cells around it
    flipCell(y, x, boardCopy);
    flipCell(y + 1, x, boardCopy);
    flipCell(y - 1, x, boardCopy);
    flipCell(y, x + 1, boardCopy);
    flipCell(y, x - 1, boardCopy);

    // return the copy
    return boardCopy;
  }

  /** Function to handle flipping cells for board in state */
  function handleFlipCells(y, x) {
    setBoard(oldBoard => flipCellsOnBoard(y, x, oldBoard));
  }
  
  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>You've won!</div>
  }
  
  
  function table() {
    return board.map((row, y) =>
      <tr key={y} >
        {
          row.map((cell, x) =>
            <Cell
              flipCellsAroundMe={() => handleFlipCells(y, x)}
              isLit={board[y][x]}
              key={`${y}-${x}`} />
          )
        }
      </tr>
    )
  }

  return (
    // make table board
    <table className='Board'>
      <tbody>
        {table()}
      </tbody>
    </table>
  );

}

export default Board;
