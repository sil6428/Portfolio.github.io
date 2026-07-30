"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";

const SECTION_COLORS = {
  work: new THREE.Color("#77e7ff"),
  info: new THREE.Color("#a99cff"),
  interests: new THREE.Color("#ffbd72"),
};

function getSection(pathname: string) {
  if (pathname.startsWith("/info")) return "info";
  if (pathname.startsWith("/interests")) return "interests";
  return "work";
}

function createNodePositions() {
  const positions: number[] = [];
  for (let index = 0; index < 44; index += 1) {
    const ring = 1.45 + (index % 6) * 0.48;
    const angle = index * 2.399963;
    positions.push(
      Math.cos(angle) * ring + Math.sin(index * 1.7) * 0.42,
      Math.sin(angle) * ring * 0.68 + Math.cos(index * 0.91) * 0.38,
      Math.sin(index * 1.31) * 1.75,
    );
  }
  return positions;
}

function createEdges(positions: number[]) {
  const edges: number[] = [];
  const count = positions.length / 3;
  for (let index = 0; index < count; index += 1) {
    const next = (index + 1) % count;
    const skip = (index + 7) % count;
    for (const target of [next, skip]) {
      const offset = index * 3;
      const targetOffset = target * 3;
      const dx = positions[offset] - positions[targetOffset];
      const dy = positions[offset + 1] - positions[targetOffset + 1];
      const dz = positions[offset + 2] - positions[targetOffset + 2];
      if (Math.hypot(dx, dy, dz) < 4.4) {
        edges.push(
          positions[offset],
          positions[offset + 1],
          positions[offset + 2],
          positions[targetOffset],
          positions[targetOffset + 1],
          positions[targetOffset + 2],
        );
      }
    }
  }
  return edges;
}

export default function TopologyScene() {
  const pathname = usePathname();
  const hostRef = useRef<HTMLDivElement>(null);
  const section = getSection(pathname);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0, 8.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.position.set(1.4, -0.1, 0);
    scene.add(group);

    const positions = createNodePositions();
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const pointMaterial = new THREE.PointsMaterial({
      color: SECTION_COLORS[section],
      size: 0.105,
      transparent: true,
      opacity: 0.94,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pointGeometry, pointMaterial);
    group.add(points);

    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(createEdges(positions), 3));
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: SECTION_COLORS[section],
      transparent: true,
      opacity: 0.16,
    });
    const lines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    group.add(lines);

    const coreMaterial = new THREE.MeshBasicMaterial({
      color: SECTION_COLORS[section],
      wireframe: true,
      transparent: true,
      opacity: 0.48,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.02, 1), coreMaterial);
    group.add(core);

    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: SECTION_COLORS[section],
      wireframe: true,
      transparent: true,
      opacity: 0.13,
    });
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.012, 4, 120), orbitMaterial);
    orbit.rotation.x = 1.17;
    orbit.rotation.y = 0.32;
    group.add(orbit);

    const pointer = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const handlePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      targetRotation.set(pointer.y * 0.18, pointer.x * 0.28);
    };

    const handleScroll = () => {
      group.position.y = Math.min(window.scrollY * 0.00045, 0.65) - 0.1;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.025;
      group.rotation.y += (targetRotation.y - group.rotation.y) * 0.025;
      if (!reducedMotion) {
        group.rotation.z = Math.sin(elapsed * 0.13) * 0.05;
        core.rotation.x = elapsed * 0.17;
        core.rotation.y = elapsed * 0.23;
        orbit.rotation.z = elapsed * 0.055;
        pointMaterial.size = 0.1 + Math.sin(elapsed * 1.6) * 0.012;
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      pointGeometry.dispose();
      pointMaterial.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      core.geometry.dispose();
      coreMaterial.dispose();
      orbit.geometry.dispose();
      orbitMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [pathname, section]);

  if (pathname === "/") return null;

  return (
    <div className={`topology-scene topology-scene-${section}`} ref={hostRef} aria-hidden="true">
      <div className="topology-hud">
        <span>LIVE TOPOLOGY</span>
        <strong>{section.toUpperCase()}_SPACE</strong>
      </div>
      <div className="topology-axis topology-axis-x">X / 06</div>
      <div className="topology-axis topology-axis-y">Y / 28</div>
      <div className="topology-signal"><i /> SIGNAL STABLE</div>
    </div>
  );
}
