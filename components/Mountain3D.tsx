'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Low-poly, golden-hour-lit mountain that crowns the trail. It slowly
 * auto-rotates; on desktop you can grab and spin it. On touch it does NOT
 * capture the gesture (touchAction: pan-y), so the page keeps scrolling.
 * Rendering pauses when off-screen, and stops entirely under reduced motion.
 */
function MountainMesh() {
  const geometry = useMemo(() => {
    const g = new THREE.ConeGeometry(1.75, 2.5, 9, 5);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();
    const apexY = 1.25;
    const baseY = -1.25;

    // Carve ridges & valleys around the slopes for a natural, eroded silhouette,
    // plus fine per-vertex faceting. Apex and base stay calm so it reads solid.
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const t = (v.y - baseY) / (apexY - baseY); // 0 base → 1 apex
      const r1 = Math.sin(i * 12.9898) * 43758.5453;
      const r2 = Math.sin(i * 78.233) * 12543.123;
      const n1 = r1 - Math.floor(r1) - 0.5;
      const n2 = r2 - Math.floor(r2) - 0.5;
      if (t < 0.985) {
        const angle = Math.atan2(v.z, v.x);
        const ridge =
          1 +
          0.17 * Math.sin(angle * 3 + 0.7) +
          0.1 * Math.sin(angle * 6 - 1.3) +
          0.06 * Math.sin(angle * 11 + 2.1);
        const mid = Math.sin(Math.PI * t); // 0 at ends → 1 mid-slope
        const scale = 1 + (ridge - 1) * (0.45 + 0.55 * mid);
        v.x *= scale;
        v.z *= scale;
        v.x += n1 * 0.12 * mid;
        v.z += n2 * 0.12 * mid;
        v.y += n1 * 0.09;
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();

    // Vertex colours: snow-lit cap blending down into teal rock.
    const snow = new THREE.Color('#FBF3E0');
    const rock = new THREE.Color('#27505b');
    const colors: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) - baseY) / (apexY - baseY);
      const c = rock.clone().lerp(snow, Math.max(0, (t - 0.5) / 0.5));
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);

  return (
    <mesh geometry={geometry} position={[0, -0.15, 0]}>
      <meshStandardMaterial vertexColors flatShading roughness={0.94} metalness={0} />
    </mesh>
  );
}

export default function Mountain3D({ reduce }: { reduce: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0.5, 6.2], fov: 36 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', touchAction: 'pan-y' }}
        frameloop={!reduce && visible ? 'always' : 'demand'}
      >
        <ambientLight intensity={0.7} color="#3a6470" />
        {/* warm sky / cool ground gradient so shaded facets never go black */}
        <hemisphereLight args={['#FFD9A0', '#23474f', 0.8]} />
        {/* the "sun" — warm golden-hour key light */}
        <directionalLight position={[3.5, 3, 2.5]} intensity={2.3} color="#FFC066" />
        {/* cool teal rim/fill from the shaded side */}
        <directionalLight position={[-3, 1, -1.5]} intensity={1} color="#5f9bb0" />
        <MountainMesh />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={desktop}
          autoRotate={!reduce}
          autoRotateSpeed={0.9}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.02}
        />
      </Canvas>
    </div>
  );
}
