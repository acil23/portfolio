"use client";

import { useEffect, useRef, useState } from "react";

export type OrbTelemetry = {
  rotX: number;
  rotY: number;
  vel: number;
  fps: number;
  webglActive: boolean;
};

type LiquidGoldOrbProps = {
  morphIntensity?: number;
  orbitSpeed?: number;
  onTelemetry?: (data: OrbTelemetry) => void;
};

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_rotation;
  uniform float u_morph;
  uniform float u_hover;

  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  // Smooth minimum for organic liquid fusion
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  // 3D trigonometric organic displacement
  float gyroid(vec3 p, float scale, float t) {
    p = p * scale + vec3(t * 0.35, -t * 0.25, t * 0.2);
    return dot(sin(p), cos(p.yzx));
  }

  // Torus signed distance
  float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
  }

  // Scene SDF returns vec2(distance, materialId)
  // materialId: 1.0 = liquid gold core, 2.0 = iridescent chrome/glass shell
  vec2 mapScene(vec3 p) {
    // Apply interactive user 3D rotation
    p.yz *= rot(u_rotation.y);
    p.xz *= rot(u_rotation.x);

    float t = u_time * 0.85;
    float morphAmt = 0.095 * u_morph;

    // 1. Twisted Liquid Gold Core (Sculpted folded torus + organic fluid lobes)
    vec3 pg = p;
    float twistAngle = atan(pg.z, pg.x) * 2.0 + t * 0.7;
    pg.xy *= rot(0.35 * sin(twistAngle));
    pg.yz *= rot(0.65);

    float wave = gyroid(pg, 3.6, t) * morphAmt + gyroid(pg, 7.2, -t * 1.2) * (morphAmt * 0.32);
    float goldTorus = sdTorus(pg, vec2(0.54, 0.24)) + wave;

    // Second interwoven liquid gold fold
    vec3 pg2 = p;
    pg2.xz *= rot(1.1 + t * 0.15);
    pg2.xy *= rot(-0.85);
    float goldLobe = sdTorus(pg2, vec2(0.46, 0.17)) + wave * 0.85;

    float dGold = smin(goldTorus, goldLobe, 0.22);

    // 2. Iridescent Chrome & Glass Ribbon Shell wrapping the core
    vec3 pc1 = p;
    pc1.xy *= rot(-0.55 + t * 0.12);
    pc1.yz *= rot(0.95);
    float chromeRing1 = sdTorus(pc1, vec2(0.74, 0.032));

    vec3 pc2 = p;
    pc2.yz *= rot(-0.78 - t * 0.1);
    pc2.xz *= rot(0.45);
    float chromeRing2 = sdTorus(pc2, vec2(0.70, 0.026));

    // Translucent glass bubble pockets fused to the core
    vec3 pb = p;
    pb.xz *= rot(t * 0.2);
    float glassShell = abs(length(pb) - 0.67 + gyroid(pb, 2.8, t * 0.6) * 0.08) - 0.018;
    // Carve openings in the glass shell so the molten gold shines through
    float cutout = gyroid(pb, 3.2, -t * 0.4);
    glassShell = max(glassShell, cutout * 0.18 - 0.02);

    float dChrome = smin(min(chromeRing1, chromeRing2), glassShell, 0.06);

    if (dGold < dChrome) {
      return vec2(dGold, 1.0);
    }
    return vec2(dChrome, 2.0);
  }

  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.0022, -0.0022);
    return normalize(
      e.xyy * mapScene(p + e.xyy).x +
      e.yyx * mapScene(p + e.yyx).x +
      e.yxy * mapScene(p + e.yxy).x +
      e.xxx * mapScene(p + e.xxx).x
    );
  }

  // Procedural luxury studio HDRI environment reflection
  vec3 studioEnv(vec3 r, bool isChrome) {
    float y = r.y * 0.5 + 0.5;
    // Studio softbox strips
    float strip1 = smoothstep(0.72, 0.96, dot(r, normalize(vec3(-0.6, 0.75, 0.5))));
    float strip2 = smoothstep(0.65, 0.95, dot(r, normalize(vec3(0.75, 0.35, 0.6))));
    float rimStrip = smoothstep(0.55, 0.92, abs(sin(r.x * 5.0 + r.z * 3.0)) * (1.0 - abs(r.y)));

    if (!isChrome) {
      // 24K Liquid Gold reflection LUT
      vec3 darkObsidian = vec3(0.05, 0.035, 0.015);
      vec3 richBronze = vec3(0.58, 0.40, 0.12);
      vec3 moltenGold = vec3(0.96, 0.79, 0.38);
      vec3 champagneSpec = vec3(1.0, 0.96, 0.84);

      vec3 col = mix(darkObsidian, richBronze, smoothstep(0.1, 0.65, y));
      col = mix(col, moltenGold, rimStrip * 0.78 + smoothstep(0.45, 0.85, y) * 0.55);
      col += champagneSpec * (strip1 * 1.45 + strip2 * 0.95);
      return col;
    } else {
      // Holographic Chrome & Iridescent Glass dispersion
      float phase = dot(r, vec3(1.2, 1.6, 0.9)) * 2.6 + u_time * 0.3;
      vec3 irid = 0.55 + 0.45 * cos(phase + vec3(0.0, 1.8, 3.6));
      vec3 silver = mix(vec3(0.08, 0.09, 0.13), vec3(0.82, 0.88, 0.96), smoothstep(0.15, 0.85, y));
      vec3 col = mix(silver, irid, 0.42 + 0.25 * rimStrip);
      col += vec3(1.0, 0.99, 1.0) * (strip1 * 1.6 + strip2 * 1.1);
      return col;
    }
  }

  void main() {
    vec2 uv = (v_uv - 0.5) * 2.0;
    uv.x *= u_resolution.x / max(1.0, u_resolution.y);

    // Camera setup
    vec3 ro = vec3(0.0, 0.0, 2.75);
    vec3 rd = normalize(vec3(uv, -1.55));

    // Raymarching loop
    float t = 0.0;
    float matId = 0.0;
    bool hit = false;
    float glowAccum = 0.0;

    for (int i = 0; i < 68; i++) {
      vec3 p = ro + rd * t;
      vec2 res = mapScene(p);
      float d = res.x;
      glowAccum += 0.0032 / (0.045 + abs(d));
      if (d < 0.0022) {
        hit = true;
        matId = res.y;
        break;
      }
      if (t > 4.6) break;
      t += d * 0.82;
    }

    vec3 color = vec3(0.0);
    float alpha = 0.0;

    if (hit) {
      vec3 p = ro + rd * t;
      vec3 n = calcNormal(p);
      vec3 v = -rd;
      vec3 refl = reflect(-v, n);

      float fresnel = pow(1.0 - max(0.0, dot(n, v)), 3.2);

      // Key & Rim lights
      vec3 l1 = normalize(vec3(-0.7, 0.8, 0.9));
      vec3 l2 = normalize(vec3(0.85, -0.45, 0.6));
      float spec1 = pow(max(0.0, dot(refl, l1)), 36.0);
      float spec2 = pow(max(0.0, dot(refl, l2)), 20.0);

      // Fake ambient occlusion inside creases
      float ao = clamp(mapScene(p + n * 0.08).x / 0.08, 0.15, 1.0);

      if (matId < 1.5) {
        // Liquid Gold Material
        vec3 envCol = studioEnv(refl, false);
        vec3 rimGold = vec3(1.0, 0.88, 0.55) * fresnel * 1.15;
        color = envCol * (0.35 + 0.65 * ao) + rimGold;
        color += vec3(1.0, 0.96, 0.82) * spec1 * 1.35;
        color += vec3(0.95, 0.72, 0.28) * spec2 * 0.75;
        alpha = 1.0;
      } else {
        // Iridescent Chrome & Glass Shell Material
        vec3 envChrome = studioEnv(refl, true);
        // Sample inner gold core refraction through the glass shell
        vec3 refrDir = refract(-v, n, 0.88);
        vec3 innerGold = studioEnv(refrDir, false) * 0.65;
        color = mix(innerGold, envChrome, 0.58 + 0.42 * fresnel);
        color += vec3(1.0, 0.98, 1.0) * spec1 * 1.55;
        color += vec3(0.65, 0.88, 1.0) * fresnel * 0.85;
        alpha = 0.96;
      }

      // Warm golden bloom around silhouette
      color += vec3(0.92, 0.74, 0.34) * glowAccum * 0.06;
    } else {
      // Soft atmospheric golden aura behind sculpture
      float r = length(uv);
      float halo = exp(-r * 3.1) * 0.42 + clamp(glowAccum * 0.038, 0.0, 0.45);
      color = mix(vec3(0.85, 0.66, 0.26), vec3(1.0, 0.90, 0.62), halo);
      alpha = clamp(halo * 0.82, 0.0, 0.78);
    }

    // Tone mapping & gamma
    color = color / (1.0 + color * 0.28);
    color = pow(max(color, vec3(0.0)), vec3(0.92));

    gl_FragColor = vec4(color, alpha);
  }
`;

export function LiquidGoldOrb({
  morphIntensity = 1.0,
  orbitSpeed = 1.0,
  onTelemetry,
}: LiquidGoldOrbProps) {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const stateRef = useRef({
    rotX: 0.45,
    rotY: -0.22,
    velX: 0.004,
    velY: 0.001,
    dragging: false,
    lastX: 0,
    lastY: 0,
    hover: 0,
    morph: morphIntensity,
    orbit: orbitSpeed,
  });

  useEffect(() => {
    stateRef.current.morph = morphIntensity;
    stateRef.current.orbit = orbitSpeed;
  }, [morphIntensity, orbitSpeed]);

  useEffect(() => {
    const glCanvas = glCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!glCanvas || !overlayCanvas) return;

    const gl = (glCanvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false }) ||
      glCanvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    const ctx2d = overlayCanvas.getContext("2d");

    let program: WebGLProgram | null = null;
    let uResolution: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let uRotation: WebGLUniformLocation | null = null;
    let uMorph: WebGLUniformLocation | null = null;
    let uHover: WebGLUniformLocation | null = null;

    const compileShader = (type: number, source: string) => {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    if (gl) {
      const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (vs && fs) {
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
              gl.STATIC_DRAW
            );
            const posLoc = gl.getAttribLocation(program, "a_position");
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            uResolution = gl.getUniformLocation(program, "u_resolution");
            uTime = gl.getUniformLocation(program, "u_time");
            uRotation = gl.getUniformLocation(program, "u_rotation");
            uMorph = gl.getUniformLocation(program, "u_morph");
            uHover = gl.getUniformLocation(program, "u_hover");
          }
        }
      }
    }

    // 3D Orbital Rings & Stardust Pearls around the Liquid Gold Sculpture
    const orbitalRings = [
      { rx: 225, ry: 225, tiltX: 1.12, tiltZ: -0.42, speed: 0.55, color: "gold", pearls: 4 },
      { rx: 248, ry: 248, tiltX: 1.24, tiltZ: 0.48, speed: -0.42, color: "chrome", pearls: 3 },
      { rx: 192, ry: 192, tiltX: 0.92, tiltZ: -0.18, speed: 0.75, color: "gold", pearls: 3 },
    ];

    const floatingDust = Array.from({ length: 42 }, (_, i) => ({
      theta: (i / 42) * Math.PI * 2,
      phi: ((i * 1.618) % 1) * Math.PI - Math.PI / 2,
      radius: 135 + ((i * 37) % 125),
      size: 1.1 + ((i * 13) % 28) * 0.1,
      speed: (0.15 + ((i * 7) % 10) * 0.04) * (i % 2 === 0 ? 1 : -1),
      isGold: i % 3 !== 0,
    }));

    const project3D = (
      x: number,
      y: number,
      z: number,
      rotX: number,
      rotY: number,
      cx: number,
      cy: number,
      scaleFactor: number
    ) => {
      // Rotate Y (yaw)
      const cosY = Math.cos(rotX * 0.55);
      const sinY = Math.sin(rotX * 0.55);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate X (pitch)
      const cosX = Math.cos(rotY * 0.55);
      const sinX = Math.sin(rotY * 0.55);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const fov = 560;
      const persp = fov / (fov + z2);
      return {
        x: cx + x1 * persp * scaleFactor,
        y: cy + y2 * persp * scaleFactor,
        z: z2,
        scale: persp * scaleFactor,
      };
    };

    let animId = 0;
    const startTime = performance.now();
    let frameCount = 0;
    let lastFpsTime = startTime;
    let currentFps = 60;

    const resizeCanvases = () => {
      const rect = overlayCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      overlayCanvas.width = rect.width * dpr;
      overlayCanvas.height = rect.height * dpr;

      // Keep raymarch resolution crisp and fast (60 FPS locked)
      const glDpr = Math.min(dpr, 1.35);
      glCanvas.width = Math.floor(rect.width * 0.72 * glDpr);
      glCanvas.height = Math.floor(rect.height * 0.72 * glDpr);
      if (gl) {
        gl.viewport(0, 0, glCanvas.width, glCanvas.height);
      }
    };

    resizeCanvases();
    window.addEventListener("resize", resizeCanvases, { passive: true });

    const renderLoop = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      frameCount++;
      if (now - lastFpsTime >= 500) {
        currentFps = Math.min(60, Math.max(30, Math.round((frameCount * 1000) / (now - lastFpsTime))));
        frameCount = 0;
        lastFpsTime = now;
        onTelemetry?.({
          rotX: stateRef.current.rotX,
          rotY: stateRef.current.rotY,
          vel: Math.hypot(stateRef.current.velX, stateRef.current.velY),
          fps: currentFps,
          webglActive: Boolean(gl && program),
        });
      }

      const st = stateRef.current;
      if (!st.dragging) {
        st.rotX += st.velX;
        st.rotY += st.velY;
        st.velX = st.velX * 0.96 + 0.0042 * st.orbit * 0.04;
        st.velY = st.velY * 0.95 + (Math.sin(elapsed * 0.6) * 0.0008 - st.rotY * 0.01) * 0.05;
      }

      // 1. Render WebGL Liquid Gold & Chrome Sculpture
      if (gl && program) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uResolution, glCanvas.width, glCanvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uRotation, st.rotX, st.rotY);
        gl.uniform1f(uMorph, st.morph);
        gl.uniform1f(uHover, st.hover);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      // 2. Render 3D Orbital Light Rings, Sparkles & Pearls on high-DPI overlay canvas
      if (ctx2d) {
        const w = overlayCanvas.width;
        const h = overlayCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const scaleFactor = Math.min(w, h) / 560;

        ctx2d.clearRect(0, 0, w, h);

        // Draw 3D elliptical orbital rings with glowing light trails
        orbitalRings.forEach((ring, rIdx) => {
          const steps = 96;
          const pts: { x: number; y: number; z: number; scale: number; angle: number }[] = [];

          for (let i = 0; i <= steps; i++) {
            const a = (i / steps) * Math.PI * 2;
            const lx = Math.cos(a) * ring.rx;
            const ly = Math.sin(a) * ring.ry;

            // Tilt ring in 3D space
            const yTilt = ly * Math.cos(ring.tiltX);
            const zTilt = ly * Math.sin(ring.tiltX);

            const xRot = lx * Math.cos(ring.tiltZ) - yTilt * Math.sin(ring.tiltZ);
            const yRot = lx * Math.sin(ring.tiltZ) + yTilt * Math.cos(ring.tiltZ);

            const proj = project3D(xRot, yRot, zTilt, st.rotX * 0.65, st.rotY * 0.65, cx, cy, scaleFactor);
            pts.push({ ...proj, angle: a });
          }

          // Draw ring segments with depth-based opacity & shimmer pulse
          for (let i = 0; i < steps; i++) {
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const depthAlpha = p1.z < 0 ? 0.85 : 0.24;
            const pulse = Math.pow(
              0.5 + 0.5 * Math.sin(p1.angle * 2 - elapsed * ring.speed * 3.2 * st.orbit + rIdx),
              3
            );

            ctx2d.beginPath();
            ctx2d.moveTo(p1.x, p1.y);
            ctx2d.lineTo(p2.x, p2.y);

            const alpha = Math.min(1, (0.18 + pulse * 0.72) * depthAlpha);
            if (ring.color === "gold") {
              ctx2d.strokeStyle = `rgba(248, 220, 148, ${alpha})`;
            } else {
              ctx2d.strokeStyle = `rgba(220, 238, 255, ${alpha})`;
            }
            ctx2d.lineWidth = (1.1 + pulse * 2.2) * scaleFactor;
            ctx2d.stroke();
          }

          // Draw orbiting luminous golden/chrome pearls on each ring
          for (let p = 0; p < ring.pearls; p++) {
            const pAngle = elapsed * ring.speed * st.orbit + (p * Math.PI * 2) / ring.pearls;
            const lx = Math.cos(pAngle) * ring.rx;
            const ly = Math.sin(pAngle) * ring.ry;
            const yTilt = ly * Math.cos(ring.tiltX);
            const zTilt = ly * Math.sin(ring.tiltX);
            const xRot = lx * Math.cos(ring.tiltZ) - yTilt * Math.sin(ring.tiltZ);
            const yRot = lx * Math.sin(ring.tiltZ) + yTilt * Math.cos(ring.tiltZ);

            const proj = project3D(xRot, yRot, zTilt, st.rotX * 0.65, st.rotY * 0.65, cx, cy, scaleFactor);
            const rPearl = (p === 0 ? 5.2 : 3.2) * proj.scale;

            const grad = ctx2d.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, rPearl * 3.8);
            if (ring.color === "gold") {
              grad.addColorStop(0, "rgba(255, 250, 225, 1)");
              grad.addColorStop(0.35, "rgba(242, 202, 105, 0.85)");
              grad.addColorStop(1, "rgba(212, 175, 55, 0)");
            } else {
              grad.addColorStop(0, "rgba(255, 255, 255, 1)");
              grad.addColorStop(0.4, "rgba(185, 225, 255, 0.8)");
              grad.addColorStop(1, "rgba(185, 225, 255, 0)");
            }

            ctx2d.fillStyle = grad;
            ctx2d.beginPath();
            ctx2d.arc(proj.x, proj.y, rPearl * 3.8, 0, Math.PI * 2);
            ctx2d.fill();
          }
        });

        // Draw floating 3D metallic micro-spheres & sparkles
        floatingDust.forEach((d, idx) => {
          const theta = d.theta + elapsed * d.speed * st.orbit;
          const x = Math.cos(theta) * Math.cos(d.phi) * d.radius;
          const y = Math.sin(d.phi) * d.radius + Math.sin(elapsed * 1.2 + idx) * 8;
          const z = Math.sin(theta) * Math.cos(d.phi) * d.radius;

          const proj = project3D(x, y, z, st.rotX * 0.45, st.rotY * 0.45, cx, cy, scaleFactor);
          const twinkle = 0.45 + 0.55 * Math.sin(elapsed * 2.8 + idx * 1.7);
          const rad = d.size * proj.scale;

          ctx2d.save();
          if (d.isGold) {
            ctx2d.fillStyle = `rgba(245, 212, 128, ${twinkle * 0.88})`;
            ctx2d.shadowColor = "rgba(212, 175, 55, 0.8)";
          } else {
            ctx2d.fillStyle = `rgba(225, 240, 255, ${twinkle * 0.85})`;
            ctx2d.shadowColor = "rgba(180, 220, 255, 0.8)";
          }
          ctx2d.shadowBlur = 8 * scaleFactor;
          ctx2d.beginPath();
          ctx2d.arc(proj.x, proj.y, rad, 0, Math.PI * 2);
          ctx2d.fill();
          ctx2d.restore();
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvases);
    };
  }, [onTelemetry]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    stateRef.current.dragging = true;
    stateRef.current.lastX = e.clientX;
    stateRef.current.lastY = e.clientY;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = stateRef.current;
    if (!st.dragging) {
      // Subtle magnetic parallax while hovering
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      st.velX += nx * 0.0006;
      st.velY += ny * 0.0006;
      return;
    }

    const dx = e.clientX - st.lastX;
    const dy = e.clientY - st.lastY;
    st.lastX = e.clientX;
    st.lastY = e.clientY;

    st.rotX += dx * 0.011;
    st.rotY = Math.max(-1.35, Math.min(1.35, st.rotY + dy * 0.011));
    st.velX = dx * 0.0065;
    st.velY = dy * 0.0065;
  };

  const handlePointerUp = () => {
    stateRef.current.dragging = false;
    setIsDragging(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="application"
      aria-label="Interactive 3D Liquid Gold and Holographic Chrome Sculpture — Drag to Rotate"
      className={`relative flex aspect-square w-[320px] select-none items-center justify-center sm:w-[420px] md:w-[500px] lg:w-[540px] ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Ambient radial gold & chrome backlight */}
      <div className="pointer-events-none absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(218,178,78,0.24)_0%,rgba(140,180,255,0.08)_45%,transparent_72%)] blur-2xl" />

      {/* Core WebGL Raymarched Liquid Gold & Chrome Sculpture */}
      <canvas
        ref={glCanvasRef}
        className="pointer-events-none relative z-10 h-[74%] w-[74%] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)]"
      />

      {/* 3D Orbital Light Rings & Stardust Overlay */}
      <canvas
        ref={overlayCanvasRef}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      />
    </div>
  );
}

