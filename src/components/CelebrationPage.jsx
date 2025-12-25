import { gsap } from "gsap";
import { useEffect, useState } from "react";
import "./CelebrationPage.css";
import Confetti from "./Confetti";

// Generate heart positions outside component to avoid render issues
const generateHeartPositions = () =>
  [...Array(15)].map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
  }));

const heartPositions = generateHeartPositions();

function CelebrationPage({ onComplete, musicPlayerRef }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [activatedButtons, setActivatedButtons] = useState({
    lights: false,
    music: false,
    decorate: false,
    balloons: false,
    message: false,
  });
  const [lightsOn, setLightsOn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // QNA Slides data (TEXT UPDATED ONLY)
  const slides = [
    {
      icon: "✨",
      text: "Hey Chico… Today’s All About You 💙",
      type: "announcement",
    },
    {
      icon: "✨",
      text: "Ready for a little surprise? 👀 Trust me… this gets better ✨",
      type: "question",
      options: [
        { text: "I’m Curious 👀 Show Me 😏", value: "yes" },
        {
          text: "Huh, you thought I would give you a no option here 🤭",
          value: "no",
        },
      ],
    },
    {
      icon: "✨",
      text: "I had most fun making this part… here it comes ✨💙",
      type: "announcement",
    },
  ];

  // Handle slide progression
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      gsap.to(".slide-content", {
        opacity: 0,
        y: -30,
        duration: 0.4,
        onComplete: () => {
          setCurrentSlide(currentSlide + 1);
          gsap.fromTo(
            ".slide-content",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        },
      });
    } else {
      gsap.to(".slides-container", {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        onComplete: () => setShowButtons(true),
      });
    }
  };

  const handleAnswer = (value) => {
    if (value === "no") {
      gsap.to(".question-options", {
        x: -20,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
      });
    } else {
      handleNext();
    }
  };

  const showLightsButton = true;
  const showMusicButton = activatedButtons.lights;
  const showDecorateButton = activatedButtons.music;
  const showBalloonsButton = activatedButtons.decorate;
  const showMessageButton = activatedButtons.balloons;

  useEffect(() => {
    if (showButtons) {
      gsap.fromTo(
        ".celebration-buttons",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, [showButtons]);

  useEffect(() => {
    if (showDecorateButton) {
      const decorateBtn = document.querySelector('[data-button="decorate"]');
      if (decorateBtn) {
        gsap.fromTo(
          decorateBtn,
          { opacity: 0, x: -30, scale: 0.8 },
          { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    }
  }, [showDecorateButton]);

  useEffect(() => {
    if (showBalloonsButton) {
      const balloonsBtn = document.querySelector('[data-button="balloons"]');
      if (balloonsBtn) {
        gsap.fromTo(
          balloonsBtn,
          { opacity: 0, x: -30, scale: 0.8 },
          { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    }
  }, [showBalloonsButton]);

  useEffect(() => {
    if (showMessageButton) {
      const messageBtn = document.querySelector('[data-button="message"]');
      if (messageBtn) {
        gsap.fromTo(
          messageBtn,
          { opacity: 0, scale: 0.8, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
      }
    }
  }, [showMessageButton]);

  const handleButtonClick = (buttonType) => {
    if (activatedButtons[buttonType]) return;

    const button = document.querySelector(`[data-button="${buttonType}"]`);

    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    setActivatedButtons((prev) => ({ ...prev, [buttonType]: true }));

    if (buttonType === "lights") {
      setLightsOn(true);
      gsap.to(".celebration-page", {
        background:
          "linear-gradient(135deg, #1a0a1f 0%, #2d1b3d 50%, #1f0f29 100%)",
        duration: 1.5,
        ease: "power2.inOut",
      });
      return;
    }

    if (buttonType === "music") {
      if (musicPlayerRef && musicPlayerRef.current) {
        musicPlayerRef.current.play();
      }
    }

    setTimeout(() => {
      const decoration = document.querySelector(`.decoration-${buttonType}`);
      if (decoration) {
        if (buttonType === "decorate") {
          gsap.fromTo(
            decoration,
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
          );
        } else if (buttonType === "music") {
          gsap.fromTo(
            decoration,
            { opacity: 0 },
            { opacity: 1, duration: 1.2, ease: "power2.out" }
          );
        } else if (buttonType === "balloons") {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
          gsap.fromTo(
            decoration,
            { opacity: 0, y: 300 },
            { opacity: 1, y: 0, duration: 2, ease: "power2.out" }
          );
        } else {
          gsap.fromTo(
            decoration,
            { opacity: 0, scale: 0, rotation: -180 },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
            }
          );
        }
      }
    }, 200);

    if (buttonType === "message") {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }
  };

  return (
    <div className={`celebration-page ${lightsOn ? "lights-on" : ""}`}>
      {showConfetti && <Confetti />}

      <div className="floating-hearts-bg">
        {heartPositions.map((pos, i) => (
          <div
            key={i}
            className="heart-float"
            style={{
              left: `${pos.left}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
            }}
          >
            💙
          </div>
        ))}
      </div>

      {!showButtons && (
        <div className="slides-container">
          <div className="slide-content">
            <div className="slide-icon">{slides[currentSlide].icon}</div>
            <h2 className="slide-text">{slides[currentSlide].text}</h2>

            {slides[currentSlide].type === "question" ? (
              <div className="question-options">
                {slides[currentSlide].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${
                      option.value === "yes" ? "yes-button" : "no-button"
                    }`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <button className="next-button" onClick={handleNext}>
                {currentSlide < slides.length - 1
                  ? "Stop Adit 🤭 Show me more 👀"
                  : "FINALLYYY LESSSGOOO 💙"}
              </button>
            )}
          </div>

          <div className="slide-progress">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${
                  index === currentSlide ? "active" : ""
                } ${index < currentSlide ? "completed" : ""}`}
              />
            ))}
          </div>
        </div>
      )}

      {showButtons && (
        <>
          <div className="celebration-buttons">
            <h2 className="celebration-title">
              Let’s Celebrate 🎉
            </h2>
            <p className="celebration-subtitle">
              Let’s set the mood with some dim lights as always yk 👀🤷🏻‍♂️
            </p>

            <div className="buttons-grid">
              {showLightsButton && !activatedButtons.lights && (
                <button
                  className="action-button lights-button"
                  data-button="lights"
                  onClick={() => handleButtonClick("lights")}
                >
                  💡 Turn on the lights
                </button>
              )}

              {showMusicButton && !activatedButtons.music && (
                <button
                  className="action-button music-button"
                  data-button="music"
                  onClick={() => handleButtonClick("music")}
                >
                  🎵 Turn up the music
                </button>
              )}

              {showDecorateButton && !activatedButtons.decorate && (
                <button
                  className="action-button decorate-button"
                  data-button="decorate"
                  onClick={() => handleButtonClick("decorate")}
                >
                  🎨 Let’s make it pretty
                </button>
              )}

              {showBalloonsButton && !activatedButtons.balloons && (
                <button
                  className="action-button balloons-button"
                  data-button="balloons"
                  onClick={() => handleButtonClick("balloons")}
                >
                  🎈 Release the chaos
                </button>
              )}

              {showMessageButton && (
                <button
                  className="action-button message-button"
                  data-button="message"
                  onClick={() => handleButtonClick("message")}
                >
                  Happy Birthday Love💙… Alright, I Have Something to Say 💌
                </button>
              )}
            </div>
          </div>

          <div className="decorations-container">
            {activatedButtons.lights && (
              <div className="decoration-lights string-lights">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`light light-${i % 4}`}
                    style={{
                      left: `${5 + i * 4.5}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {activatedButtons.decorate && (
              <div className="decoration-decorate bunting">
                <div className="bunting-string">
                  {"Happy Birthday".split("").map((letter, i) => (
                    <div key={i} className={`bunting-flag flag-${i % 3}`}>
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activatedButtons.music && (
              <div className="decoration-music cake-container">
                <div className="cake">
                  <div className="cake-layer layer-3"></div>
                  <div className="cake-layer layer-2"></div>
                  <div className="cake-layer layer-1"></div>
                  <div className="cake-candles">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="candle">
                        <div className="flame"></div>
                        <div className="wick"></div>
                      </div>
                    ))}
                  </div>
                  <div className="cake-decoration flower-decoration"></div>
                </div>
              </div>
            )}

            {activatedButtons.balloons && (
              <div className="decoration-balloons">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`balloon balloon-${i % 3}`}
                    style={{
                      left: `${8 + i * 12}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${4 + (i % 3) * 0.5}s`,
                    }}
                  >
                    <div className="balloon-body"></div>
                    <div className="balloon-string"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CelebrationPage;
