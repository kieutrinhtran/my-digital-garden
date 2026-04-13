"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";

export function Hero3D() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel mx-auto mb-6 h-56 w-full max-w-6xl overflow-hidden rounded-2xl"
    >
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1.2} />
        <Float speed={1.6} rotationIntensity={1.1} floatIntensity={0.7}>
          <Icosahedron args={[1.1, 8]}>
            <MeshDistortMaterial
              color="#8a7bff"
              distort={0.34}
              speed={1.7}
              roughness={0.15}
              metalness={0.6}
            />
          </Icosahedron>
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </motion.div>
  );
}
