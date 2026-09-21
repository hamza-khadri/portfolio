import { forwardRef, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { isFinePointer, prefersReducedMotion } from '../lib/hooks.js';

/* The photo is rebuilt from a dense field of its own pixels. At rest they
   travel along a DNA-like double helix through the middle of the subject:
   two thick strands half a turn apart, spinning around an axis that points
   east-north-east, flowing along it. Around the pointer they leave the helix
   along a curved arc and form that part of the photo, then rejoin it once the
   pointer moves on. Touch screens have no hover, so there the formed zone
   stays on the face. Disabled on reduced-motion: that gets the plain photo. */

const GAP = 3; // CSS px between particles once formed — dense enough to read as a photo
const POINT_SIZE = 3.4; // once formed — matches GAP so the photo stays sharp
const POINT_SIZE_SCATTERED = 5.0; // larger in the helix, where visibility matters more than detail
const HELIX_ANGLE = 30; // degrees above the horizontal, pointing right: the flow heads east-north-east
const HELIX_RADIUS = 0.24; // fraction of the box's shorter side
const HELIX_TURNS = 1.0; // full turns over the axis's span across the box
const HELIX_SPIN = 0.6; // rad/s around the axis
const STRAND_THICKNESS = 0.07; // fraction of the box's shorter side
const FLOW_SPEED = 0.03; // share of a strand travelled per second
const ARC_BEND = 0.3; // how far the path to the photo bows sideways, per unit of distance
const ALPHA_SCATTERED = 0.6;
const ALPHA_BACK = 0.45; // multiplier for the far side of the helix, so it reads in depth
const ALPHA_FORMED = 1.0;
const COLOR_BOOST = 0.25; // only while scattered, so formed pixels keep the photo's true tones
const HOVER_RADIUS = 500; // px, in the portrait's own box space
/* Touch only: the formed zone stays on the face, whose centre is given as a
   fraction of the source photo so it holds whatever the crop. */
const FACE_FOCUS = { u: 0.5, v: 0.35 };
const FOCUS_RADIUS_MOBILE = 260; // px, in the portrait's own box space
const FORM_EASE_MIN = 0.06; // per-frame easing, randomised per particle so they arrive in a cascade
const FORM_EASE_MAX = 0.16;
const RADIUS_EASE = 0.14;
const MOUSE_EASE = 0.3;
const RESIZE_DEBOUNCE = 160;

const VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSeed;
  attribute float aGroup; // 0 or 1: which strand
  attribute float aLane;  // -1..1: offset across the strand's thickness
  attribute float aForm;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uBox;
  uniform vec2 uCenter; // centre of the subject, in box px
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float f = aForm * aForm * (3.0 - 2.0 * aForm);
    float unit = min(uBox.x, uBox.y);
    bool first = aGroup < 0.5;

    /* The axis runs through the subject's centre; y grows downward on screen,
       so "up and to the right" has a negative y. Its span is the box's extent
       along that direction, so the helix always crosses the whole portrait. */
    float a = radians(${HELIX_ANGLE.toFixed(1)});
    vec2 dir = vec2(cos(a), -sin(a));
    vec2 normal = vec2(-dir.y, dir.x);
    float span = abs(dir.x) * uBox.x + abs(dir.y) * uBox.y;

    /* Progress along the axis, running past both edges so wraps happen
       off-screen, at a slightly per-particle speed. */
    float speed = ${FLOW_SPEED.toFixed(4)} * (0.8 + fract(aSeed * 7.13) * 0.4);
    float h = mix(-0.65, 0.65, fract(aSeed + uTime * speed));

    /* Strand 0 sits at angle theta, strand 1 half a turn behind it; both the
       sideways offset and the depth come from that angle. */
    float theta = h * 6.2831 * ${HELIX_TURNS.toFixed(2)} + uTime * ${HELIX_SPIN.toFixed(2)};
    float s = first ? 1.0 : -1.0;
    float across = sin(theta) * s;
    float z = cos(theta) * s;
    float flutter = sin(uTime * (1.5 + aSeed * 2.0) + aSeed * 40.0) * 0.006;
    float along = (fract(aSeed * 13.7) - 0.5) * ${STRAND_THICKNESS.toFixed(3)} * unit;
    vec2 helix = uCenter
      + dir * (h * span + along)
      + normal * (across * ${HELIX_RADIUS.toFixed(3)} + aLane * ${STRAND_THICKNESS.toFixed(3)} + flutter) * unit;

    /* Leaving or rejoining the helix, bow the path sideways (each strand to
       its own side) so the motion reads as a trajectory, not a straight hop. */
    vec2 home = position.xy;
    vec2 d = home - helix;
    vec2 bend = vec2(-d.y, d.x) * ${ARC_BEND.toFixed(2)} * s;
    vec2 p = mix(helix, home, f) + bend * sin(3.14159 * f);

    float front = mix(${ALPHA_BACK.toFixed(2)}, 1.0, z * 0.5 + 0.5);
    vColor = min(aColor + ${COLOR_BOOST.toFixed(2)} * (1.0 - f), vec3(1.0));
    vAlpha = mix(${ALPHA_SCATTERED.toFixed(2)} * front, ${ALPHA_FORMED.toFixed(2)}, f);

    gl_PointSize = mix(${POINT_SIZE_SCATTERED.toFixed(2)}, uSize, f) * uPixelRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uOpacity;

  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.2, d);
    gl_FragColor = vec4(vColor, edge * vAlpha * uOpacity);
  }
`;

/* Standard object-fit: cover crop rect, so the particles line up with what
   the <img> would show (including the object-position swap at the mobile breakpoint). */
function coverRect(iw, ih, bw, bh, px, py) {
  const s = Math.max(bw / iw, bh / ih);
  const sw = bw / s, sh = bh / s;
  const maxX = Math.max(0, iw - sw), maxY = Math.max(0, ih - sh);
  return { srcX: maxX * px, srcY: maxY * py, srcW: sw, srcH: sh };
}

function readObjectPosition(el) {
  const raw = getComputedStyle(el).objectPosition || '50% 50%';
  const [xRaw, yRaw] = raw.split(' ');
  const parse = (v) => (v && v.endsWith('%') ? parseFloat(v) / 100 : 0.5);
  return [parse(xRaw), parse(yRaw)];
}

const ParticlePortrait = forwardRef(function ParticlePortrait({ src }, forwardedRef) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const active = !prefersReducedMotion();

  useEffect(() => {
    if (!active) return;
    const frame = frameRef.current, canvas = canvasRef.current, img = imgRef.current;
    if (!frame || !canvas || !img) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    } catch (_) {
      return; // no WebGL — the plain photo stays visible
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -1000, 1000);
    camera.position.z = 10;

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: POINT_SIZE },
        uPixelRatio: { value: 1 },
        uBox: { value: new THREE.Vector2(1, 1) },
        uCenter: { value: new THREE.Vector2(0, 0) },
        uOpacity: { value: 0 },
      },
    });
    scene.add(new THREE.Points(geometry, material));

    let disposed = false;
    let raf = 0;
    let resizeTimer = 0;
    let pointerInside = false;
    let radius = 0;
    const touch = !isFinePointer();
    const mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };

    let count = 0;
    let homes = new Float32Array(0);
    let rates = new Float32Array(0);
    let formAttr = null;

    function resample() {
      if (!img.naturalWidth) return;
      const box = frame.getBoundingClientRect();
      const boxW = Math.max(1, Math.round(box.width));
      const boxH = Math.max(1, Math.round(box.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(boxW, boxH, false);
      material.uniforms.uPixelRatio.value = dpr;
      material.uniforms.uBox.value.set(boxW, boxH);

      camera.left = 0; camera.right = boxW; camera.top = 0; camera.bottom = boxH;
      camera.updateProjectionMatrix();

      const [px, py] = readObjectPosition(img);
      const { srcX, srcY, srcW, srcH } = coverRect(img.naturalWidth, img.naturalHeight, boxW, boxH, px, py);

      if (touch) {
        mouse.x = mouse.targetX = ((FACE_FOCUS.u * img.naturalWidth - srcX) / srcW) * boxW;
        mouse.y = mouse.targetY = ((FACE_FOCUS.v * img.naturalHeight - srcY) / srcH) * boxH;      }

      /* One sample pixel per particle: the offscreen canvas is the particle grid. */
      const sw = Math.max(1, Math.round(boxW / GAP));
      const sh = Math.max(1, Math.round(boxH / GAP));
      const off = document.createElement('canvas');
      off.width = sw; off.height = sh;
      const ctx = off.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, sw, sh);
      const { data } = ctx.getImageData(0, 0, sw, sh);

      const max = sw * sh;
      const pos = new Float32Array(max * 3);
      const col = new Float32Array(max * 3);
      const seed = new Float32Array(max);
      const group = new Float32Array(max);
      const lane = new Float32Array(max);
      const rate = new Float32Array(max);
      let n = 0;
      /* Brightness-weighted centre: the screen blend drops the dark backdrop,
         so bright pixels are the subject, and the helix runs through its middle. */
      let weightSum = 0, weightedX = 0, weightedY = 0;

      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          /* Near-black pixels vanish under the screen blend anyway — skip most of them. */
          if (lum < 0.04 && Math.random() > 0.08) continue;

          pos[n * 3] = (x + 0.5) * (boxW / sw); pos[n * 3 + 1] = (y + 0.5) * (boxH / sh);
          col[n * 3] = r / 255; col[n * 3 + 1] = g / 255; col[n * 3 + 2] = b / 255;
          weightSum += lum * lum;
          weightedX += pos[n * 3] * lum * lum;
          weightedY += pos[n * 3 + 1] * lum * lum;
          seed[n] = Math.random();
          /* Random split, so each strand carries pixels from the whole photo. */
          group[n] = Math.random() < 0.5 ? 0 : 1;
          /* Triangular spread: dense core, soft edges. */
          lane[n] = Math.random() + Math.random() - 1;
          rate[n] = FORM_EASE_MIN + Math.random() * (FORM_EASE_MAX - FORM_EASE_MIN);
          n++;
        }
      }

      if (weightSum > 0) material.uniforms.uCenter.value.set(weightedX / weightSum, weightedY / weightSum);
      else material.uniforms.uCenter.value.set(boxW / 2, boxH / 2);

      count = n;
      homes = pos.subarray(0, n * 3);
      rates = rate.subarray(0, n);
      formAttr = new THREE.BufferAttribute(new Float32Array(n), 1);
      formAttr.setUsage(THREE.DynamicDrawUsage);

      geometry.setAttribute('position', new THREE.BufferAttribute(homes, 3));
      geometry.setAttribute('aColor', new THREE.BufferAttribute(col.subarray(0, n * 3), 3));
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed.subarray(0, n), 1));
      geometry.setAttribute('aGroup', new THREE.BufferAttribute(group.subarray(0, n), 1));
      geometry.setAttribute('aLane', new THREE.BufferAttribute(lane.subarray(0, n), 1));
      geometry.setAttribute('aForm', formAttr);
      geometry.computeBoundingSphere();

      material.uniforms.uOpacity.value = 1;
      img.classList.add('is-particles');
    }

    /* Each particle eases toward "formed" when its home is under the pointer's
       circle and back to "scattered" otherwise, at its own speed. Done on the
       CPU so it keeps momentum over time instead of snapping with the circle. */
    function stepForm() {
      if (!formAttr) return;
      const form = formAttr.array;
      const r = radius, inner = r * 0.6;
      const mx = mouse.x, my = mouse.y;
      let moving = false;
      for (let i = 0; i < count; i++) {
        let target = 0;
        if (r > 1) {
          const dx = homes[i * 3] - mx, dy = homes[i * 3 + 1] - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < r) target = d <= inner ? 1 : 1 - (d - inner) / (r - inner);
        }
        const cur = form[i];
        const delta = target - cur;
        if (delta > 0.001 || delta < -0.001) {
          form[i] = cur + delta * rates[i];
          moving = true;
        } else if (cur !== target) {
          form[i] = target;
          moving = true;
        }
      }
      if (moving) formAttr.needsUpdate = true;
    }

    const clock = new THREE.Clock();
    function loop() {
      raf = requestAnimationFrame(loop);
      radius += ((touch ? FOCUS_RADIUS_MOBILE : pointerInside ? HOVER_RADIUS : 0) - radius) * RADIUS_EASE;
      mouse.x += (mouse.targetX - mouse.x) * MOUSE_EASE;
      mouse.y += (mouse.targetY - mouse.y) * MOUSE_EASE;
      stepForm();
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }

    /* Tracked on the document, like the cursor and glass effects: the portrait
       stays pointer-events:none so it never blocks the page. */
    function onMove(e) {
      const r = frame.getBoundingClientRect();
      pointerInside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (pointerInside) {
        mouse.targetX = e.clientX - r.left;
        mouse.targetY = e.clientY - r.top;
        if (radius < 1) { mouse.x = mouse.targetX; mouse.y = mouse.targetY; }
      }
    }
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resample, RESIZE_DEBOUNCE);
    }

    const start = () => { if (!disposed) { resample(); loop(); } };
    if (img.complete && img.naturalWidth) start();
    else img.addEventListener('load', start, { once: true });

    if (!touch) document.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      img.removeEventListener('load', start);
      img.classList.remove('is-particles');
      document.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [active, src]);

  return (
    <div
      className="portrait-frame"
      ref={(node) => {
        frameRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
    >
      <img ref={imgRef} className="portrait-img" src={src} alt="" fetchpriority="high" />
      {active && <canvas ref={canvasRef} className="portrait-img" />}
    </div>
  );
});

export default ParticlePortrait;
