import { useState } from "react";
import "../styles/ChallengeTopBar.css";
import currencyIcon from "../assets/images/currency.png";
import infoButton from "../assets/images/info_button.png";
import storytellerImg from "../assets/images/storyteller.png"; // for popup images

const ChallengeTopBar = ({ onBack }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [page, setPage] = useState(0);

  const handleNext = () => setPage((prev) => (prev + 1) % 3);

  return (
    <>
      {/* === Top Section === */}
      <div className="challenge-topbar-container">
        <div className="challenge-topbar-arrow" onClick={onBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-2)"
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
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            {/* === Page 1 === */}
            {page === 0 && (
              <>
                <h2>Welcome to the Daily Challenge!</h2>
                <p>Your task is to guess the creature with the help of the Storyteller.</p>
                <p>Ask him questions to help you narrow down your options.</p>
                <img src={storytellerImg} alt="Storyteller" className="popup-image" />
              </>
            )}

            {/* === Page 2 === */}
            {page === 1 && (
              <>
                <h2>Each dawn you start with 1000 points</h2>
                <p>Every question you ask costs 100 points, so choose your words wisely.</p>
                <img src={storytellerImg} alt="Storyteller" className="popup-image" />
              </>
            )}

            {/* === Page 3 === */}
            {page === 2 && (
              <>
                <h2>If you hit 0, the game ends.</h2>
                <p>You can buy more points to keep going.</p>
                <p>
                  Guess the creature before your points run out to keep your remaining points as
                  your score!
                </p>
                <img src={storytellerImg} alt="Storyteller" className="popup-image" />
              </>
            )}

            {/* Pagination Dots */}
            <div className="popup-dots">
              {[0, 1, 2].map((i) => (
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
