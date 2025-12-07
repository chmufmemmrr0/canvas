import { useRef, useEffect, useState } from "react";

export default function Runner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 700;
  const height = 300;

  // player
  const playerSize = 35;
  const groundY = height - playerSize - 10;
  const jumpForce = -10;
  const gravity = 0.5;

  const [playerY, setPlayerY] = useState(groundY);
  const playerYRef = useRef(groundY);
  const [vel, setVel] = useState(0);
  const velRef = useRef(0);

  // obstacles
  const [blocks, setBlocks] = useState<{ x: number; w: number; h: number; passed: boolean }[]>([]);
  const blocksRef = useRef(blocks);

  const blockSpeed = 5;
  const spawnInterval = 1400;

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // sync refs
  useEffect(() => { playerYRef.current = playerY; }, [playerY]);
  useEffect(() => { velRef.current = vel; }, [vel]);
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  // physics + collisions + score
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      // gravity
      velRef.current += gravity;
      let newY = playerYRef.current + velRef.current;

      // floor
      if (newY > groundY) {
        newY = groundY;
        velRef.current = 0;
      }
      setPlayerY(newY);

      // blocks movement + collision + score
      setBlocks(prev => {
        const next = prev.map(b => ({ ...b, x: b.x - blockSpeed }));

        next.forEach(b => {
          // collision
          const px = 50;
          const py = newY;

          if (
            px < b.x + b.w &&
            px + playerSize > b.x &&
            py + playerSize > height - b.h - 10
          ) {
            setGameOver(true);
          }

          // score
          if (!b.passed && b.x + b.w < px) {
            b.passed = true;
            setScore(s => s + 1);
          }
        });

        return next.filter(b => b.x + b.w > 0);
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gameOver]);

  // block spawner
  useEffect(() => {
    if (gameOver) return;
    const t = setInterval(() => {
      const w = Math.floor(Math.random() * 30) + 20;
      const h = Math.floor(Math.random() * 50) + 30;
      setBlocks(prev => [...prev, { x: width, w, h, passed: false }]);
    }, spawnInterval);

    return () => clearInterval(t);
  }, [gameOver]);

  // controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // restart
      if (gameOver && e.code === "Space") {
        setPlayerY(groundY);
        setVel(0);
        setBlocks([]);
        setScore(0);
        setGameOver(false);
        return;
      }

      // jump
      if ((e.code === "Space" || e.key === "ArrowUp") && playerYRef.current === groundY) {
        velRef.current = jumpForce;
        setVel(jumpForce);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver]);

  // drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // sky
    ctx.fillStyle = "#87ceeb";
    ctx.fillRect(0, 0, width, height);

    // ground
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(0, height - 10, width, 10);

    // player
    ctx.fillStyle = "pink";
    ctx.fillRect(50, playerY, playerSize, playerSize);

    // blocks
    ctx.fillStyle = "red";
    blocks.forEach(b => {
      ctx.fillRect(b.x, height - b.h - 10, b.w, b.h);
    });

    // score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 10, 25);

    // game over
    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "bold 40px Arial";
      ctx.fillText("GAME OVER", width / 2, height / 2);
      ctx.font = "20px Arial";
      ctx.fillText("Press SPACE to restart", width / 2, height / 2 + 40);
    }
  }, [playerY, blocks, score, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-screen gap-10">
      <h1 className="text-5xl font-bold headerGradient mb-4">Runner</h1>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border rounded-lg"
      />
    </div>
  );
}
