import { useEffect, useRef, useState } from "react";
import { type Point } from "./Snake";

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

export default function Bombs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<Point>({ x: 500, y: 535 });
  const [bombs, setBomb] = useState<Point[]>([{ x: randInt(0, 1000), y: 0 }]);
  const [gameover, setGameover] = useState(false);

  const bombsAmount = 3;
  const playerSpeed = 1;
  const fallingSpeed = 1;

  // sprawdzanie kolizji & ustawianie bomb
  useEffect(() => {
    if (gameover) return;

    const interval = setInterval(() => {
      for(let i=0; i<bombs.length; i++) {
        if(player.x == bombs[i].x && player.y == bombs[i].y) setGameover(true);
      }

      const filtered = bombs.filter(b => b.y >= 0);

      for(let i=0; i<bombsAmount-filtered.length; i++) {
        filtered.push({x: randInt(0, 1000), y: 0})
      }
      console.log(filtered)
      setBomb(filtered);
    }, 1000)

    return () => clearInterval(interval);
  }, [gameover, player])
  

  // rysowanie planszy
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // player
    ctx.fillStyle = "pink";
    ctx.fillRect(player.x, player.y, 15, 15);

    // bombs
    for(let i=0; i<bombs.length; i++) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        bombs[i].x,
        bombs[i].y,
        15,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // game over
    if (gameover) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
      ctx.font = "20px Arial";
      ctx.fillText("Press SPACE to restart", canvas.width / 2, canvas.height / 2 + 30);
    }
  }, [gameover, bombs, player])

    // sterowanie
    useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
        if (gameover && e.code === "Space") {
          // restart
          setPlayer({x: 500, y: 535});
          setBomb([{x: 333, y: 550}]);
          setGameover(false);
          return;
        }
        
        let newX = player.x;
  
        if (e.key === "ArrowLeft") {newX -= 1*playerSpeed};
        if (e.key === "ArrowRight") {newX += 1*playerSpeed};

        setPlayer({x: newX, y: player.y});
      };

      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }, [gameover]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">header</h1>
      <canvas
        ref={canvasRef}
        width={1000}
        height={550}
        className="border rounded-lg"
      />
    </div>
  );
}