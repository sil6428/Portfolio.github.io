"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { playSiteSfx } from "./site-sfx";

type HotspotData = {
  key?: string;
  easterEgg?: "cat" | "palette" | "relic" | "signal";
  label: string;
};

type RoomEntry = {
  number: string;
  directory: string;
  label: string;
  title: string;
  summary: string;
  details: string[];
  sections: Array<{ heading: string; body: string }>;
  links?: Array<{ label: string; href: string }>;
  cameraOffset: [number, number, number];
  targetOffset: [number, number, number];
};

const ROOM_ENTRIES: Record<string, RoomEntry> = {
  archtech: {
    number: "01",
    directory: "Archtech file",
    label: "PROJECT FILE / WORK IN PROGRESS",
    title: "Archtech",
    summary: "A privacy-focused community platform in development, built around secure communication, publishing, moderation, and controlled access.",
    details: ["Privacy-first", "TypeScript + React", "Cloudflare", "Work in progress"],
    sections: [
      {
        heading: "What I am building",
        body: "A stealth, work-in-progress nonprofit platform centered on private community messaging, publishing, moderation, role-based access, and program coordination. I have been building the interface, deployment flow, and privacy-aware access model across staged releases.",
      },
      {
        heading: "Current stage",
        body: "The project remains unreleased. I use staged repositories and deployments to preserve each milestone while I test the interface, access rules, and overall product direction.",
      },
    ],
    cameraOffset: [0, 0.1, 3.05],
    targetOffset: [0, 0, 0],
  },
  ssik: {
    number: "02",
    directory: "SSIK file",
    label: "PROJECT FILE / IT CONSULTING",
    title: "SSIK website",
    summary: "The public service website for our IT consulting team, independently designed and built by me.",
    details: ["IT consulting", "Sole site creator", "Responsive design", "GitHub Pages"],
    sections: [
      {
        heading: "The role",
        body: "I am part of the SSIK consulting team and independently created its public website. The site explains our services and gives prospective clients a clear way to understand what the team offers.",
      },
      {
        heading: "What I learned",
        body: "Building the complete site pushed me to plan its information architecture, responsive states, service copy, deployment, and maintenance instead of treating it as a static mockup.",
      },
    ],
    links: [
      { label: "View SSIK website", href: "https://sil6428.github.io/SSIK-website/index.html" },
      { label: "View source", href: "https://github.com/sil6428/SSIK-website" },
    ],
    cameraOffset: [0, 0.1, 3.05],
    targetOffset: [0, 0, 0],
  },
  rack: {
    number: "03",
    directory: "Server rack",
    label: "CURRENT LAB",
    title: "Proxmox home lab",
    summary: "I am turning older computers into a practical environment for virtualization, networking, storage, and self-hosted experiments.",
    details: ["Hardware reuse", "Virtual machines", "Network services"],
    sections: [
      {
        heading: "The plan",
        body: "Older computers become Proxmox nodes instead of e-waste. The lab gives me a place to create virtual machines, separate services, test networking changes, and rebuild systems without risking a daily-use computer.",
      },
      {
        heading: "Current focus",
        body: "I am planning storage, backups, addressing, remote access, and a clean network layout before moving important services onto the lab.",
      },
    ],
    cameraOffset: [0, 0.12, 2.7],
    targetOffset: [0, 1.88, 0.72],
  },
  printer: {
    number: "04",
    directory: "3D printer",
    label: "MAKING / DESIGN",
    title: "3D printing",
    summary: "From digital models to finished props. In the room, a complete miniature black-and-white chess set prints layer by layer over three minutes.",
    details: ["Live 03:00 print", "32 pieces", "Printed board", "Layer by layer"],
    sections: [
      {
        heading: "From file to object",
        body: "I prepare models, choose print orientation, tune supports, slice parts, and troubleshoot failed layers. Larger props require separate pieces, careful joins, sanding, filler, and finishing.",
      },
      {
        heading: "Favourite builds",
        body: "A full katana inspired by Elden Ring and Leon's hand cannon from Resident Evil taught me how much the final result depends on patient assembly after the printer stops.",
      },
    ],
    cameraOffset: [0, 0.28, 3.05],
    targetOffset: [0, 1.28, 0.2],
  },
  racket: {
    number: "05",
    directory: "Racket",
    label: "REGIONAL COMPETITOR",
    title: "Badminton",
    summary: "Fast decisions, controlled movement, and the discipline to keep improving one rally at a time.",
    details: ["Regional level", "Singles + doubles", "Still playing"],
    sections: [
      {
        heading: "Regional competition",
        body: "I competed at the regional level. Training made footwork, recovery, shot placement, and composure as important as speed.",
      },
      {
        heading: "Why I keep playing",
        body: "Every rally gives immediate feedback. I like the balance of technique, quick decisions, and the discipline of returning to the next point after a mistake.",
      },
    ],
    cameraOffset: [0, 0.08, 2.75],
    targetOffset: [0, -0.55, 0.08],
  },
  books: {
    number: "06",
    directory: "Books",
    label: "CURRENTLY READING",
    title: "Long-form fiction",
    summary: "I read East Asian novels, Korean manhwa, and manga with dense worlds and patient character development.",
    details: ["Lord of the Mysteries", "Reverend Insanity", "Worldbuilding"],
    sections: [
      {
        heading: "Current shelf",
        body: "I am currently reading Lord of the Mysteries and Reverend Insanity. I tend to stay with long stories that let their settings, systems, and characters develop gradually.",
      },
      {
        heading: "What holds my attention",
        body: "I enjoy strategic characters, consistent world rules, layered mysteries, and stories where earlier details become meaningful much later.",
      },
    ],
    cameraOffset: [3.0, 0.25, 0],
    targetOffset: [0, 0.28, 0],
  },
  camera: {
    number: "07",
    directory: "Camera",
    label: "PHOTOGRAPHY",
    title: "Frames I keep",
    summary: "Photography gives me a reason to notice light, structure, and small moments outside technical work.",
    details: ["Street details", "Architecture", "VSCO gallery"],
    sections: [
      {
        heading: "What I photograph",
        body: "I look for street details, architecture, light, reflections, and small arrangements that are easy to pass without noticing.",
      },
      {
        heading: "The process",
        body: "Photography slows me down. Framing a scene makes me think about balance, negative space, colour, and what should stay outside the image.",
      },
    ],
    links: [{ label: "View VSCO gallery", href: "https://sy1len.vsco.site" }],
    cameraOffset: [3.0, 0.18, 0],
    targetOffset: [0, 0, 0.08],
  },
  profile: {
    number: "08",
    directory: "About file",
    label: "PROFILE / 2028",
    title: "About Affan",
    summary: "Cybersecurity student at Ontario Tech, part of the SSIK consulting team, and someone who learns best by building.",
    details: ["Networking + security", "Development", "Ontario Tech 2028", "Oshawa"],
    sections: [
      {
        heading: "Education",
        body: "I study Networking and Cybersecurity at Ontario Tech University and expect to graduate in 2028. My work spans network design, routing, system security, Python, TypeScript, and full-stack development.",
      },
      {
        heading: "Experience",
        body: "I work in customer-facing retail, volunteer at community events, and contribute to the SSIK consulting team. Those roles strengthened my communication, troubleshooting, planning, and ability to explain technical choices clearly.",
      },
      {
        heading: "Current direction",
        body: "I am studying toward CompTIA Security+, expanding my home lab, and building projects where privacy and reliable infrastructure are requirements from the start.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/sil6428" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/sil6428" },
      { label: "Email", href: "mailto:ffaanshake@gmail.com" },
      { label: "Resume", href: "/Affan_Shaikh_Resume.pdf" },
    ],
    cameraOffset: [0, 0.1, 3.05],
    targetOffset: [0, 0, 0],
  },
  contact: {
    number: "09",
    directory: "Contact file",
    label: "CONTACTS / PUBLIC LINKS",
    title: "Contact Affan",
    summary: "The public places where you can reach me or follow my current work.",
    details: ["Email", "LinkedIn", "GitHub", "Phone"],
    sections: [
      {
        heading: "Best way to reach me",
        body: "Email or LinkedIn works best for project questions, collaboration, and opportunities. My GitHub contains the public source and learning history behind this portfolio.",
      },
    ],
    links: [
      { label: "Email", href: "mailto:ffaanshake@gmail.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/sil6428" },
      { label: "GitHub", href: "https://github.com/sil6428" },
      { label: "Phone", href: "tel:+16473091927" },
    ],
    cameraOffset: [0, 0.1, 3.05],
    targetOffset: [0, 0, 0],
  },
  resume: {
    number: "10",
    directory: "Resume file",
    label: "DOCUMENT / PDF",
    title: "Resume",
    summary: "My current networking, cybersecurity, development, experience, and education resume.",
    details: ["Ontario Tech 2028", "Networking", "Cybersecurity", "Development"],
    sections: [
      {
        heading: "Current direction",
        body: "The resume covers my technical projects, networking and security skills, SSIK work, customer-facing experience, and community volunteering.",
      },
    ],
    links: [{ label: "Open resume PDF", href: "/Affan_Shaikh_Resume.pdf" }],
    cameraOffset: [0, 0.1, 3.05],
    targetOffset: [0, 0, 0],
  },
  inspiration: {
    number: "11",
    directory: "Inspiration file",
    label: "CREDITS / WEB INSPIRATION",
    title: "Sites that shaped the lab",
    summary: "Three interactive portfolios helped set the standard for the room, its camera movement, and the desktop computer interface.",
    details: ["Interactive 3D", "Fluid camera work", "Desktop interface", "Original implementation"],
    sections: [
      {
        heading: "Bruno Simon",
        body: "Bruno Simon's portfolio inspired the idea of making the environment itself the navigation and treating movement through a 3D space as part of the experience.",
      },
      {
        heading: "Ida's Gameboy",
        body: "Ida's Gameboy inspired the computer desktop, selectable files, and the idea of revealing portfolio content through a playful device interface.",
      },
      {
        heading: "Jesse Zhou",
        body: "Jesse Zhou's portfolio influenced the focus on fluid camera motion, polished object interactions, and transitions that keep the 3D scene feeling responsive.",
      },
    ],
    links: [
      { label: "Visit Bruno Simon", href: "https://bruno-simon.com/" },
      { label: "Visit Ida's Gameboy", href: "https://idas-gameboy.netlify.app/" },
      { label: "Visit Jesse Zhou", href: "https://www.jesse-zhou.com/" },
    ],
    cameraOffset: [0, 0.1, 3.05],
    targetOffset: [0, 0, 0],
  },
};

const DIRECTORY = Object.entries(ROOM_ENTRIES);
const PRINT_DURATION_MS = 180_000;

function findHotspot(object: THREE.Object3D | null): THREE.Object3D | null {
  let current = object;
  while (current) {
    if (current.userData.key || current.userData.easterEgg) return current;
    current = current.parent;
  }
  return null;
}

export default function InteractiveRoom() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hoverLabel, setHoverLabel] = useState("");
  const [transitionLabel, setTransitionLabel] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [visitedKeys, setVisitedKeys] = useState<string[]>([]);
  const [roomSecret, setRoomSecret] = useState("");
  const focusRef = useRef<(key: string) => void>(() => undefined);
  const dismissRef = useRef<() => void>(() => undefined);
  const activeEntry = activeKey ? ROOM_ENTRIES[activeKey] : null;

  useEffect(() => {
    let frame = 0;
    try {
      const stored = window.localStorage.getItem("affan-lab-discoveries");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const validKeys = parsed.filter((key): key is string => typeof key === "string" && key in ROOM_ENTRIES);
        frame = window.requestAnimationFrame(() => setVisitedKeys(validKeys));
      }
    } catch {
      // The room still works when storage is unavailable or has been cleared.
    }
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x080a0f, 9, 19);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(5.2, 4.3, 6.5);
    camera.lookAt(0, 1.55, -0.7);

    const highDetail = window.matchMedia("(min-width: 901px) and (pointer: fine)").matches;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, highDetail ? 2 : 1.45));
    renderer.setClearColor(0x080a0f, 0.82);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.55, -0.7);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.panSpeed = 0.72;
    controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
    controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
    controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
    controls.enableZoom = true;
    controls.minDistance = 2.1;
    controls.maxDistance = 13;
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

    const physicalMaterial = (
      color: THREE.ColorRepresentation,
      options: {
        metalness?: number;
        roughness?: number;
        emissive?: THREE.ColorRepresentation;
        emissiveIntensity?: number;
        clearcoat?: number;
        clearcoatRoughness?: number;
        transmission?: number;
        opacity?: number;
      } = {},
    ) =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: options.metalness ?? 0.08,
        roughness: options.roughness ?? 0.3,
        emissive: options.emissive ?? 0x000000,
        emissiveIntensity: options.emissiveIntensity ?? 0,
        clearcoat: options.clearcoat ?? 0.55,
        clearcoatRoughness: options.clearcoatRoughness ?? 0.18,
        transmission: options.transmission ?? 0,
        transparent: (options.opacity ?? 1) < 1 || (options.transmission ?? 0) > 0,
        opacity: options.opacity ?? 1,
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

    const roundedBox = (
      parent: THREE.Object3D,
      size: [number, number, number],
      position: [number, number, number],
      color: THREE.ColorRepresentation,
      radius = 0.04,
      options?: Parameters<typeof material>[1],
    ) => {
      const safeRadius = Math.min(radius, Math.min(...size) * 0.42);
      const mesh = new THREE.Mesh(
        new RoundedBoxGeometry(size[0], size[1], size[2], 3, safeRadius),
        material(color, options),
      );
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    const hotspot = (key: string, label: string, parent: THREE.Object3D = room) => {
      const group = new THREE.Group();
      group.userData = { key, label } satisfies HotspotData;
      clickable.push(group);
      objectByKey.set(key, group);
      parent.add(group);
      return group;
    };

    const easterHotspot = (
      easterEgg: HotspotData["easterEgg"],
      label: string,
      parent: THREE.Object3D = room,
    ) => {
      const group = new THREE.Group();
      group.userData = { easterEgg, label } satisfies HotspotData;
      clickable.push(group);
      parent.add(group);
      return group;
    };

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 8.5),
      material("#111a24", { metalness: 0.05, roughness: 0.95 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    room.add(floor);
    box(room, [12, 4.8, 0.12], [0, 2.4, -4.25], "#111622");
    box(room, [0.12, 4.8, 8.5], [-5.95, 2.4, 0], "#0e1920");
    const rearBaseboard = roundedBox(room, [11.75, 0.16, 0.1], [0, 0.08, -4.16], "#26323b", 0.035, {
      metalness: 0.4,
      roughness: 0.46,
    });
    rearBaseboard.name = "room-rear-baseboard";
    const sideBaseboard = roundedBox(room, [0.1, 0.16, 8.25], [-5.86, 0.08, 0], "#26323b", 0.035, {
      metalness: 0.4,
      roughness: 0.46,
    });
    sideBaseboard.name = "room-side-baseboard";

    const wallDecor = new THREE.Group();
    wallDecor.name = "wall-decor-collection";
    room.add(wallDecor);

    const topologyFrame = new THREE.Group();
    topologyFrame.name = "wall-network-topology-frame";
    wallDecor.add(topologyFrame);
    box(topologyFrame, [0.08, 1.48, 2.34], [-5.86, 3.32, -2.42], "#1a2230", {
      metalness: 0.28,
      roughness: 0.58,
    });
    box(topologyFrame, [0.12, 1.58, 0.065], [-5.81, 3.32, -3.62], "#596773", { metalness: 0.72, roughness: 0.3 });
    box(topologyFrame, [0.12, 1.58, 0.065], [-5.81, 3.32, -1.22], "#596773", { metalness: 0.72, roughness: 0.3 });
    box(topologyFrame, [0.12, 0.065, 2.46], [-5.81, 4.09, -2.42], "#596773", { metalness: 0.72, roughness: 0.3 });
    box(topologyFrame, [0.12, 0.065, 2.46], [-5.81, 2.55, -2.42], "#596773", { metalness: 0.72, roughness: 0.3 });
    const topologyPoints = [
      new THREE.Vector3(-5.77, 3.62, -3.22),
      new THREE.Vector3(-5.77, 3.05, -2.94),
      new THREE.Vector3(-5.77, 3.72, -2.42),
      new THREE.Vector3(-5.77, 2.9, -2.16),
      new THREE.Vector3(-5.77, 3.48, -1.62),
    ];
    const topologyLinks = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4]];
    for (const [startIndex, endIndex] of topologyLinks) {
      const start = topologyPoints[startIndex];
      const end = topologyPoints[endIndex];
      const direction = end.clone().sub(start);
      const link = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, direction.length(), 6),
        material("#77e7ff", { emissive: "#255765", emissiveIntensity: 0.7, metalness: 0.38, roughness: 0.32 }),
      );
      link.name = "wall-topology-link";
      link.position.copy(start.clone().add(end).multiplyScalar(0.5));
      link.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      topologyFrame.add(link);
    }
    topologyPoints.forEach((point, index) => {
      const nodeColor = ["#77e7ff", "#68e0ae", "#9f91ff", "#ffbd72", "#77e7ff"][index];
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(index === 2 ? 0.095 : 0.07, 14, 10),
        material(nodeColor, { emissive: nodeColor, emissiveIntensity: 0.9, metalness: 0.42, roughness: 0.26 }),
      );
      node.name = "wall-topology-node";
      node.position.copy(point);
      topologyFrame.add(node);
    });
    for (let bar = 0; bar < 3; bar += 1) {
      box(topologyFrame, [0.025, 0.035, 0.34 - bar * 0.05], [-5.765, 3.88 - bar * 0.09, -3.2], bar === 0 ? "#ffbd72" : "#71818c", {
        emissive: bar === 0 ? "#6e4022" : "#111820",
        emissiveIntensity: 0.36,
        roughness: 0.44,
      });
    }

    const photoTriptych = new THREE.Group();
    photoTriptych.name = "wall-photography-triptych";
    wallDecor.add(photoTriptych);
    const photoAccents = ["#77e7ff", "#9f91ff", "#ffbd72"];
    [-0.35, 0.55, 1.45].forEach((z, index) => {
      box(photoTriptych, [0.1, 1.12, 0.7], [-5.86, 3.42, z], "#303a46", { metalness: 0.5, roughness: 0.38 });
      box(photoTriptych, [0.045, 0.92, 0.53], [-5.79, 3.42, z], "#d7d5cd", { metalness: 0.05, roughness: 0.86 });
      box(photoTriptych, [0.026, 0.68, 0.39], [-5.755, 3.46, z], index === 1 ? "#24203a" : "#162b36", {
        emissive: index === 1 ? "#241b4b" : "#102c39",
        emissiveIntensity: 0.34,
        roughness: 0.72,
      });
      const photoSun = new THREE.Mesh(
        new THREE.CircleGeometry(0.105 + index * 0.015, 20),
        material(photoAccents[index], {
          emissive: photoAccents[index],
          emissiveIntensity: 0.55,
          metalness: 0.08,
          roughness: 0.54,
        }),
      );
      photoSun.name = "wall-photo-light";
      photoSun.rotation.y = Math.PI / 2;
      photoSun.position.set(-5.735, 3.61 - index * 0.08, z - 0.08 + index * 0.08);
      photoTriptych.add(photoSun);
      for (let skyline = 0; skyline < 3; skyline += 1) {
        const height = 0.1 + ((skyline + index) % 3) * 0.075;
        box(
          photoTriptych,
          [0.024, height, 0.065],
          [-5.73, 3.17 + height / 2, z - 0.12 + skyline * 0.12],
          skyline === index ? photoAccents[index] : "#71818c",
          { emissive: skyline === index ? photoAccents[index] : "#111820", emissiveIntensity: 0.28, roughness: 0.5 },
        );
      }
    });

    const grid = new THREE.GridHelper(12, 24, 0x254a57, 0x15232b);
    grid.position.y = 0.012;
    room.add(grid);

    const desk = new THREE.Group();
    room.add(desk);
    const deskTop = roundedBox(desk, [7.65, 0.18, 2.2], [-1.32, 1.35, -3.15], "#30364c", 0.07, {
      metalness: 0.45,
      roughness: 0.48,
    });
    deskTop.name = "beveled-desk-top";
    const deskGrommet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.04, 28),
      material("#13191e", { metalness: 0.48, roughness: 0.34 }),
    );
    deskGrommet.name = "desk-cable-grommet";
    deskGrommet.position.set(-3.8, 1.46, -3.82);
    desk.add(deskGrommet);
    for (const x of [-4.92, 2.28]) {
      for (const z of [-4.02, -2.3]) {
        const deskFoot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.11, 0.055, 16),
          material("#080b0e", { metalness: 0.56, roughness: 0.44 }),
        );
        deskFoot.name = "desk-adjustable-foot";
        deskFoot.position.set(x, 0.03, z);
        desk.add(deskFoot);
      }
    }
    for (const x of [-4.92, 2.28]) {
      for (const z of [-4.02, -2.3]) {
        box(desk, [0.17, 1.35, 0.17], [x, 0.68, z], "#141c22", { metalness: 0.62 });
      }
    }
    box(desk, [7.2, 0.12, 0.18], [-1.32, 0.72, -4.03], "#111920", { metalness: 0.7 });
    box(desk, [5.9, 0.08, 0.22], [-1.72, 1.1, -4.13], "#26333a", { metalness: 0.62 });
    const deskCyanEdge = box(desk, [7.35, 0.045, 0.045], [-1.32, 1.46, -2.07], "#77e7ff", {
      emissive: "#255765",
      emissiveIntensity: 0.72,
      roughness: 0.28,
    });
    deskCyanEdge.name = "desk-cyan-edge";
    const deskAmberEdge = box(desk, [0.045, 0.045, 1.9], [2.47, 1.46, -3.15], "#ffbd72", {
      emissive: "#6e4022",
      emissiveIntensity: 0.68,
      roughness: 0.3,
    });
    deskAmberEdge.name = "desk-amber-edge";

    const workstation = new THREE.Group();
    workstation.name = "compact-desktop-pc-setup";
    workstation.position.set(-1.75, 1.46, -3.12);
    room.add(workstation);
    const keyboardDeck = roundedBox(workstation, [2.72, 0.08, 0.78], [-0.2, 0.07, 0.4], "#151e24", 0.035, {
      metalness: 0.55,
      roughness: 0.38,
    });
    keyboardDeck.name = "desktop-keyboard-beveled-deck";
    const monitorBase = roundedBox(workstation, [0.92, 0.06, 0.5], [-0.2, 0.09, -0.52], "#222d34", 0.025, {
      metalness: 0.58,
      roughness: 0.3,
    });
    monitorBase.name = "desktop-monitor-beveled-base";
    box(workstation, [0.14, 0.74, 0.14], [-0.2, 0.43, -0.72], "#29363d", { metalness: 0.78, roughness: 0.28 });
    const desktopMonitor = new THREE.Group();
    desktopMonitor.name = "desktop-monitor";
    desktopMonitor.position.set(-0.2, 0.39, -0.82);
    workstation.add(desktopMonitor);
    const monitorBezel = roundedBox(desktopMonitor, [3.16, 1.86, 0.13], [0, 0.97, 0], "#10171d", 0.055, {
      metalness: 0.68,
      roughness: 0.32,
    });
    monitorBezel.name = "desktop-monitor-rounded-bezel";
    const webcam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.018, 16),
      material("#050709", { metalness: 0.5, roughness: 0.2 }),
    );
    webcam.name = "desktop-monitor-webcam";
    webcam.rotation.x = Math.PI / 2;
    webcam.position.set(0, 1.83, 0.082);
    desktopMonitor.add(webcam);
    const webcamGlass = new THREE.Mesh(
      new THREE.CircleGeometry(0.014, 16),
      material("#457a97", { emissive: "#12354b", emissiveIntensity: 0.5, roughness: 0.08 }),
    );
    webcamGlass.position.set(0, 1.83, 0.093);
    desktopMonitor.add(webcamGlass);

    const desktopCanvas = document.createElement("canvas");
    desktopCanvas.width = 1024;
    desktopCanvas.height = 640;
    const desktopContext = desktopCanvas.getContext("2d");
    if (desktopContext) {
      const background = desktopContext.createLinearGradient(0, 0, 1024, 640);
      background.addColorStop(0, "#080d15");
      background.addColorStop(0.52, "#101827");
      background.addColorStop(1, "#18152b");
      desktopContext.fillStyle = background;
      desktopContext.fillRect(0, 0, 1024, 640);
      const cyanGlow = desktopContext.createRadialGradient(150, 110, 0, 150, 110, 390);
      cyanGlow.addColorStop(0, "rgba(75,180,214,.18)");
      cyanGlow.addColorStop(1, "rgba(75,180,214,0)");
      desktopContext.fillStyle = cyanGlow;
      desktopContext.fillRect(0, 0, 1024, 570);
      const violetGlow = desktopContext.createRadialGradient(850, 420, 0, 850, 420, 350);
      violetGlow.addColorStop(0, "rgba(122,98,190,.17)");
      violetGlow.addColorStop(1, "rgba(122,98,190,0)");
      desktopContext.fillStyle = violetGlow;
      desktopContext.fillRect(0, 0, 1024, 570);
      desktopContext.strokeStyle = "rgba(119,231,255,.12)";
      desktopContext.lineWidth = 1.5;
      for (let x = 0; x <= 1024; x += 52) {
        desktopContext.beginPath();
        desktopContext.moveTo(x, 0);
        desktopContext.lineTo(x, 570);
        desktopContext.stroke();
      }
      for (let y = 0; y <= 570; y += 52) {
        desktopContext.beginPath();
        desktopContext.moveTo(0, y);
        desktopContext.lineTo(1024, y);
        desktopContext.stroke();
      }
      desktopContext.fillStyle = "#05080d";
      desktopContext.fillRect(0, 0, 1024, 12);
      desktopContext.fillStyle = "rgba(7,11,18,.96)";
      desktopContext.fillRect(0, 570, 1024, 70);
      desktopContext.strokeStyle = "#40536b";
      desktopContext.lineWidth = 5;
      desktopContext.strokeRect(2, 2, 1020, 636);
      desktopContext.beginPath();
      desktopContext.moveTo(0, 570);
      desktopContext.lineTo(1024, 570);
      desktopContext.stroke();
      desktopContext.fillStyle = "#d8e7ec";
      desktopContext.font = "bold 20px monospace";
      desktopContext.fillText("AFFAN_OS", 24, 614);
      desktopContext.textAlign = "right";
      desktopContext.fillStyle = "#68e0ae";
      desktopContext.fillText("LAB ONLINE  •  08:28", 996, 614);
      desktopContext.textAlign = "left";
      const files = [
        { x: 138, y: 78, width: 170, height: 172, color: "#4ea7c8", title: "ARCHTECH", note: "projects/" },
        { x: 360, y: 78, width: 170, height: 172, color: "#7869bc", title: "SSIK", note: "consulting/" },
        { x: 582, y: 78, width: 170, height: 172, color: "#c4865d", title: "ABOUT", note: "profile.doc" },
        { x: 804, y: 78, width: 184, height: 172, color: "#d6b85d", title: "INSPIRATION", note: "credits/" },
        { x: 250, y: 306, width: 184, height: 168, color: "#4f9d7d", title: "CONTACT", note: "links.file" },
        { x: 512, y: 306, width: 184, height: 168, color: "#8da2ac", title: "RESUME", note: "resume.pdf" },
      ];
      for (const file of files) {
        desktopContext.fillStyle = "rgba(12,18,28,.9)";
        desktopContext.fillRect(file.x - file.width / 2, file.y, file.width, file.height);
        desktopContext.strokeStyle = "#40536b";
        desktopContext.lineWidth = 4;
        desktopContext.strokeRect(file.x - file.width / 2, file.y, file.width, file.height);
        desktopContext.fillStyle = file.color;
        desktopContext.fillRect(file.x - 42, file.y + 27, 84, 64);
        desktopContext.fillRect(file.x - 42, file.y + 17, 35, 16);
        desktopContext.strokeStyle = "#071019";
        desktopContext.lineWidth = 3;
        desktopContext.strokeRect(file.x - 42, file.y + 27, 84, 64);
        desktopContext.fillStyle = "#e3edf0";
        desktopContext.font = "bold 20px monospace";
        desktopContext.textAlign = "center";
        desktopContext.fillText(file.title, file.x, file.y + file.height - 46);
        desktopContext.fillStyle = "#91a3ae";
        desktopContext.font = "14px monospace";
        desktopContext.fillText(file.note, file.x, file.y + file.height - 22);
      }
    }
    const desktopTexture = new THREE.CanvasTexture(desktopCanvas);
    desktopTexture.colorSpace = THREE.SRGBColorSpace;
    desktopTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const desktopScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.92, 1.62),
      new THREE.MeshBasicMaterial({ map: desktopTexture, toneMapped: false }),
    );
    desktopScreen.position.set(0, 0.97, 0.071);
    desktopMonitor.add(desktopScreen);

    const addDesktopFile = (
      key: "archtech" | "ssik" | "profile" | "contact" | "resume" | "inspiration",
      label: string,
      x: number,
      y: number,
      width: number,
      height: number,
      color: THREE.ColorRepresentation,
    ) => {
      const file = hotspot(key, label, desktopMonitor);
      file.position.set(x, y, 0.09);
      const hitArea = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.035, depthWrite: false }),
      );
      file.add(hitArea);
      return file;
    };
    addDesktopFile("archtech", "OPEN ARCHTECH FILE", -1.16, 1.46, 0.53, 0.48, cyan);
    addDesktopFile("ssik", "OPEN SSIK FILE", -0.47, 1.46, 0.53, 0.48, violet);
    addDesktopFile("profile", "OPEN ABOUT FILE", 0.22, 1.46, 0.53, 0.48, amber);
    addDesktopFile("inspiration", "OPEN INSPIRATION FILE", 0.91, 1.46, 0.57, 0.48, "#d6b85d");
    addDesktopFile("contact", "OPEN CONTACT FILE", -0.81, 0.84, 0.57, 0.47, "#68e0ae");
    addDesktopFile("resume", "OPEN RESUME PDF", 0, 0.84, 0.57, 0.47, "#e7eceb");

    for (let row = 0; row < 4; row += 1) {
      for (let key = 0; key < 13; key += 1) {
        const keycap = roundedBox(
          workstation,
          [0.15, 0.028, 0.12],
          [-1.35 + key * 0.19, 0.125, 0.16 + row * 0.16],
          row === 0 && key > 9 ? "#3c4c54" : "#27353c",
          0.012,
          { metalness: 0.24, roughness: 0.48 },
        );
        keycap.name = "desktop-keycap";
      }
    }
    box(workstation, [0.72, 0.02, 0.58], [1.28, 0.11, 0.45], "#1a242a", { metalness: 0.35, roughness: 0.34 });
    const desktopMouse = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 18, 12),
      material("#252f35", { metalness: 0.48, roughness: 0.35 }),
    );
    desktopMouse.name = "desktop-mouse";
    desktopMouse.scale.set(0.72, 0.35, 1);
    desktopMouse.position.set(1.28, 0.15, 0.43);
    workstation.add(desktopMouse);
    const mouseWheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.075, 14),
      material("#77e7ff", { emissive: "#245765", emissiveIntensity: 0.35, roughness: 0.46 }),
    );
    mouseWheel.name = "desktop-mouse-scroll-wheel";
    mouseWheel.rotation.z = Math.PI / 2;
    mouseWheel.position.set(1.28, 0.205, 0.34);
    workstation.add(mouseWheel);
    const desktopTower = roundedBox(workstation, [0.48, 1.18, 0.85], [1.48, 0.6, -0.32], "#121a20", 0.055, {
      metalness: 0.62,
      roughness: 0.34,
    });
    desktopTower.name = "desktop-tower-beveled-case";
    box(workstation, [0.035, 1.02, 0.7], [1.23, 0.6, -0.32], "#263640", { metalness: 0.38, roughness: 0.24 });
    const towerGlass = new THREE.Mesh(
      new RoundedBoxGeometry(0.018, 0.92, 0.62, 3, 0.008),
      physicalMaterial("#17303b", {
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        transmission: 0.14,
        opacity: 0.68,
        emissive: "#0d2733",
        emissiveIntensity: 0.24,
      }),
    );
    towerGlass.name = "desktop-tower-glass";
    towerGlass.position.set(1.205, 0.6, -0.32);
    towerGlass.castShadow = true;
    workstation.add(towerGlass);
    const motherboard = box(workstation, [0.018, 0.58, 0.52], [1.185, 0.6, -0.3], "#20504c", {
      metalness: 0.22,
      roughness: 0.58,
    });
    motherboard.name = "desktop-motherboard";
    for (let trace = 0; trace < 4; trace += 1) {
      const boardTrace = box(
        workstation,
        [0.008, 0.018, 0.32 - trace * 0.045],
        [1.172, 0.43 + trace * 0.11, -0.27 + trace * 0.025],
        trace % 2 ? "#ffbd72" : "#77e7ff",
        { emissive: trace % 2 ? "#6e4022" : "#255765", emissiveIntensity: 0.55, roughness: 0.35 },
      );
      boardTrace.name = "desktop-motherboard-trace";
    }
    for (const y of [0.4, 0.75]) {
      const pcFan = new THREE.Mesh(
        new THREE.TorusGeometry(0.13, 0.017, 8, 24),
        material("#77e7ff", { emissive: "#255765", emissiveIntensity: 0.65, metalness: 0.34, roughness: 0.3 }),
      );
      pcFan.name = "desktop-case-fan-ring";
      pcFan.rotation.y = Math.PI / 2;
      pcFan.position.set(1.165, y, -0.33);
      workstation.add(pcFan);
      const pcFanHub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.027, 0.027, 0.018, 12),
        material("#243138", { metalness: 0.62, roughness: 0.3 }),
      );
      pcFanHub.rotation.z = Math.PI / 2;
      pcFanHub.position.set(1.155, y, -0.33);
      workstation.add(pcFanHub);
      if (highDetail) {
        for (let blade = 0; blade < 5; blade += 1) {
          const fanBlade = roundedBox(
            workstation,
            [0.008, 0.04, 0.105],
            [1.15, y, -0.33],
            "#4c6973",
            0.01,
            { metalness: 0.44, roughness: 0.28 },
          );
          fanBlade.name = "desktop-case-fan-blade";
          fanBlade.rotation.x = (blade / 5) * Math.PI * 2 + 0.32;
        }
      }
    }
    const cpuBlock = roundedBox(workstation, [0.025, 0.18, 0.18], [1.145, 0.57, -0.3], "#8b9498", 0.018, {
      metalness: 0.82,
      roughness: 0.22,
    });
    cpuBlock.name = "desktop-cpu-block";
    const graphicsCard = roundedBox(workstation, [0.035, 0.13, 0.43], [1.14, 0.34, -0.28], "#171f24", 0.022, {
      metalness: 0.62,
      roughness: 0.34,
    });
    graphicsCard.name = "desktop-graphics-card";
    for (let ramIndex = 0; ramIndex < 2; ramIndex += 1) {
      const ramStick = roundedBox(
        workstation,
        [0.02, 0.28, 0.035],
        [1.14, 0.62, -0.09 + ramIndex * 0.06],
        ramIndex === 0 ? "#9f91ff" : "#77e7ff",
        0.008,
        { emissive: ramIndex === 0 ? "#30285f" : "#225766", emissiveIntensity: 0.42, metalness: 0.42, roughness: 0.3 },
      );
      ramStick.name = "desktop-rgb-memory";
    }
    if (highDetail) {
      for (let vent = 0; vent < 8; vent += 1) {
        const towerVent = roundedBox(
          workstation,
          [0.26, 0.015, 0.012],
          [1.48, 0.3 + vent * 0.075, 0.112],
          "#52636b",
          0.004,
          { metalness: 0.68, roughness: 0.32 },
        );
        towerVent.name = "desktop-tower-front-vent";
      }
    }
    box(workstation, [0.03, 0.88, 0.055], [1.225, 0.62, -0.34], "#77e7ff", {
      emissive: "#255765",
      emissiveIntensity: 0.86,
      roughness: 0.24,
    });
    const pcPower = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 10, 8),
      material(cyan, { emissive: cyan, emissiveIntensity: 2.2 }),
    );
    pcPower.name = "desktop-pc-power";
    pcPower.position.set(1.49, 1.02, 0.115);
    workstation.add(pcPower);

    const rack = hotspot("rack", "PROXMOX SERVER RACK");
    rack.position.set(4.45, 0, -3.35);
    const rackBase = roundedBox(rack, [1.9, 0.16, 1.46], [0, 0.1, 0], "#151d24", 0.045, {
      metalness: 0.7,
      roughness: 0.36,
    });
    rackBase.name = "server-rack-beveled-base";
    const rackCap = roundedBox(rack, [1.9, 0.16, 1.46], [0, 3.7, 0], "#151d24", 0.045, {
      metalness: 0.7,
      roughness: 0.36,
    });
    rackCap.name = "server-rack-beveled-cap";
    for (const x of [-0.86, 0.86]) {
      for (const z of [-0.62, 0.62]) {
        box(rack, [0.14, 3.65, 0.14], [x, 1.85, z], "#202b32", { metalness: 0.78, roughness: 0.3 });
      }
    }
    box(rack, [1.62, 3.38, 0.08], [0, 1.9, -0.67], "#0f151a", { metalness: 0.54, roughness: 0.46 });
    for (let unit = 0; unit < 7; unit += 1) {
      const faceplate = roundedBox(rack, [1.58, 0.34, 0.14], [0, 0.55 + unit * 0.44, 0.69], unit === 5 ? "#1d2930" : "#26323a", 0.025, {
        metalness: 0.7,
        roughness: 0.38,
      });
      faceplate.name = "server-rack-unit-faceplate";
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.045, 0.025),
        material(unit % 3 === 0 ? amber : "#68e0ae", {
          emissive: unit % 3 === 0 ? amber : "#68e0ae",
          emissiveIntensity: 2,
        }),
      );
      led.position.set(0.61, 0.55 + unit * 0.44, 0.775);
      rack.add(led);
      box(rack, [0.18, 0.1, 0.035], [-0.61, 0.55 + unit * 0.44, 0.777], "#0c1115", { metalness: 0.8 });
      for (let port = 0; port < 5; port += 1) {
        const serverPort = roundedBox(
          rack,
          [0.082, 0.05, 0.026],
          [-0.34 + port * 0.125, 0.55 + unit * 0.44, 0.78],
          "#61757d",
          0.008,
          { metalness: 0.72 },
        );
        serverPort.name = "server-rack-network-port";
      }
      for (const x of [-0.7, 0.7]) {
        const screw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 0.018, 12),
          material("#a6b2b6", { metalness: 0.92, roughness: 0.18 }),
        );
        screw.name = "server-rack-screw";
        screw.rotation.x = Math.PI / 2;
        screw.position.set(x, 0.55 + unit * 0.44, 0.785);
        rack.add(screw);
      }
      for (const x of [-0.55, 0.55]) {
        const unitHandle = roundedBox(
          rack,
          [0.16, 0.055, 0.045],
          [x, 0.55 + unit * 0.44, 0.795],
          "#89969b",
          0.012,
          { metalness: 0.86, roughness: 0.24 },
        );
        unitHandle.name = "server-rack-unit-handle";
      }
    }
    box(rack, [0.1, 3.3, 0.1], [-0.72, 1.86, 0.79], "#53636a", { metalness: 0.88 });
    box(rack, [0.1, 3.3, 0.1], [0.72, 1.86, 0.79], "#53636a", { metalness: 0.88 });
    for (let vent = 0; vent < 10; vent += 1) {
      box(rack, [0.82, 0.025, 0.025], [0, 3.27 + vent * 0.035, 0.79], "#415158", { metalness: 0.72, roughness: 0.34 });
    }
    const rackBadge = roundedBox(rack, [0.44, 0.14, 0.03], [-0.48, 3.4, 0.8], "#10171c", 0.018, {
      metalness: 0.46,
      roughness: 0.4,
      emissive: "#122830",
      emissiveIntensity: 0.25,
    });
    rackBadge.name = "server-rack-status-badge";
    if (highDetail) {
      for (const x of [-0.72, 0.72]) {
        for (let hole = 0; hole < 17; hole += 1) {
          const railHole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.012, 0.018, 8),
            material("#11171b", { metalness: 0.35, roughness: 0.56 }),
          );
          railHole.name = "server-rack-rail-hole";
          railHole.rotation.x = Math.PI / 2;
          railHole.position.set(x, 0.38 + hole * 0.185, 0.802);
          rack.add(railHole);
        }
      }
    }
    const serverBeacon = easterHotspot("signal", "PRESS SERVER BEACON", rack);
    serverBeacon.position.set(0.69, 3.38, 0.81);
    const serverBeaconMaterial = material("#68e0ae", {
      emissive: "#68e0ae",
      emissiveIntensity: 2.4,
      metalness: 0.42,
      roughness: 0.22,
    });
    const serverBeaconButton = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.055, 18),
      serverBeaconMaterial,
    );
    serverBeaconButton.name = "hidden-server-beacon";
    serverBeaconButton.rotation.x = Math.PI / 2;
    serverBeacon.add(serverBeaconButton);
    const serverBeaconLight = new THREE.PointLight(0x68e0ae, 0, 2.8, 2);
    serverBeaconLight.position.set(0, 0, 0.22);
    serverBeacon.add(serverBeaconLight);

    const printer = hotspot("printer", "3D PRINTER");
    printer.position.set(1.28, 1.45, -3.18);
    const printerBase = roundedBox(printer, [2.05, 0.14, 1.7], [0, 0.08, 0], "#222d34", 0.055, {
      metalness: 0.55,
      roughness: 0.38,
    });
    printerBase.name = "printer-beveled-base";
    box(printer, [0.14, 2.5, 0.14], [-0.9, 1.3, -0.68], "#202a31", { metalness: 0.62 });
    box(printer, [0.14, 2.5, 0.14], [0.9, 1.3, -0.68], "#202a31", { metalness: 0.62 });
    box(printer, [1.95, 0.14, 0.14], [0, 2.52, -0.68], "#202a31", { metalness: 0.62 });
    for (const x of [-0.74, 0.74]) {
      const leadScrew = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 2.32, 12),
        material("#9aa9ad", { metalness: 0.94, roughness: 0.2 }),
      );
      leadScrew.name = "printer-z-lead-screw";
      leadScrew.position.set(x, 1.34, -0.63);
      printer.add(leadScrew);
      for (let thread = 0; thread < 13; thread += 1) {
        const threadRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.026, 0.004, 5, 10),
          material("#c5cfd1", { metalness: 0.96, roughness: 0.18 }),
        );
        threadRing.name = "printer-lead-screw-thread";
        threadRing.rotation.x = Math.PI / 2;
        threadRing.position.set(x, 0.28 + thread * 0.17, -0.63);
        printer.add(threadRing);
      }
    }
    const printBedAssembly = new THREE.Group();
    printBedAssembly.name = "printer-y-bed";
    printer.add(printBedAssembly);
    const printBed = roundedBox(printBedAssembly, [1.72, 0.1, 1.35], [0, 0.25, 0], "#29363d", 0.035, {
      metalness: 0.38,
      roughness: 0.46,
    });
    printBed.name = "printer-textured-build-plate";
    for (const x of [-0.72, 0.72]) {
      for (const z of [-0.52, 0.52]) {
        const bedClip = roundedBox(printBedAssembly, [0.16, 0.035, 0.08], [x, 0.31, z], "#9aa8ac", 0.012, {
          metalness: 0.88,
          roughness: 0.24,
        });
        bedClip.name = "printer-bed-clip";
        const bedSpring = new THREE.Mesh(
          new THREE.TorusKnotGeometry(0.034, 0.006, highDetail ? 34 : 18, 5, 2, 5),
          material("#89979b", { metalness: 0.86, roughness: 0.26 }),
        );
        bedSpring.name = "printer-bed-spring";
        bedSpring.scale.set(0.65, 0.65, 0.65);
        bedSpring.position.set(x, 0.19, z);
        printBedAssembly.add(bedSpring);
      }
    }
    const printedChessSet = new THREE.Group();
    printedChessSet.name = "printer-miniature-chess-set";
    printedChessSet.position.set(0, 0.28, 0);
    printBedAssembly.add(printedChessSet);
    const printableParts: THREE.Object3D[] = [];
    const chessSetHeight = 0.62;
    const chessLayerHeight = 0.024;
    const blackChessMaterial = material("#080a0d", {
      emissive: "#020304",
      emissiveIntensity: 0.12,
      metalness: 0.18,
      roughness: 0.48,
    });
    const whiteChessMaterial = material("#f1f2ed", {
      emissive: "#34383b",
      emissiveIntensity: 0.12,
      metalness: 0.16,
      roughness: 0.42,
    });
    const darkBoardMaterial = material("#11161b", { metalness: 0.3, roughness: 0.48 });
    const lightBoardMaterial = material("#d9dbd7", { metalness: 0.12, roughness: 0.52 });
    const addPrintablePart = (part: THREE.Object3D, printHeight: number) => {
      part.visible = false;
      part.userData.printHeight = printHeight;
      printableParts.push(part);
      printedChessSet.add(part);
    };

    for (let layer = 0; layer < 3; layer += 1) {
      const y = 0.01 + layer * 0.018;
      const boardLayer = new THREE.Mesh(
        new RoundedBoxGeometry(1.22, 0.016, 1.22, 2, 0.006),
        layer === 2 ? lightBoardMaterial : darkBoardMaterial,
      );
      boardLayer.name = "chess-board-layer";
      boardLayer.position.y = y;
      addPrintablePart(boardLayer, y);
    }
    const squareSize = 0.142;
    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column < 8; column += 1) {
        const square = new THREE.Mesh(
          new THREE.BoxGeometry(squareSize * 0.94, 0.012, squareSize * 0.94),
          (row + column) % 2 === 0 ? whiteChessMaterial : blackChessMaterial,
        );
        square.name = "chess-board-square";
        square.position.set(
          (column - 3.5) * squareSize,
          0.064,
          (row - 3.5) * squareSize,
        );
        addPrintablePart(square, 0.064);
      }
    }
    for (const [size, position] of [
      [[1.3, 0.035, 0.04], [0, 0.076, -0.63]],
      [[1.3, 0.035, 0.04], [0, 0.076, 0.63]],
      [[0.04, 0.035, 1.22], [-0.63, 0.076, 0]],
      [[0.04, 0.035, 1.22], [0.63, 0.076, 0]],
    ] as Array<[[number, number, number], [number, number, number]]>) {
      const boardBorder = new THREE.Mesh(new RoundedBoxGeometry(...size, 2, 0.01), darkBoardMaterial);
      boardBorder.name = "chess-board-beveled-border";
      boardBorder.position.set(...position);
      addPrintablePart(boardBorder, 0.076);
    }

    type ChessPieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
    const pieceHeights: Record<ChessPieceType, number> = {
      pawn: 0.24,
      rook: 0.31,
      knight: 0.34,
      bishop: 0.36,
      queen: 0.4,
      king: 0.43,
    };
    const backRank: ChessPieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
    const pieceProfiles: Record<ChessPieceType, Array<[number, number]>> = {
      pawn: [
        [0, 0.062], [0.1, 0.064], [0.2, 0.054], [0.3, 0.044], [0.52, 0.031],
        [0.62, 0.027], [0.7, 0.04], [0.82, 0.051], [0.93, 0.041], [1, 0.018],
      ],
      rook: [
        [0, 0.064], [0.1, 0.066], [0.2, 0.055], [0.3, 0.044], [0.62, 0.038],
        [0.72, 0.047], [0.8, 0.057], [0.92, 0.058], [1, 0.056],
      ],
      knight: [
        [0, 0.064], [0.1, 0.066], [0.2, 0.055], [0.31, 0.044], [0.58, 0.035],
        [0.7, 0.031], [0.82, 0.037], [0.92, 0.043], [1, 0.038],
      ],
      bishop: [
        [0, 0.064], [0.1, 0.066], [0.2, 0.055], [0.3, 0.043], [0.57, 0.031],
        [0.66, 0.028], [0.73, 0.044], [0.84, 0.051], [0.95, 0.036], [1, 0.016],
      ],
      queen: [
        [0, 0.066], [0.1, 0.068], [0.2, 0.057], [0.31, 0.045], [0.58, 0.032],
        [0.67, 0.03], [0.73, 0.044], [0.8, 0.052], [0.9, 0.046], [1, 0.038],
      ],
      king: [
        [0, 0.068], [0.1, 0.07], [0.2, 0.058], [0.31, 0.046], [0.58, 0.033],
        [0.67, 0.031], [0.74, 0.046], [0.82, 0.052], [0.93, 0.04], [1, 0.035],
      ],
    };
    const pieceRadius = (kind: ChessPieceType, progress: number) => {
      const profile = pieceProfiles[kind];
      for (let index = 1; index < profile.length; index += 1) {
        const [rightProgress, rightRadius] = profile[index];
        if (progress > rightProgress) continue;
        const [leftProgress, leftRadius] = profile[index - 1];
        const localProgress = (progress - leftProgress) / Math.max(0.001, rightProgress - leftProgress);
        return THREE.MathUtils.lerp(leftRadius, rightRadius, localProgress);
      }
      return profile[profile.length - 1][1];
    };
    const addChessPiece = (
      kind: ChessPieceType,
      column: number,
      row: number,
      side: "black" | "white",
    ) => {
      const pieceMaterial = side === "white" ? whiteChessMaterial : blackChessMaterial;
      const x = (column - 3.5) * squareSize;
      const z = (row - 3.5) * squareSize;
      const pieceHeight = pieceHeights[kind];
      const pieceLayerCount = Math.ceil(pieceHeight / chessLayerHeight);
      const baseRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.054, 0.009, 6, 18),
        pieceMaterial,
      );
      baseRing.name = "chess-piece-base-ring";
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.set(x, 0.082, z);
      addPrintablePart(baseRing, 0.082);
      const lowerBaseRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.049, 0.006, 6, highDetail ? 20 : 14),
        pieceMaterial,
      );
      lowerBaseRing.name = "chess-piece-lower-base-ring";
      lowerBaseRing.rotation.x = Math.PI / 2;
      lowerBaseRing.position.set(x, 0.108, z);
      addPrintablePart(lowerBaseRing, 0.108);
      for (let layer = 0; layer < pieceLayerCount; layer += 1) {
        const relativeY = Math.min(pieceHeight, (layer + 0.5) * chessLayerHeight);
        const progress = relativeY / pieceHeight;
        const radius = pieceRadius(kind, progress);
        const pieceLayer = new THREE.Mesh(
          new THREE.CylinderGeometry(radius, radius, chessLayerHeight * 0.82, highDetail ? 20 : 12),
          pieceMaterial,
        );
        pieceLayer.name = `chess-${kind}-layer`;
        pieceLayer.position.set(x, 0.072 + relativeY, z);
        addPrintablePart(pieceLayer, 0.072 + relativeY);
      }

      const topY = 0.072 + pieceHeight;
      if (kind !== "pawn") {
        const collarY = 0.072 + pieceHeight * 0.7;
        const collar = new THREE.Mesh(
          new THREE.TorusGeometry(kind === "king" || kind === "queen" ? 0.043 : 0.037, 0.007, 6, highDetail ? 20 : 14),
          pieceMaterial,
        );
        collar.name = "chess-piece-collar-ring";
        collar.rotation.x = Math.PI / 2;
        collar.position.set(x, collarY, z);
        addPrintablePart(collar, collarY);
      }

      if (kind === "pawn") {
        const pawnHead = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, highDetail ? 18 : 12, highDetail ? 14 : 9),
          pieceMaterial,
        );
        pawnHead.name = "chess-pawn-spherical-head";
        pawnHead.position.set(x, topY - 0.012, z);
        addPrintablePart(pawnHead, topY + 0.03);
      } else if (kind === "rook") {
        const rookCrown = new THREE.Mesh(
          new THREE.TorusGeometry(0.052, 0.008, 6, highDetail ? 22 : 14),
          pieceMaterial,
        );
        rookCrown.name = "chess-rook-crown-ring";
        rookCrown.rotation.x = Math.PI / 2;
        rookCrown.position.set(x, topY - 0.01, z);
        addPrintablePart(rookCrown, topY);
        for (let turret = 0; turret < 6; turret += 1) {
          const angle = (turret / 6) * Math.PI * 2;
          const battlement = new THREE.Mesh(
            new RoundedBoxGeometry(0.027, 0.042, 0.03, 2, 0.005),
            pieceMaterial,
          );
          battlement.name = "chess-rook-battlement";
          battlement.position.set(
            x + Math.cos(angle) * 0.039,
            topY + 0.013,
            z + Math.sin(angle) * 0.039,
          );
          battlement.rotation.y = -angle;
          addPrintablePart(battlement, topY + 0.034);
        }
      } else if (kind === "knight") {
        const facing = side === "white" ? -1 : 1;
        const knightHead = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.036, 0.065, highDetail ? 5 : 3, highDetail ? 10 : 7),
          pieceMaterial,
        );
        knightHead.name = "chess-knight-head";
        knightHead.position.set(x + facing * 0.018, topY - 0.004, z);
        knightHead.rotation.z = facing * 0.5;
        addPrintablePart(knightHead, topY + 0.048);
        const knightSnout = new THREE.Mesh(
          new RoundedBoxGeometry(0.06, 0.035, 0.048, 2, 0.01),
          pieceMaterial,
        );
        knightSnout.name = "chess-knight-snout";
        knightSnout.position.set(x + facing * 0.052, topY + 0.008, z);
        knightSnout.rotation.z = facing * 0.12;
        addPrintablePart(knightSnout, topY + 0.027);
        for (const earZ of [-0.018, 0.018]) {
          const knightEar = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.045, 8), pieceMaterial);
          knightEar.name = "chess-knight-ear";
          knightEar.position.set(x - facing * 0.006, topY + 0.052, z + earZ);
          knightEar.rotation.z = -facing * 0.18;
          addPrintablePart(knightEar, topY + 0.074);
        }
        for (let mane = 0; mane < 3; mane += 1) {
          const maneRidge = new THREE.Mesh(
            new THREE.ConeGeometry(0.015, 0.038, 7),
            pieceMaterial,
          );
          maneRidge.name = "chess-knight-mane";
          maneRidge.position.set(x - facing * (0.018 + mane * 0.014), topY + 0.027 - mane * 0.02, z);
          maneRidge.rotation.z = -facing * 0.75;
          addPrintablePart(maneRidge, topY + 0.05 - mane * 0.016);
        }
      } else if (kind === "bishop") {
        const bishopMitre = new THREE.Mesh(
          new THREE.SphereGeometry(0.046, highDetail ? 18 : 12, highDetail ? 14 : 9),
          pieceMaterial,
        );
        bishopMitre.name = "chess-bishop-mitre";
        bishopMitre.scale.set(0.78, 1.18, 0.78);
        bishopMitre.position.set(x, topY - 0.012, z);
        addPrintablePart(bishopMitre, topY + 0.042);
        const bishopTip = new THREE.Mesh(
          new THREE.ConeGeometry(0.025, 0.065, highDetail ? 16 : 10),
          pieceMaterial,
        );
        bishopTip.name = "chess-bishop-tip";
        bishopTip.position.set(x, topY + 0.042, z);
        addPrintablePart(bishopTip, topY + 0.074);
        const bishopSlash = new THREE.Mesh(
          new RoundedBoxGeometry(0.012, 0.062, 0.014, 2, 0.004),
          side === "white" ? blackChessMaterial : whiteChessMaterial,
        );
        bishopSlash.name = "chess-bishop-mitre-slash";
        bishopSlash.position.set(x + 0.035, topY, z);
        bishopSlash.rotation.z = -0.48;
        addPrintablePart(bishopSlash, topY + 0.035);
      } else if (kind === "queen") {
        const queenCrownRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.045, 0.008, 6, highDetail ? 20 : 14),
          pieceMaterial,
        );
        queenCrownRing.name = "chess-queen-crown-ring";
        queenCrownRing.rotation.x = Math.PI / 2;
        queenCrownRing.position.set(x, topY - 0.008, z);
        addPrintablePart(queenCrownRing, topY);
        for (let crown = 0; crown < 6; crown += 1) {
          const angle = (crown / 6) * Math.PI * 2;
          const crownSpike = new THREE.Mesh(
            new THREE.ConeGeometry(0.014, 0.06, 7),
            pieceMaterial,
          );
          crownSpike.name = "chess-queen-crown-spike";
          crownSpike.position.set(x + Math.cos(angle) * 0.038, topY + 0.025, z + Math.sin(angle) * 0.038);
          crownSpike.rotation.z = Math.cos(angle) * 0.18;
          crownSpike.rotation.x = Math.sin(angle) * 0.18;
          addPrintablePart(crownSpike, topY + 0.055);
          const crownPoint = new THREE.Mesh(
            new THREE.SphereGeometry(0.011, 8, 6),
            pieceMaterial,
          );
          crownPoint.name = "chess-queen-crown";
          crownPoint.position.set(x + Math.cos(angle) * 0.041, topY + 0.055, z + Math.sin(angle) * 0.041);
          addPrintablePart(crownPoint, topY + 0.066);
        }
      } else if (kind === "king") {
        const kingOrb = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, highDetail ? 16 : 10, highDetail ? 12 : 8),
          pieceMaterial,
        );
        kingOrb.name = "chess-king-orb";
        kingOrb.position.set(x, topY + 0.012, z);
        addPrintablePart(kingOrb, topY + 0.046);
        const crossStem = new THREE.Mesh(new RoundedBoxGeometry(0.018, 0.075, 0.018, 2, 0.004), pieceMaterial);
        crossStem.name = "chess-king-cross";
        crossStem.position.set(x, topY + 0.07, z);
        addPrintablePart(crossStem, topY + 0.108);
        const crossBar = new THREE.Mesh(new RoundedBoxGeometry(0.065, 0.018, 0.018, 2, 0.004), pieceMaterial);
        crossBar.name = "chess-king-cross";
        crossBar.position.set(x, topY + 0.076, z);
        addPrintablePart(crossBar, topY + 0.085);
      }
    };

    for (let column = 0; column < 8; column += 1) {
      addChessPiece(backRank[column], column, 0, "black");
      addChessPiece("pawn", column, 1, "black");
      addChessPiece("pawn", column, 6, "white");
      addChessPiece(backRank[column], column, 7, "white");
    }
    printableParts.sort((a, b) => Number(a.userData.printHeight) - Number(b.userData.printHeight));

    const printerGantry = new THREE.Group();
    printerGantry.name = "printer-z-gantry";
    printerGantry.position.y = 0.84;
    printer.add(printerGantry);
    box(printerGantry, [1.72, 0.08, 0.08], [0, 0, -0.28], "#68777d", { metalness: 0.9 });
    for (const x of [-0.68, 0.68]) {
      const gantryWheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.045, 18),
        material("#11171b", { metalness: 0.4, roughness: 0.48 }),
      );
      gantryWheel.name = "printer-gantry-wheel";
      gantryWheel.rotation.x = Math.PI / 2;
      gantryWheel.position.set(x, 0, -0.23);
      printerGantry.add(gantryWheel);
    }
    const printHead = new THREE.Group();
    printHead.name = "printer-head-carriage";
    printHead.position.set(0, 0, -0.28);
    printerGantry.add(printHead);
    box(printHead, [0.5, 0.34, 0.44], [0, -0.08, 0.02], "#151d23", { metalness: 0.72, roughness: 0.32 });
    box(printHead, [0.32, 0.11, 0.455], [0, 0.11, 0.025], "#303e44", { metalness: 0.78, roughness: 0.26 });
    const extruderFan = new THREE.Mesh(
      new THREE.TorusGeometry(0.105, 0.014, 8, highDetail ? 28 : 18),
      material("#7f8f95", { metalness: 0.72, roughness: 0.28 }),
    );
    extruderFan.name = "printer-extruder-fan-grille";
    extruderFan.position.set(0, -0.08, 0.247);
    printHead.add(extruderFan);
    const extruderFanHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.018, 12),
      material("#20292e", { metalness: 0.55, roughness: 0.34 }),
    );
    extruderFanHub.name = "printer-extruder-fan-hub";
    extruderFanHub.rotation.x = Math.PI / 2;
    extruderFanHub.position.set(0, -0.08, 0.257);
    printHead.add(extruderFanHub);
    if (highDetail) {
      for (let blade = 0; blade < 6; blade += 1) {
        const extruderBlade = roundedBox(
          printHead,
          [0.022, 0.078, 0.01],
          [0, -0.08, 0.258],
          "#45565d",
          0.006,
          { metalness: 0.45, roughness: 0.34 },
        );
        extruderBlade.name = "printer-extruder-fan-blade";
        extruderBlade.rotation.z = (blade / 6) * Math.PI * 2;
      }
    }
    const hotendAssembly = new THREE.Group();
    hotendAssembly.name = "printer-hotend-assembly";
    hotendAssembly.position.set(0, -0.08, 0.1);
    printHead.add(hotendAssembly);
    const heatsinkCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.17, highDetail ? 18 : 12),
      material("#aab8bc", { metalness: 0.94, roughness: 0.2 }),
    );
    heatsinkCore.name = "printer-hotend-heatsink-core";
    heatsinkCore.position.y = 0.035;
    hotendAssembly.add(heatsinkCore);
    for (let fin = 0; fin < 6; fin += 1) {
      const heatsinkFin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.078, 0.078, 0.012, highDetail ? 24 : 14),
        material(fin % 2 ? "#9eacb0" : "#c2cccf", { metalness: 0.94, roughness: 0.18 }),
      );
      heatsinkFin.name = "printer-hotend-heatsink-fin";
      heatsinkFin.position.y = 0.105 - fin * 0.03;
      hotendAssembly.add(heatsinkFin);
    }
    const heatBreak = new THREE.Mesh(
      new THREE.CylinderGeometry(0.021, 0.024, 0.085, highDetail ? 16 : 10),
      material("#d2dcde", { metalness: 0.96, roughness: 0.16 }),
    );
    heatBreak.name = "printer-hotend-heat-break";
    heatBreak.position.y = -0.095;
    hotendAssembly.add(heatBreak);
    const heaterBlock = roundedBox(
      hotendAssembly,
      [0.18, 0.11, 0.15],
      [0, -0.165, 0],
      "#bd7846",
      0.018,
      { metalness: 0.88, roughness: 0.25 },
    );
    heaterBlock.name = "printer-hotend-heater-block";
    const siliconeSock = roundedBox(
      hotendAssembly,
      [0.185, 0.07, 0.155],
      [0, -0.192, 0],
      "#20262a",
      0.022,
      { metalness: 0.08, roughness: 0.78 },
    );
    siliconeSock.name = "printer-hotend-silicone-sock";
    const heatingCartridge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.24, 12),
      material("#d3dadc", { metalness: 0.96, roughness: 0.16 }),
    );
    heatingCartridge.name = "printer-hotend-heating-cartridge";
    heatingCartridge.rotation.z = Math.PI / 2;
    heatingCartridge.position.set(0, -0.16, 0.018);
    hotendAssembly.add(heatingCartridge);
    const thermistor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 0.08, 10),
      material("#e2a768", { metalness: 0.82, roughness: 0.26 }),
    );
    thermistor.name = "printer-hotend-thermistor";
    thermistor.rotation.x = Math.PI / 2;
    thermistor.position.set(0.055, -0.16, 0.09);
    hotendAssembly.add(thermistor);
    const nozzleHex = new THREE.Mesh(
      new THREE.CylinderGeometry(0.047, 0.047, 0.055, 6),
      material("#d79b4f", { metalness: 0.92, roughness: 0.2 }),
    );
    nozzleHex.name = "printer-brass-nozzle-hex";
    nozzleHex.position.y = -0.245;
    hotendAssembly.add(nozzleHex);
    const brassNozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.042, 0.105, highDetail ? 18 : 12),
      material("#e0a74f", { metalness: 0.94, roughness: 0.18 }),
    );
    brassNozzle.name = "printer-brass-nozzle-cone";
    brassNozzle.position.y = -0.325;
    hotendAssembly.add(brassNozzle);
    const nozzleTip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.009, 0.035, 10),
      material("#b87531", { metalness: 0.92, roughness: 0.2 }),
    );
    nozzleTip.name = "printer-nozzle-fine-tip";
    nozzleTip.position.y = -0.395;
    hotendAssembly.add(nozzleTip);
    const extrusionThread = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.055, 8),
      material("#f1f2ed", { roughness: 0.48 }),
    );
    extrusionThread.name = "printer-active-filament-thread";
    extrusionThread.position.y = -0.438;
    hotendAssembly.add(extrusionThread);
    const filamentFeedTube = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.18, 0.12, -0.03),
          new THREE.Vector3(-0.12, 0.24, 0.01),
          new THREE.Vector3(-0.035, 0.18, 0.08),
          new THREE.Vector3(0, 0.09, 0.1),
        ]),
        highDetail ? 24 : 14,
        0.013,
        7,
        false,
      ),
      material("#dce7e9", { metalness: 0.06, roughness: 0.58 }),
    );
    filamentFeedTube.name = "printer-filament-feed-tube";
    printHead.add(filamentFeedTube);
    const xAxisBelt = box(printerGantry, [1.48, 0.022, 0.035], [0, 0.055, -0.31], "#111417", {
      metalness: 0.16,
      roughness: 0.76,
    });
    xAxisBelt.name = "printer-x-axis-belt";
    for (const x of [-0.81, 0.81]) {
      const stepperMotor = roundedBox(printer, [0.25, 0.25, 0.25], [x, 0.36, -0.65], "#303a40", 0.028, {
        metalness: 0.74,
        roughness: 0.3,
      });
      stepperMotor.name = "printer-stepper-motor";
      const motorCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.035, 14),
        material("#a4afb2", { metalness: 0.92, roughness: 0.18 }),
      );
      motorCap.name = "printer-stepper-shaft";
      motorCap.rotation.x = Math.PI / 2;
      motorCap.position.set(x, 0.36, -0.5);
      printer.add(motorCap);
    }
    const createPrinterSpool = (name: string, color: string, emissive: string, x: number) => {
      const spoolGroup = new THREE.Group();
      spoolGroup.name = name;
      spoolGroup.position.set(x, 2.86, -0.63);
      printer.add(spoolGroup);

      const filament = new THREE.Mesh(
        new THREE.CylinderGeometry(0.29, 0.29, 0.15, 28),
        material(color, {
          emissive,
          emissiveIntensity: color === "#f4f4ef" ? 0.08 : 0.18,
          metalness: color === "#080a0d" ? 0.18 : 0.08,
          roughness: 0.5,
        }),
      );
      filament.name = `${name}-filament`;
      filament.rotation.z = Math.PI / 2;
      spoolGroup.add(filament);
      for (const rimX of [-0.095, 0.095]) {
        const rim = new THREE.Mesh(
          new THREE.CylinderGeometry(0.34, 0.34, 0.025, 30),
          material("#273239", { metalness: 0.52, roughness: 0.36 }),
        );
        rim.name = `${name}-rim`;
        rim.rotation.z = Math.PI / 2;
        rim.position.x = rimX;
        spoolGroup.add(rim);
      }

      const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.105, 0.105, 0.19, 20),
        material("#56636a", { metalness: 0.58, roughness: 0.34 }),
      );
      core.name = `${name}-core`;
      core.rotation.z = Math.PI / 2;
      spoolGroup.add(core);
      return spoolGroup;
    };
    createPrinterSpool("printer-spool-black", "#080a0d", "#010203", -0.66);
    createPrinterSpool("printer-spool-orange", "#ef7d4d", "#7b2f1d", -0.22);
    createPrinterSpool("printer-spool-purple", "#7d62d9", "#332568", 0.22);
    createPrinterSpool("printer-spool-white", "#f4f4ef", "#34383b", 0.66);
    box(printer, [0.52, 0.32, 0.08], [0.62, 0.28, 0.88], "#162028", { metalness: 0.55 });
    const printerDisplayCanvas = document.createElement("canvas");
    printerDisplayCanvas.width = 256;
    printerDisplayCanvas.height = 96;
    const printerDisplayContext = printerDisplayCanvas.getContext("2d");
    const printerDisplayTexture = new THREE.CanvasTexture(printerDisplayCanvas);
    printerDisplayTexture.colorSpace = THREE.SRGBColorSpace;
    const printerDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.17),
      new THREE.MeshBasicMaterial({ map: printerDisplayTexture, toneMapped: false }),
    );
    printerDisplay.position.set(0.62, 0.28, 0.926);
    printer.add(printerDisplay);
    const drawPrinterDisplay = (progress: number) => {
      if (!printerDisplayContext) return;
      const percent = Math.round(progress * 100);
      const remainingSeconds = Math.max(0, Math.ceil((PRINT_DURATION_MS * (1 - progress)) / 1000));
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = `${remainingSeconds % 60}`.padStart(2, "0");
      printerDisplayContext.fillStyle = "#10221f";
      printerDisplayContext.fillRect(0, 0, 256, 96);
      printerDisplayContext.fillStyle = progress >= 1 ? "#f6d36c" : "#7df0c0";
      printerDisplayContext.font = "bold 26px monospace";
      printerDisplayContext.fillText(progress >= 1 ? "COMPLETE" : `PRINT ${`${percent}`.padStart(3, "0")}%`, 12, 35);
      printerDisplayContext.fillStyle = "#dcece5";
      printerDisplayContext.font = "19px monospace";
      printerDisplayContext.fillText(progress >= 1 ? "CHESS SET READY" : `ETA ${minutes}:${seconds}`, 12, 70);
      printerDisplayTexture.needsUpdate = true;
    };
    drawPrinterDisplay(0);
    const printCompletionLight = new THREE.PointLight(0xf6d36c, 0, 3.2, 2);
    printCompletionLight.position.set(0, 1.1, 0.4);
    printer.add(printCompletionLight);

    const bookshelf = new THREE.Group();
    bookshelf.position.set(-5.4, 0, 0.85);
    room.add(bookshelf);
    box(bookshelf, [0.22, 2.4, 3.15], [-0.18, 1.2, 0], "#19262c", { metalness: 0.34, roughness: 0.62 });
    for (const z of [-1.5, 1.5]) {
      box(bookshelf, [0.72, 2.45, 0.16], [0.1, 1.23, z], "#51466f", { metalness: 0.42, roughness: 0.54 });
    }
    for (const y of [0.16, 1.17, 2.35]) {
      box(bookshelf, [0.72, 0.14, 3.15], [0.1, y, 0], y === 1.17 ? "#315765" : "#3a465e", {
        metalness: 0.42,
        roughness: 0.54,
      });
    }
    for (const y of [0.2, 1.2, 2.38]) {
      for (const z of [-1.36, 1.36]) {
        const shelfFastener = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.018, 12),
          material("#a7b4b8", { metalness: 0.92, roughness: 0.2 }),
        );
        shelfFastener.name = "shelf-fastener";
        shelfFastener.rotation.z = Math.PI / 2;
        shelfFastener.position.set(-4.95, y, 0.85 + z);
        room.add(shelfFastener);
      }
    }
    const shelfSwordBaseY = 0.38;
    const shelfSword = easterHotspot("relic", "TOUCH THE PRINTED KATANA");
    shelfSword.name = "bottom-shelf-printed-katana";
    shelfSword.position.set(-4.98, shelfSwordBaseY, 0.72);
    const shelfSwordBladeMaterial = material("#f1f2ed", {
      emissive: "#30353a",
      emissiveIntensity: 0.2,
      metalness: 0.82,
      roughness: 0.16,
    });
    const shelfSwordHiltMaterial = material("#111317", {
      emissive: "#241c3b",
      emissiveIntensity: 0.22,
      metalness: 0.42,
      roughness: 0.36,
    });
    const shelfSwordDarkMaterial = material("#080a0d", { metalness: 0.72, roughness: 0.28 });
    const katanaProfile = new THREE.Shape();
    katanaProfile.moveTo(-0.055, -0.48);
    katanaProfile.lineTo(0.055, -0.48);
    katanaProfile.bezierCurveTo(0.075, 0.24, 0.105, 0.95, 0.17, 1.42);
    katanaProfile.quadraticCurveTo(0.19, 1.54, 0.015, 1.66);
    katanaProfile.bezierCurveTo(-0.005, 0.96, -0.03, 0.16, -0.055, -0.48);
    katanaProfile.closePath();
    const katanaBladeGeometry = new THREE.ExtrudeGeometry(katanaProfile, {
      depth: 0.055,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.007,
      bevelThickness: 0.006,
      curveSegments: 18,
      steps: 1,
    });
    katanaBladeGeometry.rotateX(Math.PI / 2);
    katanaBladeGeometry.translate(0, 0.035, 0);
    katanaBladeGeometry.computeVertexNormals();
    const shelfBlade = new THREE.Mesh(katanaBladeGeometry, shelfSwordBladeMaterial);
    shelfBlade.name = "shelf-katana-unified-curved-blade";
    shelfSword.add(shelfBlade);
    const katanaScabbardCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.19, -0.055, -0.42),
      new THREE.Vector3(0.2, -0.05, 0.2),
      new THREE.Vector3(0.22, -0.04, 0.92),
      new THREE.Vector3(0.26, -0.025, 1.54),
    ]);
    const katanaScabbard = new THREE.Mesh(
      new THREE.TubeGeometry(katanaScabbardCurve, highDetail ? 42 : 24, 0.068, highDetail ? 12 : 8, false),
      physicalMaterial("#101318", {
        metalness: 0.24,
        roughness: 0.16,
        clearcoat: 0.92,
        clearcoatRoughness: 0.12,
        emissive: "#17142b",
        emissiveIntensity: 0.2,
      }),
    );
    katanaScabbard.name = "shelf-katana-lacquered-scabbard";
    shelfSword.add(katanaScabbard);
    const scabbardCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.072, 0.012, 7, 18),
      shelfSwordHiltMaterial,
    );
    scabbardCollar.name = "shelf-katana-scabbard-collar";
    scabbardCollar.rotation.x = Math.PI / 2;
    scabbardCollar.position.set(0.19, -0.055, -0.42);
    shelfSword.add(scabbardCollar);
    const katanaHabaki = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.07, 0.14),
      shelfSwordDarkMaterial,
    );
    katanaHabaki.name = "shelf-katana-habaki";
    katanaHabaki.position.set(0, 0.03, -0.43);
    shelfSword.add(katanaHabaki);
    const shelfGuard = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.055, 20),
      shelfSwordDarkMaterial,
    );
    shelfGuard.name = "shelf-katana-tsuba";
    shelfGuard.rotation.x = Math.PI / 2;
    shelfGuard.position.set(0, 0.025, -0.5);
    shelfSword.add(shelfGuard);
    const shelfGrip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.5, 14),
      shelfSwordDarkMaterial,
    );
    shelfGrip.name = "shelf-katana-grip";
    shelfGrip.rotation.x = Math.PI / 2;
    shelfGrip.position.set(0, 0.025, -0.77);
    shelfSword.add(shelfGrip);
    for (let wrap = 0; wrap < 5; wrap += 1) {
      const gripWrap = new THREE.Mesh(
        new THREE.TorusGeometry(0.058, 0.008, 6, 16),
        shelfSwordHiltMaterial,
      );
      gripWrap.rotation.x = Math.PI / 2;
      gripWrap.position.set(0, 0.025, -0.59 - wrap * 0.09);
      shelfSword.add(gripWrap);
    }
    for (let diamond = 0; diamond < 4; diamond += 1) {
      for (const side of [-1, 1]) {
        const gripDiamond = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.028, 0),
          material("#d4d0c3", { metalness: 0.08, roughness: 0.76 }),
        );
        gripDiamond.name = "shelf-katana-grip-diamond";
        gripDiamond.scale.set(0.42, 0.45, 1);
        gripDiamond.position.set(side * 0.052, 0.025, -0.63 - diamond * 0.09);
        shelfSword.add(gripDiamond);
      }
    }
    const shelfPommel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.06, 0.07, 14),
      shelfSwordHiltMaterial,
    );
    shelfPommel.name = "shelf-katana-kashira";
    shelfPommel.rotation.x = Math.PI / 2;
    shelfPommel.position.set(0, 0.025, -1.055);
    shelfSword.add(shelfPommel);
    for (const z of [-0.3, 0.9]) {
      box(room, [0.24, 0.08, 0.1], [-5.02, 0.27, 0.72 + z], "#1b252d", {
        metalness: 0.58,
        roughness: 0.38,
      });
    }
    const shelfSwordLight = new THREE.PointLight(0x9f91ff, 0, 3.4, 2);
    shelfSwordLight.position.set(0, 0.35, 0);
    shelfSword.add(shelfSwordLight);

    const books = hotspot("books", "READING SHELF");
    books.position.set(-4.99, 1.3, 1.08);
    const bookColors = ["#4d6170", "#7965be", "#9a6c45", "#355968", "#a86a65", "#65518e"];
    const bookWidths = [0.21, 0.24, 0.19, 0.28, 0.22, 0.25];
    let bookZ = -1.04;
    bookColors.forEach((color, index) => {
      const width = bookWidths[index];
      const height = 0.68 + (index % 3) * 0.09;
      const bookCover = roundedBox(books, [0.44, height, width], [0, height / 2, bookZ], color, 0.018, {
        roughness: 0.86,
      });
      bookCover.name = "book-rounded-cover";
      const pageBlock = roundedBox(books, [0.028, height * 0.72, width * 0.7], [0.23, height / 2, bookZ], "#d5cdb6", 0.008, {
        roughness: 0.96,
      });
      pageBlock.name = "book-page-block";
      for (let page = -1; page <= 1; page += 1) {
        const pageLine = box(
          books,
          [0.008, 0.008, width * 0.58],
          [0.246, height / 2 + page * height * 0.19, bookZ],
          "#938d7e",
          { roughness: 1 },
        );
        pageLine.name = "book-page-line";
      }
      for (const labelOffset of [-0.17, 0.12]) {
        const spineBand = roundedBox(
          books,
          [0.012, 0.045, width * 0.72],
          [-0.226, height / 2 + labelOffset, bookZ],
          index % 2 ? "#f0c66f" : "#8eead2",
          0.006,
          { emissive: index % 2 ? "#6f4a22" : "#245c54", emissiveIntensity: 0.2, roughness: 0.62 },
        );
        spineBand.name = "book-spine-label-band";
      }
      box(books, [0.455, 0.035, width * 0.92], [0, height - 0.1, bookZ], index % 2 ? cyan : amber, {
        emissive: index % 2 ? "#2b626c" : "#815c2e",
        emissiveIntensity: 0.25,
        roughness: 0.8,
      });
      bookZ += width + 0.06;
    });
    const laidBook = box(books, [0.45, 0.16, 0.88], [0, 0.08, 0.9], "#6e5caf", { roughness: 0.88 });
    laidBook.rotation.x = 0.03;
    box(books, [0.02, 0.11, 0.72], [0.23, 0.08, 0.9], "#d8d1bb", { roughness: 1 });

    const cameraGroup = hotspot("camera", "PHOTOGRAPHY");
    cameraGroup.position.set(-5.4, 2.8, 0.34);
    const cameraBody = roundedBox(cameraGroup, [0.52, 0.76, 1.08], [0, 0, 0], "#1a2025", 0.09, {
      metalness: 0.7,
      roughness: 0.34,
    });
    cameraBody.name = "camera-beveled-body";
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.34, 0.46, 36),
      material("#11161b", { metalness: 0.82, roughness: 0.24 }),
    );
    lens.name = "camera-lens-barrel";
    lens.rotation.z = -Math.PI / 2;
    lens.position.x = 0.43;
    cameraGroup.add(lens);
    for (let ringIndex = 0; ringIndex < 4; ringIndex += 1) {
      const focusRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.29 - ringIndex * 0.012, 0.018, 8, 32),
        material(ringIndex === 2 ? "#5d6c72" : "#151b20", { metalness: 0.74, roughness: 0.3 }),
      );
      focusRing.name = "camera-focus-ring";
      focusRing.rotation.y = Math.PI / 2;
      focusRing.position.x = 0.28 + ringIndex * 0.1;
      cameraGroup.add(focusRing);
    }
    const glass = new THREE.Mesh(
      new THREE.CircleGeometry(0.22, 36),
      physicalMaterial("#4b77a5", {
        emissive: "#1d3857",
        emissiveIntensity: 0.38,
        roughness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        transmission: 0.16,
        opacity: 0.86,
      }),
    );
    glass.name = "camera-coated-lens-glass";
    glass.rotation.y = Math.PI / 2;
    glass.position.x = 0.67;
    cameraGroup.add(glass);
    const aperture = new THREE.Mesh(
      new THREE.CircleGeometry(0.105, highDetail ? 24 : 16),
      material("#030506", { metalness: 0.26, roughness: 0.2 }),
    );
    aperture.name = "camera-lens-aperture";
    aperture.rotation.y = Math.PI / 2;
    aperture.position.x = 0.677;
    cameraGroup.add(aperture);
    const lensGlint = new THREE.Mesh(
      new THREE.CircleGeometry(0.026, 14),
      material("#b9efff", { emissive: "#73d9ff", emissiveIntensity: 1.25, roughness: 0.08 }),
    );
    lensGlint.name = "camera-lens-glint";
    lensGlint.rotation.y = Math.PI / 2;
    lensGlint.position.set(0.682, 0.07, -0.08);
    cameraGroup.add(lensGlint);
    roundedBox(cameraGroup, [0.44, 0.28, 0.38], [-0.03, 0.4, -0.3], "#222b31", 0.045, { metalness: 0.68, roughness: 0.3 });
    roundedBox(cameraGroup, [0.42, 0.18, 0.28], [-0.02, 0.44, 0.35], "#252f35", 0.04, { metalness: 0.66, roughness: 0.28 });
    const cameraGrip = roundedBox(cameraGroup, [0.52, 0.5, 0.24], [0, -0.08, 0.5], "#11171b", 0.055, { roughness: 0.42 });
    cameraGrip.name = "camera-sculpted-grip";
    const cameraRearLcd = roundedBox(cameraGroup, [0.025, 0.4, 0.58], [-0.275, -0.02, -0.12], "#142530", 0.012, {
      emissive: "#15394e",
      emissiveIntensity: 0.36,
      metalness: 0.18,
      roughness: 0.14,
    });
    cameraRearLcd.name = "camera-rear-lcd";
    const viewfinder = roundedBox(cameraGroup, [0.22, 0.17, 0.24], [-0.04, 0.49, 0.02], "#11171b", 0.025, {
      metalness: 0.62,
      roughness: 0.32,
    });
    viewfinder.name = "camera-viewfinder";
    for (let buttonIndex = 0; buttonIndex < 3; buttonIndex += 1) {
      const rearButton = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.018, 12),
        material("#78858a", { metalness: 0.6, roughness: 0.28 }),
      );
      rearButton.name = "camera-rear-control";
      rearButton.rotation.z = Math.PI / 2;
      rearButton.position.set(-0.295, -0.2 + buttonIndex * 0.16, 0.3);
      cameraGroup.add(rearButton);
    }
    const shutter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.035, 16),
      material("#aeb9bc", { metalness: 0.92, roughness: 0.2 }),
    );
    shutter.position.set(0.12, 0.5, -0.32);
    cameraGroup.add(shutter);
    for (let dialIndex = 0; dialIndex < 2; dialIndex += 1) {
      const dial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.07, 18),
        material("#303a40", { metalness: 0.78, roughness: 0.24 }),
      );
      dial.position.set(-0.12, 0.5, -0.15 + dialIndex * 0.42);
      cameraGroup.add(dial);
      if (highDetail) {
        for (let notch = 0; notch < 12; notch += 1) {
          const angle = (notch / 12) * Math.PI * 2;
          const dialNotch = roundedBox(
            cameraGroup,
            [0.018, 0.035, 0.018],
            [-0.12 + Math.cos(angle) * 0.105, 0.5 + Math.sin(angle) * 0.105, -0.15 + dialIndex * 0.42],
            "#8b989d",
            0.004,
            { metalness: 0.8, roughness: 0.22 },
          );
          dialNotch.name = "camera-dial-knurl";
        }
      }
    }
    const hotShoe = roundedBox(cameraGroup, [0.16, 0.025, 0.18], [-0.02, 0.555, 0.1], "#889397", 0.008, {
      metalness: 0.9,
      roughness: 0.2,
    });
    hotShoe.name = "camera-hot-shoe";
    const strap = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.12, 0.15, -0.52),
          new THREE.Vector3(-0.28, -0.42, -0.72),
          new THREE.Vector3(-0.2, -0.54, 0.62),
          new THREE.Vector3(-0.12, 0.12, 0.5),
        ]),
        26,
        0.022,
        6,
        false,
      ),
      material("#202629", { roughness: 0.95 }),
    );
    cameraGroup.add(strap);

    const racket = hotspot("racket", "BADMINTON");
    racket.position.set(-4.35, 3.52, -4.08);
    racket.rotation.z = -0.14;
    const racketMount = new THREE.Group();
    racketMount.position.set(-4.35, 2.42, -4.16);
    room.add(racketMount);
    const racketWallPlate = roundedBox(racketMount, [0.4, 0.12, 0.06], [0, 0, 0], "#303a46", 0.025, {
      metalness: 0.62,
      roughness: 0.42,
    });
    racketWallPlate.name = "racket-wall-mount-plate";
    for (const x of [-0.08, 0.08]) {
      const mountArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.18, 12),
        material("#7b69bb", {
          emissive: "#332966",
          emissiveIntensity: 0.3,
          metalness: 0.62,
          roughness: 0.32,
        }),
      );
      mountArm.name = "racket-wall-hook-arm";
      mountArm.rotation.x = Math.PI / 2;
      mountArm.position.set(x, 0, 0.1);
      racketMount.add(mountArm);
      const hookTip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.021, 0.021, 0.12, 12),
        material("#7b69bb", {
          emissive: "#332966",
          emissiveIntensity: 0.3,
          metalness: 0.62,
          roughness: 0.32,
        }),
      );
      hookTip.name = "racket-wall-hook-tip";
      hookTip.position.set(x, 0.055, 0.19);
      racketMount.add(hookTip);
      const hookCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.023, 10, 7),
        material("#9f91ff", {
          emissive: "#493c86",
          emissiveIntensity: 0.4,
          metalness: 0.5,
          roughness: 0.3,
        }),
      );
      hookCap.name = "racket-wall-hook-cap";
      hookCap.position.set(x, 0.115, 0.19);
      racketMount.add(hookCap);
    }
    const racketHead = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.052, 12, 52),
      physicalMaterial("#dce7e9", {
        metalness: 0.55,
        roughness: 0.25,
        clearcoat: 0.82,
        clearcoatRoughness: 0.14,
      }),
    );
    racketHead.name = "racket-aero-frame";
    racketHead.scale.y = 1.28;
    racket.add(racketHead);
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.042, 0.78, 16),
      material("#b9c8cc", { metalness: 0.74, roughness: 0.3 }),
    );
    shaft.name = "racket-single-shaft";
    shaft.position.y = -1.15;
    racket.add(shaft);
    const shaftFerrule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.052, 0.036, 0.16, 18),
      physicalMaterial("#dce7e9", { metalness: 0.5, roughness: 0.24, clearcoat: 0.75 }),
    );
    shaftFerrule.name = "racket-tapered-shaft-ferrule";
    shaftFerrule.position.y = -0.84;
    racket.add(shaftFerrule);
    const ferruleCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.039, 0.006, 6, 18),
      material("#8ca0a6", { metalness: 0.78, roughness: 0.28 }),
    );
    ferruleCollar.name = "racket-shaft-collar";
    ferruleCollar.rotation.x = Math.PI / 2;
    ferruleCollar.position.y = -0.92;
    racket.add(ferruleCollar);
    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.078, 0.62, 12),
      material("#7046b7", { roughness: 0.62 }),
    );
    grip.position.y = -1.72;
    racket.add(grip);
    for (let string = -4; string <= 4; string += 1) {
      const chord = Math.sqrt(Math.max(0, 1 - Math.pow((string * 0.105) / 0.58, 2))) * 1.35;
      const racketString = box(racket, [0.01, chord, 0.009], [string * 0.105, 0, 0], "#91a3a8", { metalness: 0.18 });
      racketString.name = "racket-string";
    }
    for (let string = -5; string <= 5; string += 1) {
      const chord = Math.sqrt(Math.max(0, 1 - Math.pow((string * 0.098) / 0.74, 2))) * 1.02;
      const racketString = box(racket, [chord, 0.01, 0.009], [0, string * 0.098, 0], "#91a3a8", { metalness: 0.18 });
      racketString.name = "racket-string";
    }
    for (let wrap = 0; wrap < 6; wrap += 1) {
      const gripBand = new THREE.Mesh(
        new THREE.TorusGeometry(0.072, 0.012, 6, 18),
        material(wrap % 2 ? "#9a75da" : "#503177", { roughness: 0.8 }),
      );
      gripBand.rotation.x = Math.PI / 2;
      gripBand.position.y = -1.47 - wrap * 0.1;
      racket.add(gripBand);
    }
    const racketEndCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.074, 0.055, 16),
      material("#27173d", { metalness: 0.3, roughness: 0.55 }),
    );
    racketEndCap.name = "racket-end-cap";
    racketEndCap.position.y = -2.04;
    racket.add(racketEndCap);
    for (let grommet = 0; grommet < 18; grommet += 1) {
      const angle = (grommet / 18) * Math.PI * 2;
      const grommetMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.013, 7, 5),
        material("#1b2226", { metalness: 0.45, roughness: 0.42 }),
      );
      grommetMesh.name = "racket-string-grommet";
      grommetMesh.position.set(Math.cos(angle) * 0.58, Math.sin(angle) * 0.58 * 1.28, 0);
      racket.add(grommetMesh);
    }

    const cat = new THREE.Group();
    cat.position.set(-0.2, 0.24, 0.95);
    cat.rotation.y = -0.32;
    cat.userData = { easterEgg: "cat", label: "PET THE CAT" } satisfies HotspotData;
    clickable.push(cat);
    room.add(cat);
    const catFur = material("#050607", { roughness: 0.92 });
    const catBody = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 18), catFur);
    catBody.scale.set(1.5, 0.82, 0.86);
    catBody.position.set(-0.12, 0.18, 0);
    cat.add(catBody);
    const catHaunch = new THREE.Mesh(new THREE.SphereGeometry(0.31, 22, 16), catFur);
    catHaunch.scale.set(0.9, 1.05, 1);
    catHaunch.position.set(-0.43, 0.26, 0);
    cat.add(catHaunch);
    const catChest = new THREE.Mesh(new THREE.SphereGeometry(0.25, 22, 16), material("#0a0c0d", { roughness: 0.95 }));
    catChest.scale.set(0.78, 1.34, 0.9);
    catChest.position.set(0.25, 0.31, 0);
    cat.add(catChest);
    const catHead = new THREE.Mesh(new THREE.SphereGeometry(0.245, 24, 18), catFur);
    catHead.scale.set(1.04, 1, 0.94);
    catHead.position.set(0.45, 0.62, 0);
    cat.add(catHead);
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(
        new THREE.ConeGeometry(0.105, 0.24, 4),
        catFur,
      );
      ear.position.set(0.42, 0.86, side * 0.145);
      ear.rotation.x = side * 0.14;
      ear.rotation.z = -0.07;
      cat.add(ear);
      const innerEar = new THREE.Mesh(
        new THREE.ConeGeometry(0.055, 0.13, 4),
        material("#3a252c", { roughness: 0.96 }),
      );
      innerEar.position.set(0.49, 0.845, side * 0.15);
      innerEar.rotation.x = side * 0.14;
      innerEar.rotation.z = -0.07;
      cat.add(innerEar);
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.036, 12, 10),
        material("#d8c75e", { emissive: "#8c7e2a", emissiveIntensity: 0.85, roughness: 0.22 }),
      );
      eye.scale.set(0.45, 1, 0.8);
      eye.position.set(0.66, 0.67, side * 0.09);
      cat.add(eye);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 8), material("#020303", { roughness: 0.35 }));
      pupil.scale.set(0.38, 1, 0.65);
      pupil.position.set(0.687, 0.67, side * 0.09);
      cat.add(pupil);
      const eyeGlint = new THREE.Mesh(
        new THREE.SphereGeometry(0.006, 8, 6),
        material("#f5ffff", { emissive: "#d8fbff", emissiveIntensity: 1.2, roughness: 0.05 }),
      );
      eyeGlint.name = "cat-eye-glint";
      eyeGlint.position.set(0.699, 0.683, side * 0.083);
      cat.add(eyeGlint);
      const brow = new THREE.Mesh(
        new THREE.TubeGeometry(
          new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0.655, 0.737, side * 0.055),
            new THREE.Vector3(0.675, 0.758, side * 0.09),
            new THREE.Vector3(0.65, 0.742, side * 0.13),
          ),
          8,
          0.006,
          5,
          false,
        ),
        material("#25282a", { roughness: 0.9 }),
      );
      brow.name = "cat-brow-fur";
      cat.add(brow);
    }
    const catChestPatch = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, highDetail ? 22 : 14, highDetail ? 16 : 10),
      material("#15191b", { roughness: 0.98 }),
    );
    catChestPatch.name = "cat-chest-fur-patch";
    catChestPatch.scale.set(0.34, 1.1, 0.72);
    catChestPatch.position.set(0.45, 0.34, 0);
    cat.add(catChestPatch);
    const muzzleMaterial = material("#151719", { roughness: 0.96 });
    for (const side of [-1, 1]) {
      const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), muzzleMaterial);
      muzzle.scale.set(1.1, 0.65, 0.9);
      muzzle.position.set(0.67, 0.57, side * 0.055);
      cat.add(muzzle);
    }
    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 8),
      material("#8d6971", { roughness: 0.72 }),
    );
    nose.scale.set(0.6, 0.45, 0.72);
    nose.position.set(0.735, 0.605, 0);
    cat.add(nose);
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.185, 0.018, 8, 28),
      material("#5d4aa3", { metalness: 0.22, roughness: 0.6 }),
    );
    collar.rotation.y = Math.PI / 2;
    collar.scale.y = 0.86;
    collar.position.set(0.31, 0.48, 0);
    cat.add(collar);
    const bell = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 10),
      material(amber, { emissive: "#7d562a", emissiveIntensity: 0.35, metalness: 0.82, roughness: 0.25 }),
    );
    bell.position.set(0.46, 0.42, 0);
    cat.add(bell);
    const bandanaShape = new THREE.Shape();
    bandanaShape.moveTo(-0.17, 0.11);
    bandanaShape.lineTo(0.17, 0.11);
    bandanaShape.lineTo(0, -0.22);
    bandanaShape.closePath();
    const bandana = new THREE.Mesh(
      new THREE.ExtrudeGeometry(bandanaShape, {
        depth: 0.018,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.012,
        bevelThickness: 0.008,
      }),
      material("#7256c7", { emissive: "#241b46", emissiveIntensity: 0.2, roughness: 0.72 }),
    );
    bandana.name = "cat-patterned-bandana";
    bandana.rotation.y = Math.PI / 2;
    bandana.position.set(0.49, 0.43, -0.009);
    cat.add(bandana);
    for (const side of [-1, 1]) {
      const bandanaDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 10, 8),
        material(side === -1 ? "#77e7ff" : "#ffbd72", {
          emissive: side === -1 ? "#2e7183" : "#7d562a",
          emissiveIntensity: 0.35,
          roughness: 0.45,
        }),
      );
      bandanaDot.scale.set(0.45, 1, 1);
      bandanaDot.position.set(0.505, 0.43, side * 0.065);
      cat.add(bandanaDot);
    }
    const catNameTag = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.014, 14),
      material("#77e7ff", { emissive: "#245d6c", emissiveIntensity: 0.45, metalness: 0.62, roughness: 0.28 }),
    );
    catNameTag.name = "cat-name-tag";
    catNameTag.rotation.z = Math.PI / 2;
    catNameTag.position.set(0.51, 0.39, 0.055);
    cat.add(catNameTag);
    for (const z of [-0.19, 0.19]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.32, 12), catFur);
      leg.position.set(0.28, 0.08, z);
      cat.add(leg);
      const paw = new THREE.Mesh(
        new THREE.SphereGeometry(0.085, 14, 10),
        catFur,
      );
      paw.scale.set(1.35, 0.48, 0.9);
      paw.position.set(0.39, -0.08, z);
      cat.add(paw);
    }
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.62, 0.2, -0.05),
      new THREE.Vector3(-0.88, 0.16, -0.28),
      new THREE.Vector3(-0.72, 0.11, -0.58),
      new THREE.Vector3(-0.38, 0.13, -0.63),
      new THREE.Vector3(-0.22, 0.23, -0.5),
    ]);
    const catTail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 30, 0.055, 8, false), catFur);
    catTail.name = "cat-tail-3d";
    cat.add(catTail);
    for (const side of [-1, 1]) {
      for (let whiskerIndex = -1; whiskerIndex <= 1; whiskerIndex += 1) {
        const start = new THREE.Vector3(0.72, 0.57 + whiskerIndex * 0.022, side * 0.075);
        const end = new THREE.Vector3(0.78, 0.58 + whiskerIndex * 0.03, side * (0.25 + Math.abs(whiskerIndex) * 0.035));
        const whisker = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.LineCurve3(start, end), 6, 0.004, 5, false),
          material("#a8abad", { metalness: 0.08, roughness: 0.58 }),
        );
        whisker.name = "cat-whisker";
        cat.add(whisker);
      }
    }
    const catMouth = new THREE.Mesh(
      new THREE.TorusGeometry(0.038, 0.006, 5, 16, Math.PI),
      material("#a47b82", { roughness: 0.74 }),
    );
    catMouth.name = "cat-mouth-detail";
    catMouth.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
    catMouth.position.set(0.738, 0.565, 0);
    cat.add(catMouth);
    for (const z of [-0.19, 0.19]) {
      for (let toe = -1; toe <= 1; toe += 1) {
        const toeLine = new THREE.Mesh(
          new THREE.TorusGeometry(0.025, 0.004, 5, 12, Math.PI * 0.72),
          material("#343739", { roughness: 0.9 }),
        );
        toeLine.name = "cat-paw-toe";
        toeLine.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        toeLine.position.set(0.495, -0.085, z + toe * 0.024);
        cat.add(toeLine);
      }
    }

    const yarnBall = new THREE.Group();
    yarnBall.name = "cat-rug-yarn-ball";
    yarnBall.position.set(0.7, 0.16, 1.58);
    room.add(yarnBall);
    const yarnCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.145, 18, 14),
      material("#e87842", { emissive: "#6f2918", emissiveIntensity: 0.2, roughness: 0.88 }),
    );
    yarnBall.add(yarnCore);
    for (let wrap = 0; wrap < 4; wrap += 1) {
      const yarnWrap = new THREE.Mesh(
        new THREE.TorusGeometry(0.135, 0.012, 6, 24),
        material(wrap % 2 === 0 ? "#ff9a5f" : "#c94d34", { roughness: 0.9 }),
      );
      yarnWrap.rotation.set(wrap * 0.62, wrap * 0.38, wrap * 0.76);
      yarnBall.add(yarnWrap);
    }
    const looseYarnCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.7, 0.08, 1.58),
      new THREE.Vector3(0.44, 0.035, 1.72),
      new THREE.Vector3(0.13, 0.035, 1.62),
      new THREE.Vector3(-0.06, 0.035, 1.78),
    ]);
    const looseYarn = new THREE.Mesh(
      new THREE.TubeGeometry(looseYarnCurve, 28, 0.011, 6, false),
      material("#e87842", { roughness: 0.9 }),
    );
    looseYarn.name = "cat-rug-loose-yarn";
    room.add(looseYarn);

    const toyMouse = new THREE.Group();
    toyMouse.name = "cat-rug-toy-mouse";
    toyMouse.position.set(-1.05, 0.13, 1.56);
    toyMouse.rotation.y = -0.35;
    room.add(toyMouse);
    const mouseBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 12),
      material("#9ba4aa", { roughness: 0.94 }),
    );
    mouseBody.scale.set(1.4, 0.65, 0.82);
    toyMouse.add(mouseBody);
    const mouseNose = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 10, 8),
      material("#e87842", { emissive: "#6f2918", emissiveIntensity: 0.2, roughness: 0.72 }),
    );
    mouseNose.position.set(0.19, 0, 0);
    toyMouse.add(mouseNose);
    for (const side of [-1, 1]) {
      const mouseEar = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 10, 8),
        material("#c5ccd0", { roughness: 0.92 }),
      );
      mouseEar.scale.set(0.45, 1, 1);
      mouseEar.position.set(0.06, 0.075, side * 0.07);
      toyMouse.add(mouseEar);
    }
    const mouseTailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 0, 0),
      new THREE.Vector3(-0.28, -0.01, -0.05),
      new THREE.Vector3(-0.35, -0.02, 0.04),
      new THREE.Vector3(-0.46, -0.03, 0.02),
    ]);
    const mouseTail = new THREE.Mesh(
      new THREE.TubeGeometry(mouseTailCurve, 20, 0.009, 6, false),
      material("#b9858b", { roughness: 0.9 }),
    );
    toyMouse.add(mouseTail);

    const waterBowl = new THREE.Group();
    waterBowl.name = "cat-rug-water-bowl";
    waterBowl.position.set(0.57, 0.065, 0.35);
    room.add(waterBowl);
    const bowlBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.205, 0.09, 24),
      material("#252b33", { metalness: 0.72, roughness: 0.3 }),
    );
    waterBowl.add(bowlBase);
    const bowlRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.018, 7, 28),
      material("#77e7ff", { emissive: "#285f6d", emissiveIntensity: 0.35, metalness: 0.58, roughness: 0.3 }),
    );
    bowlRim.rotation.x = Math.PI / 2;
    bowlRim.position.y = 0.055;
    waterBowl.add(bowlRim);
    const waterSurface = new THREE.Mesh(
      new THREE.CircleGeometry(0.15, 24),
      material("#3e8eac", { emissive: "#1c4b5e", emissiveIntensity: 0.3, metalness: 0.12, roughness: 0.18 }),
    );
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.y = 0.058;
    waterBowl.add(waterSurface);

    const floorRug = new THREE.Mesh(
      new THREE.CircleGeometry(1.45, 48),
      material("#1c2437", { metalness: 0.02, roughness: 1 }),
    );
    floorRug.rotation.x = -Math.PI / 2;
    floorRug.position.set(-0.2, 0.022, 0.95);
    room.add(floorRug);
    const rugColors = ["#77e7ff", "#9f91ff", "#ffbd72"];
    for (let ring = 1; ring <= 3; ring += 1) {
      const rugRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.35 * ring, 0.012, 5, 48),
        material(rugColors[ring - 1], {
          emissive: rugColors[ring - 1],
          emissiveIntensity: 0.25,
          roughness: 0.72,
        }),
      );
      rugRing.rotation.x = Math.PI / 2;
      rugRing.position.set(-0.2, 0.03, 0.95);
      room.add(rugRing);
    }
    const ceilingPanelColors = ["#77e7ff", "#9f91ff", "#ffbd72", "#68e0ae"];
    for (let panel = 0; panel < 4; panel += 1) {
      box(room, [1.85, 0.055, 0.08], [-3.6 + panel * 2.35, 4.42, -4.34], ceilingPanelColors[panel], {
        emissive: ceilingPanelColors[panel],
        emissiveIntensity: 0.6,
        metalness: 0.5,
      });
    }
    for (let accent = 0; accent < 3; accent += 1) {
      box(room, [0.32, 1.2 + accent * 0.18, 0.035], [2.8 + accent * 0.52, 3.15, -4.17], ceilingPanelColors[accent], {
        emissive: ceilingPanelColors[accent],
        emissiveIntensity: 0.46,
        roughness: 0.4,
      });
    }
    const ceilingLight = box(room, [3.6, 0.06, 0.5], [0.7, 4.72, -1.1], "#b8f6ff", {
      emissive: "#77e7ff",
      emissiveIntensity: 1.2,
      roughness: 0.25,
    });
    ceilingLight.rotation.x = 0.02;

    room.updateMatrixWorld(true);
    const interactionMarkers = new Map<string, THREE.Mesh>();
    for (const [key, object] of objectByKey) {
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: key === "profile" ? amber : cyan,
        transparent: true,
        opacity: 0.26,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const marker = new THREE.Mesh(new THREE.RingGeometry(0.52, 0.59, 36), markerMaterial);
      marker.rotation.x = -Math.PI / 2;
      const markerWorldPosition = object.getWorldPosition(new THREE.Vector3());
      const markerLocalPosition = room.worldToLocal(markerWorldPosition.clone());
      marker.position.set(markerLocalPosition.x, 0.035, markerLocalPosition.z);
      room.add(marker);
      interactionMarkers.set(key, marker);
    }

    scene.add(new THREE.HemisphereLight(0xb8deea, 0x12101b, 1.65));
    const cyanLight = new THREE.PointLight(0x77e7ff, 27, 10, 2);
    cyanLight.position.set(-1.3, 3.3, -0.2);
    cyanLight.castShadow = true;
    cyanLight.shadow.mapSize.set(highDetail ? 2048 : 1024, highDetail ? 2048 : 1024);
    cyanLight.shadow.bias = -0.00035;
    cyanLight.shadow.normalBias = 0.035;
    cyanLight.shadow.radius = highDetail ? 4 : 2;
    scene.add(cyanLight);
    const violetLight = new THREE.PointLight(0x9f91ff, 22, 9, 2);
    violetLight.position.set(3.1, 3.8, 2.2);
    scene.add(violetLight);
    const warmLight = new THREE.PointLight(0xffbd72, 14, 7, 2);
    warmLight.position.set(-4.2, 2.8, 1.5);
    scene.add(warmLight);
    const studioFill = new THREE.DirectionalLight(0xdcecff, 1.25);
    studioFill.name = "room-studio-fill-light";
    studioFill.position.set(5.5, 7.5, 5.2);
    scene.add(studioFill);

    room.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const surfaceMaterials = Array.isArray(object.material) ? object.material : [object.material];
      const hasLitSurface = surfaceMaterials.some((surface) => surface instanceof THREE.MeshStandardMaterial);
      if (!hasLitSurface) return;
      const hasTransparentSurface = surfaceMaterials.some(
        (surface) => surface.transparent || ("transmission" in surface && Number(surface.transmission) > 0.05),
      );
      object.castShadow = !hasTransparentSurface;
      object.receiveShadow = true;
    });
    room.updateMatrixWorld(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const overviewPosition = new THREE.Vector3(5.2, 4.3, 6.5);
    const overviewTarget = new THREE.Vector3(0, 1.55, -0.7);
    const roomBaseRotation = -0.08;
    const pointerParallax = new THREE.Vector2();
    const pointerParallaxTarget = new THREE.Vector2();
    let focusedKey: string | null = null;
    let cameraMove: {
      fromPosition: THREE.Vector3;
      toPosition: THREE.Vector3;
      fromTarget: THREE.Vector3;
      toTarget: THREE.Vector3;
      startedAt: number;
      duration: number;
      arcHeight: number;
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
        duration: reducedMotion ? 1 : 1180,
        arcHeight: THREE.MathUtils.clamp(camera.position.distanceTo(toPosition) * 0.055, 0.18, 0.48),
        revealKey,
      };
    };

    const focusObject = (key: string) => {
      if (key === "__overview") {
        playSiteSfx("close");
        focusedKey = null;
        document.body.classList.remove("room-focus-active");
        document.body.classList.remove("room-default-view");
        pointerParallaxTarget.set(0, 0);
        beginCameraMove(
          overviewPosition,
          overviewTarget,
          null,
          "RETURNING TO DEFAULT VIEW",
        );
        return;
      }

      const entry = ROOM_ENTRIES[key];
      const object = objectByKey.get(key);
      if (!entry || !object) return;
      playSiteSfx("open");
      focusedKey = key;
      document.body.classList.remove("room-default-view");
      object.updateWorldMatrix(true, true);
      const target = object.localToWorld(new THREE.Vector3(...entry.targetOffset));
      const roomRotation = room.getWorldQuaternion(new THREE.Quaternion());
      const cameraOffset = new THREE.Vector3(...entry.cameraOffset).applyQuaternion(roomRotation);
      const viewDirection = cameraOffset.clone().normalize().multiplyScalar(-1);
      const cameraRight = new THREE.Vector3()
        .crossVectors(viewDirection, new THREE.Vector3(0, 1, 0))
        .normalize();
      const compositionShift = cameraRight.multiplyScalar(window.innerWidth < 720 ? 0.12 : 0.28);
      const composedTarget = target.clone().add(compositionShift);
      document.body.classList.add("room-focus-active");
      beginCameraMove(
        target.clone().add(cameraOffset).add(compositionShift),
        composedTarget,
        key,
        `MOVING TO ${entry.directory.toUpperCase()}`,
      );
    };
    const dismissObjectFile = () => {
      playSiteSfx("close");
      cameraMove = null;
      focusedKey = null;
      setActiveKey(null);
      setTransitionLabel("");
      controls.enabled = true;
      document.body.classList.remove("room-focus-active");
      document.body.classList.remove("room-default-view");
    };
    focusRef.current = focusObject;
    dismissRef.current = dismissObjectFile;
    camera.position.copy(overviewPosition);
    controls.target.copy(overviewTarget);
    controls.enabled = true;
    document.body.classList.add("room-default-view");

    const markCameraExploring = () => {
      if (!cameraMove && focusedKey === null) {
        document.body.classList.remove("room-default-view");
      }
    };
    controls.addEventListener("start", markCameraExploring);

    let roomSecretTimeout = 0;
    let catTapCount = 0;
    let catSecretUntil = 0;
    let paletteSecretUntil = 0;
    let paletteWasActive = false;
    let relicSecretUntil = 0;
    let signalSecretUntil = 0;
    const showRoomSecret = (message: string) => {
      window.clearTimeout(roomSecretTimeout);
      setRoomSecret(message);
      roomSecretTimeout = window.setTimeout(() => setRoomSecret(""), 3200);
    };
    const activateRoomSecret = (easterEgg: HotspotData["easterEgg"]) => {
      playSiteSfx(easterEgg === "cat" ? "cat" : "secret");
      if (easterEgg === "palette") {
        paletteSecretUntil = performance.now() + 12_000;
        showRoomSecret("LIGHT OVERRIDE / SUNROOM PALETTE UNLOCKED");
        return;
      }
      if (easterEgg === "relic") {
        relicSecretUntil = performance.now() + 7_000;
        showRoomSecret("PRINTED RELIC AWAKENED / SWORD CHARGED");
        return;
      }
      if (easterEgg === "signal") {
        signalSecretUntil = performance.now() + 8_000;
        showRoomSecret("SERVER BEACON ONLINE / SIGNAL FOUND");
        return;
      }
      if (easterEgg === "cat") {
        catTapCount += 1;
        if (catTapCount < 3) {
          showRoomSecret(`CAT TRUST ${catTapCount} / 3`);
          return;
        }
        catTapCount = 0;
        catSecretUntil = performance.now() + 3600;
        showRoomSecret("PURR MODE UNLOCKED");
      }
    };
    const handlePaletteCommand = () => activateRoomSecret("palette");
    const handleRelicCommand = () => activateRoomSecret("relic");
    const handleSignalCommand = () => activateRoomSecret("signal");
    const handleCatCommand = () => {
      catTapCount = 2;
      activateRoomSecret("cat");
    };
    window.addEventListener("affan-room-palette", handlePaletteCommand);
    window.addEventListener("affan-room-relic", handleRelicCommand);
    window.addEventListener("affan-room-signal", handleSignalCommand);
    window.addEventListener("affan-room-cat", handleCatCommand);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pressedAt = { x: 0, y: 0 };
    let hovered: THREE.Object3D | null = null;

    const pick = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      const sample = (clientX: number, clientY: number) => {
        pointer.x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
        pointer.y = -((clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(clickable, true)[0];
        return findHotspot(hit?.object ?? null);
      };
      const directHit = sample(event.clientX, event.clientY);
      if (directHit || (event.pointerType !== "touch" && !window.matchMedia("(pointer: coarse)").matches)) {
        return directHit;
      }
      const touchOffsets = [
        [-16, 0],
        [16, 0],
        [0, -16],
        [0, 16],
        [-12, -12],
        [12, -12],
        [-12, 12],
        [12, 12],
      ];
      for (const [offsetX, offsetY] of touchOffsets) {
        const expandedHit = sample(event.clientX + offsetX, event.clientY + offsetY);
        if (expandedHit) {
          sample(event.clientX, event.clientY);
          return expandedHit;
        }
      }
      sample(event.clientX, event.clientY);
      return null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const next = pick(event);
      pointerParallaxTarget.copy(pointer);
      if (next === hovered) return;
      hovered = next;
      renderer.domElement.style.cursor = hovered ? "pointer" : "grab";
      setHoverLabel(hovered?.userData.label ?? "");
    };

    const handlePointerDown = (event: PointerEvent) => {
      pressedAt = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - pressedAt.x, event.clientY - pressedAt.y) > 7) return;
      const selected = pick(event);
      if (selected?.userData.easterEgg) {
        activateRoomSecret(selected.userData.easterEgg);
      } else if (selected?.userData.key) {
        focusObject(selected.userData.key);
      }
    };

    const handlePointerLeave = () => {
      hovered = null;
      pointerParallaxTarget.set(0, 0);
      renderer.domElement.style.cursor = "grab";
      setHoverLabel("");
    };
    const handleContextMenu = (event: MouseEvent) => event.preventDefault();
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("contextmenu", handleContextMenu);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      const phonePortrait = width <= 600 && height > width;
      const phoneLandscape = height <= 520 && width > height;
      if (phonePortrait) {
        overviewPosition.set(4.55, 4.05, 7.7);
        overviewTarget.set(-0.72, 1.5, -0.62);
        camera.fov = 52;
      } else if (phoneLandscape) {
        overviewPosition.set(5.2, 4.3, 7.35);
        overviewTarget.set(-0.2, 1.55, -0.68);
        camera.fov = 43;
      } else {
        overviewPosition.set(5.2, 4.3, 6.5);
        overviewTarget.set(0, 1.55, -0.7);
        camera.fov = 40;
      }
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (!cameraMove && focusedKey === null && document.body.classList.contains("room-default-view")) {
        camera.position.copy(overviewPosition);
        controls.target.copy(overviewTarget);
        controls.update();
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const printerCarriage = room.getObjectByName("printer-head-carriage");
    const activeFilamentThread = room.getObjectByName("printer-active-filament-thread");
    const printerSpools = [
      "printer-spool-black",
      "printer-spool-orange",
      "printer-spool-purple",
      "printer-spool-white",
    ].map((name) => room.getObjectByName(name));
    const animatedCatTail = room.getObjectByName("cat-tail-3d");
    const catYarnBall = room.getObjectByName("cat-rug-yarn-ball");
    const catToyMouse = room.getObjectByName("cat-rug-toy-mouse");
    const printStartedAt = performance.now();
    let lastPrintPercent = -1;
    let printCompletedAt = 0;
    let previousTimestamp = performance.now();
    let frame = 0;
    const render = (timestamp = performance.now()) => {
      const elapsed = timestamp * 0.001;
      const delta = Math.min((timestamp - previousTimestamp) * 0.001, 0.05);
      const printProgress = Math.min(1, Math.max(0, (timestamp - printStartedAt) / PRINT_DURATION_MS));
      const printPercent = Math.round(printProgress * 100);
      previousTimestamp = timestamp;
      const currentPrintHeight = printProgress * chessSetHeight;
      for (const part of printableParts) {
        part.visible = Number(part.userData.printHeight) <= currentPrintHeight;
      }
      if (activeFilamentThread) activeFilamentThread.visible = printProgress < 1;
      if (printPercent !== lastPrintPercent) {
        lastPrintPercent = printPercent;
        drawPrinterDisplay(printProgress);
      }
      if (printProgress >= 1 && printCompletedAt === 0) {
        printCompletedAt = timestamp;
        playSiteSfx("complete");
        showRoomSecret("THREE-MINUTE PRINT COMPLETE / CHESS SET READY");
      }
      printCompletionLight.intensity =
        printCompletedAt > 0 && timestamp - printCompletedAt < 8000
          ? 5 + Math.sin(elapsed * 8) * 2
          : 0;

      const paletteActive = timestamp < paletteSecretUntil;
      if (paletteActive !== paletteWasActive) {
        paletteWasActive = paletteActive;
        cyanLight.color.set(paletteActive ? "#b8ff6a" : "#77e7ff");
        violetLight.color.set(paletteActive ? "#ff83bd" : "#9f91ff");
        warmLight.color.set(paletteActive ? "#ffd76d" : "#ffbd72");
        renderer.setClearColor(paletteActive ? 0x162217 : 0x080a0f, paletteActive ? 0.9 : 0.82);
        if (scene.fog) scene.fog.color.set(paletteActive ? "#162217" : "#080a0f");
      }
      const relicActive = timestamp < relicSecretUntil;
      const signalActive = timestamp < signalSecretUntil;
      shelfSwordLight.intensity = relicActive ? 4.5 + Math.sin(elapsed * 7) * 1.4 : 0;
      shelfSwordBladeMaterial.emissiveIntensity = relicActive ? 1.1 : 0.24;
      shelfSwordHiltMaterial.emissiveIntensity = relicActive ? 1.1 : 0.22;
      serverBeaconLight.intensity = signalActive ? 5 + Math.sin(elapsed * 11) * 2 : 0;
      serverBeaconMaterial.emissiveIntensity = signalActive ? 5.5 : 2.4;

      if (!reducedMotion) {
        cyanLight.intensity = signalActive
          ? 24 + Math.abs(Math.sin(elapsed * 5.2)) * 25
          : 27 + Math.sin(elapsed * 1.4) * 2;
        violetLight.intensity = signalActive
          ? 16 + Math.abs(Math.sin(elapsed * 5.2 + 1.1)) * 25
          : 22;
        warmLight.intensity = signalActive
          ? 10 + Math.abs(Math.sin(elapsed * 5.2 + 2.2)) * 22
          : 14;
        shelfSword.position.y = relicActive
          ? shelfSwordBaseY + 0.1 + Math.sin(elapsed * 3.2) * 0.045
          : shelfSwordBaseY;
        shelfSword.rotation.y = relicActive ? Math.sin(elapsed * 1.4) * 0.22 : 0;
        const catSecretActive = timestamp < catSecretUntil;
        cat.position.y = catSecretActive
          ? 0.24 + Math.abs(Math.sin(elapsed * 7)) * 0.55
          : 0.24 + Math.sin(elapsed * 1.15) * 0.012;
        cat.rotation.y = catSecretActive ? -0.32 + Math.sin(elapsed * 5) * 0.5 : -0.32;
        if (animatedCatTail) animatedCatTail.rotation.y = Math.sin(elapsed * 0.72) * 0.11;
        if (catYarnBall) {
          catYarnBall.position.y = catSecretActive
            ? 0.16 + Math.abs(Math.sin(elapsed * 8.5)) * 0.11
            : 0.16;
          catYarnBall.rotation.z = catSecretActive ? elapsed * 4.2 : Math.sin(elapsed * 0.7) * 0.08;
        }
        if (catToyMouse) {
          catToyMouse.rotation.y = catSecretActive
            ? -0.35 + Math.sin(elapsed * 7.5) * 0.22
            : -0.35;
        }
        if (printerCarriage) printerCarriage.position.x = printProgress < 1 ? Math.sin(elapsed * 1.9) * 0.55 : 0;
        if (printProgress < 1) {
          printerSpools.forEach((spoolObject, index) => {
            if (spoolObject) spoolObject.rotation.x += delta * (0.26 + index * 0.04) * (index % 2 === 0 ? 1 : -1);
          });
        }
        printBedAssembly.position.z = printProgress < 1 ? Math.sin(elapsed * 1.35) * 0.24 : 0;
        printerGantry.position.y = 0.84 + printProgress * chessSetHeight;
        const smashActive = document.body.classList.contains("easter-mode");
        racket.rotation.z = THREE.MathUtils.lerp(
          racket.rotation.z,
          smashActive ? -0.14 + Math.sin(elapsed * 8) * 0.4 : -0.14,
          1 - Math.pow(0.0001, delta),
        );
      }

      if (!cameraMove && focusedKey === null) {
        const parallaxEase = reducedMotion ? 1 : 1 - Math.pow(0.0008, delta);
        pointerParallax.lerp(pointerParallaxTarget, parallaxEase);
        room.rotation.y = THREE.MathUtils.lerp(
          room.rotation.y,
          roomBaseRotation + pointerParallax.x * 0.028,
          parallaxEase,
        );
        cyanLight.position.x = THREE.MathUtils.lerp(cyanLight.position.x, -1.3 + pointerParallax.x * 0.75, parallaxEase);
        cyanLight.position.y = THREE.MathUtils.lerp(cyanLight.position.y, 3.3 + pointerParallax.y * 0.22, parallaxEase);
        violetLight.position.z = THREE.MathUtils.lerp(violetLight.position.z, 2.2 - pointerParallax.x * 0.45, parallaxEase);
      }

      const scaleEase = reducedMotion ? 1 : 1 - Math.pow(0.00015, delta);
      for (const object of clickable) {
        const isHovered = object === hovered;
        const isFocused = object.userData.key === focusedKey;
        const breathing = isFocused && !reducedMotion ? Math.sin(elapsed * 2.1) * 0.006 : 0;
        const targetScale = (isHovered ? 1.045 : isFocused ? 1.018 : 1) + breathing;
        const nextScale = THREE.MathUtils.lerp(object.scale.x, targetScale, scaleEase);
        object.scale.setScalar(nextScale);
      }

      for (const [key, marker] of interactionMarkers) {
        const active = key === hovered?.userData.key || key === focusedKey;
        const pulse = 1 + Math.sin(elapsed * 2.3 + Number(ROOM_ENTRIES[key].number)) * 0.06;
        marker.scale.setScalar((active ? 1.22 : 1) * pulse);
        const markerMaterial = marker.material as THREE.MeshBasicMaterial;
        markerMaterial.opacity = active ? 0.72 : 0.16 + Math.sin(elapsed * 1.5) * 0.045;
      }
      if (cameraMove) {
        const progress = Math.min(1, (timestamp - cameraMove.startedAt) / cameraMove.duration);
        const eased = progress * progress * progress * (progress * (progress * 6 - 15) + 10);
        camera.position.lerpVectors(cameraMove.fromPosition, cameraMove.toPosition, eased);
        camera.position.y += Math.sin(progress * Math.PI) * cameraMove.arcHeight;
        controls.target.lerpVectors(cameraMove.fromTarget, cameraMove.toTarget, eased);
        if (progress >= 1) {
          const revealKey = cameraMove.revealKey;
          cameraMove = null;
          controls.enabled = revealKey === null;
          setTransitionLabel("");
          setActiveKey(revealKey);
          if (revealKey === null) document.body.classList.add("room-default-view");
          else document.body.classList.remove("room-default-view");
          if (revealKey) {
            setVisitedKeys((current) => {
              if (current.includes(revealKey)) return current;
              const next = [...current, revealKey];
              try {
                window.localStorage.setItem("affan-lab-discoveries", JSON.stringify(next));
              } catch {
                // Discovery tracking is optional and device-local.
              }
              return next;
            });
          }
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
      controls.removeEventListener("start", markCameraExploring);
      controls.dispose();
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("affan-room-palette", handlePaletteCommand);
      window.removeEventListener("affan-room-relic", handleRelicCommand);
      window.removeEventListener("affan-room-signal", handleSignalCommand);
      window.removeEventListener("affan-room-cat", handleCatCommand);
      window.clearTimeout(roomSecretTimeout);
      focusRef.current = () => undefined;
      dismissRef.current = () => undefined;
      document.body.classList.remove("room-focus-active");
      document.body.classList.remove("room-default-view");
      room.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const objectMaterial = object.material;
        if (Array.isArray(objectMaterial)) objectMaterial.forEach((item) => item.dispose());
        else objectMaterial.dispose();
      });
      desktopTexture.dispose();
      printerDisplayTexture.dispose();
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
          {transitionLabel || hoverLabel || (activeEntry ? activeEntry.title.toUpperCase() : "MOVE / DRAG / SELECT")}
        </strong>
      </div>
      <div className="room-canvas" ref={hostRef} />
      <div className="room-fluid-hint" aria-hidden="true">
        <span><i /> SCENE RESPONSIVE</span>
        <span>Move pointer / shift perspective</span>
        <span>Left drag / orbit</span>
        <span>Right drag / move camera</span>
        <span>Select an object / inspect</span>
        <strong>{visitedKeys.length} / {DIRECTORY.length} viewed</strong>
      </div>
      {roomSecret && <div className="room-secret-toast" role="status">{roomSecret}</div>}
      <nav className="room-directory-accessible" aria-label="3D room objects">
        {DIRECTORY.map(([key, entry]) => (
          <button
            type="button"
            onClick={() => focusRef.current(key)}
            key={key}
          >
            Open {entry.directory}
          </button>
        ))}
      </nav>
      {activeEntry && (
        <>
          <button
            className="room-popup-dismiss"
            type="button"
            aria-label="Close object file and keep the current camera view"
            onClick={() => dismissRef.current()}
          />
          <aside className="room-popup" aria-live="polite" aria-labelledby="room-popup-title">
            <button
              className="room-popup-close"
              type="button"
              aria-label="Close object file and return to the default room view"
              onClick={() => focusRef.current("__overview")}
            >
              X
            </button>
            <p>{activeEntry.label}</p>
            <h2 id="room-popup-title">{activeEntry.title}</h2>
            <div className="room-popup-line" />
            <p>{activeEntry.summary}</p>
            <ul>
              {activeEntry.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
            <div className="room-popup-sections">
              {activeEntry.sections.map((section) => (
                <section key={section.heading}>
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
            {activeEntry.links && (
              <div className="room-popup-actions">
                {activeEntry.links.map((link) => (
                  <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                    {link.label} <span aria-hidden="true">+</span>
                  </a>
                ))}
              </div>
            )}
            <small>OUTSIDE / FREE CAMERA · X OR ESC / RESET VIEW</small>
          </aside>
        </>
      )}
    </section>
  );
}
