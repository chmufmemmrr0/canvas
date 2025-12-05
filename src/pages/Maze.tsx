import { useRef, useEffect, useState } from "react";

export type Point = { x: number; y: number };

// generowanie labiryntu 20x20
function generateMaze(size: number) {
  const maze = Array.from({ length: size }, () => Array(size).fill(1));

  const dirs = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  function shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  function carve(x: number, y: number) {
    maze[y][x] = 0;

    for (const dir of shuffle(dirs)) {
      const nx = x + dir.x * 2;
      const ny = y + dir.y * 2;
      if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1) {
        if (maze[ny][nx] === 1) {
          maze[y + dir.y][x + dir.x] = 0;
          carve(nx, ny);
        }
      }
    }
  }

  carve(1, 1);

  // start i meta
  maze[1][1] = 0;
  maze[size - 2][size - 2] = 0;

  for (let i = 1; i < size - 1; i++) {
    if (maze[size - 3][i] === 0) maze[size - 2][i] = 0; // ostatni wiersz
    if (maze[i][size - 3] === 0) maze[i][size - 2] = 0; // ostatnia kolumna
  }

  return maze;
}


export default function Maze() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellSize = 30;
  const gridSize = 20;

  const [maze, setMaze] = useState<number[][]>(generateMaze(gridSize));
  const [player, setPlayer] = useState<Point>({ x: 1, y: 1 });
  const [win, setWin] = useState(false);

  const move = (dx: number, dy: number) => {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (
      newX >= 0 &&
      newX < gridSize &&
      newY >= 0 &&
      newY < gridSize &&
      maze[newY][newX] === 0
    ) {
      setPlayer({ x: newX, y: newY });
      if (newX === gridSize - 2 && newY === gridSize - 2) setWin(true);
    }
  };

  // sterowanie
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (win) return;
      if (e.key === "ArrowUp") move(0, -1);
      if (e.key === "ArrowDown") move(0, 1);
      if (e.key === "ArrowLeft") move(-1, 0);
      if (e.key === "ArrowRight") move(1, 0);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [player, win]);

  // rysowanie
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // labirynt
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        ctx.fillStyle = maze[y][x] === 1 ? "black" : "#eee";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // gracz
    ctx.fillStyle = "pink";
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);

    // meta
    ctx.fillStyle = "gold";
    ctx.fillRect((gridSize - 2) * cellSize, (gridSize - 2) * cellSize, cellSize, cellSize);

    // wygrana
    if (win) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("YOU WON!", canvas.width / 2, canvas.height / 2);
      ctx.font = "20px Arial";
      ctx.fillText("Press SPACE to restart", canvas.width / 2, canvas.height / 2 + 30);
    }
  }, [maze, player, win]);

  // restart
  useEffect(() => {
    const handleRestart = (e: KeyboardEvent) => {
      if (e.code === "Space" && win) {
        setMaze(generateMaze(gridSize));
        setPlayer({ x: 1, y: 1 });
        setWin(false);
      }
    };
    window.addEventListener("keydown", handleRestart);
    return () => window.removeEventListener("keydown", handleRestart);
  }, [win]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">Maze</h1>
      <canvas
        ref={canvasRef}
        width={cellSize * gridSize}
        height={cellSize * gridSize}
        className="border rounded-lg"
      />
    </div>
  );
}
