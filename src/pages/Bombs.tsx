import { useEffect, useState } from "react";
import { type Point } from "./Snake";

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

export default function Bombs() {
  const [player, setPlayer] = useState<Point>({ x: 500, y: 0 });
  const [bombs, setBomb] = useState<Point[]>([{ x: 333, y: 550 }]);
  const [gameover, setGameover] = useState(false);

  const bombsAmount = 1;
  const playerSpeed = 1;
  const fallingSpeed = 1;

  // sprawdzanie kolizji & ustawianie bomb
  useEffect(() => {
    if (gameover) return;

    for(let i=0; i<bombs.length; i++) {
      if(player.x == bombs[i].x && player.y == bombs[i].y) setGameover(true);
      if(bombs[i].y < 0) bombs.pop();
    }

    const bombsCopy = [...bombs];
    for(let i=0; i<bombsAmount; i++) {
      bombsCopy[i].x = randInt(0, 500);
      bombsCopy[i].y = 550;
    }
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">header</h1>
      <canvas
        //ref={canvasRef}
        width={1000}
        height={550}
        className="border rounded-lg"
      />
    </div>
  );
}