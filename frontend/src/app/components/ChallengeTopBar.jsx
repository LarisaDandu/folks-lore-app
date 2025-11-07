import { useState } from "react";
import "../styles/ChallengeTopBar.css";
import currencyIcon from "../assets/images/currency.png";
import infoButton from "../assets/images/info_button.png";
import storyteller1 from "../assets/images/storyteller_info1.png";
import storyteller2 from "../assets/images/storyteller_info2.png";
import storyteller3 from "../assets/images/storyteller_info3.png";

const ChallengeTopBar = ({ onBack }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [page, setPage] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const handleNext = () => setPage((prev) => (prev + 1) % 3);
  const handlePrev = () => setPage((prev) => (prev - 1 + 3) % 3);

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) handleNext(); // swipe left
    else if (diff < -50) handlePrev(); // swipe right
    setTouchStartX(null);
  };

  const slides = [
    {
      title: "Welcome to the Daily Challenge!",
      text: [
        "Your task is to guess the creature with the help of the Storyteller.",
        "Ask him questions to help you narrow down your options."
      ],
      img: storyteller1
    },
    {
      title: "Each dawn you start with 1000 points",
      text: [
        "Every question you ask costs 100 points, so choose your words wisely."
      ],
      img: storyteller2
    },
    {
      title: "If you hit 0, the game ends.",
      text: [
        "You can buy more points to keep going.",
        "Guess the creature before your points run out to keep your remaining points as your score!"
      ],
      img: storyteller3
    }
  ];

  return (
    <>
      {/* === Top Section === */}
      <div className="challenge-topbar-container">
        <div className="challenge-topbar-arrow" onClick={onBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5095FD"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="arrow-icon"
          >
            <line x1="20" y1="12" x2="5" y2="12" />
            <polyline points="12 5 5 12 12 19" />
          </svg>
        </div>

        <div className="challenge-topbar-row">
          <div className="currency-section">
            <img src={currencyIcon} alt="Currency" className="currency-icon" />
            <span className="currency-amount">800</span>
          </div>

          <img
            src={infoButton}
            alt="Info"
            className="info-icon"
            onClick={() => {
              setShowInfo(true);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* === Overlay Popup === */}
      {showInfo && (
        <div className="info-overlay" onClick={() => setShowInfo(false)}>
<div
  className="info-popup"
  onClick={(e) => e.stopPropagation()}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
  <button className="close-btn" onClick={() => setShowInfo(false)}>
    <span className="close-x">×</span>
  </button>

  <div
    className="fade-container"
    onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width / 2) handlePrev();
      else handleNext();
    }}
  >

              {slides.map((slide, i) => (
                <div key={i} className={`fade-slide ${page === i ? "active" : ""}`}>
                  <div className="slide-content">
                    <h2>{slide.title}</h2>
                    {slide.text.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                    <img src={slide.img} alt={`Slide ${i + 1}`} className="popup-image" />
                  </div>
                </div>
              ))}
            </div>

            <div className="popup-dots">
              {slides.map((_, i) => (
                <span key={i} className={`dot ${page === i ? "active" : ""}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChallengeTopBar;
