import { useRef, useState, useEffect } from "react";

export default function TicTacToe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [board, setBoard] = useState(Array(3).fill(Array(3).fill(null)));
  const [turn, setTurn] = useState<"X" | "O">("X");

  const handleClick = (row: number, col: number) => {
    if (board[row][col]) return;
    const newBoard = board.map((r, i) =>
      r.map((c: any, j: number) => (i === row && j === col ? turn : c))
    );
    setBoard(newBoard);
    setTurn(turn === "X" ? "O" : "X");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / 3;
    const cellH = height / 3;

    ctx.clearRect(0, 0, width, height);
    ctx.font = `${cellH * 0.8}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    board.forEach((row, i) => {
      row.forEach((cell: string, j: number) => {
        if (cell) {
          ctx.fillStyle = cell === "X" ? "red" : "green";
          ctx.fillText(cell, j * cellW + cellW / 2, i * cellH + cellH / 2);
        }
      });
    });
  }, [board]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">Tic-Tac-Toe</h1>

      <div className="relative w-[450px]">

        <div className="grid grid-cols-3 gap-2">
          {board.map((row, i) =>
            row.map((_: any, j: number) => (
              <button
                key={`${i}-${j}`}
                className="h-[150px] bg-gray-200 flex items-center justify-center rounded-lg hover:bg-gray-300"
                onClick={() => handleClick(i, j)}
              />
            ))
          )}
        </div>

        <canvas
          ref={canvasRef}
          width={450}
          height={450}
          className="absolute top-0 left-0 pointer-events-none"
        />
      </div>
    </div>
  );
}
