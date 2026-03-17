import confetti, { type Options as ConfettiOptions } from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type Star = {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
};

const STAR_COUNT = 50;
const REVEAL_DELAY_MS = 500;
const FIREWORKS_DURATION_MS = 4000;
const FIREWORKS_INTERVAL_MS = 250;

const makeStars = (): Star[] =>
  Array.from({ length: STAR_COUNT }, (_, id) => ({
    id,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

function fireBurst(particleRatio: number, options: ConfettiOptions, count: number) {
  confetti({
    origin: { y: 0.7 },
    colors: ['#ff69b4', '#ff1493', '#da70d6', '#ee82ee', '#ffc0cb'],
    particleCount: Math.floor(count * particleRatio),
    ...options,
  });
}

export default function App() {
  const [showMessage, setShowMessage] = useState(false);
  const [stars] = useState(makeStars);
  const fireworksTimer = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);

  useEffect(() => {
    revealTimer.current = window.setTimeout(() => {
      const animationEnd = Date.now() + FIREWORKS_DURATION_MS;

      fireworksTimer.current = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          if (fireworksTimer.current) {
            window.clearInterval(fireworksTimer.current);
          }
          setShowMessage(true);
          return;
        }

        const randomInRange = (min: number, max: number) =>
          Math.random() * (max - min) + min;

        confetti({
          particleCount: 50,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2,
          },
          colors: ['#ff69b4', '#ff1493', '#ff6eb4', '#ffc0cb', '#ff85a2'],
        });

        confetti({
          particleCount: 50,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2,
          },
          colors: ['#da70d6', '#ee82ee', '#dda0dd', '#e6a8d7', '#ba55d3'],
        });
      }, FIREWORKS_INTERVAL_MS);
    }, REVEAL_DELAY_MS);

    return () => {
      if (revealTimer.current) {
        window.clearTimeout(revealTimer.current);
      }

      if (fireworksTimer.current) {
        window.clearInterval(fireworksTimer.current);
      }
    };
  }, []);

  const triggerConfetti = () => {
    const count = 200;

    fireBurst(0.25, { spread: 26, startVelocity: 55 }, count);
    fireBurst(0.2, { spread: 60 }, count);
    fireBurst(0.35, { spread: 100, decay: 0.91, scalar: 0.8 }, count);
    fireBurst(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 }, count);
    fireBurst(0.1, { spread: 120, startVelocity: 45 }, count);
  };

  return (
    <main className="page-shell">
      <div className="aurora aurora-left" />
      <div className="aurora aurora-right" />

      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      <section className="content">
        {!showMessage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="intro"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <Sparkles className="intro-icon" strokeWidth={1.8} />
            </motion.div>
            <p className="intro-copy">Preparing something special...</p>
          </motion.div>
        ) : (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={triggerConfetti}
            className="celebration"
            aria-label="Celebrate Ilze with more fireworks"
          >
            <motion.h1
              className="name"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 105, 180, 0.5)',
                  '0 0 40px rgba(255, 105, 180, 0.8)',
                  '0 0 20px rgba(255, 105, 180, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ilze
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="message-row"
            >
              <motion.span
                className="sparkle-holder"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="message-icon" strokeWidth={2} fill="currentColor" />
              </motion.span>

              <p className="message">I love you</p>

              <motion.span
                className="sparkle-holder"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Sparkles className="message-icon" strokeWidth={2} fill="currentColor" />
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="hint"
            >
              (click for more fireworks!)
            </motion.p>
          </motion.button>
        )}
      </section>
    </main>
  );
}
