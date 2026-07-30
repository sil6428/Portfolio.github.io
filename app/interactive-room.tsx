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
  workstation: {
    number: "01",
    directory: "Workstation",
    label: "SELECTED WORK / TWO CASE STUDIES",
    title: "Projects workstation",
    summary: "The main screen holds Archtech, my privacy-focused platform in progress. The second holds SSIK, the IT consulting site I independently designed and built.",
    details: ["Archtech", "SSIK Website", "TypeScript + React", "Cloudflare"],
    sections: [
      {
        heading: "Archtech",
        body: "A stealth, work-in-progress nonprofit platform centered on private community messaging, publishing, moderation, role-based access, and program coordination. I have been building the interface, deployment flow, and privacy-aware access model across staged releases.",
      },
      {
        heading: "SSIK Website",
        body: "I independently designed and built SSIK's public website for our IT consulting team. It explains our services, gives prospective clients a clear way to understand the team, and is deployed through GitHub Pages.",
      },
      {
        heading: "What I learned",
        body: "Both projects pushed me to plan information architecture, responsive states, real deployment constraints, and maintainable interfaces instead of treating the website as a static mockup.",
      },
    ],
    cameraOffset: [0.2, 0.45, 3.45],
    targetOffset: [0, 2.2, 0.08],
  },
  rack: {
    number: "02",
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
    cameraOffset: [0, 0.15, 3.7],
    targetOffset: [0, 1.9, 0.68],
  },
  printer: {
    number: "03",
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
    cameraOffset: [0.15, 0.35, 3.45],
    targetOffset: [0, 1.25, 0.05],
  },
  racket: {
    number: "04",
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
    cameraOffset: [0, 0.1, 3.1],
    targetOffset: [0, -0.05, 0.05],
  },
  books: {
    number: "05",
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
    cameraOffset: [0, 0.45, 2.9],
    targetOffset: [0, 0.5, 0],
  },
  camera: {
    number: "06",
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
    cameraOffset: [0, 0.25, 2.65],
    targetOffset: [0, 0, 0.4],
  },
  profile: {
    number: "07",
    directory: "Wall board",
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
    cameraOffset: [0, 0, 3.55],
    targetOffset: [0, 0, 0.08],
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

    const hotspot = (key: string, label: string) => {
      const group = new THREE.Group();
      group.userData = { key, label } satisfies HotspotData;
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

    const workstation = hotspot("workstation", "PROJECTS WORKSTATION");
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
    const sideMonitor = box(workstation, [1.22, 0.92, 0.12], [1.72, 2.15, -0.12], "#121a21", { metalness: 0.55 });
    sideMonitor.rotation.y = -0.16;
    const sideScreen = box(workstation, [1.05, 0.74, 0.025], [1.7, 2.15, -0.045], "#9f91ff", {
      emissive: "#503eb8",
      emissiveIntensity: 0.9,
      roughness: 0.28,
    });
    sideScreen.rotation.y = -0.16;
    box(workstation, [0.09, 0.6, 0.09], [1.72, 1.52, -0.12], "#18232a", { metalness: 0.72 });
    box(workstation, [0.56, 0.06, 0.34], [1.72, 1.4, -0.02], "#18232a", { metalness: 0.72 });
    box(workstation, [2.1, 0.08, 0.72], [0.05, 1.49, 0.63], "#151e24", { metalness: 0.44 });
    for (let row = 0; row < 4; row += 1) {
      for (let key = 0; key < 12; key += 1) {
        box(
          workstation,
          [0.11, 0.025, 0.09],
          [-0.82 + key * 0.15, 1.55, 0.43 + row * 0.13],
          row === 0 && key > 8 ? "#33434a" : "#26343b",
          { metalness: 0.26 },
        );
      }
    }
    const mouse = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 12),
      material("#25323a", { metalness: 0.45, roughness: 0.4 }),
    );
    mouse.scale.set(0.72, 0.28, 1.05);
    mouse.position.set(1.38, 1.57, 0.62);
    workstation.add(mouse);
    box(workstation, [0.64, 1.2, 0.8], [-2.05, 0.74, -0.05], "#10171d", { metalness: 0.62, roughness: 0.34 });
    for (let vent = 0; vent < 4; vent += 1) {
      box(workstation, [0.34, 0.035, 0.018], [-2.05, 0.45 + vent * 0.18, 0.37], "#4e6269", { metalness: 0.8 });
    }
    const powerLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 10, 10),
      material(cyan, { emissive: cyan, emissiveIntensity: 2 }),
    );
    powerLed.position.set(-2.05, 1.17, 0.38);
    workstation.add(powerLed);

    const rack = hotspot("rack", "PROXMOX SERVER RACK");
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
      box(rack, [0.12, 0.09, 0.035], [-0.54, 0.58 + unit * 0.43, 0.755], "#0c1115", { metalness: 0.8 });
      for (let port = 0; port < 4; port += 1) {
        box(rack, [0.075, 0.045, 0.025], [-0.28 + port * 0.12, 0.58 + unit * 0.43, 0.76], "#61757d", { metalness: 0.72 });
      }
    }
    box(rack, [0.09, 3.25, 0.09], [-0.7, 1.86, 0.76], "#53636a", { metalness: 0.88 });
    box(rack, [0.09, 3.25, 0.09], [0.7, 1.86, 0.76], "#53636a", { metalness: 0.88 });
    for (let fanIndex = 0; fanIndex < 2; fanIndex += 1) {
      const fan = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.025, 8, 24),
        material("#090d11", { metalness: 0.64, roughness: 0.36 }),
      );
      fan.name = `rack-fan-${fanIndex}`;
      fan.position.set(-0.28 + fanIndex * 0.56, 3.34, 0.75);
      rack.add(fan);
    }
    const patchCable = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.018, 6, 32, Math.PI * 1.45),
      material("#49d9a0", { emissive: "#1d6048", emissiveIntensity: 0.45, roughness: 0.52 }),
    );
    patchCable.rotation.z = 0.3;
    patchCable.position.set(0.2, 2.15, 0.82);
    rack.add(patchCable);

    const printer = hotspot("printer", "3D PRINTER");
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
    for (let layer = 0; layer < 7; layer += 1) {
      box(printer, [0.62 - layer * 0.025, 0.018, 0.62 - layer * 0.025], [0, 0.64 + layer * 0.095, 0], layer % 2 ? "#7458e0" : "#9b82ff", {
        emissive: "#39268a",
        emissiveIntensity: 0.28,
      });
    }
    box(printer, [0.52, 0.32, 0.45], [0, 2.22, -0.34], "#1b242b", { metalness: 0.72 });
    box(printer, [1.72, 0.08, 0.08], [0, 2.18, -0.28], "#68777d", { metalness: 0.9 });
    const nozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.075, 0.24, 10),
      material("#d49a54", { metalness: 0.88, roughness: 0.28 }),
    );
    nozzle.name = "printer-nozzle";
    nozzle.position.set(0, 1.97, -0.12);
    printer.add(nozzle);
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
    box(printer, [0.52, 0.32, 0.08], [0.62, 0.48, 0.88], "#162028", { metalness: 0.55 });
    box(printer, [0.34, 0.14, 0.02], [0.62, 0.48, 0.925], cyan, { emissive: cyan, emissiveIntensity: 0.75 });

    const books = hotspot("books", "READING STACK");
    books.position.set(-4.35, 0, 1.7);
    [["#424d55", 0.22], ["#7d6cc8", 0.48], ["#9b7448", 0.73]].forEach(([color, y], index) => {
      box(books, [1.65 - index * 0.08, 0.24, 1.05], [0, Number(y), 0], color as string, { roughness: 0.9 });
      box(books, [1.46 - index * 0.08, 0.16, 1.065], [0.06, Number(y), 0], "#d6cfb4", { roughness: 1 });
      box(books, [0.08, 0.25, 1.08], [-0.79 + index * 0.04, Number(y), 0], color as string, { roughness: 0.88 });
    });
    const uprightBook = box(books, [0.32, 1.25, 1.02], [0.42, 1.45, -0.02], "#314e5b", { roughness: 0.86 });
    uprightBook.rotation.z = -0.1;
    box(books, [0.34, 0.06, 1.04], [0.49, 1.87, -0.01], amber, { roughness: 0.76 });
    const bookmark = box(books, [0.08, 0.42, 0.025], [0.25, 0.83, 0.42], "#d16b60", { roughness: 0.9 });
    bookmark.rotation.z = 0.08;

    const cameraGroup = hotspot("camera", "PHOTOGRAPHY");
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
    box(cameraGroup, [0.36, 0.26, 0.42], [-0.36, 0.38, -0.02], "#222b31", { metalness: 0.68, roughness: 0.3 });
    box(cameraGroup, [0.26, 0.18, 0.38], [0.39, 0.42, -0.01], "#252f35", { metalness: 0.66, roughness: 0.28 });
    box(cameraGroup, [0.24, 0.5, 0.5], [0.48, -0.08, 0], "#11171b", { roughness: 0.42 });
    const shutter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.035, 16),
      material("#aeb9bc", { metalness: 0.92, roughness: 0.2 }),
    );
    shutter.position.set(0.34, 0.51, 0.12);
    cameraGroup.add(shutter);
    for (let dialIndex = 0; dialIndex < 2; dialIndex += 1) {
      const dial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.07, 18),
        material("#303a40", { metalness: 0.78, roughness: 0.24 }),
      );
      dial.position.set(-0.28 + dialIndex * 0.48, 0.49, -0.02);
      cameraGroup.add(dial);
    }
    const strap = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.025, 7, 36, Math.PI * 1.6),
      material("#202629", { roughness: 0.95 }),
    );
    strap.rotation.z = Math.PI;
    strap.position.set(-0.02, -0.48, -0.12);
    cameraGroup.add(strap);

    const racket = hotspot("racket", "BADMINTON");
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
    for (let string = -4; string <= 4; string += 1) {
      box(racket, [0.98, 0.014, 0.012], [0, string * 0.12, 0], "#66767c", { metalness: 0.18 });
    }
    for (let wrap = 0; wrap < 7; wrap += 1) {
      const gripBand = new THREE.Mesh(
        new THREE.TorusGeometry(0.072, 0.012, 6, 18),
        material(wrap % 2 ? "#9a75da" : "#503177", { roughness: 0.8 }),
      );
      gripBand.rotation.x = Math.PI / 2;
      gripBand.position.y = -0.72 - wrap * 0.15;
      racket.add(gripBand);
    }
    const shuttle = new THREE.Group();
    shuttle.position.set(-0.92, -0.3, 0.04);
    const shuttleCork = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 14, 10),
      material("#e5d0a6", { roughness: 0.82 }),
    );
    shuttleCork.scale.y = 0.72;
    shuttle.add(shuttleCork);
    const shuttleSkirt = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.44, 12, 1, true),
      material("#e7eceb", { roughness: 0.72 }),
    );
    shuttleSkirt.position.y = 0.26;
    shuttle.add(shuttleSkirt);
    shuttle.rotation.z = 0.45;
    racket.add(shuttle);

    const profile = hotspot("profile", "ABOUT AFFAN");
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
    box(profile, [3.36, 0.09, 0.16], [0, 0.77, 0], "#3a484e", { metalness: 0.62 });
    box(profile, [3.36, 0.09, 0.16], [0, -0.77, 0], "#3a484e", { metalness: 0.62 });
    box(profile, [0.09, 1.62, 0.16], [-1.64, 0, 0], "#3a484e", { metalness: 0.62 });
    box(profile, [0.09, 1.62, 0.16], [1.64, 0, 0], "#3a484e", { metalness: 0.62 });
    const noteColors = ["#d4ccb7", "#8ec7cf", "#b9a3df"];
    for (let noteIndex = 0; noteIndex < 3; noteIndex += 1) {
      const note = box(profile, [0.64, 0.42, 0.025], [-0.87 + noteIndex * 0.86, -0.25 + (noteIndex % 2) * 0.18, 0.125], noteColors[noteIndex], { roughness: 0.92 });
      note.rotation.z = (noteIndex - 1) * 0.05;
      for (let noteLine = 0; noteLine < 3; noteLine += 1) {
        box(profile, [0.38 - noteLine * 0.04, 0.012, 0.012], [-0.96 + noteIndex * 0.86, -0.18 + (noteIndex % 2) * 0.18 - noteLine * 0.08, 0.145], "#55666a", { roughness: 0.8 });
      }
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
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 0.22, 4),
        material("#050607", { roughness: 0.9 }),
      );
      ear.position.set(0.43, 0.38, side * 0.12);
      ear.rotation.x = Math.PI / 4;
      cat.add(ear);
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 10, 8),
        material("#9cf4bc", { emissive: "#4ea66b", emissiveIntensity: 1.4, roughness: 0.2 }),
      );
      eye.position.set(0.62, 0.2, side * 0.085);
      cat.add(eye);
    }
    const tail = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.055, 8, 26, Math.PI * 1.35),
      material("#050607", { roughness: 0.9 }),
    );
    tail.rotation.x = Math.PI / 2;
    tail.rotation.z = 0.35;
    tail.position.set(-0.48, 0.14, -0.04);
    cat.add(tail);
    for (const z of [-0.18, 0.18]) {
      const paw = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 12, 8),
        material("#050607", { roughness: 0.92 }),
      );
      paw.scale.set(1.35, 0.46, 0.82);
      paw.position.set(0.34, -0.16, z);
      cat.add(paw);
    }

    const floorRug = new THREE.Mesh(
      new THREE.CircleGeometry(1.45, 48),
      material("#121b22", { metalness: 0.02, roughness: 1 }),
    );
    floorRug.rotation.x = -Math.PI / 2;
    floorRug.position.set(-0.1, 0.022, 1.7);
    room.add(floorRug);
    for (let ring = 1; ring <= 3; ring += 1) {
      const rugRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.35 * ring, 0.012, 5, 48),
        material(ring === 2 ? "#524580" : "#253b43", { roughness: 0.9 }),
      );
      rugRing.rotation.x = Math.PI / 2;
      rugRing.position.set(-0.1, 0.03, 1.7);
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
      marker.position.set(object.position.x, 0.035, object.position.z);
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
    const overviewPosition = new THREE.Vector3(7.7, 5.5, 9.4);
    const overviewTarget = new THREE.Vector3(0, 1.25, 0);
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
      beginCameraMove(target.clone().add(cameraOffset), target, key, `MOVING TO ${entry.directory.toUpperCase()}`);
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

    const printerNozzle = room.getObjectByName("printer-nozzle");
    const printerSpool = room.getObjectByName("printer-spool");
    const rackFans = [room.getObjectByName("rack-fan-0"), room.getObjectByName("rack-fan-1")];
    let previousTimestamp = performance.now();
    let frame = 0;
    const render = (timestamp = performance.now()) => {
      const elapsed = timestamp * 0.001;
      const delta = Math.min((timestamp - previousTimestamp) * 0.001, 0.05);
      previousTimestamp = timestamp;
      if (!reducedMotion) {
        cyanLight.intensity = 22 + Math.sin(elapsed * 1.4) * 2;
        cat.position.y = 0.18 + Math.sin(elapsed * 1.15) * 0.015;
        if (printerNozzle) printerNozzle.position.x = Math.sin(elapsed * 0.9) * 0.55;
        if (printerSpool) printerSpool.rotation.x += delta * 0.34;
        rackFans.forEach((fan, index) => {
          if (fan) fan.rotation.z += delta * (index ? -2.2 : 2.5);
        });
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
      <nav className="room-directory" id="room-directory" aria-label="3D room directory">
        {DIRECTORY.map(([key, entry]) => (
          <button
            type="button"
            className={visitedKeys.includes(key) ? "room-directory-visited" : ""}
            onClick={() => focusRef.current(key)}
            key={key}
          >
            <span>{entry.number}</span>{entry.directory}<i aria-label={visitedKeys.includes(key) ? "Visited" : "Not visited"} />
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
