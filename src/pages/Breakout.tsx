import { useEffect, useRef, useState } from "react";

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paddleWidth = 120;
  const paddleHeight = 20;
  const paddleSpeed = 20;
  const ballRadius = 10;

  // klocek
  const brickRows = 5;
  const brickCols = 10;
  const brickWidth = 84;
  const brickHeight = 30;
  const brickPadding = 10;
  const brickOffsetX = 35;
  const brickOffsetY = 40;

  const [paddle, setPaddle] = useState({ x: 430, y: 500 });

  const [ball, setBall] = useState({
    x: 500,
    y: 300,
    vx: 4,
    vy: -4,
  });

  const [bricks, setBricks] = useState(
    Array.from({ length: brickRows }, () =>
      Array.from({ length: brickCols }, () => true)
    )
  );

  const [gameover, setGameover] = useState(false);

  // update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const interval = setInterval(() => {
      if (gameover) return;

      setBall((prev) => {
        let newX = prev.x + prev.vx;
        let newY = prev.y + prev.vy;
        let newVx = prev.vx;
        let newVy = prev.vy;

        // wall collisions
        if (newX - ballRadius < 0 || newX + ballRadius > canvas.width) {
          newVx = -newVx;
        }
        if (newY - ballRadius < 0) {
          newVy = -newVy;
        }

        // paddle
        if (
          newY + ballRadius > paddle.y &&
          newX > paddle.x &&
          newX < paddle.x + paddleWidth
        ) {
          newVy = -newVy;
          newY = paddle.y - ballRadius;
        }

        // bottom collision
        if (newY + ballRadius > canvas.height) {
          setGameover(true);
        }

        // kolizje bricków
        setBricks((old) => {
          const newBricks = old.map((row) => [...row]);

          for (let r = 0; r < brickRows; r++) {
            for (let c = 0; c < brickCols; c++) {
              if (!newBricks[r][c]) continue;

              const bx = brickOffsetX + c * (brickWidth + brickPadding);
              const by = brickOffsetY + r * (brickHeight + brickPadding);

              if (
                newX + ballRadius > bx &&
                newX - ballRadius < bx + brickWidth &&
                newY + ballRadius > by &&
                newY - ballRadius < by + brickHeight
              ) {
                newVy = -newVy;
                newBricks[r][c] = false;
              }
            }
          }

          return newBricks;
        });

        return { x: newX, y: newY, vx: newVx, vy: newVy };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [paddle, gameover]);

  // -------------------------------
  // DRAW
  // -------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // paddle
    ctx.fillStyle = "pink";
    ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);

    // ball
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // bricks
    bricks.forEach((row, r) => {
      row.forEach((alive, c) => {
        if (!alive) return;

        const x = brickOffsetX + c * (brickWidth + brickPadding);
        const y = brickOffsetY + r * (brickHeight + brickPadding);

        ctx.fillStyle = "#0095DD";
        ctx.fillRect(x, y, brickWidth, brickHeight);
      });
    });

    // game over
    if (gameover) {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

      ctx.font = "20px Arial";
      ctx.fillText(
        "Press SPACE to restart",
        canvas.width / 2,
        canvas.height / 2 + 40
      );
    }
  }, [paddle, ball, bricks, gameover]);

  // -------------------------------
  // INPUT
  // -------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameover && e.key === " ") {
        setGameover(false);
        setBall({ x: 500, y: 300, vx: 4, vy: -4 });
        setPaddle({ x: 430, y: 500 });
        setBricks(
          Array.from({ length: brickRows }, () =>
            Array.from({ length: brickCols }, () => true)
          )
        );
        return;
      }

      if (e.key === "ArrowLeft") {
        setPaddle((p) => ({ ...p, x: Math.max(0, p.x - paddleSpeed) }));
      }
      if (e.key === "ArrowRight") {
        setPaddle((p) => ({
          ...p,
          x: Math.min(1000 - paddleWidth, p.x + paddleSpeed),
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameover]);

  // -------------------------------
  // RETURN
  // -------------------------------
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient text-5xl font-bold mb-4">Breakout</h1>
      <canvas
        ref={canvasRef}
        width={1000}
        height={550}
        className="border rounded-lg"
      />
    </div>
  );
}
