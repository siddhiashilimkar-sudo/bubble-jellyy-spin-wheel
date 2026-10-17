
import { useState } from "react";
import "./App.css";

const prizes = [
  {
    id: "buy-try",
    label: "Buy and Try Again",
    emoji: "😜",
    color: "#A8E3D2",
    probability: 30,
    result: "Buy and Try Again",
  },
  {
    id: "better-luck",
    label: "Better Luck Next Time",
    emoji: "🍀",
    color: "#FFE4A7",
    probability: 25,
    result: "Better Luck Next Time",
  },
  {
    id: "spin-again",
    label: "Sorry, Spin Again",
    emoji: "🔄",
    color: "#C8B0F5",
    probability: 20,
    result: "Sorry, Spin Again",
  },
  {
    id: "follow-discount",
    label: "Follow + Get 25% OFF",
    emoji: "📲",
    color: "#F8A9C4",
    probability: 10,
    result:
      "Follow + Get 25% OFF",
  },
  {
    id: "story-discount",
    label:
      "Follow Us + Story + Get 30% OFF",
    emoji: "📸",
    color: "#FFE4A7",
    probability: 7,
    result:
      "Follow Us + Story + Get 30% OFF",
  },
  {
    id: "free-softie",
    label: "Softie FREE",
    emoji: "🍦",
    color: "#C8B0F5",
    probability: 5,
    result: "Softie FREE",
  },
  {
    id: "free-boba",
    label: "Boba Milk Tea FREE",
    emoji: "🧋",
    color: "#F8A9C4",
    probability: 3,
    result: "Boba Milk Tea FREE",
  },
];

const totalProbability = prizes.reduce(
  (total, prize) => total + prize.probability,
  0
);

// Keep the three similar outcomes apart, including
// the last and first segments of the circular wheel.
const similarPrizeIds = new Set([
  "buy-try",
  "better-luck",
  "spin-again",
]);

function shufflePrizes() {
  const shuffled = [...prizes];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}

function hasAdjacentSimilarPrizes(order) {
  return order.some((prize, index) => {
    const nextPrize = order[(index + 1) % order.length];

    return (
      similarPrizeIds.has(prize.id) &&
      similarPrizeIds.has(nextPrize.id)
    );
  });
}

function createWheelOrder() {
  let order;

  do {
    order = shufflePrizes();
  } while (hasAdjacentSimilarPrizes(order));

  return order;
}

// Select the winning prize according to its probability,
// independently of where it appears on the wheel.
function getRandomPrize() {
  const random = Math.random() * totalProbability;
  let cumulativeProbability = 0;

  for (const prize of prizes) {
    cumulativeProbability += prize.probability;

    if (random < cumulativeProbability) {
      return prize;
    }
  }

  return prizes[prizes.length - 1];
}

export default function App() {
  const [wheelOrder] = useState(() => createWheelOrder());
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const sectionAngle = 360 / wheelOrder.length;

  const wheelBackground = `conic-gradient(
    from -${sectionAngle / 2}deg,
    ${wheelOrder
      .map(
        (prize, index) =>
          `${prize.color} ${index * sectionAngle}deg ${
            (index + 1) * sectionAngle
          }deg`
      )
      .join(", ")}
  )`;

  function spinWheel() {
    if (spinning) return;

    setWinner(null);
    setSpinning(true);

    const selectedPrize = getRandomPrize();
    const winningIndex = wheelOrder.findIndex(
      (prize) => prize.id === selectedPrize.id
    );

    // The centre of segment zero initially points upward.
    const targetAngle =
      (360 - winningIndex * sectionAngle) % 360;

    const currentAngle = ((rotation % 360) + 360) % 360;
    const extraTurns = 5 * 360;

    const nextRotation =
      rotation +
      extraTurns +
      ((targetAngle - currentAngle + 360) % 360);

    setRotation(nextRotation);

    window.setTimeout(() => {
      setWinner(selectedPrize);
      setSpinning(false);
    }, 5200);
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
          <span className="eyebrow">
            A LITTLE FUN, A LITTLE MAGIC
          </span>
          <h2>Spin &amp; Win!</h2>
          <p>
            Try your luck and discover your Bubble Jellyy
            surprise.
          </p>
        </div>

        <div className="wheel-area">
          <div className="pointer" />

          <div
            className={`wheel ${spinning ? "is-spinning" : ""}`}
            style={{
              transform: `rotate(${rotation}deg)`,
              background: wheelBackground,
              "--spin-duration": "5.2s",
            }}
          >
            {wheelOrder.map((prize, index) => {
              const angle = index * sectionAngle;

              return (
                <div
                  className="wheel-label"
                  key={prize.id}
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <span
                    className="prize-emoji"
                    style={{
                      transform: `translateX(-50%) rotate(${-angle}deg)`,
                    }}
                  >
                    {prize.emoji}
                  </span>

                  <span
                    className="prize-name"
                    style={{
                      transform: `translateX(-50%) rotate(${-angle}deg)`,
                    }}
                  >
                    {prize.label}
                  </span>
                </div>
              );
            })}

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
          {spinning ? "✨ SPINNING..." : "🎡 SPIN NOW"}
        </button>

        <p className="footnote">
          {spinning
            ? "Fingers crossed! Your surprise is on its way..."
            : "One spin. Seven possibilities. Endless good vibes! 💗"}
        </p>

        <p className="friend-message">
          visit with your friend next time
        </p>

        {winner && (
          <div className="result-overlay">
            <div
              className="result-card"
              role="status"
              aria-live="polite"
            >
              <button
                className="result-close"
                onClick={() => setWinner(null)}
                aria-label="Close result"
              >
                ×
              </button>

              <div className="result-icon">{winner.emoji}</div>

              <p className="result-eyebrow">
                YOUR LUCKY MOMENT
              </p>

              <h3>{winner.label}</h3>

              <p className="result-message">
                {winner.result}
              </p>

              {winner.id === "follow-discount" && (
                <p className="claim-instructions">
                  Follow @bubble_jellyy_ on Instagram and
                  show us your follow to claim your discount.
                </p>
              )}

              {winner.id === "story-discount" && (
                <p className="claim-instructions">
                  Follow @bubble_jellyy_ and add our shop to
                  your Instagram Story. Show us your Story
                  to claim your discount.
                </p>
              )}

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
