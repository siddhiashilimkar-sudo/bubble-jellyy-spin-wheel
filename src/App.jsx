
import { useState } from "react";
import "./App.css";

const prizes = [
  { label: "FREE BOBA", result: "You won a FREE BOBA!", emoji: "🧋", color: "#F8A9C4" },
  { label: "FREE SOFTIE", result: "You won a FREE SOFTIE!", emoji: "🍦", color: "#FFE4A7" },
  { label: "30% OFF", result: "You won 30% OFF!", emoji: "🎉", color: "#C8B0F5" },
  { label: "FREE MIXER", result: "You won a FREE MIXER!", emoji: "🥤", color: "#A8E3D2" },
  { label: "25% OFF", result: "You won 25% OFF!", emoji: "💗", color: "#F8A9C4" },
  { label: "TRY AGAIN", result: "Better luck next time!", emoji: "🍀", color: "#FFE4A7" },
  { label: "SPIN AGAIN", result: "Give it another spin!", emoji: "🔄", color: "#C8B0F5" },
  { label: "BUY & TRY", result: "Buy a drink and try again!", emoji: "🛍️", color: "#A8E3D2" },
];

export default function App() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  function spinWheel() {
    if (spinning) return;

    setWinner(null);
    setSpinning(true);

    const winningIndex = Math.floor(Math.random() * prizes.length);
    const sectionAngle = 360 / prizes.length;

    // The pointer is at the top of the wheel.
    // The wheel's first section is centered at the top.
    const targetAngle =
      (360 - (winningIndex * sectionAngle + sectionAngle / 2)) % 360;

    const currentAngle = ((rotation % 360) + 360) % 360;
    const extraTurns = 5 * 360;
    const nextRotation =
      rotation +
      extraTurns +
      ((targetAngle - currentAngle + 360) % 360);

    setRotation(nextRotation);

    window.setTimeout(() => {
      setWinner(prizes[winningIndex]);
      setSpinning(false);
    }, 5100);
  }

  return (
    <main className="page">
      <header className="brand">
        <div className="brand-logo">🧋</div>
        <h1>BUBBLE JELLYY</h1>
        <p className="tagline">SIP YOUR VIBE</p>
      </header>

      <section className="game-card">
        <div className="decor decor-left">✦</div>
        <div className="decor decor-right">✧</div>

        <div className="intro">
          <span className="eyebrow">A LITTLE FUN, A LITTLE MAGIC</span>
          <h2>Spin & Win!</h2>
          <p>Try your luck and discover your Bubble Jellyy surprise.</p>
        </div>

        <div className="wheel-area">
          <div className="pointer" />

          <div
            className="wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(from -22.5deg, ${prizes
                .map(
                  (prize, index) =>
                    `${prize.color} ${index * 45}deg ${(index + 1) * 45}deg`
                )
                .join(", ")})`,
            }}
          >
            {prizes.map((prize, index) => (
              <div
                className="wheel-label"
                key={prize.label}
                style={{ transform: `rotate(${index * 45}deg)` }}
              >
                <span className="prize-emoji">{prize.emoji}</span>
                <span
                  className="prize-name"
                  style={{
                    transform: `translateX(-50%) rotate(${-index * 45}deg)`,
                  }}
                >
                  {prize.label}
                </span>
              </div>
            ))}

            <div className="wheel-center">
              <span className="center-icon">🧋</span>
              <span className="center-brand">BUBBLE</span>
              <span className="center-brand">JELLYY</span>
              <span className="center-sparkle">✦</span>
            </div>
          </div>
        </div>

        <button
          className="spin-button"
          onClick={spinWheel}
          disabled={spinning}
        >
          {spinning ? (
            <>✨ SPINNING...</>
          ) : (
            <>🎡 SPIN NOW</>
          )}
        </button>

        <p className="footnote">
          {spinning
            ? "Fingers crossed! Your surprise is on its way..."
            : "One spin. Eight possibilities. Endless good vibes! 💗"}
        </p>

        {winner && (
          <div className="result-overlay">
            <div className="result-card" role="status">
              <button
                className="result-close"
                onClick={() => setWinner(null)}
                aria-label="Close result"
              >
                ×
              </button>

              <div className="result-icon">{winner.emoji}</div>
              <p className="result-eyebrow">YOUR LUCKY MOMENT</p>
              <h3>{winner.label}</h3>
              <p className="result-message">{winner.result}</p>
              <p className="result-thanks">
                Thanks for playing with Bubble Jellyy!
              </p>

              <button
                className="awesome-button"
                onClick={() => setWinner(null)}
              >
                AWESOME! 💖
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="footer">
        <p>MADE WITH 💗 BY BUBBLE JELLYY</p>
        <span>GOOD VIBES. GREAT SIPS.</span>
      </footer>
    </main>
  );
}
