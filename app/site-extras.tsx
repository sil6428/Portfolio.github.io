"use client";

import { FormEvent, type ChangeEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSiteSfxEnabled, playSiteSfx, setSiteSfxEnabled } from "./site-sfx";

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
    help: ["Available commands: whoami, projects, interests, status, lights, cat, relic, signal, print, eggs, clear"],
    whoami: [
      "Affan Shaikh",
      "Cybersecurity student, builder, and regional badminton player.",
    ],
    projects: [
      "CICIDS2017 Research / File Integrity Monitor / Network Lab / Nonprofit Technology Operations",
      "Browse the Work page for details.",
    ],
    interests: [
      "Badminton / 3D printing / East Asian fiction / Proxmox home lab",
      "There is a whole Interests page hiding in plain sight.",
    ],
    status: ["ONLINE", "Currently turning old computers into a Proxmox server."],
    lights: ["Sending a colour override to the 3D room..."],
    cat: ["Sending three approved pets to the room cat..."],
    relic: ["Charging the printed katana on the bottom shelf..."],
    signal: ["Starting the hidden server beacon sequence..."],
    print: ["The miniature chess set takes exactly 03:00.", "Watch the printer display for live progress."],
    eggs: ["Opening easter-eggs.md..."],
  };

  if (!normalized) return [];
  return responses[normalized] ?? [`Command not found: ${normalized}`, "Type help to see the command list."];
}

type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => {
    finished: Promise<void>;
  };
};

function MobileNavigationTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const pendingRef = useRef<{ resolve: () => void; timeout: number } | null>(null);

  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return;

    window.requestAnimationFrame(() => {
      window.clearTimeout(pending.timeout);
      pending.resolve();
      pendingRef.current = null;
    });
  }, [pathname]);

  useEffect(() => {
    const handleNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !window.matchMedia("(max-width: 900px)").matches
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(".nav-pill a");
      if (!link || link.target || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === pathname) return;

      const transitionDocument = document as TransitionDocument;
      if (!transitionDocument.startViewTransition) return;

      event.preventDefault();
      document.documentElement.classList.add("nav-transition-running");

      const transition = transitionDocument.startViewTransition(() => {
        return new Promise<void>((resolve) => {
          const timeout = window.setTimeout(resolve, 1200);
          pendingRef.current = { resolve, timeout };
          router.push(`${destination.pathname}${destination.search}${destination.hash}`);
        });
      });

      transition.finished.finally(() => {
        document.documentElement.classList.remove("nav-transition-running");
      });
    };

    document.addEventListener("click", handleNavigation);
    return () => {
      document.removeEventListener("click", handleNavigation);
      const pending = pendingRef.current;
      if (pending) {
        window.clearTimeout(pending.timeout);
        pending.resolve();
        pendingRef.current = null;
      }
      document.documentElement.classList.remove("nav-transition-running");
    };
  }, [pathname, router]);

  return null;
}

export default function SiteExtras() {
  const [soundtrackOpen, setSoundtrackOpen] = useState(false);
  const [playlistId, setPlaylistId] = useState(DEFAULT_PLAYLIST_ID);
  const [playlistInput, setPlaylistInput] = useState("");
  const [playlistError, setPlaylistError] = useState("");
  const [localTrack, setLocalTrack] = useState<{ name: string; url: string } | null>(null);
  const [sfxEnabled, setSfxEnabledState] = useState(true);
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
  const localTrackUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const storedPlaylist =
      window.localStorage.getItem(PLAYLIST_STORAGE_KEY) ?? DEFAULT_PLAYLIST_ID;
    const update = window.setTimeout(() => {
      setPlaylistId(storedPlaylist);
      setSfxEnabledState(getSiteSfxEnabled());
    }, 0);
    return () => window.clearTimeout(update);
  }, []);

  useEffect(() => {
    if (terminalOpen && terminalPage === "console") terminalInputRef.current?.focus();
  }, [terminalOpen, terminalPage]);

  useEffect(() => {
    return () => {
      if (localTrackUrlRef.current) URL.revokeObjectURL(localTrackUrlRef.current);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (event.key === "Escape") {
        playSiteSfx("close");
        setTerminalOpen(false);
        setSoundtrackOpen(false);
        return;
      }

      if (!isTyping && event.key === "`") {
        event.preventDefault();
        if (document.querySelector(".affan-os")) {
          setTerminalOpen(false);
          playSiteSfx("open");
          window.dispatchEvent(new Event("affan-os-terminal-toggle"));
          return;
        }
        setTerminalOpen((current) => {
          playSiteSfx(current ? "close" : "open");
          return !current;
        });
        return;
      }

      if (isTyping) return;

      const expectedKey = KONAMI_SEQUENCE[sequencePosition.current];
      if (event.key === expectedKey) {
        sequencePosition.current += 1;
        if (sequencePosition.current === KONAMI_SEQUENCE.length) {
          sequencePosition.current = 0;
          playSiteSfx("secret");
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

  function selectLocalTrack(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (localTrackUrlRef.current) URL.revokeObjectURL(localTrackUrlRef.current);
    const url = URL.createObjectURL(file);
    localTrackUrlRef.current = url;
    setLocalTrack({ name: file.name, url });
    event.target.value = "";
  }

  function removeLocalTrack() {
    if (localTrackUrlRef.current) URL.revokeObjectURL(localTrackUrlRef.current);
    localTrackUrlRef.current = null;
    setLocalTrack(null);
  }

  function submitTerminal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = terminalInput.trim();
    if (!command) return;
    playSiteSfx("click");
    const normalized = command.toLowerCase();

    if (normalized === "clear") {
      setTerminalLines([]);
    } else {
      setTerminalLines((lines) => [...lines, `visitor@affan:~$ ${command}`, ...runTerminalCommand(command)]);
    }

    if (normalized === "lights") window.dispatchEvent(new Event("affan-room-palette"));
    if (normalized === "cat") window.dispatchEvent(new Event("affan-room-cat"));
    if (normalized === "relic") window.dispatchEvent(new Event("affan-room-relic"));
    if (normalized === "signal") window.dispatchEvent(new Event("affan-room-signal"));
    if (normalized === "eggs") setTerminalPage("eggs");
    setTerminalInput("");
  }

  function toggleSfx() {
    const next = !sfxEnabled;
    setSiteSfxEnabled(next);
    setSfxEnabledState(next);
    if (next) playSiteSfx("open");
  }

  return (
    <div className="site-extras">
      <MobileNavigationTransitions />
      <button
        className="soundtrack-toggle"
        type="button"
        aria-expanded={soundtrackOpen}
        aria-controls="soundtrack-panel"
        onClick={() => {
          playSiteSfx(soundtrackOpen ? "close" : "open");
          setSoundtrackOpen((current) => !current);
        }}
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
            <button
              type="button"
              aria-label="Close soundtrack"
              onClick={() => {
                playSiteSfx("close");
                setSoundtrackOpen(false);
              }}
            >
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
          <div className="sfx-settings">
            <div>
              <span>INTERFACE SFX</span>
              <p>Original procedural sounds generated in your browser. No downloaded recordings or third-party audio.</p>
            </div>
            <button type="button" aria-pressed={sfxEnabled} onClick={toggleSfx}>
              {sfxEnabled ? "ON" : "OFF"}
            </button>
          </div>
          <div className="local-audio">
            <div className="local-audio-heading">
              <span>LOCAL AUDIO</span>
              <p>Play an MP3 you own or have permission to use. It stays on your device.</p>
            </div>
            {localTrack ? (
              <div className="local-audio-player">
                <strong>{localTrack.name}</strong>
                <audio src={localTrack.url} controls autoPlay />
                <button type="button" onClick={removeLocalTrack}>Remove</button>
              </div>
            ) : (
              <label className="local-audio-picker">
                Choose an audio file
                <input type="file" accept="audio/*,.mp3" onChange={selectLocalTrack} />
              </label>
            )}
          </div>
        </aside>
      )}

      {terminalOpen && (
        <div
          className="terminal-overlay"
          role="presentation"
          onMouseDown={() => {
            playSiteSfx("close");
            setTerminalOpen(false);
          }}
        >
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
              <button
                className="terminal-close"
                type="button"
                aria-label="Close terminal"
                onClick={() => {
                  playSiteSfx("close");
                  setTerminalOpen(false);
                }}
              >
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
                    <div><strong>Integrated terminal</strong><p>Press the backtick key anywhere outside a text field. Inside AFFAN_OS it opens the operating system terminal. Elsewhere it opens this compact terminal.</p></div>
                  </li>
                  <li>
                    <code>02</code>
                    <div><strong>Terminal commands</strong><p>Try help, whoami, projects, interests, status, lights, cat, relic, signal, print, eggs, and clear.</p></div>
                  </li>
                  <li>
                    <code>03</code>
                    <div><strong>Smash mode</strong><p>Press ↑ ↑ ↓ ↓ ← → ← → B A. The site changes for eight seconds.</p></div>
                  </li>
                  <li>
                    <code>04</code>
                    <div><strong>AFFAN_OS files</strong><p>Power on the room&apos;s PC to browse categorized project, education, experience, interests, networking, contact, resume, and inspiration files.</p></div>
                  </li>
                  <li>
                    <code>05</code>
                    <div><strong>Three-minute print</strong><p>The printer starts when the room loads. Watch the board and all 32 black-and-white chess pieces build upward layer by layer until the set finishes at 03:00.</p></div>
                  </li>
                  <li>
                    <code>06</code>
                    <div><strong>Cat trust</strong><p>Find the black cat among its rug toys and pet it three times. The yarn ball reacts too. The terminal command cat also works.</p></div>
                  </li>
                  <li>
                    <code>07</code>
                    <div><strong>Printed relic</strong><p>Find the completed katana on the bottom shelf and touch it. The terminal command relic also works.</p></div>
                  </li>
                  <li>
                    <code>08</code>
                    <div><strong>Server beacon</strong><p>A small button is hidden near the top of the server rack. Press it or use the terminal command signal.</p></div>
                  </li>
                  <li>
                    <code>09</code>
                    <div><strong>Terminal room controls</strong><p>Try lights, cat, relic, signal, and print in the hidden terminal.</p></div>
                  </li>
                  <li>
                    <code>10</code>
                    <div><strong>Original sound effects</strong><p>Room interactions use procedural Web Audio tones generated at runtime. No third-party sound recordings are included.</p></div>
                  </li>
                </ol>
              </div>
            )}
          </section>
        </div>
      )}

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
