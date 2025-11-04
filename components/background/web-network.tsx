"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Line2, LineMaterial } from "three-stdlib";

type WebNetworkProps = {
  className?: string;
};

const NODE_COUNT = 42;
const CONNECTIONS = 64;

export function WebNetworkBackground({ className }: WebNetworkProps) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        className="[&>*]:pointer-events-none"
        camera={{ position: [0, 0, 14], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} color={0x8899ff} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.6}
          color={0xff2255}
        />
        <WebNetwork />
      </Canvas>
    </div>
  );
}

function WebNetwork() {
  const nodes = useMemo(() => generateNodes(NODE_COUNT), []);
  const lines = useMemo(() => generateConnections(nodes, CONNECTIONS), [nodes]);
  const pointsPositions = useMemo(() => {
    const array = new Float32Array(nodes.length * 3);
    nodes.forEach((node, index) => {
      array[index * 3] = node.position[0];
      array[index * 3 + 1] = node.position[1];
      array[index * 3 + 2] = node.position[2];
    });
    return array;
  }, [nodes]);

  return (
    <group>
      {lines.map((line, index) => (
        <AnimatedLine key={`web-line-${index}`} {...line} />
      ))}
      <Points positions={pointsPositions} stride={3}>
        <PointMaterial
          transparent
          color="#e50950"
          size={0.18}
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
        />
      </Points>
    </group>
  );
}

type Node = {
  position: [number, number, number];
};

type AnimatedLineProps = {
  start: [number, number, number];
  end: [number, number, number];
  curvature: number;
  pulseSpeed: number;
};

function AnimatedLine({
  start,
  end,
  curvature,
  pulseSpeed,
}: AnimatedLineProps) {
  const points = useMemo(
    () => createBezierPoints(start, end, curvature),
    [start, end, curvature]
  );
  const lineRef = useRef<Line2 | null>(null);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const material = lineRef.current.material as LineMaterial;
    material.transparent = true;
    material.opacity =
      0.15 +
      0.2 * Math.sin(clock.getElapsedTime() * pulseSpeed + curvature * 10);
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#7f5af0"
      linewidth={1.5}
      opacity={0.3}
    />
  );
}

function generateNodes(count: number): Node[] {
  return Array.from({ length: count }, () => {
    const radius = THREE.MathUtils.mapLinear(Math.random(), 0, 1, 2.2, 4.5);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    return {
      position: [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi) * (Math.random() > 0.5 ? 1 : -1) * 0.6,
      ],
    };
  });
}

function generateConnections(nodes: Node[], maxLines: number) {
  const lines: Array<
    Pick<AnimatedLineProps, "start" | "end" | "curvature" | "pulseSpeed">
  > = [];
  for (let i = 0; i < maxLines; i += 1) {
    const startIndex = Math.floor(Math.random() * nodes.length);
    let endIndex = Math.floor(Math.random() * nodes.length);
    if (endIndex === startIndex) {
      endIndex = (endIndex + 1) % nodes.length;
    }
    const start = nodes[startIndex].position;
    const end = nodes[endIndex].position;
    const curvature = THREE.MathUtils.randFloat(0.15, 0.35);
    const pulseSpeed = THREE.MathUtils.randFloat(0.65, 1.4);
    lines.push({ start, end, curvature, pulseSpeed });
  }
  return lines;
}

function createBezierPoints(
  start: [number, number, number],
  end: [number, number, number],
  curvature: number
) {
  const midPoint = new THREE.Vector3()
    .addVectors(new THREE.Vector3(...start), new THREE.Vector3(...end))
    .multiplyScalar(0.5);
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const normal = new THREE.Vector3()
    .subVectors(endVector, startVector)
    .normalize();
  const perpendicular = new THREE.Vector3(
    normal.y,
    -normal.x,
    normal.z * 0.35
  ).normalize();
  const control = midPoint
    .clone()
    .addScaledVector(perpendicular, curvature * Math.min(midPoint.length(), 4));

  const curve = new THREE.QuadraticBezierCurve3(
    startVector,
    control,
    endVector
  );
  return curve
    .getPoints(32)
    .map((point) => point.toArray() as [number, number, number]);
}
