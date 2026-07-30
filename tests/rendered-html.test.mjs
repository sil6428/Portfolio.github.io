import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the full-screen interactive portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Affan Shaikh/);
  assert.match(html, /AFFAN_OS \/ INTERACTIVE PORTFOLIO/);
  assert.match(html, /Explore the lab/);
  assert.match(html, /Move your pointer to shift the room/);
  assert.match(html, /Interactive 3D portfolio/);
  assert.match(html, /3D room objects/);
  assert.match(html, /Archtech file/);
  assert.match(html, /SSIK file/);
  assert.match(html, /Server rack/);
  assert.match(html, /3D printer/);
  assert.match(html, /About file/);
  assert.match(html, /Contact file/);
  assert.match(html, /Resume file/);
  assert.match(html, /Inspiration file/);
  assert.doesNotMatch(html, /Room controls/);
  assert.doesNotMatch(html, /08 ACTIVE OBJECTS/);
  assert.doesNotMatch(html, /href="#room-directory"/);
  assert.doesNotMatch(html, /class="immersive-header"/);
  assert.doesNotMatch(html, /class="immersive-footer"/);
  assert.doesNotMatch(html, /class="immersive-status"/);
  assert.doesNotMatch(html, /href="\/info"/);
  assert.doesNotMatch(html, /href="\/interests"/);
  assert.doesNotMatch(html, /href="\/work\//);
  assert.match(html, /Soundtrack/);
  assert.doesNotMatch(html, /Arch Narrative/i);
});

test("renders both project case studies", async () => {
  const archtechResponse = await render("/work/archtech");
  assert.equal(archtechResponse.status, 200);
  const archtech = await archtechResponse.text();
  assert.match(archtech, /Why I started it/);
  assert.match(archtech, /Stage 4\.5/);
  assert.match(archtech, /\/projects\/archtech-home\.png/);
  assert.doesNotMatch(archtech, /_next\/image/);
  assert.match(archtech, /still a work in progress/i);

  const ssikResponse = await render("/work/ssik");
  assert.equal(ssikResponse.status, 200);
  const ssik = await ssikResponse.text();
  assert.match(ssik, /The goal/);
  assert.match(ssik, /GitHub Pages/);
  assert.match(ssik, /\/projects\/ssik-home\.png/);
  assert.doesNotMatch(ssik, /_next\/image/);
  assert.match(ssik, /View source/);
  assert.match(ssik, /sole site creator/);
  assert.match(ssik, /independently created the entire public website/);
});

test("publishes crawler and structured profile metadata", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /ProfilePage/);
  assert.match(html, /Ontario Tech University/);
  assert.match(html, /\/og-lab\.png/);
  assert.match(html, /\/terminal-favicon\.svg/);

  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /work\/archtech/);
  assert.match(sitemap, /work\/ssik/);

  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /Allow: \//);
  assert.match(robots, /sitemap\.xml/i);
});

test("renders the information page", async () => {
  const response = await render("/info");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Ontario Tech University/);
  assert.match(html, /Skills and tools/);
  assert.match(html, /430 hours/);
  assert.match(html, /Explore my interests/);
  assert.match(html, /href="tel:\+16473091927">Phone/);
  assert.match(html, /https:\/\/github\.com\/sil6428/);
  assert.match(html, /Current focus/);
  assert.doesNotMatch(html, /src="\/affan-portrait\.png"/);
});

test("renders the expanded interests page", async () => {
  const response = await render("/interests");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Badminton/);
  assert.match(html, /3D printing &amp; design/);
  assert.match(html, /Lord of the Mysteries/);
  assert.match(html, /Reverend Insanity/);
  assert.match(html, /Proxmox home lab/);
  assert.match(html, /Photography/);
  assert.match(html, /https:\/\/sy1len\.vsco\.site/);
  assert.match(html, /court-visual/);
  assert.match(html, /printer-visual/);
  assert.match(html, /books-visual/);
  assert.match(html, /photo-visual/);
  assert.match(html, /rack-visual/);
  assert.match(html, /Read full notes/);
  assert.match(html, /href="\/interests\/badminton"/);
  assert.match(html, /href="\/interests\/3d-printing"/);
});

test("renders all expanded interest notes", async () => {
  const pages = [
    ["/interests/badminton", /Competing at regionals/],
    ["/interests/3d-printing", /From a file to a finished piece/],
    ["/interests/reading", /What I am reading/],
    ["/interests/photography", /What I look for/],
    ["/interests/home-lab", /Why reuse old computers/],
  ];

  for (const [path, expected] of pages) {
    const response = await render(path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), expected);
  }
});

test("includes the device-local soundtrack and hidden terminal", async () => {
  const source = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/site-extras.tsx", import.meta.url), "utf8"),
  );
  assert.match(source, /open\.spotify\.com\/playlist/);
  assert.doesNotMatch(source, /open\.spotify\.com\/embed\/playlist/);
  assert.match(source, /1whuIX2zMB3aYGf5oEdCGs/);
  assert.match(source, /window\.localStorage/);
  assert.match(source, /KONAMI_SEQUENCE/);
  assert.match(source, /AFFAN_OS/);
  assert.match(source, /Hidden things and how to find them/);
  assert.match(source, /Desktop files/);
  assert.match(source, /Three-minute print/);
  assert.match(source, /Original sound effects/);
  assert.match(source, /procedural Web Audio tones/);
  assert.match(source, /sfx-settings/);
  assert.match(source, /Cat trust/);
  assert.match(source, /Printed relic/);
  assert.match(source, /Server beacon/);
  assert.doesNotMatch(source, /cat\.jpg/i);
  assert.match(source, /affan-room-palette/);
  assert.match(source, /affan-room-cat/);
  assert.match(source, /affan-room-relic/);
  assert.match(source, /affan-room-signal/);
  assert.doesNotMatch(source, /PortfolioCat/);
  assert.doesNotMatch(source, /portfolio-cat-swat/);
  assert.doesNotMatch(source, /cat-is-home/);
  const sfx = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/site-sfx.ts", import.meta.url), "utf8"),
  );
  assert.match(sfx, /new AudioContext/);
  assert.match(sfx, /affan-portfolio-sfx/);
  assert.match(sfx, /effect === "complete"/);
  assert.match(sfx, /effect === "cat"/);
  assert.doesNotMatch(source, /cat-play-badminton/);
  assert.match(source, /usePathname/);
  assert.match(source, /MobileNavigationTransitions/);
  assert.match(source, /startViewTransition/);
  assert.match(source, /Choose an audio file/);
  assert.match(source, /URL\.createObjectURL/);

  const styles = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  );
  assert.doesNotMatch(styles, /portfolio-cat/);
  assert.doesNotMatch(styles, /cat-footer-visible/);
  assert.doesNotMatch(styles, /cat-house-ready/);
  assert.match(styles, /view-transition-name: mobile-active-tab/);
  assert.match(styles, /max-height: calc\(100svh - 92px\)/);
  assert.match(styles, /max-height: 520px/);
  assert.match(styles, /width: 44px/);
  assert.match(styles, /prefers-reduced-motion: reduce/);

  const topology = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/topology-scene.tsx", import.meta.url), "utf8"),
  );
  assert.match(topology, /from "three"/);
  assert.match(topology, /WebGLRenderer/);
  assert.match(topology, /LIVE TOPOLOGY/);

  const room = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/interactive-room.tsx", import.meta.url), "utf8"),
  );
  assert.match(room, /OrbitControls/);
  assert.match(room, /OPEN ARCHTECH FILE/);
  assert.match(room, /OPEN SSIK FILE/);
  assert.match(room, /OPEN ABOUT FILE/);
  assert.match(room, /OPEN CONTACT FILE/);
  assert.match(room, /OPEN RESUME PDF/);
  assert.match(room, /OPEN INSPIRATION FILE/);
  assert.match(room, /https:\/\/bruno-simon\.com\//);
  assert.match(room, /https:\/\/idas-gameboy\.netlify\.app\//);
  assert.match(room, /https:\/\/www\.jesse-zhou\.com\//);
  assert.match(room, /Open resume PDF/);
  assert.match(room, /tel:\+16473091927/);
  assert.match(room, /Affan_Shaikh_Resume\.pdf/);
  assert.match(room, /CanvasTexture/);
  assert.match(room, /wall-decor-collection/);
  assert.match(room, /wall-network-topology-frame/);
  assert.match(room, /wall-photography-triptych/);
  assert.match(room, /#080d15/);
  assert.match(room, /#18152b/);
  assert.doesNotMatch(room, /#a9edcf/);
  assert.match(room, /PROXMOX SERVER RACK/);
  assert.match(room, /3D PRINTER/);
  assert.match(room, /compact-desktop-pc-setup/);
  assert.match(room, /desktop-monitor/);
  assert.match(room, /desktop-mouse/);
  assert.match(room, /desktop-pc-power/);
  assert.match(room, /printer-head-carriage/);
  assert.match(room, /printer-miniature-chess-set/);
  assert.match(room, /chess-board-layer/);
  assert.match(room, /chess-board-square/);
  assert.match(room, /pieceLayer\.name = `chess-\$\{kind\}-layer`/);
  assert.match(room, /\["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"\]/);
  assert.match(room, /chess-rook-battlement/);
  assert.match(room, /chess-knight-head/);
  assert.match(room, /chess-bishop-tip/);
  assert.match(room, /chess-queen-crown/);
  assert.match(room, /chess-king-cross/);
  assert.match(room, /chessSetHeight = 0\.5/);
  assert.match(room, /0\.84 \+ printProgress \* chessSetHeight/);
  assert.match(room, /printer-y-bed/);
  assert.match(room, /printer-z-gantry/);
  assert.match(room, /printer-spool-black/);
  assert.match(room, /printer-spool-orange/);
  assert.match(room, /printer-spool-purple/);
  assert.match(room, /printer-spool-white/);
  assert.match(room, /createPrinterSpool/);
  assert.match(room, /printableParts/);
  assert.match(room, /desk-cyan-edge/);
  assert.match(room, /racketMount/);
  assert.match(room, /racket\.position\.set\(-4\.35, 3\.52, -4\.08\)/);
  assert.match(room, /cameraGroup\.position\.set\(-5\.12, 2\.8, 0\.34\)/);
  assert.match(room, /ceilingPanelColors/);
  assert.doesNotMatch(room, /let brace/);
  assert.match(room, /PRINT_DURATION_MS = 180_000/);
  assert.match(room, /drawPrinterDisplay/);
  assert.match(room, /THREE-MINUTE PRINT COMPLETE/);
  assert.match(room, /CHESS SET READY/);
  assert.doesNotMatch(room, /dagger/i);
  assert.match(room, /playSiteSfx\("complete"\)/);
  assert.match(room, /playSiteSfx\("open"\)/);
  assert.doesNotMatch(room, /cat\.jpg/i);
  assert.match(room, /bottom-shelf-printed-katana/);
  assert.match(room, /shelf-katana-unified-curved-blade/);
  assert.match(room, /shelf-katana-habaki/);
  assert.doesNotMatch(room, /shelf-katana-white-spine/);
  assert.match(room, /shelf-katana-tsuba/);
  assert.match(room, /shelf-katana-kashira/);
  assert.match(room, /hidden-server-beacon/);
  assert.match(room, /PRINTED RELIC AWAKENED/);
  assert.match(room, /SERVER BEACON ONLINE/);
  assert.match(room, /PURR MODE UNLOCKED/);
  assert.match(room, /SUNROOM PALETTE UNLOCKED/);
  assert.match(room, /BADMINTON/);
  assert.match(room, /READING SHELF/);
  assert.match(room, /PHOTOGRAPHY/);
  assert.match(room, /cat-tail-3d/);
  assert.match(room, /cat-patterned-bandana/);
  assert.match(room, /cat-name-tag/);
  assert.match(room, /cat-rug-yarn-ball/);
  assert.match(room, /cat-rug-loose-yarn/);
  assert.match(room, /cat-rug-toy-mouse/);
  assert.match(room, /cat-rug-water-bowl/);
  assert.match(room, /TubeGeometry/);
  assert.match(room, /raycaster\.intersectObjects/);
  assert.match(room, /touchOffsets/);
  assert.match(room, /phonePortrait/);
  assert.match(room, /phoneLandscape/);
  assert.match(room, /beginCameraMove/);
  assert.match(room, /RETURNING TO DEFAULT VIEW/);
  assert.match(room, /dismissObjectFile/);
  assert.match(room, /Close object file and keep the current camera view/);
  assert.match(room, /Close object file and return to the default room view/);
  assert.match(room, /OUTSIDE \/ FREE CAMERA/);
  assert.match(room, /focusObject/);
  assert.match(room, /room-popup/);
  assert.match(room, /setActiveKey/);
  assert.match(room, /controls\.enableZoom = true/);
  assert.match(room, /controls\.minDistance = 2\.1/);
  assert.match(room, /controls\.mouseButtons\.RIGHT = THREE\.MOUSE\.PAN/);
  assert.match(room, /Right drag \/ move camera/);
  assert.match(room, /contextmenu/);
  assert.match(room, /cameraOffset/);
  assert.match(room, /compositionShift/);
  assert.match(room, /room-focus-active/);
  assert.match(room, /room-default-view/);
  assert.match(room, /markCameraExploring/);
  assert.match(room, /targetOffset/);
  assert.match(room, /room-popup-sections/);
  assert.match(room, /pointerParallax/);
  assert.match(room, /pointerParallaxTarget/);
  assert.match(room, /arcHeight/);
  assert.match(room, /interactionMarkers/);
  assert.match(room, /MOVE \/ DRAG \/ SELECT/);
  assert.match(room, /SCENE RESPONSIVE/);
  assert.match(room, /affan-lab-discoveries/);
  assert.match(room, /viewed/);
  assert.doesNotMatch(room, /rack-fan-/);
  assert.doesNotMatch(room, /const rackFans/);
  assert.doesNotMatch(room, /CYBER ROVER/);
  assert.doesNotMatch(room, /driveState/);
  assert.doesNotMatch(room, /rover-pad/);
  assert.doesNotMatch(room, /from "next\/link"/);
  assert.doesNotMatch(room, /href: "\/work\//);
  assert.doesNotMatch(room, /href: "\/interests\//);

  assert.match(styles, /room-fluid-hint/);
  assert.match(styles, /room-directory-accessible/);
  assert.match(styles, /room-secret-toast/);
  assert.match(styles, /body\.room-default-view \.immersive-intro/);
  assert.match(styles, /body\.room-default-view \.room-fluid-hint/);
  assert.doesNotMatch(styles, /room-drive-hud/);
  assert.doesNotMatch(styles, /rover-pad/);
});
