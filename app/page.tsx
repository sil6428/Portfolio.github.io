import InteractiveRoom from "./interactive-room";

export default function Home() {
  return (
    <main className="immersive-home">
      <section className="immersive-intro" aria-labelledby="lab-title">
        <p>AFFAN_OS / INTERACTIVE PORTFOLIO</p>
        <h1 id="lab-title">Explore the lab.</h1>
        <span>
          Move your pointer to shift the room. Drag to orbit gently, then select any object for a closer look.
        </span>
      </section>

      <InteractiveRoom />
    </main>
  );
}
