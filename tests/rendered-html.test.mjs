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

test("renders the work portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Affan Shaikh/);
  assert.match(html, /I learn systems by taking them apart/);
  assert.match(html, /Archtech/);
  assert.match(html, /SSIK Website/);
  assert.match(html, /independently designed and built the public website for SSIK/);
  assert.match(html, /https:\/\/sil6428\.github\.io\/SSIK-website\/index\.html/);
  assert.match(html, /Source code/);
  assert.match(html, /Read case study/);
  assert.match(html, /href="\/work\/archtech"/);
  assert.match(html, /href="\/work\/ssik"/);
  assert.match(html, /CYBERSECURITY \/ 2028/);
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
  assert.match(html, /\/og-topology\.png/);
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
  assert.match(source, /PortfolioCat/);
  assert.match(source, /portfolio-cat-swat/);
  assert.match(source, /Hidden things and how to find them/);
  assert.match(source, /Double-click it/);
  assert.match(source, /cat-is-home/);
  assert.match(source, /Scroll all the way to the bottom/);
  assert.match(source, /cat-play-badminton/);
  assert.match(source, /cat-play-printer/);
  assert.match(source, /cat-play-books/);
  assert.match(source, /cat-play-photo/);
  assert.match(source, /cat-play-rack/);
  assert.match(source, /Page-specific tricks/);
  assert.match(source, /usePathname/);
  assert.match(source, /nap spot found/);
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /cat-footer-visible/);
  assert.match(source, /MobileNavigationTransitions/);
  assert.match(source, /startViewTransition/);
  assert.match(source, /Choose an audio file/);
  assert.match(source, /URL\.createObjectURL/);

  const styles = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  );
  assert.match(styles, /body\.cat-footer-visible \.soundtrack-toggle/);
  assert.match(styles, /body\.cat-footer-visible \.soundtrack-panel/);
  assert.match(styles, /view-transition-name: mobile-active-tab/);
  assert.match(styles, /prefers-reduced-motion: reduce/);

  const topology = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/topology-scene.tsx", import.meta.url), "utf8"),
  );
  assert.match(topology, /from "three"/);
  assert.match(topology, /WebGLRenderer/);
  assert.match(topology, /LIVE TOPOLOGY/);
});
