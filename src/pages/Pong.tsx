import { useEffect, useRef, useState } from "react";

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const paddleWidth = 100;
  const paddleHeight = 20;
  const ballRadius = 10;
  const paddleSpeed = 20;

  const [paddle, setPaddle] = useState<{ x: number; y: number }>({ x: 450, y: 520 });
  const [ball, setBall] = useState<{ x: number; y: number; vx: number; vy: number }>({
    x: 500,
    y: 300,
    vx: 4,
    vy: -4,
  });
  const [gameover, setGameover] = useState(false);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const interval = setInterval(() => {
        // update ball position
        setBall((prev) => {
          let newX = prev.x + prev.vx;
          let newY = prev.y + prev.vy;
          let newVx = prev.vx;
          let newVy = prev.vy;
  
          // wall collisions
          if (newX + ballRadius > canvas.width || newX - ballRadius < 0) {
            newVx = -newVx;
          }
          if (newY - ballRadius < 0) {
            newVy = -newVy;
          }
  
          // paddle collision
          if (
            newY + ballRadius > paddle.y &&
            newX > paddle.x &&
            newX < paddle.x + paddleWidth
          ) {
            newVy = -newVy;
            newY = paddle.y - ballRadius;
          }
  
          // bottom collision (game over)
          if (newY + ballRadius > canvas.height) {
            setGameover(true);
          }
  
          return { x: newX, y: newY, vx: newVx, vy: newVy };
        });
      }, 16);
  
      return () => clearInterval(interval);
    }, [paddle]);

    // drawing
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // draw paddle
      ctx.fillStyle = "pink";
      ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
  
      // draw ball
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
      ctx.fill();
  
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
    }, [paddle, ball, gameover]);

    // paddle movement
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (gameover) {
          if (e.key === " ") {
            // restart game
            setGameover(false);
            setBall({ x: 500, y: 300, vx: 4, vy: -4 });
            setPaddle({ x: 450, y: 530 });
          }
          return;
        }
        if (e.key === "ArrowLeft") {
          setPaddle((prev) => ({
            x: Math.max(0, prev.x - paddleSpeed),
            y: prev.y,
          }));
        } else if (e.key === "ArrowRight") {
          setPaddle((prev) => ({
            x: Math.min(1000 - paddleWidth, prev.x + paddleSpeed),
            y: prev.y,
          }));
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameover]);




  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">Ping Pong</h1>
      <canvas
        ref={canvasRef}
        width={1000}
        height={550}
        className="border rounded-lg"
      />
    </div>
  );
}
