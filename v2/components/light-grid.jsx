import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../lib/hooks.js';

/* A grid of light, far out of focus.

   The page is the subject, the grid is the set behind it, rendered the way
   a lens renders what lies well past the focal plane: no edge survives,
   each line becomes a wide gaussian of light with a softer halo around it,
   and where two lines cross their light adds up. A half-blurred line reads
   as a low-quality image; a fully blurred one reads as depth. The whole
   thing stays dim so the copy keeps its contrast. Light is what reveals
   it: where the light falls, the lines brighten and pick up its tint.

   The grid drifts with the scroll (parallax) so it reads as a plane behind
   the page. What lights it:
   - one light per section, fixed on that plane, so it travels with the
     grid and never slides across the screen against the scroll. Each sits
     where it should appear while its section is centred on screen, and
     fades with the distance to that moment, so the tints hand over from
     one section to the next as you scroll;
   - the scroll itself: moving fast opens the lights up a little, and the
     intro's exit gives them one full pulse as it opens onto the site;
   - the pointer, softly, on fine pointers. */

/* One buffer pixel per CSS pixel: the blur needs no more, and any less
   shows once the browser upscales it. */
const RENDER_SCALE = 1;

const VIOLET = [0.545, 0.482, 1.0];
const BLUE   = [0.47, 0.67, 1.0];
const SIGNAL = [0.36, 0.94, 0.64];
const PALE   = [0.8, 0.84, 1.0];

const PARALLAX = 0.3; // grid moves at this fraction of the scroll
const MAX_LIGHTS = 8;

/* Where each section's light appears while that section is centred on
   screen, in viewport fractions. */
const SPOTS = {
  hero:         { x: 0.3,  y: -0.05, c: VIOLET, k: 0.9 },
  about:        { x: 0.14, y: 0.42, c: BLUE,   k: 0.85 },
  work:         { x: 0.86, y: 0.32, c: VIOLET, k: 0.9 },
  approach:     { x: 0.5,  y: 0.7,  c: SIGNAL, k: 0.6 },
  stack:        { x: 0.18, y: 0.28, c: BLUE,   k: 0.8 },
  services:     { x: 0.82, y: 0.58, c: VIOLET, k: 0.85 },
  testimonials: { x: 0.5,  y: 0.36, c: PALE,   k: 0.7 },
  contact:      { x: 0.5,  y: 0.95, c: SIGNAL, k: 0.75 },
};

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  uCss;       // viewport, CSS px
uniform vec2  uRes;       // drawing buffer, px
uniform float uScroll;    // CSS px
uniform float uEnergy;    // 0..1, smoothed scroll speed
uniform vec4  uLight[${MAX_LIGHTS}];    // x (CSS px), y on the grid plane (CSS px), strength
uniform vec3  uLightCol[${MAX_LIGHTS}];
uniform int   uLightCount;
uniform vec2  uPointer;   // CSS px
uniform float uPointerOn;

out vec4 outColor;

const float CELL     = 375.0; // grid pitch: large cells, the grid reads as architecture
const float PARALLAX = ${PARALLAX.toFixed(2)};
const float DEFOCUS  = 9.0;   // blur of the lines, CSS px
const float HALO     = 30.0;  // the wider, fainter spread around them

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uRes * uCss;

  /* Light: the section lights, riding the grid plane and opened up a
     little by scroll speed, and a tighter one under the pointer. */
  float spread = 5.0 - uEnergy * 1.6;
  float plane = uScroll * PARALLAX;
  vec3 L = vec3(0.0);
  for (int i = 0; i < ${MAX_LIGHTS}; i++) {
    if (i >= uLightCount) break;
    vec2 d = (p - vec2(uLight[i].x, uLight[i].y - plane)) / uCss.y;
    L += uLightCol[i] * uLight[i].z * exp(-dot(d, d) * spread);
  }
  vec2 pd = (p - uPointer) / uCss.y;
  L += vec3(0.75, 0.74, 1.0) * exp(-dot(pd, pd) * 18.0) * uPointerOn * 0.45;
  float lum = max(L.r, max(L.g, L.b));

  /* Distance to the nearest line on each axis, CSS px. */
  vec2 g = p + vec2(0.0, plane);
  vec2 f = abs(fract(g / CELL - 0.5) - 0.5) * CELL;

  /* A blurred line is a gaussian; two crossing lines add their light. */
  vec2 core2 = exp(-f * f / (2.0 * DEFOCUS * DEFOCUS));
  vec2 halo2 = exp(-f * f / (2.0 * HALO * HALO));
  float lines = (core2.x + core2.y) * 0.7 + (halo2.x + halo2.y) * 0.3;

  vec3 tint = mix(vec3(1.0), L / max(lum, 1e-3), 0.6);
  vec3 col = tint * lines * (0.012 + lum * 0.11);

  /* Dither so the soft gradients don't band. */
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;

  outColor = vec4(max(col, 0.0), 1.0);
}`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function LightGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return; // no WebGL2: the glows alone make the ground

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    /* One triangle that covers the screen. */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ['uCss', 'uRes', 'uScroll', 'uEnergy', 'uLight', 'uLightCol', 'uLightCount', 'uPointer', 'uPointerOn']
      .forEach(n => { U[n] = gl.getUniformLocation(prog, n); });

    const still = prefersReducedMotion();
    const fine = isFinePointer();
    let w = 0, h = 0;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      const scale = RENDER_SCALE;
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    /* Pin each section's light on the grid plane. At the scroll where the
       section is centred (clamped to what the page can actually reach),
       the plane has moved by that scroll × PARALLAX, so adding it back
       puts the light at its viewport position right then. */
    const lights = new Float32Array(MAX_LIGHTS * 4);
    const colors = new Float32Array(MAX_LIGHTS * 3);
    const peaks = [];   // per light: scroll where it is fullest, reach, strength
    let count = 0;
    const layout = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - h);
      count = 0;
      document.querySelectorAll('main > section[id]').forEach((el) => {
        const spot = SPOTS[el.id];
        if (!spot || count >= MAX_LIGHTS) return;
        const r = el.getBoundingClientRect();
        const centre = r.top + window.scrollY + r.height / 2;
        const at = Math.min(maxScroll, Math.max(0, centre - h / 2));
        lights.set([spot.x * w, spot.y * h + at * PARALLAX, spot.k, 0], count * 4);
        colors.set(spot.c, count * 3);
        peaks[count] = { at, reach: Math.max(h, r.height) * 0.75, k: spot.k };
        count++;
      });
    };

    resize();
    layout();

    let energy = 0, lastY = window.scrollY, lastT = performance.now();
    let ptr = { x: w * 0.5, y: h * 0.5, tx: w * 0.5, ty: h * 0.5, on: 0, ton: 0 };

    const draw = (now) => {
      const dt = Math.min(0.05, (now - lastT) / 1000) || 0.016;
      lastT = now;
      const y = window.scrollY;

      if (!still) {
        /* Frame-rate independent easing. */
        const speed = Math.abs(y - lastY) / dt;
        const want = Math.min(1, speed / 2600);
        energy += (want - energy) * (1 - Math.exp(-dt * (want > energy ? 8 : 1.4)));

        const pe = 1 - Math.exp(-dt * 5);
        ptr.x += (ptr.tx - ptr.x) * pe;
        ptr.y += (ptr.ty - ptr.y) * pe;
        ptr.on += (ptr.ton - ptr.on) * (1 - Math.exp(-dt * 3));
      }
      lastY = y;

      gl.uniform2f(U.uCss, w, h);
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uScroll, y);
      gl.uniform1f(U.uEnergy, energy);
      for (let i = 0; i < count; i++) {
        const { at, reach, k } = peaks[i];
        const t = (y - at) / reach;
        lights[i * 4 + 2] = k * Math.exp(-t * t);
      }
      gl.uniform4fv(U.uLight, lights);
      gl.uniform3fv(U.uLightCol, colors);
      gl.uniform1i(U.uLightCount, count);
      gl.uniform2f(U.uPointer, ptr.x, ptr.y);
      gl.uniform1f(U.uPointerOn, ptr.on);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    const loop = (now) => { draw(now); raf = requestAnimationFrame(loop); };
    const once = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };

    const onResize = () => { resize(); layout(); if (still) once(); };
    /* Sections change height after load (images, language switch). */
    const ro = new ResizeObserver(() => { layout(); if (still) once(); });
    ro.observe(document.body);
    const onMove = (e) => { ptr.tx = e.clientX; ptr.ty = e.clientY; ptr.ton = 1; };
    const onLeave = () => { ptr.ton = 0; };
    const onIntroExit = () => { energy = 1; };
    const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(raf); canvas.classList.remove('on'); };

    window.addEventListener('resize', onResize);
    window.addEventListener('hk:intro-exit', onIntroExit);
    canvas.addEventListener('webglcontextlost', onLost);
    if (still) {
      window.addEventListener('scroll', once, { passive: true });
      once();
    } else {
      if (fine) {
        window.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
      }
      raf = requestAnimationFrame(loop);
    }
    canvas.classList.add('on');

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('hk:intro-exit', onIntroExit);
      window.removeEventListener('scroll', once);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-grid" />;
}
