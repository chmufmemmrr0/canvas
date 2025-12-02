import { useRef, useEffect, useState } from "react";

type Point = { x: number; y: number };

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Point>({ x: 8, y: 8 });
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 }); // direction
  const [gameOver, setGameOver] = useState(false);

  const cellSize = 30;
  const gridSize = 20; 

  // ruch weza
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

        // game over na scianach
        if (
          newHead.x < 0 ||
          newHead.x >= gridSize ||
          newHead.y < 0 ||
          newHead.y >= gridSize
        ) {
          setGameOver(true);
          return prev;
        }

        // kolizja samego ze soba
        if (prev.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        let newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
          });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [dir, food, gameOver]);

  // rysowanie planszy
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // szachownica
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#eee" : "#ffffff";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // jedzenie
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // waz
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#006400" : "green"; // glowa ciemniejsza
      ctx.fillRect(s.x * cellSize, s.y * cellSize, cellSize, cellSize);
    });

    // game over
    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
      ctx.font = "20px Arial";
      ctx.fillText("Press SPACE to restart", canvas.width / 2, canvas.height / 2 + 30);
    }
  }, [snake, food, gameOver]);

  // sterowanie
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver && e.code === "Space") {
        // restart
        setSnake([{ x: 5, y: 5 }]);
        setFood({ x: 8, y: 8 });
        setDir({ x: 1, y: 0 });
        setGameOver(false);
        return;
      }

      if (e.key === "ArrowUp" && dir.y === 0) setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && dir.y === 0) setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && dir.x === 0) setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && dir.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">Snake</h1>
      <canvas
        ref={canvasRef}
        width={cellSize * gridSize}
        height={cellSize * gridSize}
        className="border rounded-lg"
      />
    </div>
  );
}
