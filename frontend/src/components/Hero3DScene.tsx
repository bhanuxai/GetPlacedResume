import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Document Sheet in 3D
const DocumentLayer: React.FC<{ position: [number, number, number]; rotation?: [number, number, number]; color: string; wireframe?: boolean }> = ({
  position,
  rotation = [0, 0, 0],
  color,
  wireframe = false
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * 1.2 + position[0]) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={[2.4, 3.4, 0.04]} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
};

// Analytical Data Nodes & Vectors
const DataGraph: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Structured nodes
  const nodes = useMemo(() => [
    { pos: new THREE.Vector3(-1.8, 1.2, 0.8), label: "Skills", color: "#2563EB" },
    { pos: new THREE.Vector3(1.8, 1.4, 0.6), label: "Relevance", color: isDark ? "#10B981" : "#059669" },
    { pos: new THREE.Vector3(1.6, -1.2, 0.9), label: "Experience", color: "#2563EB" },
    { pos: new THREE.Vector3(-1.7, -1.0, 0.7), label: "ATS Parse", color: "#3B82F6" },
    { pos: new THREE.Vector3(0, 2.0, 0.4), label: "Summary", color: isDark ? "#94A3B8" : "#64748B" },
    { pos: new THREE.Vector3(0, -2.1, 0.5), label: "Education", color: "#2563EB" },
  ], [isDark]);

  // Relationship lines between nodes and document center
  const linesGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const center = new THREE.Vector3(0, 0, 0.1);
    nodes.forEach(n => {
      points.push(center);
      points.push(n.pos);
    });
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.12 + (state.mouse.x * 0.2);
      groupRef.current.rotation.x = -Math.cos(t * 0.3) * 0.08 + (-state.mouse.y * 0.15);
    }
  });

  const backDocColor = isDark ? "#0A0A0A" : "#E2E8F0";
  const mainDocColor = isDark ? "#141414" : "#FFFFFF";
  const wireDocColor = isDark ? "#262626" : "#94A3B8";

  return (
    <group ref={groupRef}>
      {/* Central Document Layer Structure */}
      <DocumentLayer position={[-0.15, -0.1, -0.15]} rotation={[0.05, -0.12, -0.04]} color={backDocColor} />
      <DocumentLayer position={[0, 0, 0]} rotation={[0, 0, 0]} color={mainDocColor} />
      <DocumentLayer position={[0.15, 0.1, 0.15]} rotation={[-0.04, 0.08, 0.02]} color={wireDocColor} wireframe={true} />

      {/* Connection Lines */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#2563EB" opacity={isDark ? 0.6 : 0.45} transparent={true} />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((n, i) => (
        <group key={i} position={[n.pos.x, n.pos.y, n.pos.z]}>
          <mesh>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color={n.color} roughness={0.2} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const Hero3DScene: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className="w-full h-[400px] md:h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lights */}
        <ambientLight intensity={isDark ? 0.8 : 1.1} />
        <directionalLight position={[6, 8, 5]} intensity={isDark ? 1.5 : 1.8} color="#FFFFFF" />
        <directionalLight position={[-6, -4, -2]} intensity={0.4} color="#3B82F6" />
        
        <React.Suspense fallback={null}>
          <DataGraph isDark={isDark} />
        </React.Suspense>
      </Canvas>
    </div>
  );
};
