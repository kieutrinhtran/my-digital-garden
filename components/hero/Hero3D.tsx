"use client";

import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Sparkles,
  Sphere,
  Torus,
} from "@react-three/drei";
import { motion } from "framer-motion";

export function Hero3D() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel relative mx-auto mb-6 h-72 w-full max-w-6xl overflow-hidden rounded-3xl border-white/25"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 via-transparent to-cyan-400/20" />

      <div className="relative z-10 flex h-full items-center justify-between gap-6 px-6 py-6 md:px-10">
        <div className="max-w-xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-100/70">
            My Digital Garden
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Khám phá hệ thống ghi chú
          </h1>
          <p className="text-sm text-indigo-100/80 md:text-base">
            Nơi tổng hợp kiến thức Data, Analytics và các case study thực chiến theo từng thư
            mục note.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/posts"
              className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/30"
            >
              Xem tất cả bài viết
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 w-[45%] min-w-[240px]">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.95} />
          <directionalLight position={[2, 3, 4]} intensity={1.2} />
          <pointLight position={[-2, -1, 2]} intensity={0.9} color="#67e8f9" />
          <Sparkles count={70} scale={4} size={1.6} speed={0.45} color="#c4b5fd" />

          <Float speed={1.1} rotationIntensity={0.9} floatIntensity={0.7}>
            <Sphere args={[0.88, 64, 64]}>
              <MeshDistortMaterial
                color="#8b7dff"
                distort={0.18}
                speed={1.2}
                roughness={0.18}
                metalness={0.52}
              />
            </Sphere>
            <Torus args={[1.22, 0.045, 16, 180]} rotation={[1.2, 0.3, 0]}>
              <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.28} />
            </Torus>
            <Torus args={[1.52, 0.03, 16, 180]} rotation={[0.2, 1.1, 0]}>
              <meshStandardMaterial color="#c4b5fd" emissive="#a78bfa" emissiveIntensity={0.24} />
            </Torus>
          </Float>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.85} />
        </Canvas>
      </div>
    </motion.div>
  );
}
