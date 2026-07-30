import InteractiveRoom from "./interactive-room";

export default function Home() {
  return (
    <main className="immersive-home">
      <header className="immersive-header">
        <div className="immersive-identity">
          <strong>Affan Shaikh</strong>
          <span>Cybersecurity student / Class of 2028</span>
        </div>
        <nav aria-label="Room controls">
          <a href="#room-directory">Room index</a>
          <a href="/Affan_Shaikh_Resume.pdf" target="_blank" rel="noreferrer">Resume</a>
        </nav>
      </header>

      <section className="immersive-intro" aria-labelledby="lab-title">
        <p>AFFAN_OS / INTERACTIVE PORTFOLIO</p>
        <h1 id="lab-title">Enter the lab.</h1>
        <span>
          Drag to look around. Select an object to move closer. Every detail stays inside the room.
        </span>
      </section>

      <InteractiveRoom />

      <div className="immersive-status" aria-hidden="true">
        <span><i /> ROOM ONLINE</span>
        <span>07 ACTIVE OBJECTS</span>
        <span>OSHAWA / 43.8971 N</span>
      </div>

      <footer className="immersive-footer">
        <span>Copyright 2026 Affan Shaikh. All rights reserved.</span>
        <a href="mailto:ffaanshake@gmail.com">Email</a>
        <a href="https://github.com/sil6428" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/sil6428" target="_blank" rel="noreferrer">LinkedIn</a>
      </footer>
    </main>
  );
}
