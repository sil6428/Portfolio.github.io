"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type HotspotData = {
  key: string;
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
    summary: "From digital models to finished props, including a katana inspired by Elden Ring and Leon's hand cannon.",
    details: ["Slicing", "Assembly", "Sanding + finishing"],
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

function findHotspot(object: THREE.Object3D | null): THREE.Object3D | null {
  let current = object;
  while (current) {
    if (current.userData.key) return current;
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
    camera.position.set(6.15, 4.6, 7.15);
    camera.lookAt(0, 1.55, -0.55);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.setClearColor(0x080a0f, 0.82);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.55, -0.55);
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

    const hotspot = (key: string, label: string, parent: THREE.Object3D = room) => {
      const group = new THREE.Group();
      group.userData = { key, label } satisfies HotspotData;
      clickable.push(group);
      objectByKey.set(key, group);
      parent.add(group);
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
    box(desk, [7.65, 0.18, 2.2], [-1.32, 1.35, -3.15], "#202a31", { metalness: 0.45, roughness: 0.48 });
    for (const x of [-4.92, 2.28]) {
      for (const z of [-4.02, -2.3]) {
        box(desk, [0.17, 1.35, 0.17], [x, 0.68, z], "#141c22", { metalness: 0.62 });
      }
    }
    box(desk, [7.2, 0.12, 0.18], [-1.32, 0.72, -4.03], "#111920", { metalness: 0.7 });
    box(desk, [5.9, 0.08, 0.22], [-1.72, 1.1, -4.13], "#26333a", { metalness: 0.62 });

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
      background.addColorStop(0, "#071018");
      background.addColorStop(0.52, "#12253a");
      background.addColorStop(1, "#241943");
      desktopContext.fillStyle = background;
      desktopContext.fillRect(0, 0, 1024, 640);
      desktopContext.strokeStyle = "rgba(119,231,255,.16)";
      desktopContext.lineWidth = 2;
      for (let line = -180; line < 1180; line += 90) {
        desktopContext.beginPath();
        desktopContext.moveTo(line, 640);
        desktopContext.lineTo(line + 320, 0);
        desktopContext.stroke();
      }
      desktopContext.fillStyle = "rgba(5,10,16,.72)";
      desktopContext.fillRect(0, 0, 1024, 58);
      desktopContext.fillStyle = "#90a7b4";
      desktopContext.font = "22px monospace";
      desktopContext.fillText("AFFAN_OS", 30, 37);
      desktopContext.textAlign = "right";
      desktopContext.fillText("PROJECT DESKTOP   08:28", 994, 37);
      desktopContext.textAlign = "left";
      const files = [
        { x: 170, y: 102, width: 182, height: 188, color: "#77e7ff", title: "ARCHTECH", note: "project.file" },
        { x: 512, y: 102, width: 182, height: 188, color: "#9f91ff", title: "SSIK", note: "project.file" },
        { x: 854, y: 102, width: 182, height: 188, color: "#ffbd72", title: "ABOUT", note: "profile.doc" },
        { x: 340, y: 340, width: 218, height: 150, color: "#68e0ae", title: "CONTACT", note: "links.file" },
        { x: 684, y: 340, width: 218, height: 150, color: "#e7eceb", title: "RESUME", note: "resume.pdf" },
      ];
      for (const file of files) {
        desktopContext.fillStyle = "rgba(4,8,14,.74)";
        desktopContext.fillRect(file.x - file.width / 2, file.y, file.width, file.height);
        desktopContext.strokeStyle = file.color;
        desktopContext.strokeRect(file.x - file.width / 2, file.y, file.width, file.height);
        desktopContext.fillStyle = file.color;
        desktopContext.fillRect(file.x - 43, file.y + 38, 86, 62);
        desktopContext.fillRect(file.x - 43, file.y + 26, 38, 18);
        desktopContext.fillStyle = "#eaf8fb";
        desktopContext.font = "21px monospace";
        desktopContext.textAlign = "center";
        desktopContext.fillText(file.title, file.x, file.y + file.height - 43);
        desktopContext.fillStyle = "#82949e";
        desktopContext.font = "15px monospace";
        desktopContext.fillText(file.note, file.x, file.y + file.height - 19);
      }
      desktopContext.fillStyle = "rgba(4,8,14,.78)";
      desktopContext.fillRect(250, 555, 524, 52);
      for (let icon = 0; icon < 6; icon += 1) {
        desktopContext.fillStyle = icon === 2 ? "#77e7ff" : "#556975";
        desktopContext.fillRect(285 + icon * 78, 569, 28, 24);
      }
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
    addDesktopFile("archtech", "OPEN ARCHTECH FILE", -1.06, 1.34, 0.62, 0.6, cyan);
    addDesktopFile("ssik", "OPEN SSIK FILE", 0, 1.34, 0.62, 0.6, violet);
    addDesktopFile("profile", "OPEN ABOUT FILE", 1.06, 1.34, 0.62, 0.6, amber);
    addDesktopFile("contact", "OPEN CONTACT FILE", -0.54, 0.66, 0.74, 0.48, "#68e0ae");
    addDesktopFile("resume", "OPEN RESUME PDF", 0.54, 0.66, 0.74, 0.48, "#e7eceb");

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
    rack.position.set(4.72, 0, -3.48);
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
    box(printer, [1.72, 0.1, 1.35], [0, 0.25, 0], "#29363d", { metalness: 0.38 });
    const printedPiece = new THREE.Group();
    printedPiece.name = "printer-cyber-helmet";
    printedPiece.position.set(0, 0.28, 0);
    printer.add(printedPiece);
    const printMaterial = material("#252331", { roughness: 0.68 });
    const printAccent = material("#7b65d1", { emissive: "#342768", emissiveIntensity: 0.28, roughness: 0.56 });
    const printBase = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.12, 8), printMaterial);
    printBase.position.y = 0.06;
    printedPiece.add(printBase);
    const helmetDome = new THREE.Mesh(new THREE.SphereGeometry(0.29, 18, 12), printMaterial);
    helmetDome.scale.set(1, 0.92, 0.88);
    helmetDome.position.y = 0.36;
    printedPiece.add(helmetDome);
    box(printedPiece, [0.4, 0.22, 0.18], [0, 0.3, 0.23], "#171720", { roughness: 0.7 });
    box(printedPiece, [0.09, 0.3, 0.05], [0, 0.55, 0.28], "#7b65d1", {
      emissive: "#342768",
      emissiveIntensity: 0.28,
      roughness: 0.56,
    });
    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.48, 6), printAccent);
      horn.position.set(side * 0.24, 0.67, 0);
      horn.rotation.z = side * -0.48;
      printedPiece.add(horn);
      const cheek = box(printedPiece, [0.12, 0.28, 0.12], [side * 0.22, 0.25, 0.22], "#302d42", { roughness: 0.66 });
      cheek.rotation.z = side * 0.18;
    }
    for (let printLayer = 0; printLayer < 5; printLayer += 1) {
      box(printedPiece, [0.78 - printLayer * 0.035, 0.012, 0.7 - printLayer * 0.035], [0, -0.01 + printLayer * 0.024, 0], "#51448a", {
        roughness: 0.74,
      });
    }
    box(printer, [1.72, 0.08, 0.08], [0, 2.18, -0.28], "#68777d", { metalness: 0.9 });
    const printHead = new THREE.Group();
    printHead.name = "printer-head-carriage";
    printHead.position.set(0, 2.18, -0.28);
    printer.add(printHead);
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
    box(printer, [0.34, 0.14, 0.02], [0.62, 0.28, 0.925], cyan, { emissive: cyan, emissiveIntensity: 0.75 });

    const bookshelf = new THREE.Group();
    bookshelf.position.set(-6.08, 0, 1.05);
    room.add(bookshelf);
    box(bookshelf, [0.22, 2.4, 3.15], [-0.18, 1.2, 0], "#121a20", { metalness: 0.34, roughness: 0.62 });
    for (const z of [-1.5, 1.5]) {
      box(bookshelf, [0.72, 2.45, 0.16], [0.1, 1.23, z], "#27343a", { metalness: 0.42, roughness: 0.54 });
    }
    for (const y of [0.16, 1.17, 2.35]) {
      box(bookshelf, [0.72, 0.14, 3.15], [0.1, y, 0], "#27343a", { metalness: 0.42, roughness: 0.54 });
    }
    for (let brace = 0; brace < 2; brace += 1) {
      box(bookshelf, [0.08, 0.08, 2.76], [0.47, 0.66 + brace * 1.02, 0], "#52656d", { metalness: 0.72 });
    }

    const books = hotspot("books", "READING SHELF");
    books.position.set(-5.67, 1.3, 1.28);
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
    cameraGroup.position.set(-5.62, 2.8, 0.02);
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
    racket.position.set(-5.56, 2.02, 2.92);
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
      material("#121b22", { metalness: 0.02, roughness: 1 }),
    );
    floorRug.rotation.x = -Math.PI / 2;
    floorRug.position.set(-0.2, 0.022, 0.95);
    room.add(floorRug);
    for (let ring = 1; ring <= 3; ring += 1) {
      const rugRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.35 * ring, 0.012, 5, 48),
        material(ring === 2 ? "#524580" : "#253b43", { roughness: 0.9 }),
      );
      rugRing.rotation.x = Math.PI / 2;
      rugRing.position.set(-0.2, 0.03, 0.95);
      room.add(rugRing);
    }
    for (let panel = 0; panel < 4; panel += 1) {
      box(room, [1.85, 0.055, 0.08], [-3.6 + panel * 2.35, 4.42, -4.34], panel % 2 ? "#3f6873" : "#38454c", {
        emissive: panel % 2 ? "#244b54" : "#151e23",
        emissiveIntensity: 0.35,
        metalness: 0.5,
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
    const overviewPosition = new THREE.Vector3(6.15, 4.6, 7.15);
    const overviewTarget = new THREE.Vector3(0, 1.55, -0.55);
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
        focusedKey = null;
        document.body.classList.remove("room-focus-active");
        beginCameraMove(overviewPosition.clone(), overviewTarget.clone(), null, "RETURNING TO ROOM OVERVIEW");
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
      const compositionShift = cameraRight.multiplyScalar(window.innerWidth < 720 ? 0.3 : 0.78);
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
      if (selected?.userData.key) focusObject(selected.userData.key);
    };

    const handlePointerLeave = () => {
      hovered = null;
      pointerParallaxTarget.set(0, 0);
      renderer.domElement.style.cursor = "grab";
      setHoverLabel("");
    };
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

    const printerCarriage = room.getObjectByName("printer-head-carriage");
    const printerSpool = room.getObjectByName("printer-spool");
    const animatedCatTail = room.getObjectByName("cat-tail-3d");
    let previousTimestamp = performance.now();
    let frame = 0;
    const render = (timestamp = performance.now()) => {
      const elapsed = timestamp * 0.001;
      const delta = Math.min((timestamp - previousTimestamp) * 0.001, 0.05);
      previousTimestamp = timestamp;
      if (!reducedMotion) {
        cyanLight.intensity = 22 + Math.sin(elapsed * 1.4) * 2;
        cat.position.y = 0.24 + Math.sin(elapsed * 1.15) * 0.012;
        if (animatedCatTail) animatedCatTail.rotation.y = Math.sin(elapsed * 0.72) * 0.11;
        if (printerCarriage) printerCarriage.position.x = Math.sin(elapsed * 0.9) * 0.55;
        if (printerSpool) printerSpool.rotation.x += delta * 0.34;
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
        <span>Drag / orbit gently</span>
        <span>Select an object / inspect</span>
        <strong>{visitedKeys.length} / {DIRECTORY.length} viewed</strong>
      </div>
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
            aria-label="Return to room overview"
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
          <small>ESC / RETURN TO ROOM</small>
        </aside>
      )}
    </section>
  );
}
