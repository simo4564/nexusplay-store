"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// The Player Spaceship
function Player({ position, onCollision }: { position: [number, number, number], onCollision: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const targetX = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") targetX.current = Math.max(targetX.current - 2, -4);
      if (e.key === "ArrowRight" || e.key === "d") targetX.current = Math.min(targetX.current + 2, 4);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useFrame((state, delta) => {
    // Smooth movement
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX.current, 0.1);
    
    // Rotation based on movement
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -targetX.current * 0.1, 0.1);
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} castShadow>
        <tetrahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} emissive="#d4af37" emissiveIntensity={0.2} />
      </mesh>
    </Float>
  );
}

// Falling Obstacles
function Obstacles({ speed, onGameOver }: { speed: number, onGameOver: () => void }) {
  const groupRef = useRef<THREE.Group>(null!);
  const [obstacles, setObstacles] = useState<{ id: number, x: number, z: number }[]>([]);
  
  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      setObstacles(prev => [...prev, {
        id: id++,
        x: (Math.random() - 0.5) * 10,
        z: -20
      }]);
    }, Math.max(1000 - speed * 50, 200)); // Gets faster
    return () => clearInterval(interval);
  }, [speed]);

  useFrame((state, delta) => {
    // Move obstacles towards player
    const playerX = state.scene.children.find(c => c.type === 'Mesh' || c.children.length > 0)?.children[0]?.position.x || 0; // Simple collision check

    groupRef.current.children.forEach((child) => {
      child.position.z += speed * delta;
      child.rotation.x += delta;
      child.rotation.y += delta;

      // Collision detection (Player is at z=0)
      if (child.position.z > -0.5 && child.position.z < 0.5) {
        if (Math.abs(child.position.x - playerX) < 1) {
          onGameOver();
        }
      }
      
      // Remove obstacles that passed
      if (child.position.z > 5) {
        child.visible = false;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {obstacles.map(obs => (
        <mesh key={obs.id} position={[obs.x, 0, obs.z]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} emissive="#ff3333" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function MiniGameClient() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(10);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isGameOver) {
      interval = setInterval(() => {
        setScore(s => s + 10);
        setSpeed(s => Math.min(s + 0.1, 40));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver]);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setSpeed(10);
  };

  const gameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
  };

  return (
    <div style={{ width: "100%", height: "calc(100vh - 80px)", position: "relative", backgroundColor: "#0a0a0a" }}>
      
      {/* UI Overlay */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, color: "white", fontFamily: "monospace", fontSize: "24px" }}>
        SCORE: {score}
      </div>

      {!isPlaying && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.7)", zIndex: 20
        }}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: "center", background: "#111", padding: "3rem", borderRadius: "16px", border: "1px solid var(--gold)" }}
          >
            <h1 style={{ color: "var(--gold)", fontSize: "3rem", marginBottom: "1rem" }}>NEXUS RUN</h1>
            <p style={{ color: "#aaa", marginBottom: "2rem" }}>Use Left/Right Arrows or A/D to dodge the red cubes.</p>
            {isGameOver && <h2 style={{ color: "#ff3333", marginBottom: "1rem" }}>GAME OVER! Score: {score}</h2>}
            <button className="btn btn-primary interactive" onClick={startGame} style={{ fontSize: "1.2rem", padding: "1rem 3rem" }}>
              {isGameOver ? "Try Again" : "Start Game"}
            </button>
          </motion.div>
        </div>
      )}

      {/* 3D Scene */}
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 60 }}>
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 10, 30]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />

        {isPlaying && (
          <>
            <Player position={[0, 0, 0]} onCollision={gameOver} />
            <Obstacles speed={speed} onGameOver={gameOver} />
          </>
        )}

        {/* The Grid Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </mesh>
        <gridHelper args={[100, 100, "#d4af37", "#222"]} position={[0, -0.99, 0]} />
      </Canvas>
    </div>
  );
}
