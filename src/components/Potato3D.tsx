"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function PotatoModel() {
  const { scene } = useGLTF("/potato-draco.glb");
  return (
    <primitive
      object={scene}
      scale={3.2}
      position={[0, -0.5, 0]}
      rotation={[0.1, 0.5, 0]}
    />
  );
}

export default function Potato3D() {
  return (
    <div className="potato-3d-container" style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, -3, 2]} intensity={0.3} />
        <Suspense fallback={null}>
          <PotatoModel />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/potato-draco.glb");
