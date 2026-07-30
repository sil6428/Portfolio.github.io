"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type HotspotData = {
  key: string;
  href: string;
  label: string;
};

type RoomEntry = {
  number: string;
  directory: string;
  label: string;
  title: string;
  summary: string;
  details: string[];
  href: string;
  action: string;
  secondaryHref?: string;
  secondaryAction?: string;
  camera: [number, number, number];
};

const ROOM_ENTRIES: Record<string, RoomEntry> = {
  workstation: {
    number: "01",
    directory: "Workstation",
    label: "SELECTED WORK / TWO CASE STUDIES",
    title: "Projects workstation",
    summary: "The main screen holds Archtech, my privacy-focused platform in progress. The second holds SSIK, the IT consulting site I independently designed and built.",
    details: ["Archtech", "SSIK Website", "TypeScript + React"],
    href: "/work/archtech",
    action: "Open Archtech",
    secondaryHref: "/work/ssik",
    secondaryAction: "Open SSIK",
    camera: [2.8, 3.25, 4.5],
  },
  rack: {
    number: "02",
    directory: "Server rack",
    label: "CURRENT LAB",
    title: "Proxmox home lab",
    summary: "I am turning older computers into a practical environment for virtualization, networking, storage, and self-hosted experiments.",
    details: ["Hardware reuse", "Virtual machines", "Network services"],
    href: "/interests/home-lab",
    action: "Open lab notes",
    camera: [6.25, 3.3, 1.25],
  },
  printer: {
    number: "03",
    directory: "3D printer",
    label: "MAKING / DESIGN",
    title: "3D printing",
    summary: "From digital models to finished props, including a katana inspired by Elden Ring and Leon's hand cannon.",
    details: ["Slicing", "Assembly", "Sanding + finishing"],
    href: "/interests/3d-printing",
    action: "Open build notes",
    camera: [5.65, 3.25, 5.15],
  },
  racket: {
    number: "04",
    directory: "Racket",
    label: "REGIONAL COMPETITOR",
    title: "Badminton",
    summary: "Fast decisions, controlled movement, and the discipline to keep improving one rally at a time.",
    details: ["Regional level", "Singles + doubles", "Still playing"],
    href: "/interests/badminton",
    action: "Open badminton notes",
    camera: [6.4, 3.45, 4.1],
  },
  books: {
    number: "05",
    directory: "Books",
    label: "CURRENTLY READING",
    title: "Long-form fiction",
    summary: "I read East Asian novels, Korean manhwa, and manga with dense worlds and patient character development.",
    details: ["Lord of the Mysteries", "Reverend Insanity", "Worldbuilding"],
    href: "/interests/reading",
    action: "Open reading notes",
    camera: [-3.9, 2.35, 5.2],
  },
  camera: {
    number: "06",
    directory: "Camera",
    label: "PHOTOGRAPHY",
    title: "Frames I keep",
    summary: "Photography gives me a reason to notice light, structure, and small moments outside technical work.",
    details: ["Street details", "Architecture", "VSCO gallery"],
    href: "/interests/photography",
    action: "Open photography notes",
    camera: [-4.35, 2.9, 2.35],
  },
  profile: {
    number: "07",
    directory: "Wall board",
    label: "PROFILE / 2028",
    title: "About Affan",
    summary: "Cybersecurity student at Ontario Tech, part of the SSIK consulting team, and someone who learns best by building.",
    details: ["Networking + security", "Development", "Oshawa, Ontario"],
    href: "/info",
    action: "Open full profile",
    camera: [0.4, 4.25, 2.15],
  },
};

const DIRECTORY = Object.entries(ROOM_ENTRIES);

function findHotspot(object: THREE.Object3D | null): THREE.Object3D | null {
  let current = object;
  while (current) {
    if (current.userData.href) return current;
    current = current.parent;
  }
  return null;
}

export default function InteractiveRoom() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hoverLabel, setHoverLabel] = useState("");
  const [transitionLabel, setTransitionLabel] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const focusRef = useRef<(key: string) => void>(() => undefined);
  const activeEntry = activeKey ? ROOM_ENTRIES[activeKey] : null;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x080a0f, 9, 19);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(7.7, 5.5, 9.4);
    camera.lookAt(0, 1.35, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.setClearColor(0x080a0f, 0.82);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.25, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 0.72;
    controls.maxPolarAngle = 1.38;
    controls.minAzimuthAngle = -0.82;
    controls.maxAzimuthAngle = 0.82;

    const room = new THREE.Group();
    room.rotation.y = -0.08;
    scene.add(room);

    const clickable: THREE.Object3D[] = [];
    const objectByKey = new Map<string, THREE.Object3D>();
    const cyan = new THREE.Color("#77e7ff");
    const violet = new THREE.Color("#9f91ff");
    const amber = new THREE.Color("#ffbd72");

    const material = (
      color: THREE.ColorRepresentation,
      options: { metalness?: number; roughness?: number; emissive?: THREE.ColorRepresentation; emissiveIntensity?: number } = {},
    ) =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: options.metalness ?? 0.22,
        roughness: options.roughness ?? 0.72,
        emissive: options.emissive ?? 0x000000,
        emissiveIntensity: options.emissiveIntensity ?? 0,
      });

    const box = (
      parent: THREE.Object3D,
      size: [number, number, number],
      position: [number, number, number],
      color: THREE.ColorRepresentation,
      options?: Parameters<typeof material>[1],
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, options));
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    const hotspot = (key: string, label: string, href: string) => {
      const group = new THREE.Group();
      group.userData = { key, label, href } satisfies HotspotData;
      clickable.push(group);
      objectByKey.set(key, group);
      room.add(group);
      return group;
    };

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(13, 9),
      material("#0d1319", { metalness: 0.05, roughness: 0.95 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    room.add(floor);
    box(room, [13, 4.8, 0.12], [0, 2.4, -4.45], "#0b1016");
    box(room, [0.12, 4.8, 9], [-6.45, 2.4, 0], "#090e14");

    const grid = new THREE.GridHelper(13, 26, 0x254a57, 0x15232b);
    grid.position.y = 0.012;
    room.add(grid);

    const desk = new THREE.Group();
    room.add(desk);
    box(desk, [5.2, 0.18, 2.05], [-1.25, 1.35, -1.15], "#202a31", { metalness: 0.45, roughness: 0.48 });
    box(desk, [0.17, 1.35, 0.17], [-3.52, 0.68, -1.88], "#141c22", { metalness: 0.62 });
    box(desk, [0.17, 1.35, 0.17], [1.02, 0.68, -1.88], "#141c22", { metalness: 0.62 });
    box(desk, [0.17, 1.35, 0.17], [-3.52, 0.68, -0.42], "#141c22", { metalness: 0.62 });
    box(desk, [0.17, 1.35, 0.17], [1.02, 0.68, -0.42], "#141c22", { metalness: 0.62 });

    const workstation = hotspot("workstation", "ARCHTECH WORKSTATION", "/work/archtech");
    workstation.position.set(-1.35, 0, -1.05);
    box(workstation, [2.35, 1.38, 0.15], [0, 2.25, 0], "#111820", { metalness: 0.52 });
    box(workstation, [2.08, 1.12, 0.04], [0, 2.25, 0.095], "#79e9ff", {
      emissive: "#2aa9c5",
      emissiveIntensity: 1.15,
      metalness: 0.08,
      roughness: 0.32,
    });
    box(workstation, [0.12, 0.72, 0.12], [0, 1.48, 0], "#18232a", { metalness: 0.7 });
    box(workstation, [0.72, 0.08, 0.46], [0, 1.39, 0], "#18232a", { metalness: 0.7 });
    for (let line = 0; line < 5; line += 1) {
      box(workstation, [1.25 - line * 0.09, 0.018, 0.018], [-0.25, 2.55 - line * 0.16, 0.125], line === 1 ? violet : cyan, {
        emissive: line === 1 ? violet : cyan,
        emissiveIntensity: 1.3,
      });
    }

    const rack = hotspot("rack", "PROXMOX SERVER RACK", "/interests/home-lab");
    rack.position.set(3.55, 0, -2.65);
    box(rack, [1.7, 3.65, 1.35], [0, 1.83, 0], "#141b22", { metalness: 0.62, roughness: 0.42 });
    for (let unit = 0; unit < 7; unit += 1) {
      box(rack, [1.48, 0.32, 0.08], [0, 0.58 + unit * 0.43, 0.7], "#26323a", { metalness: 0.7, roughness: 0.38 });
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 10, 10),
        material(unit % 3 === 0 ? amber : "#68e0ae", {
          emissive: unit % 3 === 0 ? amber : "#68e0ae",
          emissiveIntensity: 2,
        }),
      );
      led.position.set(0.55, 0.58 + unit * 0.43, 0.76);
      rack.add(led);
    }

    const printer = hotspot("printer", "3D PRINTER", "/interests/3d-printing");
    printer.position.set(2.65, 0, 1.6);
    box(printer, [2.05, 0.14, 1.7], [0, 0.1, 0], "#222d34", { metalness: 0.55 });
    box(printer, [0.14, 2.5, 0.14], [-0.9, 1.3, -0.68], "#202a31", { metalness: 0.62 });
    box(printer, [0.14, 2.5, 0.14], [0.9, 1.3, -0.68], "#202a31", { metalness: 0.62 });
    box(printer, [1.95, 0.14, 0.14], [0, 2.52, -0.68], "#202a31", { metalness: 0.62 });
    box(printer, [1.72, 0.1, 1.35], [0, 0.55, 0], "#29363d", { metalness: 0.38 });
    box(printer, [0.58, 0.7, 0.58], [0, 0.96, 0], "#8f73ff", {
      emissive: "#5637c9",
      emissiveIntensity: 0.45,
      roughness: 0.46,
    });
    box(printer, [0.52, 0.32, 0.45], [0, 2.22, -0.34], "#1b242b", { metalness: 0.72 });

    const books = hotspot("books", "READING STACK", "/interests/reading");
    books.position.set(-4.35, 0, 1.7);
    [["#424d55", 0.22], ["#7d6cc8", 0.48], ["#9b7448", 0.73]].forEach(([color, y], index) => {
      box(books, [1.65 - index * 0.08, 0.24, 1.05], [0, Number(y), 0], color as string, { roughness: 0.9 });
    });

    const cameraGroup = hotspot("camera", "PHOTOGRAPHY", "/interests/photography");
    cameraGroup.position.set(-3.25, 1.58, -0.4);
    box(cameraGroup, [1.05, 0.72, 0.48], [0, 0, 0], "#1a2025", { metalness: 0.7, roughness: 0.34 });
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.34, 0.46, 24),
      material("#11161b", { metalness: 0.82, roughness: 0.24 }),
    );
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.43;
    cameraGroup.add(lens);
    const glass = new THREE.Mesh(
      new THREE.CircleGeometry(0.22, 24),
      material("#4b77a5", { emissive: "#1d3857", emissiveIntensity: 0.55, roughness: 0.12 }),
    );
    glass.position.z = 0.67;
    cameraGroup.add(glass);

    const racket = hotspot("racket", "BADMINTON", "/interests/badminton");
    racket.position.set(4.72, 1.62, 0.1);
    racket.rotation.z = -0.32;
    const racketHead = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.055, 10, 38),
      material("#dce7e9", { metalness: 0.55, roughness: 0.32 }),
    );
    racketHead.scale.y = 1.28;
    racket.add(racketHead);
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.075, 1.55, 12),
      material("#7046b7", { roughness: 0.62 }),
    );
    handle.position.y = -1.18;
    racket.add(handle);
    for (let string = -3; string <= 3; string += 1) {
      box(racket, [0.018, 1.16, 0.012], [string * 0.13, 0, 0], "#66767c", { metalness: 0.18 });
    }

    const profile = hotspot("profile", "ABOUT AFFAN", "/info");
    profile.position.set(-1.7, 2.95, -4.34);
    box(profile, [3.2, 1.45, 0.12], [0, 0, 0], "#172027", { metalness: 0.34 });
    box(profile, [2.88, 1.15, 0.04], [0, 0, 0.08], "#705eb7", {
      emissive: "#35296d",
      emissiveIntensity: 0.45,
      roughness: 0.72,
    });
    for (let pin = 0; pin < 4; pin += 1) {
      box(profile, [0.42 + pin * 0.08, 0.025, 0.02], [-0.72 + pin * 0.47, 0.28 - pin * 0.18, 0.12], pin % 2 ? cyan : amber, {
        emissive: pin % 2 ? cyan : amber,
        emissiveIntensity: 0.85,
      });
    }

    const cat = new THREE.Group();
    cat.position.set(-0.1, 0.18, 1.65);
    room.add(cat);
    const catBody = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 14), material("#050607", { roughness: 0.9 }));
    catBody.scale.set(1.45, 0.75, 0.8);
    cat.add(catBody);
    const catHead = new THREE.Mesh(new THREE.SphereGeometry(0.23, 18, 14), material("#050607", { roughness: 0.9 }));
    catHead.position.set(0.43, 0.15, 0);
    cat.add(catHead);

    scene.add(new THREE.HemisphereLight(0x9fcfe0, 0x0a0b10, 1.35));
    const cyanLight = new THREE.PointLight(0x77e7ff, 24, 10, 2);
    cyanLight.position.set(-1.3, 3.3, -0.2);
    cyanLight.castShadow = true;
    scene.add(cyanLight);
    const violetLight = new THREE.PointLight(0x9f91ff, 18, 9, 2);
    violetLight.position.set(3.1, 3.8, 2.2);
    scene.add(violetLight);
    const warmLight = new THREE.PointLight(0xffbd72, 11, 7, 2);
    warmLight.position.set(-4.2, 2.8, 1.5);
    scene.add(warmLight);

    room.updateMatrixWorld(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const overviewPosition = new THREE.Vector3(7.7, 5.5, 9.4);
    const overviewTarget = new THREE.Vector3(0, 1.25, 0);
    let cameraMove: {
      fromPosition: THREE.Vector3;
      toPosition: THREE.Vector3;
      fromTarget: THREE.Vector3;
      toTarget: THREE.Vector3;
      startedAt: number;
      duration: number;
      revealKey: string | null;
    } | null = null;

    const beginCameraMove = (
      toPosition: THREE.Vector3,
      toTarget: THREE.Vector3,
      revealKey: string | null,
      label: string,
    ) => {
      setActiveKey(null);
      setTransitionLabel(label);
      controls.enabled = false;
      cameraMove = {
        fromPosition: camera.position.clone(),
        toPosition,
        fromTarget: controls.target.clone(),
        toTarget,
        startedAt: performance.now(),
        duration: reducedMotion ? 1 : 920,
        revealKey,
      };
    };

    const focusObject = (key: string) => {
      if (key === "__overview") {
        beginCameraMove(overviewPosition.clone(), overviewTarget.clone(), null, "RETURNING TO ROOM OVERVIEW");
        return;
      }

      const entry = ROOM_ENTRIES[key];
      const object = objectByKey.get(key);
      if (!entry || !object) return;
      const target = new THREE.Vector3();
      object.getWorldPosition(target);
      target.y += key === "profile" ? 0 : 0.45;
      beginCameraMove(new THREE.Vector3(...entry.camera), target, key, `MOVING TO ${entry.directory.toUpperCase()}`);
    };
    focusRef.current = focusObject;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pressedAt = { x: 0, y: 0 };
    let hovered: THREE.Object3D | null = null;

    const pick = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(clickable, true)[0];
      return findHotspot(hit?.object ?? null);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const next = pick(event);
      if (next === hovered) return;
      if (hovered) hovered.scale.setScalar(1);
      hovered = next;
      if (hovered) hovered.scale.setScalar(1.035);
      renderer.domElement.style.cursor = hovered ? "pointer" : "grab";
      setHoverLabel(hovered?.userData.label ?? "");
    };

    const handlePointerDown = (event: PointerEvent) => {
      pressedAt = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - pressedAt.x, event.clientY - pressedAt.y) > 7) return;
      const selected = pick(event);
      if (selected?.userData.key) focusObject(selected.userData.key);
    };

    const handlePointerLeave = () => setHoverLabel("");
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = (timestamp = performance.now()) => {
      const elapsed = clock.getElapsedTime();
      if (!reducedMotion) {
        cyanLight.intensity = 22 + Math.sin(elapsed * 1.4) * 2;
        cat.position.y = 0.18 + Math.sin(elapsed * 1.15) * 0.015;
      }
      if (cameraMove) {
        const progress = Math.min(1, (timestamp - cameraMove.startedAt) / cameraMove.duration);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        camera.position.lerpVectors(cameraMove.fromPosition, cameraMove.toPosition, eased);
        controls.target.lerpVectors(cameraMove.fromTarget, cameraMove.toTarget, eased);
        if (progress >= 1) {
          const revealKey = cameraMove.revealKey;
          cameraMove = null;
          controls.enabled = true;
          setTransitionLabel("");
          setActiveKey(revealKey);
        }
      }
      controls.update();
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      focusRef.current = () => undefined;
      room.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const objectMaterial = object.material;
        if (Array.isArray(objectMaterial)) objectMaterial.forEach((item) => item.dispose());
        else objectMaterial.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeKey) focusRef.current("__overview");
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeKey]);

  return (
    <section className={`room-stage ${activeEntry ? "room-has-popup" : ""}`} aria-label="Interactive 3D portfolio">
      <div className="room-stage-bar">
        <span>AFFAN_LAB / ROOM_01</span>
        <strong aria-live="polite">
          {transitionLabel || hoverLabel || (activeEntry ? activeEntry.title.toUpperCase() : "DRAG TO LOOK · CLICK AN OBJECT")}
        </strong>
      </div>
      <div className="room-canvas" ref={hostRef} />
      <nav className="room-directory" aria-label="3D room directory">
        {DIRECTORY.map(([key, entry]) => (
          <button type="button" onClick={() => focusRef.current(key)} key={key}>
            <span>{entry.number}</span>{entry.directory}
          </button>
        ))}
      </nav>
      {activeEntry && (
        <aside className="room-popup" aria-live="polite" aria-labelledby="room-popup-title">
          <button
            className="room-popup-close"
            type="button"
            aria-label="Return to room overview"
            onClick={() => focusRef.current("__overview")}
          >
            ×
          </button>
          <p>{activeEntry.label}</p>
          <h2 id="room-popup-title">{activeEntry.title}</h2>
          <div className="room-popup-line" />
          <p>{activeEntry.summary}</p>
          <ul>
            {activeEntry.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
      <div className="room-popup-actions">
        <Link href={activeEntry.href}>{activeEntry.action} <span aria-hidden="true">→</span></Link>
        {activeEntry.secondaryHref && activeEntry.secondaryAction && (
          <Link href={activeEntry.secondaryHref}>
            {activeEntry.secondaryAction} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      <small>ESC / RETURN TO ROOM</small>
        </aside>
      )}
    </section>
  );
}
