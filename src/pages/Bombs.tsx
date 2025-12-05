import { useEffect, useRef, useState } from "react";
import { type Point } from "./Snake";

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default function Bombs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [player, setPlayer] = useState<Point>({ x: 500, y: 535 });
  const [bombs, setBombs] = useState<Point[]>([
    { x: randInt(0, 1000), y: 0 },
  ]);
  const [gameover, setGameover] = useState(false);

  const bombsAmount = 15;
  const playerSpeed = 25;
  const fallingSpeed = 10;

  // logika gry (spadanie + kolizje)
  useEffect(() => {
    if (gameover) return;

    const interval = setInterval(() => {
      setBombs((prev) => {
        // przesuwanie
        const moved = prev.map((b) => ({
          ...b,
          y: b.y + fallingSpeed,
        }));

        // usunięcie bomb, które spadły
        let filtered = moved.filter(b => b.y <= 550);

        // dodanie nowych bomb
        if (filtered.length < bombsAmount) {
          if (randInt(0, 30) === 0) {  
            // 1/30 szansy na spawn w każdej klatce
            filtered.push({
              x: randInt(0, 985),
              y: 0
            });
          }
        }


        // kolizje
        for (const b of filtered) {
          const dx = player.x - b.x;
          const dy = player.y - b.y;
          if (Math.sqrt(dx * dx + dy * dy) < 20) {
            setGameover(true);
            break;
          }
        }

        return filtered;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gameover, player]);

  // rysowanie
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // player
    ctx.fillStyle = "pink";
    ctx.fillRect(player.x, player.y-20, 40, 40);

    // bombs
    ctx.fillStyle = "black";
    for (const b of bombs) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    // game over
    if (gameover) {
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
      ctx.font = "20px Arial";
      ctx.fillText(
        "Press SPACE to restart",
        canvas.width / 2,
        canvas.height / 2 + 30
      );
    }
  }, [bombs, player, gameover]);

  // sterowanie
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameover && e.code === "Space") {
        // restart
        setPlayer({ x: 500, y: 535 });
        setBombs([{ x: randInt(0, 985), y: 0 }]);
        setGameover(false);
        return;
      }

      if (gameover) return;

      if (e.key === "ArrowLeft") {
        setPlayer((p) => ({ x: p.x - playerSpeed, y: p.y }));
      }
      if (e.key === "ArrowRight") {
        setPlayer((p) => ({ x: p.x + playerSpeed, y: p.y }));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameover]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">Avoid the Bombs</h1>
      <canvas
        ref={canvasRef}
        width={1000}
        height={550}
        className="border rounded-lg"
      />
    </div>
  );
}
