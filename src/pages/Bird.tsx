import { useRef, useEffect, useState } from "react";

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 600;
  const height = 600;
  const birdSize = 30;

  const [birdY, setBirdY] = useState(height / 2);
  const birdYRef = useRef(height / 2);
  const [velocity, setVelocity] = useState(0);
  const velocityRef = useRef(0);
  const [pipes, setPipes] = useState<{ x: number; gapY: number; passed: boolean }[]>([]);
  const pipesRef = useRef(pipes);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gravity = 0.3;
  const jump = -5;
  const pipeWidth = 60;
  const gapHeight = 200;
  const pipeSpeed = 3;
  const pipeInterval = 1500;

  // synchronizacja refów z state
  useEffect(() => { birdYRef.current = birdY; }, [birdY]);
  useEffect(() => { velocityRef.current = velocity; }, [velocity]);
  useEffect(() => { pipesRef.current = pipes; }, [pipes]);

  // ruch ptaka + kolizje + liczenie punktów
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      // ruch ptaka
      velocityRef.current += gravity;
      let newY = birdYRef.current + velocityRef.current;
      if (newY + birdSize > height || newY < 0) {
        setGameOver(true);
        return;
      }
      setBirdY(newY);

      // ruch rur
      setPipes(prev => {
        const newPipes = prev.map(p => ({ ...p, x: p.x - pipeSpeed }));

        newPipes.forEach(p => {
          // kolizja
          if (
            50 + birdSize > p.x &&
            50 < p.x + pipeWidth &&
            (newY < p.gapY || newY + birdSize > p.gapY + gapHeight)
          ) {
            setGameOver(true);
          }

          // punktacja
          if (!p.passed && p.x + pipeWidth < 50) {
            p.passed = true;
            setScore(s => s + 1);
          }
        });

        return newPipes.filter(p => p.x + pipeWidth > 0);
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gameOver]);

  // generowanie rur
  useEffect(() => {
    if (gameOver) return;
    const pipeTimer = setInterval(() => {
      const gapY = Math.floor(Math.random() * (height - gapHeight - 40)) + 20;
      setPipes(prev => [...prev, { x: width, gapY, passed: false }]);
    }, pipeInterval);

    return () => clearInterval(pipeTimer);
  }, [gameOver]);

  // sterowanie ptakiem
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver && e.code === "Space") {
        setBirdY(height / 2);
        setVelocity(0);
        setPipes([]);
        setScore(0);
        setGameOver(false);
        return;
      }
      if (e.code === "Space" || e.key === "ArrowUp") {
        velocityRef.current = jump;
        setVelocity(jump);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  // rysowanie
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // tło
    ctx.fillStyle = "#87ceeb";
    ctx.fillRect(0, 0, width, height);

    // ptak
    ctx.fillStyle = "pink";
    ctx.fillRect(50, birdY, birdSize, birdSize);

    // rury
    ctx.fillStyle = "green";
    pipes.forEach(p => {
      ctx.fillRect(p.x, 0, pipeWidth, p.gapY);
      ctx.fillRect(p.x, p.gapY + gapHeight, pipeWidth, height - p.gapY - gapHeight);
    });

    // score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, 10, 10);

    // game over
    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", width / 2, height / 2);
      ctx.font = "20px Arial";
      ctx.fillText("Press SPACE to restart", width / 2, height / 2 + 40);
    }
  }, [birdY, pipes, score, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">Flappy Bird</h1>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border rounded-lg"
      />
    </div>
  );
}
