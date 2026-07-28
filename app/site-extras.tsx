"use client";

import { FormEvent, type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const PLAYLIST_STORAGE_KEY = "affan-portfolio-spotify-playlist-v2";
const DEFAULT_PLAYLIST_ID = "1whuIX2zMB3aYGf5oEdCGs";
const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function getPlaylistId(value: string) {
  const trimmed = value.trim();
  const uriMatch = trimmed.match(/^spotify:playlist:([a-zA-Z0-9]+)$/);
  if (uriMatch) return uriMatch[1];

  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    if (
      (url.hostname === "open.spotify.com" || url.hostname === "www.open.spotify.com") &&
      parts[0] === "playlist" &&
      /^[a-zA-Z0-9]+$/.test(parts[1] ?? "")
    ) {
      return parts[1];
    }
  } catch {
    return null;
  }

  return null;
}

function runTerminalCommand(command: string) {
  const normalized = command.trim().toLowerCase();

  const responses: Record<string, string[]> = {
    help: ["Available commands: whoami, projects, interests, status, eggs, cat, clear"],
    whoami: [
      "Affan Shaikh",
      "Cybersecurity student, builder, and regional badminton player.",
    ],
    projects: [
      "Archtech / SSIK Website / Network Lab / Password Manager",
      "Browse the Work page for details.",
    ],
    interests: [
      "Badminton / 3D printing / East Asian fiction / Proxmox home lab",
      "There is a whole Interests page hiding in plain sight.",
    ],
    status: ["ONLINE", "Currently turning old computers into a Proxmox server."],
    cat: ["Calling the resident cat...", "It has unfinished business with the soundtrack button."],
    eggs: ["Opening easter-eggs.md..."],
  };

  if (!normalized) return [];
  return responses[normalized] ?? [`Command not found: ${normalized}`, "Type help to see the command list."];
}

type CatMood = "sit" | "walk" | "pet" | "swat" | "nap" | "jump" | "home";

function PortfolioCat() {
  const pathname = usePathname();
  const [position, setPosition] = useState(280);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [mood, setMood] = useState<CatMood>("sit");
  const [message, setMessage] = useState("pspsps?");
  const [leapHeight, setLeapHeight] = useState(130);
  const positionRef = useRef(280);
  const homeRef = useRef(false);
  const busyRef = useRef(false);
  const messageTimerRef = useRef<number | null>(null);
  const actionTimersRef = useRef<number[]>([]);

  const later = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    actionTimersRef.current.push(timer);
  }, []);

  const showMessage = useCallback((text: string, duration = 1800) => {
    setMessage(text);
    if (messageTimerRef.current) window.clearTimeout(messageTimerRef.current);
    messageTimerRef.current = window.setTimeout(() => setMessage(""), duration);
  }, []);

  const moveTo = useCallback((target: number) => {
    const maximum = Math.max(12, window.innerWidth - 92);
    const next = Math.max(12, Math.min(maximum, target));
    setFacing(next < positionRef.current ? "left" : "right");
    positionRef.current = next;
    setMood("walk");
    setPosition(next);
  }, []);

  const swatSoundtrack = useCallback(() => {
    if (homeRef.current || busyRef.current) return;
    const soundtrack = document.querySelector<HTMLElement>(".soundtrack-toggle");
    if (!soundtrack) return;
    busyRef.current = true;

    const bounds = soundtrack.getBoundingClientRect();
    const soundtrackOnLeft = bounds.left < window.innerWidth / 2;
    moveTo(soundtrackOnLeft ? bounds.right + 5 : bounds.left - 78);
    setFacing(soundtrackOnLeft ? "left" : "right");
    showMessage("target spotted", 1500);

    later(() => {
      if (homeRef.current) return;
      setMood("swat");
      soundtrack.classList.add("cat-swatted");
      showMessage("bonk!", 1300);
    }, 1250);

    later(() => {
      soundtrack.classList.remove("cat-swatted");
      busyRef.current = false;
      if (!homeRef.current) setMood("sit");
    }, 2350);
  }, [later, moveTo, showMessage]);

  const interactWithPage = useCallback(() => {
    if (homeRef.current || busyRef.current) return false;

    const interactions = [
      { match: "/interests/badminton", selector: ".shuttle", effect: "cat-play-badminton", message: "birdie!" },
      { match: "/interests/3d-printing", selector: ".printer-head", effect: "cat-play-printer", message: "machine goes brrr" },
      { match: "/interests/reading", selector: ".book-two", effect: "cat-play-books", message: "new pillow?" },
      { match: "/interests/photography", selector: ".photo-b", effect: "cat-play-photo", message: "photobomb!" },
      { match: "/interests/home-lab", selector: ".rack-unit:nth-child(2)", effect: "cat-play-rack", message: "blinky lights" },
      { match: "/interests", selector: ".shuttle", effect: "cat-play-badminton", message: "mine!" },
      { match: "/info", selector: ".profile-facts", effect: "cat-play-info", message: "inspecting..." },
      { match: "/work/archtech", selector: ".case-facts", effect: "cat-play-case", message: "security audit" },
      { match: "/work/ssik", selector: ".case-facts", effect: "cat-play-case", message: "consulting" },
      { match: "/", selector: ".browser-frame", effect: "cat-play-work", message: "caught a bug" },
    ];
    const interaction = interactions.find((item) => item.match === pathname);
    const target = interaction
      ? document.querySelector<HTMLElement>(interaction.selector)
      : null;
    if (!interaction || !target) return false;

    const bounds = target.getBoundingClientRect();
    if (bounds.bottom < 20 || bounds.top > window.innerHeight - 20) return false;

    busyRef.current = true;
    const targetX = bounds.left + bounds.width / 2 - 41;
    const height = Math.max(85, Math.min(260, window.innerHeight - bounds.top - 62));
    setLeapHeight(height);
    moveTo(targetX);
    showMessage(interaction.message, 1650);

    later(() => {
      if (homeRef.current) return;
      setMood("jump");
      target.classList.add(interaction.effect);
    }, 1300);

    later(() => {
      target.classList.remove(interaction.effect);
      busyRef.current = false;
      if (!homeRef.current) setMood("sit");
    }, 2800);
    return true;
  }, [later, moveTo, pathname, showMessage]);

  useEffect(() => {
    const resetPosition = () => {
      const maximum = Math.max(12, window.innerWidth - 92);
      const next = Math.min(positionRef.current, maximum);
      positionRef.current = next;
      setPosition(next);
    };

    actionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    actionTimersRef.current = [];
    homeRef.current = false;
    busyRef.current = false;
    document.querySelector(".site-footer")?.classList.remove("cat-house-ready", "cat-is-home");
    const initial = Math.max(24, Math.min(window.innerWidth * 0.26, window.innerWidth - 96));
    positionRef.current = initial;
    const routeReset = window.setTimeout(() => {
      setPosition(initial);
      setFacing("right");
      setMood("sit");
      setMessage("");
    }, 0);

    window.addEventListener("resize", resetPosition);
    return () => {
      window.clearTimeout(routeReset);
      window.removeEventListener("resize", resetPosition);
    };
  }, [pathname]);

  useEffect(() => {
    const wander = window.setInterval(() => {
      if (document.hidden || homeRef.current || busyRef.current) return;

      if (Math.random() < 0.42 && interactWithPage()) return;

      if (Math.random() < 0.32) {
        swatSoundtrack();
        return;
      }

      const shouldNap = Math.random() < 0.24;
      const target = shouldNap
        ? Math.max(28, Math.min(window.innerWidth * 0.27, window.innerWidth - 130))
        : 24 + Math.random() * Math.max(40, window.innerWidth - 130);
      moveTo(target);
      showMessage(shouldNap ? "nap spot found" : Math.random() < 0.5 ? "patrol..." : "mrrp", 1400);
      later(() => {
        if (!homeRef.current) setMood(shouldNap ? "nap" : "sit");
      }, 1900);
    }, 7200);

    return () => window.clearInterval(wander);
  }, [interactWithPage, later, moveTo, showMessage, swatSoundtrack]);

  useEffect(() => {
    const callCat = () => {
      if (!interactWithPage()) swatSoundtrack();
    };
    window.addEventListener("portfolio-cat-swat", callCat);
    return () => window.removeEventListener("portfolio-cat-swat", callCat);
  }, [interactWithPage, swatSoundtrack]);

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".site-footer");
    if (!footer) return;

    const checkForHome = () => {
      const remaining =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      const reachedBottom = remaining <= 28;

      if (reachedBottom && !homeRef.current) {
        homeRef.current = true;
        footer.classList.add("cat-house-ready");
        const bounds = footer.getBoundingClientRect();
        moveTo(bounds.right - 126);
        setFacing("right");
        showMessage("home time", 1500);

        later(() => {
          if (!homeRef.current) return;
          setMood("home");
          footer.classList.remove("cat-house-ready");
          footer.classList.add("cat-is-home");
          showMessage("zzz", 1200);
        }, 1750);
      } else if (!reachedBottom && homeRef.current) {
        homeRef.current = false;
        busyRef.current = false;
        footer.classList.remove("cat-house-ready", "cat-is-home");
        setMood("sit");
        setFacing("left");
        showMessage("back on patrol", 1400);
      }
    };

    window.addEventListener("scroll", checkForHome, { passive: true });
    const initialCheck = window.setTimeout(checkForHome, 0);
    return () => {
      window.clearTimeout(initialCheck);
      window.removeEventListener("scroll", checkForHome);
      footer.classList.remove("cat-house-ready", "cat-is-home");
    };
  }, [later, moveTo, pathname, showMessage]);

  useEffect(() => {
    const actionTimers = actionTimersRef.current;
    return () => {
      if (messageTimerRef.current) window.clearTimeout(messageTimerRef.current);
      actionTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function petCat() {
    if (homeRef.current) {
      showMessage("zzz", 1000);
      return;
    }
    setMood("pet");
    showMessage("purr  +1", 1500);
    later(() => setMood("sit"), 1200);
  }

  function startPageInteraction() {
    if (!interactWithPage()) swatSoundtrack();
  }

  return (
    <button
      className={`portfolio-cat cat-${mood}`}
      type="button"
      style={{ left: position, "--cat-leap": `${leapHeight}px` } as CSSProperties}
      aria-label="Pet the roaming portfolio cat. Double-click to trigger its current page interaction."
      title="Pet me. Double-click to see what I do on this page."
      onClick={petCat}
      onDoubleClick={startPageInteraction}
    >
      <span className="cat-message" aria-live="polite">{message}</span>
      <span className={`cat-sprite cat-facing-${facing}`} aria-hidden="true">
        <i className="cat-shadow" />
        <i className="cat-tail" />
        <i className="cat-body" />
        <i className="cat-chest" />
        <i className="cat-leg cat-leg-back" />
        <i className="cat-leg cat-leg-front" />
        <i className="cat-head">
          <b className="cat-ear cat-ear-left" />
          <b className="cat-ear cat-ear-right" />
          <b className="cat-eye cat-eye-left" />
          <b className="cat-eye cat-eye-right" />
          <b className="cat-muzzle" />
          <b className="cat-nose" />
          <b className="cat-whiskers cat-whiskers-left" />
          <b className="cat-whiskers cat-whiskers-right" />
        </i>
        <i className="cat-paw" />
        <i className="cat-heart">♥</i>
      </span>
    </button>
  );
}

export default function SiteExtras() {
  const [soundtrackOpen, setSoundtrackOpen] = useState(false);
  const [playlistId, setPlaylistId] = useState(DEFAULT_PLAYLIST_ID);
  const [playlistInput, setPlaylistInput] = useState("");
  const [playlistError, setPlaylistError] = useState("");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalPage, setTerminalPage] = useState<"console" | "eggs">("console");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "AFFAN_OS v1.0",
    "A quiet corner of the portfolio.",
    "Type help to begin.",
  ]);
  const [easterMode, setEasterMode] = useState(false);
  const sequencePosition = useRef(0);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedPlaylist =
      window.localStorage.getItem(PLAYLIST_STORAGE_KEY) ?? DEFAULT_PLAYLIST_ID;
    const update = window.setTimeout(() => setPlaylistId(storedPlaylist), 0);
    return () => window.clearTimeout(update);
  }, []);

  useEffect(() => {
    if (terminalOpen && terminalPage === "console") terminalInputRef.current?.focus();
  }, [terminalOpen, terminalPage]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (event.key === "Escape") {
        setTerminalOpen(false);
        setSoundtrackOpen(false);
        return;
      }

      if (!isTyping && event.key === "`") {
        event.preventDefault();
        setTerminalOpen((current) => !current);
        return;
      }

      if (isTyping) return;

      const expectedKey = KONAMI_SEQUENCE[sequencePosition.current];
      if (event.key === expectedKey) {
        sequencePosition.current += 1;
        if (sequencePosition.current === KONAMI_SEQUENCE.length) {
          sequencePosition.current = 0;
          setEasterMode(true);
          window.setTimeout(() => setEasterMode(false), 8000);
        }
      } else {
        sequencePosition.current = event.key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("easter-mode", easterMode);
    return () => document.body.classList.remove("easter-mode");
  }, [easterMode]);

  function savePlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = getPlaylistId(playlistInput);

    if (!id) {
      setPlaylistError("Paste a valid Spotify playlist link.");
      return;
    }

    window.localStorage.setItem(PLAYLIST_STORAGE_KEY, id);
    setPlaylistId(id);
    setPlaylistInput("");
    setPlaylistError("");
  }

  function removePlaylist() {
    window.localStorage.removeItem(PLAYLIST_STORAGE_KEY);
    setPlaylistId("");
    setPlaylistInput("");
    setPlaylistError("");
  }

  function submitTerminal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = terminalInput.trim();
    if (!command) return;
    const normalized = command.toLowerCase();

    if (normalized === "clear") {
      setTerminalLines([]);
    } else {
      setTerminalLines((lines) => [...lines, `visitor@affan:~$ ${command}`, ...runTerminalCommand(command)]);
    }

    if (normalized === "eggs") setTerminalPage("eggs");
    if (normalized === "cat") window.dispatchEvent(new Event("portfolio-cat-swat"));
    setTerminalInput("");
  }

  return (
    <div className="site-extras">
      <button
        className="soundtrack-toggle"
        type="button"
        aria-expanded={soundtrackOpen}
        aria-controls="soundtrack-panel"
        onClick={() => setSoundtrackOpen((current) => !current)}
      >
        <span className="soundtrack-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        Soundtrack
      </button>

      {soundtrackOpen && (
        <aside className="soundtrack-panel" id="soundtrack-panel" aria-label="Portfolio soundtrack">
          <div className="soundtrack-heading">
            <div>
              <span>FULL PLAYLIST</span>
              <strong>Your soundtrack</strong>
            </div>
            <button type="button" aria-label="Close soundtrack" onClick={() => setSoundtrackOpen(false)}>
              ×
            </button>
          </div>

          {playlistId ? (
            <>
              <div className="spotify-link-card">
                <p>Open the full playlist in Spotify and listen through your account.</p>
                <a
                  className="spotify-open-link"
                  href={`https://open.spotify.com/playlist/${playlistId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Listen in Spotify</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="soundtrack-actions">
                <span>Saved on this device</span>
                <button type="button" onClick={removePlaylist}>
                  Change playlist
                </button>
              </div>
            </>
          ) : (
            <form className="spotify-form" onSubmit={savePlaylist}>
              <p>Paste any public Spotify playlist link. It stays saved on this device.</p>
              <label htmlFor="spotify-playlist">Spotify playlist link</label>
              <div>
                <input
                  id="spotify-playlist"
                  type="url"
                  inputMode="url"
                  placeholder="https://open.spotify.com/playlist/..."
                  value={playlistInput}
                  onChange={(event) => setPlaylistInput(event.target.value)}
                  aria-describedby={playlistError ? "spotify-error" : undefined}
                />
                <button type="submit">Add</button>
              </div>
              {playlistError && (
                <span className="spotify-error" id="spotify-error" role="alert">
                  {playlistError}
                </span>
              )}
            </form>
          )}
          <small>No embedded preview. The playlist opens directly in Spotify.</small>
        </aside>
      )}

      {terminalOpen && (
        <div className="terminal-overlay" role="presentation" onMouseDown={() => setTerminalOpen(false)}>
          <section
            className="secret-terminal"
            role="dialog"
            aria-modal="true"
            aria-label="Hidden portfolio terminal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="secret-terminal-bar">
              <span className="terminal-title">affan@portfolio: ~</span>
              <div className="terminal-tabs" role="tablist" aria-label="Hidden portfolio pages">
                <button
                  className={terminalPage === "console" ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={terminalPage === "console"}
                  onClick={() => setTerminalPage("console")}
                >
                  Console
                </button>
                <button
                  className={terminalPage === "eggs" ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={terminalPage === "eggs"}
                  onClick={() => setTerminalPage("eggs")}
                >
                  Easter eggs
                </button>
              </div>
              <button className="terminal-close" type="button" aria-label="Close terminal" onClick={() => setTerminalOpen(false)}>
                ×
              </button>
            </div>
            {terminalPage === "console" ? (
              <>
                <div className="terminal-history" aria-live="polite">
                  {terminalLines.map((line, index) => (
                    <p key={`${line}-${index}`}>{line}</p>
                  ))}
                </div>
                <form className="terminal-form" onSubmit={submitTerminal}>
                  <label htmlFor="terminal-command">visitor@affan:~$</label>
                  <input
                    id="terminal-command"
                    ref={terminalInputRef}
                    value={terminalInput}
                    onChange={(event) => setTerminalInput(event.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </form>
              </>
            ) : (
              <div className="easter-guide" role="tabpanel">
                <div className="easter-guide-heading">
                  <span>easter-eggs.md</span>
                  <h2>Hidden things and how to find them</h2>
                  <p>Everything currently tucked into the portfolio is documented here.</p>
                </div>
                <ol>
                  <li>
                    <code>01</code>
                    <div><strong>Hidden terminal</strong><p>Press the backtick key anywhere outside a text field. Press Escape to close it.</p></div>
                  </li>
                  <li>
                    <code>02</code>
                    <div><strong>Terminal commands</strong><p>Try help, whoami, projects, interests, status, cat, eggs, and clear.</p></div>
                  </li>
                  <li>
                    <code>03</code>
                    <div><strong>Smash mode</strong><p>Press ↑ ↑ ↓ ↓ ← → ← → B A. The site changes for eight seconds.</p></div>
                  </li>
                  <li>
                    <code>04</code>
                    <div><strong>The resident cat</strong><p>Click or tap the cat to pet it. Double-click it, or type cat in the console, to trigger its current page interaction.</p></div>
                  </li>
                  <li>
                    <code>05</code>
                    <div><strong>Cat house</strong><p>Scroll all the way to the bottom. The cat walks into its house in the footer and comes back out when you scroll up.</p></div>
                  </li>
                  <li>
                    <code>06</code>
                    <div><strong>Cat patrol</strong><p>Leave the page open. The cat wanders, naps, and occasionally swats the soundtrack without being asked.</p></div>
                  </li>
                  <li>
                    <code>07</code>
                    <div><strong>Page-specific tricks</strong><p>The cat chases the badminton birdie, investigates the printer and home lab, knocks books, photobombs, and inspects project details.</p></div>
                  </li>
                </ol>
              </div>
            )}
          </section>
        </div>
      )}

      <PortfolioCat />

      {easterMode && (
        <>
          <div className="easter-toast" role="status">
            SMASH MODE UNLOCKED
          </div>
          <div className="secret-shuttle" aria-hidden="true">
            <b />
            <span />
          </div>
        </>
      )}
    </div>
  );
}
