import { useEffect, useRef, useState } from "react";
import { type Point } from "./Snake";

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default function Fruit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [player, setPlayer] = useState<Point>({ x: 500, y: 535 });
  const [fruits, setFruit] = useState<Point[]>([
    { x: randInt(0, 985), y: 0 },
  ]);
  const [score, setScore] = useState(0);

  const maxFruits = 5;
  const playerSpeed = 30;
  const fallingSpeed = 5;

  // logika gry
  useEffect(() => {
    const interval = setInterval(() => {
      setFruit((prev) => {
        // spadanie
        const moved = prev.map((f) => ({
          ...f,
          y: f.y + fallingSpeed,
        }));

        // filtracja + zbieranie punktów
        let filtered: Point[] = [];
        for (const f of moved) {

          const dx = player.x - f.x;
          const dy = player.y - f.y;
          if (Math.sqrt(dx * dx + dy * dy) < 40) {
            setScore((s) => s + 1);
            continue;
          }

          // poza ekranem
          if (f.y <= 550) {
            filtered.push(f);
          }
        }

        // losowy drop
        if (filtered.length < maxFruits) {
          if (randInt(0, 25) === 0) {
            filtered.push({
              x: randInt(0, 985),
              y: 0,
            });
          }
        }

        return filtered;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [player]);

  // rysowanie
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // player
    ctx.fillStyle = "pink";
    ctx.fillRect(player.x, player.y - 20, 40, 40);

    // fruits
    ctx.fillStyle = "red";
    for (const f of fruits) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // punktacja na canvas
    ctx.fillStyle = "black";
    ctx.font = "26px Arial";
    ctx.fillText(`Score: ${score}`, 20, 40);
  }, [fruits, player, score]);

  // sterowanie
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setPlayer((p) => ({ x: p.x - playerSpeed, y: p.y }));
      }
      if (e.key === "ArrowRight") {
        setPlayer((p) => ({ x: p.x + playerSpeed, y: p.y }));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-10 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-2">Catch the Fruit</h1>

      <canvas
        ref={canvasRef}
        width={1000}
        height={550}
        className="border rounded-lg"
      />
    </div>
  );
}
