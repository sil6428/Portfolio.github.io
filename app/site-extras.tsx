"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

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
    help: ["Available commands: whoami, projects, interests, status, clear"],
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
  };

  if (!normalized) return [];
  return responses[normalized] ?? [`Command not found: ${normalized}`, "Type help to see the command list."];
}

export default function SiteExtras() {
  const [soundtrackOpen, setSoundtrackOpen] = useState(false);
  const [playlistId, setPlaylistId] = useState(DEFAULT_PLAYLIST_ID);
  const [playlistInput, setPlaylistInput] = useState("");
  const [playlistError, setPlaylistError] = useState("");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
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
    if (terminalOpen) terminalInputRef.current?.focus();
  }, [terminalOpen]);

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

    if (command.toLowerCase() === "clear") {
      setTerminalLines([]);
    } else {
      setTerminalLines((lines) => [...lines, `visitor@affan:~$ ${command}`, ...runTerminalCommand(command)]);
    }
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
              <span>affan@portfolio: ~</span>
              <button type="button" aria-label="Close terminal" onClick={() => setTerminalOpen(false)}>
                ×
              </button>
            </div>
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
