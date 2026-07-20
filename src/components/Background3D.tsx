import React, { useEffect, useRef } from "react";
import { ThemeId } from "@/types";

interface Background3DProps {
  currentTheme: ThemeId;
}

interface Particle {
  x: number;
  y: number;
  z: number; // 3D depth
  px: number; // Projected x
  py: number; // Projected y
  size: number;
  color: string;
  vx: number;
  vy: number;
  vz: number;
}

export default function Background3D({ currentTheme }: Background3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 }); // Mouse position and target

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track container resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || window.innerWidth;
        height = canvas.height = entry.contentRect.height || window.innerHeight;
      }
    });
    resizeObserver.observe(canvas.parentElement || document.body);

    // Track mouse coordinates for 3D parallax
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to center (from -1 to 1)
      mouseRef.current.tx = (e.clientX - width / 2) / (width / 2);
      mouseRef.current.ty = (e.clientY - height / 2) / (height / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic style based on current theme
    const getThemeConfig = () => {
      switch (currentTheme) {
        case "developer":
          return {
            bgColor: "rgba(15, 20, 28, 0.08)",
            particleColors: ["#00E5FF", "#0088FF", "#00FF66"],
            count: 75,
            drawMesh: true,
            meshColor: "rgba(0, 229, 255, 0.06)",
            speedMultiplier: 0.8,
          };
        case "glass":
          return {
            bgColor: "rgba(11, 8, 22, 0.1)",
            particleColors: ["#8B5CF6", "#EC4899", "#06B6D4", "#10B981"],
            count: 85,
            drawMesh: true,
            meshColor: "rgba(139, 92, 246, 0.07)",
            speedMultiplier: 0.75,
          };
        case "academic":
          return {
            bgColor: "rgba(244, 246, 249, 0.12)",
            particleColors: ["#1E3A8A", "#4F46E5", "#3B82F6", "#93C5FD"],
            count: 55,
            drawMesh: true,
            meshColor: "rgba(30, 58, 138, 0.05)",
            speedMultiplier: 0.5,
          };
        case "minimal":
        default:
          return {
            bgColor: "rgba(252, 252, 253, 0.15)",
            particleColors: ["#404040", "#737373", "#A3A3A3", "#D4D4D4"],
            count: 45,
            drawMesh: false,
            meshColor: "transparent",
            speedMultiplier: 0.4,
          };
      }
    };

    let config = getThemeConfig();

    // Create 3D particles (with coordinate x, y, z where z is depth)
    const particles: Particle[] = [];
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < config.count; i++) {
        particles.push({
          x: (Math.random() - 0.5) * width * 1.8,
          y: (Math.random() - 0.5) * height * 1.8,
          z: Math.random() * 800 + 200, // Depth from 200 to 1000
          px: 0,
          py: 0,
          size: Math.random() * 2.5 + 1,
          color: config.particleColors[Math.floor(Math.random() * config.particleColors.length)],
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          vz: -Math.random() * 0.8 - 0.2, // Drift forward in 3D
        });
      }
    };

    initParticles();

    // Smoothly interpolate mouse
    let mx = 0;
    let my = 0;

    const render = () => {
      // Clear with slight transparency for trailing effect
      if (currentTheme === "developer" || currentTheme === "glass") {
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Clean canvas for light modes to prevent muddy colors
        ctx.clearRect(0, 0, width, height);
      }

      // Update config if theme changed
      config = getThemeConfig();

      // Lerp mouse coordinates
      mx += (mouseRef.current.tx - mx) * 0.05;
      my += (mouseRef.current.ty - my) * 0.05;

      const fov = 400; // Field of view
      const cx = width / 2;
      const cy = height / 2;

      // Draw dynamic rotating 3D background grid if selected
      if (config.drawMesh) {
        ctx.strokeStyle = config.meshColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Dynamic sine wave lattice in 3D style
        const rows = 12;
        const cols = 12;
        const time = Date.now() * 0.0005;

        for (let r = 0; r <= rows; r++) {
          const gy = (r / rows - 0.5) * height * 1.2;
          ctx.beginPath();
          for (let c = 0; c <= cols; c++) {
            const gx = (c / cols - 0.5) * width * 1.2;
            const gz = 350 + Math.sin(r * 0.5 + time) * 60 + Math.cos(c * 0.5 + time) * 60;
            
            // Apply 3D rotation based on mouse movement
            const rx = gx * Math.cos(mx * 0.1) - gz * Math.sin(mx * 0.1);
            const rz = gx * Math.sin(mx * 0.1) + gz * Math.cos(mx * 0.1);
            const ry = gy * Math.cos(my * 0.1) - rz * Math.sin(my * 0.1);
            const finalZ = gy * Math.sin(my * 0.1) + rz * Math.cos(my * 0.1);

            // Project to 2D
            const scale = fov / (fov + finalZ);
            const px = cx + rx * scale;
            const py = cy + ry * scale;

            if (c === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // DRAW PREMIUM 3D SCI-FI ELEMENTS BASED ON ACTIVE THEME
      const time = Date.now() * 0.0005;
      
      if (currentTheme === "developer" || currentTheme === "glass") {
        // Draw floating rotating 3D Wireframe Cubes
        const draw3DCube = (x: number, y: number, z: number, size: number, color: string, rotSpeed: number) => {
          const vertices = [
            { x: -size, y: -size, z: -size },
            { x: size, y: -size, z: -size },
            { x: size, y: size, z: -size },
            { x: -size, y: size, z: -size },
            { x: -size, y: -size, z: size },
            { x: size, y: -size, z: size },
            { x: size, y: size, z: size },
            { x: -size, y: size, z: size },
          ];

          const t = 0;
          const rotated = vertices.map((v) => {
            // Self rotation
            let rx = v.x * Math.cos(t) - v.z * Math.sin(t);
            let rz = v.x * Math.sin(t) + v.z * Math.cos(t);
            let ry = v.y * Math.cos(t * 0.6) - rz * Math.sin(t * 0.6);
            let rz2 = v.y * Math.sin(t * 0.6) + rz * Math.cos(t * 0.6);

            // Mouse parallax rotation
            let rx2 = rx * Math.cos(mx * 0.25) - rz2 * Math.sin(mx * 0.25);
            let rz3 = rx * Math.sin(mx * 0.25) + rz2 * Math.cos(mx * 0.25);
            let ry2 = ry * Math.cos(my * 0.25) - rz3 * Math.sin(my * 0.25);
            let rz4 = ry * Math.sin(my * 0.25) + rz3 * Math.cos(my * 0.25);

            // Projection
            const fZ = rz4 + z;
            const scale = fov / (fov + fZ);
            return {
              px: cx + (rx2 + x) * scale,
              py: cy + (ry2 + y) * scale,
            };
          });

          const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // back
            [4, 5], [5, 6], [6, 7], [7, 4], // front
            [0, 4], [1, 5], [2, 6], [3, 7], // connectors
          ];

          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.15;
          edges.forEach(([u, v]) => {
            ctx.beginPath();
            ctx.moveTo(rotated[u].px, rotated[u].py);
            ctx.lineTo(rotated[v].px, rotated[v].py);
            ctx.stroke();
          });
        };

        draw3DCube(-width * 0.3, -height * 0.2, 500, 80, "rgba(59, 130, 246, 0.4)", 0.6);
        draw3DCube(width * 0.35, height * 0.15, 600, 100, "rgba(139, 92, 246, 0.4)", 0.4);
      } else if (currentTheme === "academic") {
        // Draw nested elegant orbiting orbital rings in 3D
        const draw3DOrbit = (radius: number, color: string, inclination: number, phase: number) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.08;
          ctx.beginPath();

          for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * Math.cos(inclination);
            const z = Math.sin(angle) * radius * Math.sin(inclination) + 400;

            // Parallax rotation
            const rx = x * Math.cos(mx * 0.12) - z * Math.sin(mx * 0.12);
            const rz = x * Math.sin(mx * 0.12) + z * Math.cos(mx * 0.12);
            const ry = y * Math.cos(my * 0.12) - rz * Math.sin(my * 0.12);
            const finalZ = y * Math.sin(my * 0.12) + rz * Math.cos(my * 0.12);

            const scale = fov / (fov + finalZ);
            const px = cx + rx * scale;
            const py = cy + ry * scale;

            if (angle === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Draw a small node orbiting the track
          const orbitAngle = phase;
          const ox = Math.cos(orbitAngle) * radius;
          const oy = Math.sin(orbitAngle) * radius * Math.cos(inclination);
          const oz = Math.sin(orbitAngle) * radius * Math.sin(inclination) + 400;

          const rx = ox * Math.cos(mx * 0.12) - oz * Math.sin(mx * 0.12);
          const rz = ox * Math.sin(mx * 0.12) + oz * Math.cos(mx * 0.12);
          const ry = oy * Math.cos(my * 0.12) - rz * Math.sin(my * 0.12);
          const finalZ = oy * Math.sin(my * 0.12) + rz * Math.cos(my * 0.12);

          const scale = fov / (fov + finalZ);
          const px = cx + rx * scale;
          const py = cy + ry * scale;

          ctx.fillStyle = color;
          ctx.globalAlpha = 0.35;
          ctx.beginPath();
          ctx.arc(px, py, 4 * scale, 0, Math.PI * 2);
          ctx.fill();
        };

        draw3DOrbit(180, "rgba(99, 102, 241, 0.4)", Math.PI / 6, 0);
        draw3DOrbit(260, "rgba(99, 102, 241, 0.3)", -Math.PI / 4, Math.PI);
      }

      // Update and draw 3D particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.z += p.vz * config.speedMultiplier;
        p.x += p.vx * config.speedMultiplier;
        
        // Add natural sinusoidal sway for minimal theme (leaf flutter effect)
        if (currentTheme === "minimal") {
          p.y += (p.vy + Math.sin(time + p.x * 0.01) * 0.4) * config.speedMultiplier;
        } else {
          p.y += p.vy * config.speedMultiplier;
        }

        // Reset if too close or out of bounds
        if (p.z <= 10 || Math.abs(p.x) > width * 2 || Math.abs(p.y) > height * 2) {
          p.z = Math.random() * 800 + 400;
          p.x = (Math.random() - 0.5) * width * 1.8;
          p.y = (Math.random() - 0.5) * height * 1.8;
        }

        // Apply 3D rotation based on mouse (parallax)
        const rotX = p.x * Math.cos(mx * 0.15) - p.z * Math.sin(mx * 0.15);
        const rotZ = p.x * Math.sin(mx * 0.15) + p.z * Math.cos(mx * 0.15);
        const rotY = p.y * Math.cos(my * 0.15) - rotZ * Math.sin(my * 0.15);
        const finalZ = p.y * Math.sin(my * 0.15) + rotZ * Math.cos(my * 0.15);

        // Project
        const scale = fov / (fov + finalZ);
        p.px = cx + rotX * scale;
        p.py = cy + rotY * scale;

        const renderSize = p.size * scale * 2.5;

        // Draw particle if on screen
        if (p.px > 0 && p.px < width && p.py > 0 && p.py < height) {
          const alpha = Math.min(1, Math.max(0, 1 - finalZ / 1200));
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;

          // Draw simple circle or cross to resemble data structures/coordinates
          ctx.beginPath();
          ctx.arc(p.px, p.py, renderSize, 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby particles for a neural-net / graph 3D network look
          if (config.drawMesh) {
            for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              const dx = p.px - p2.px;
              const dy = p.py - p2.py;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 85) {
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = (1 - dist / 85) * 0.08 * alpha;
                ctx.beginPath();
                ctx.moveTo(p.px, p.py);
                ctx.lineTo(p2.px, p2.py);
                ctx.stroke();
              }
            }
          }
        }
      }

      ctx.globalAlpha = 1.0; // Reset alpha
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [currentTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none transition-all duration-500"
      style={{
        mixBlendMode: currentTheme === "minimal" ? "multiply" : "normal",
        opacity: currentTheme === "minimal" ? 0.35 : currentTheme === "academic" ? 0.75 : 0.9,
      }}
    />
  );
}
