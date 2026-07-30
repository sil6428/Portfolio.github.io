"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type HotspotData = {
  key?: string;
  easterEgg?: "cat" | "palette";
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
    summary: "From digital models to finished props. In the room, a biker helmet prints from the build plate upward over three minutes.",
    details: ["Live 03:00 print", "Slicing", "Assembly", "Sanding + finishing"],
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
    targetOffset: [0, 1.12, 0.2],
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
    cameraOffset: [2.75, 0.08, 0],
    targetOffset: [0, -0.1, 0],
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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.setClearColor(0x080a0f, 0.82);
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

    const grid = new THREE.GridHelper(12, 24, 0x254a57, 0x15232b);
    grid.position.y = 0.012;
    room.add(grid);

    const desk = new THREE.Group();
    room.add(desk);
    box(desk, [7.65, 0.18, 2.2], [-1.32, 1.35, -3.15], "#30364c", { metalness: 0.45, roughness: 0.48 });
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
    workstation.position.set(-1.75, 1.46, -3.12);
    room.add(workstation);
    box(workstation, [3.45, 0.12, 1.86], [0, 0.02, 0.05], "#151e24", { metalness: 0.55, roughness: 0.38 });
    box(workstation, [1.02, 0.035, 0.72], [0, 0.095, 0.35], "#222d34", { metalness: 0.42, roughness: 0.32 });
    const laptopLid = new THREE.Group();
    laptopLid.position.set(0, 0.11, -0.82);
    laptopLid.rotation.x = -0.08;
    workstation.add(laptopLid);
    box(laptopLid, [3.42, 2.04, 0.13], [0, 1.03, 0], "#10171d", { metalness: 0.68, roughness: 0.32 });

    const desktopCanvas = document.createElement("canvas");
    desktopCanvas.width = 1024;
    desktopCanvas.height = 640;
    const desktopContext = desktopCanvas.getContext("2d");
    if (desktopContext) {
      const background = desktopContext.createLinearGradient(0, 0, 1024, 640);
      background.addColorStop(0, "#a9edcf");
      background.addColorStop(0.5, "#f6e6a8");
      background.addColorStop(1, "#9ee16b");
      desktopContext.fillStyle = background;
      desktopContext.fillRect(0, 0, 1024, 640);
      desktopContext.strokeStyle = "rgba(255,255,255,.72)";
      desktopContext.lineWidth = 2;
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
      desktopContext.fillStyle = "#16271f";
      desktopContext.fillRect(0, 0, 1024, 12);
      desktopContext.fillStyle = "rgba(235,255,225,.94)";
      desktopContext.fillRect(0, 570, 1024, 70);
      desktopContext.strokeStyle = "#17221d";
      desktopContext.lineWidth = 5;
      desktopContext.strokeRect(2, 2, 1020, 636);
      desktopContext.beginPath();
      desktopContext.moveTo(0, 570);
      desktopContext.lineTo(1024, 570);
      desktopContext.stroke();
      desktopContext.fillStyle = "#1d3127";
      desktopContext.font = "bold 20px monospace";
      desktopContext.fillText("AFFAN_OS", 24, 614);
      desktopContext.textAlign = "right";
      desktopContext.fillText("LAB ONLINE  •  08:28", 996, 614);
      desktopContext.textAlign = "left";
      const files = [
        { x: 138, y: 78, width: 170, height: 172, color: "#83d9ff", title: "ARCHTECH", note: "projects/" },
        { x: 360, y: 78, width: 170, height: 172, color: "#b99aff", title: "SSIK", note: "consulting/" },
        { x: 582, y: 78, width: 170, height: 172, color: "#ffc982", title: "ABOUT", note: "profile.doc" },
        { x: 250, y: 306, width: 184, height: 168, color: "#83e6b3", title: "CONTACT", note: "links.file" },
        { x: 512, y: 306, width: 184, height: 168, color: "#f4f2e9", title: "RESUME", note: "resume.pdf" },
      ];
      for (const file of files) {
        desktopContext.fillStyle = "rgba(255,255,245,.84)";
        desktopContext.fillRect(file.x - file.width / 2, file.y, file.width, file.height);
        desktopContext.strokeStyle = "#21312a";
        desktopContext.lineWidth = 4;
        desktopContext.strokeRect(file.x - file.width / 2, file.y, file.width, file.height);
        desktopContext.fillStyle = file.color;
        desktopContext.fillRect(file.x - 42, file.y + 27, 84, 64);
        desktopContext.fillRect(file.x - 42, file.y + 17, 35, 16);
        desktopContext.strokeStyle = "#21312a";
        desktopContext.lineWidth = 3;
        desktopContext.strokeRect(file.x - 42, file.y + 27, 84, 64);
        desktopContext.fillStyle = "#17241e";
        desktopContext.font = "bold 20px monospace";
        desktopContext.textAlign = "center";
        desktopContext.fillText(file.title, file.x, file.y + file.height - 46);
        desktopContext.fillStyle = "#53655b";
        desktopContext.font = "14px monospace";
        desktopContext.fillText(file.note, file.x, file.y + file.height - 22);
      }
      desktopContext.fillStyle = "rgba(255,245,225,.88)";
      desktopContext.fillRect(790, 315, 168, 170);
      desktopContext.strokeStyle = "#21312a";
      desktopContext.lineWidth = 4;
      desktopContext.strokeRect(790, 315, 168, 170);
      desktopContext.fillStyle = "#161817";
      desktopContext.fillRect(820, 340, 108, 76);
      desktopContext.fillStyle = "#d8c75e";
      desktopContext.beginPath();
      desktopContext.arc(851, 375, 7, 0, Math.PI * 2);
      desktopContext.arc(896, 375, 7, 0, Math.PI * 2);
      desktopContext.fill();
      desktopContext.fillStyle = "#17241e";
      desktopContext.font = "bold 20px monospace";
      desktopContext.textAlign = "center";
      desktopContext.fillText("cat.jpg", 874, 452);
      desktopContext.fillStyle = "#53655b";
      desktopContext.font = "13px monospace";
      desktopContext.fillText("do not open", 874, 474);
      desktopContext.textAlign = "left";
    }
    const desktopTexture = new THREE.CanvasTexture(desktopCanvas);
    desktopTexture.colorSpace = THREE.SRGBColorSpace;
    desktopTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const laptopScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(3.18, 1.78),
      new THREE.MeshBasicMaterial({ map: desktopTexture, toneMapped: false }),
    );
    laptopScreen.position.set(0, 1.03, 0.071);
    laptopLid.add(laptopScreen);

    const addDesktopFile = (
      key: "archtech" | "ssik" | "profile" | "contact" | "resume",
      label: string,
      x: number,
      y: number,
      width: number,
      height: number,
      color: THREE.ColorRepresentation,
    ) => {
      const file = hotspot(key, label, laptopLid);
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
    addDesktopFile("contact", "OPEN CONTACT FILE", -0.81, 0.84, 0.57, 0.47, "#68e0ae");
    addDesktopFile("resume", "OPEN RESUME PDF", 0, 0.84, 0.57, 0.47, "#e7eceb");
    const mysteryFile = easterHotspot("palette", "OPEN CAT.JPG", laptopLid);
    mysteryFile.position.set(1.12, 0.78, 0.09);
    mysteryFile.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(0.46, 0.48),
        new THREE.MeshBasicMaterial({ color: "#d8c75e", transparent: true, opacity: 0.035, depthWrite: false }),
      ),
    );

    for (let row = 0; row < 4; row += 1) {
      for (let key = 0; key < 13; key += 1) {
        box(
          workstation,
          [0.15, 0.028, 0.12],
          [-1.18 + key * 0.19, 0.105, -0.08 + row * 0.18],
          row === 0 && key > 9 ? "#3c4c54" : "#27353c",
          { metalness: 0.24 },
        );
      }
    }
    box(workstation, [0.92, 0.02, 0.52], [0, 0.11, 0.73], "#1a242a", { metalness: 0.35, roughness: 0.34 });
    const laptopPower = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 10, 8),
      material(cyan, { emissive: cyan, emissiveIntensity: 2.2 }),
    );
    laptopPower.position.set(1.5, 0.12, -0.7);
    workstation.add(laptopPower);

    const rack = hotspot("rack", "PROXMOX SERVER RACK");
    rack.position.set(4.45, 0, -3.35);
    box(rack, [1.9, 0.16, 1.46], [0, 0.1, 0], "#151d24", { metalness: 0.7, roughness: 0.36 });
    box(rack, [1.9, 0.16, 1.46], [0, 3.7, 0], "#151d24", { metalness: 0.7, roughness: 0.36 });
    for (const x of [-0.86, 0.86]) {
      for (const z of [-0.62, 0.62]) {
        box(rack, [0.14, 3.65, 0.14], [x, 1.85, z], "#202b32", { metalness: 0.78, roughness: 0.3 });
      }
    }
    box(rack, [1.62, 3.38, 0.08], [0, 1.9, -0.67], "#0f151a", { metalness: 0.54, roughness: 0.46 });
    for (let unit = 0; unit < 7; unit += 1) {
      box(rack, [1.58, 0.34, 0.14], [0, 0.55 + unit * 0.44, 0.69], unit === 5 ? "#1d2930" : "#26323a", {
        metalness: 0.7,
        roughness: 0.38,
      });
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
        box(rack, [0.082, 0.05, 0.026], [-0.34 + port * 0.125, 0.55 + unit * 0.44, 0.78], "#61757d", { metalness: 0.72 });
      }
    }
    box(rack, [0.1, 3.3, 0.1], [-0.72, 1.86, 0.79], "#53636a", { metalness: 0.88 });
    box(rack, [0.1, 3.3, 0.1], [0.72, 1.86, 0.79], "#53636a", { metalness: 0.88 });
    for (let vent = 0; vent < 10; vent += 1) {
      box(rack, [0.82, 0.025, 0.025], [0, 3.27 + vent * 0.035, 0.79], "#415158", { metalness: 0.72, roughness: 0.34 });
    }

    const printer = hotspot("printer", "3D PRINTER");
    printer.position.set(1.28, 1.45, -3.18);
    box(printer, [2.05, 0.14, 1.7], [0, 0.08, 0], "#222d34", { metalness: 0.55 });
    box(printer, [0.14, 2.5, 0.14], [-0.9, 1.3, -0.68], "#202a31", { metalness: 0.62 });
    box(printer, [0.14, 2.5, 0.14], [0.9, 1.3, -0.68], "#202a31", { metalness: 0.62 });
    box(printer, [1.95, 0.14, 0.14], [0, 2.52, -0.68], "#202a31", { metalness: 0.62 });
    const printBedAssembly = new THREE.Group();
    printBedAssembly.name = "printer-y-bed";
    printer.add(printBedAssembly);
    box(printBedAssembly, [1.72, 0.1, 1.35], [0, 0.25, 0], "#29363d", { metalness: 0.38 });
    const printedPiece = new THREE.Group();
    printedPiece.name = "printer-biker-helmet";
    printedPiece.position.set(0, 0.28, 0);
    printBedAssembly.add(printedPiece);
    const printableParts: THREE.Object3D[] = [];
    const helmetHeight = 0.82;
    const shellMaterial = material("#242a31", { metalness: 0.34, roughness: 0.46 });
    const stripeMaterial = material("#d96942", { emissive: "#5a2417", emissiveIntensity: 0.24, roughness: 0.4 });
    const visorMaterial = material("#101820", { metalness: 0.72, roughness: 0.16 });
    const addPrintablePart = (part: THREE.Object3D, printHeight: number) => {
      part.visible = false;
      part.userData.printHeight = printHeight;
      printableParts.push(part);
      printedPiece.add(part);
    };
    for (let layer = 0; layer < 33; layer += 1) {
      const y = 0.012 + layer * 0.024;
      const normalized = y / helmetHeight;
      const radius =
        normalized < 0.22
          ? 0.36 + normalized * 0.1
          : Math.max(0.13, 0.42 * Math.sqrt(Math.max(0, 1 - Math.pow((normalized - 0.48) / 0.58, 2))));
      const shellLayer = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.98, radius, 0.021, 28),
        layer >= 9 && layer <= 12 ? stripeMaterial : shellMaterial,
      );
      shellLayer.position.set(0, y, -0.025);
      shellLayer.scale.z = 0.9;
      addPrintablePart(shellLayer, y);

      if (layer >= 6 && layer <= 13) {
        const chinLayer = new THREE.Mesh(
          new THREE.BoxGeometry(0.58 - Math.abs(layer - 9.5) * 0.018, 0.021, 0.19),
          layer >= 9 && layer <= 12 ? stripeMaterial : shellMaterial,
        );
        chinLayer.position.set(0, y, 0.31);
        addPrintablePart(chinLayer, y);
      }
      if (layer >= 15 && layer <= 22) {
        const visorLayer = new THREE.Mesh(
          new THREE.BoxGeometry(0.58 - Math.abs(layer - 18.5) * 0.014, 0.018, 0.075),
          visorMaterial,
        );
        visorLayer.position.set(0, y, 0.29);
        addPrintablePart(visorLayer, y);
      }
    }
    for (const side of [-1, 1]) {
      const visorPivot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.035, 16),
        stripeMaterial,
      );
      visorPivot.rotation.z = Math.PI / 2;
      visorPivot.position.set(side * 0.35, 0.47, 0.12);
      addPrintablePart(visorPivot, 0.47);
    }
    printableParts.sort((a, b) => Number(a.userData.printHeight) - Number(b.userData.printHeight));

    const printerGantry = new THREE.Group();
    printerGantry.name = "printer-z-gantry";
    printerGantry.position.y = 0.88;
    printer.add(printerGantry);
    box(printerGantry, [1.72, 0.08, 0.08], [0, 0, -0.28], "#68777d", { metalness: 0.9 });
    const printHead = new THREE.Group();
    printHead.name = "printer-head-carriage";
    printHead.position.set(0, 0, -0.28);
    printerGantry.add(printHead);
    box(printHead, [0.5, 0.34, 0.44], [0, -0.08, 0.02], "#151d23", { metalness: 0.72, roughness: 0.32 });
    box(printHead, [0.32, 0.11, 0.455], [0, 0.11, 0.025], "#303e44", { metalness: 0.78, roughness: 0.26 });
    const nozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.075, 0.24, 10),
      material("#d49a54", { metalness: 0.88, roughness: 0.28 }),
    );
    nozzle.position.set(0, -0.34, 0.12);
    printHead.add(nozzle);
    box(printHead, [0.14, 0.12, 0.18], [0, -0.2, 0.1], "#c28b4d", { metalness: 0.86, roughness: 0.26 });
    const spool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.26, 28),
      material("#6e55dd", { roughness: 0.52 }),
    );
    spool.name = "printer-spool";
    spool.rotation.z = Math.PI / 2;
    spool.position.set(0.55, 2.86, -0.63);
    printer.add(spool);
    const spoolCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.3, 20),
      material("#171e24", { metalness: 0.45 }),
    );
    spoolCore.rotation.z = Math.PI / 2;
    spoolCore.position.copy(spool.position);
    printer.add(spoolCore);
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
      printerDisplayContext.fillText(progress >= 1 ? "HELMET READY" : `ETA ${minutes}:${seconds}`, 12, 70);
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

    const books = hotspot("books", "READING SHELF");
    books.position.set(-4.99, 1.3, 1.08);
    const bookColors = ["#4d6170", "#7965be", "#9a6c45", "#355968", "#a86a65", "#65518e"];
    const bookWidths = [0.21, 0.24, 0.19, 0.28, 0.22, 0.25];
    let bookZ = -1.04;
    bookColors.forEach((color, index) => {
      const width = bookWidths[index];
      const height = 0.68 + (index % 3) * 0.09;
      box(books, [0.44, height, width], [0, height / 2, bookZ], color, { roughness: 0.86 });
      box(books, [0.02, height * 0.72, width * 0.7], [0.23, height / 2, bookZ], "#d5cdb6", { roughness: 0.96 });
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
    cameraGroup.position.set(-4.94, 2.8, 0.34);
    box(cameraGroup, [0.52, 0.76, 1.08], [0, 0, 0], "#1a2025", { metalness: 0.7, roughness: 0.34 });
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.34, 0.46, 24),
      material("#11161b", { metalness: 0.82, roughness: 0.24 }),
    );
    lens.rotation.z = -Math.PI / 2;
    lens.position.x = 0.43;
    cameraGroup.add(lens);
    const glass = new THREE.Mesh(
      new THREE.CircleGeometry(0.22, 24),
      material("#4b77a5", { emissive: "#1d3857", emissiveIntensity: 0.55, roughness: 0.12 }),
    );
    glass.rotation.y = Math.PI / 2;
    glass.position.x = 0.67;
    cameraGroup.add(glass);
    box(cameraGroup, [0.44, 0.28, 0.38], [-0.03, 0.4, -0.3], "#222b31", { metalness: 0.68, roughness: 0.3 });
    box(cameraGroup, [0.42, 0.18, 0.28], [-0.02, 0.44, 0.35], "#252f35", { metalness: 0.66, roughness: 0.28 });
    box(cameraGroup, [0.52, 0.5, 0.24], [0, -0.08, 0.5], "#11171b", { roughness: 0.42 });
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
    }
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
    racket.position.set(-4, 1.96, -1.35);
    racket.rotation.y = Math.PI / 2;
    racket.rotation.z = -0.14;
    const racketHead = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.055, 10, 38),
      material("#dce7e9", { metalness: 0.55, roughness: 0.32 }),
    );
    racketHead.scale.y = 1.28;
    racket.add(racketHead);
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.045, 0.92, 12),
      material("#b9c8cc", { metalness: 0.74, roughness: 0.3 }),
    );
    shaft.position.y = -1.03;
    racket.add(shaft);
    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.078, 0.62, 12),
      material("#7046b7", { roughness: 0.62 }),
    );
    grip.position.y = -1.72;
    racket.add(grip);
    for (let string = -3; string <= 3; string += 1) {
      const chord = Math.sqrt(Math.max(0, 1 - Math.pow((string * 0.13) / 0.58, 2))) * 1.35;
      box(racket, [0.014, chord, 0.012], [string * 0.13, 0, 0], "#788a90", { metalness: 0.18 });
    }
    for (let string = -4; string <= 4; string += 1) {
      const chord = Math.sqrt(Math.max(0, 1 - Math.pow((string * 0.12) / 0.74, 2))) * 1.02;
      box(racket, [chord, 0.014, 0.012], [0, string * 0.12, 0], "#788a90", { metalness: 0.18 });
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
    }
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
        cat.add(whisker);
      }
    }

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
    scene.add(cyanLight);
    const violetLight = new THREE.PointLight(0x9f91ff, 22, 9, 2);
    violetLight.position.set(3.1, 3.8, 2.2);
    scene.add(violetLight);
    const warmLight = new THREE.PointLight(0xffbd72, 14, 7, 2);
    warmLight.position.set(-4.2, 2.8, 1.5);
    scene.add(warmLight);

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
        cameraMove = null;
        focusedKey = null;
        setActiveKey(null);
        setTransitionLabel("");
        controls.enabled = true;
        document.body.classList.remove("room-focus-active");
        return;
      }

      const entry = ROOM_ENTRIES[key];
      const object = objectByKey.get(key);
      if (!entry || !object) return;
      focusedKey = key;
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
    focusRef.current = focusObject;
    camera.position.copy(overviewPosition);
    controls.target.copy(overviewTarget);
    controls.enabled = true;

    let roomSecretTimeout = 0;
    let catTapCount = 0;
    let catSecretUntil = 0;
    let paletteSecretUntil = 0;
    let paletteWasActive = false;
    const showRoomSecret = (message: string) => {
      window.clearTimeout(roomSecretTimeout);
      setRoomSecret(message);
      roomSecretTimeout = window.setTimeout(() => setRoomSecret(""), 3200);
    };
    const activateRoomSecret = (easterEgg: HotspotData["easterEgg"]) => {
      if (easterEgg === "palette") {
        paletteSecretUntil = performance.now() + 12_000;
        showRoomSecret("CAT.JPG OPENED / SUNROOM PALETTE UNLOCKED");
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
    const handleCatCommand = () => {
      catTapCount = 2;
      activateRoomSecret("cat");
    };
    window.addEventListener("affan-room-palette", handlePaletteCommand);
    window.addEventListener("affan-room-cat", handleCatCommand);

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
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const printerCarriage = room.getObjectByName("printer-head-carriage");
    const printerSpool = room.getObjectByName("printer-spool");
    const animatedCatTail = room.getObjectByName("cat-tail-3d");
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
      const currentPrintHeight = printProgress * helmetHeight;
      for (const part of printableParts) {
        part.visible = Number(part.userData.printHeight) <= currentPrintHeight;
      }
      if (printPercent !== lastPrintPercent) {
        lastPrintPercent = printPercent;
        drawPrinterDisplay(printProgress);
      }
      if (printProgress >= 1 && printCompletedAt === 0) {
        printCompletedAt = timestamp;
        showRoomSecret("THREE-MINUTE PRINT COMPLETE / HELMET READY");
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

      if (!reducedMotion) {
        cyanLight.intensity = 27 + Math.sin(elapsed * 1.4) * 2;
        const catSecretActive = timestamp < catSecretUntil;
        cat.position.y = catSecretActive
          ? 0.24 + Math.abs(Math.sin(elapsed * 7)) * 0.55
          : 0.24 + Math.sin(elapsed * 1.15) * 0.012;
        cat.rotation.y = catSecretActive ? -0.32 + Math.sin(elapsed * 5) * 0.5 : -0.32;
        if (animatedCatTail) animatedCatTail.rotation.y = Math.sin(elapsed * 0.72) * 0.11;
        if (printerCarriage) printerCarriage.position.x = printProgress < 1 ? Math.sin(elapsed * 1.9) * 0.55 : 0;
        if (printerSpool && printProgress < 1) printerSpool.rotation.x += delta * 0.34;
        printBedAssembly.position.z = printProgress < 1 ? Math.sin(elapsed * 1.35) * 0.24 : 0;
        printerGantry.position.y = 0.88 + printProgress * 0.78;
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
      controls.dispose();
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("affan-room-palette", handlePaletteCommand);
      window.removeEventListener("affan-room-cat", handleCatCommand);
      window.clearTimeout(roomSecretTimeout);
      focusRef.current = () => undefined;
      document.body.classList.remove("room-focus-active");
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
        <aside className="room-popup" aria-live="polite" aria-labelledby="room-popup-title">
          <button
            className="room-popup-close"
            type="button"
            aria-label="Close object file and enable camera controls"
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
          <small>ESC / CLOSE FILE / SCROLL TO ZOOM</small>
        </aside>
      )}
    </section>
  );
}
