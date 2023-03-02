import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  let rows = [];
  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    let rowSquares = [];
    for (let colIndex = 0; colIndex < 3; colIndex++) {
      const squareIndex = rowIndex * 3 + colIndex;
      rowSquares.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
        />
      );
    }
    rows.push(
      <div key={rowIndex} className="board-row">
        {rowSquares}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );

  function calculateWinner(squares) {
    const lines = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [3, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i].map((index) => squares[index]);
      if (a && a === b && b === c) {
        return a;
      }
    }
    return null;
  }
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moveButtons = history.map((squares, move) => {
    const prefix = move === currentMove ? "You are at" : "Go to";
    const moveName = move === 0 ? "the game start" : `move #${move}`;
    const description = `${prefix} ${moveName}`;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-timeline">
        <ol>{moveButtons}</ol>
      </div>
    </div>
  );
}

export default function App() {
  return Game();
}
