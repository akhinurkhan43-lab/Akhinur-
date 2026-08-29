import React, { useEffect, useRef } from 'react';

export const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = Math.floor((width * height) / 3500);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.8 ? '#fde68a' : Math.random() > 0.6 ? '#bae6fd' : '#ffffff'
    }));

    // Shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }

    const shootingStars: ShootingStar[] = [];

    const spawnShootingStar = () => {
      if (Math.random() < 0.015 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 50,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          opacity: 1,
          active: true
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep sky gradient (#05070A obsidian)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#05070a');
      skyGrad.addColorStop(0.5, '#070a10');
      skyGrad.addColorStop(1, '#05070a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Warm amber ambient glow top-left
      const amberGlow = ctx.createRadialGradient(width * 0.15, height * 0.1, 10, width * 0.15, height * 0.1, 550);
      amberGlow.addColorStop(0, 'rgba(217, 119, 6, 0.045)');
      amberGlow.addColorStop(0.6, 'rgba(180, 83, 9, 0.015)');
      amberGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = amberGlow;
      ctx.fillRect(0, 0, width, height);

      // Deep sapphire ambient glow bottom-right
      const blueGlow = ctx.createRadialGradient(width * 0.85, height * 0.8, 10, width * 0.85, height * 0.8, 650);
      blueGlow.addColorStop(0, 'rgba(30, 58, 138, 0.05)');
      blueGlow.addColorStop(0.6, 'rgba(15, 23, 42, 0.02)');
      blueGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw and animate stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha > 0.9) {
          star.alpha = 0.9;
          star.twinkleDir = -1;
        } else if (star.alpha < 0.2) {
          star.alpha = 0.2;
          star.twinkleDir = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();
      });

      // Draw shooting stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        if (!s.active) continue;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(253, 230, 138, ${s.opacity})`;
        ctx.lineWidth = 1.5;
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.02;

        if (s.opacity <= 0 || s.x > width || s.y > height) {
          shootingStars.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starry-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
