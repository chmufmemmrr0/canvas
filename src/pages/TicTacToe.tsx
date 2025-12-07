import { useRef, useState, useEffect } from "react";

export default function TicTacToe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [board, setBoard] = useState(() =>
    Array.from({ length: 3 }, () => Array(3).fill(null))
  );

  const [turn, setTurn] = useState<"X" | "O">("X");

  const handleClick = (row: number, col: number) => {
    if (board[row][col]) return;

    const newBoard = board.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? turn : c))
    );

    setBoard(newBoard);
    setTurn(turn === "X" ? "O" : "X");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gap = 8;
    const size = 150; // HTML button height

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${size * 0.8}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell) return;

        const x = j * (size + gap) + size / 2;
        const y = i * (size + gap) + size / 2;

        ctx.fillStyle = cell === "X" ? "red" : "green";
        ctx.fillText(cell, x, y);
      });
    });
  }, [board]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">Tic-Tac-Toe</h1>

      <div className="relative" style={{ width: 466, height: 466 }}>
        <div className="grid grid-cols-3 gap-2">
          {board.map((row, i) =>
            row.map((_, j) => (
              <button
                key={`${i}-${j}`}
                onClick={() => handleClick(i, j)}
                className="h-[150px] bg-gray-200 rounded-lg hover:bg-gray-300"
              />
            ))
          )}
        </div>

        <canvas
          ref={canvasRef}
          width={466}
          height={466}
          className="absolute top-0 left-0 pointer-events-none"
        />
      </div>
    </div>
  );
}
