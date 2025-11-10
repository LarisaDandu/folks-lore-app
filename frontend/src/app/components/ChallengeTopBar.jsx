import React, { useState } from "react";
import "../styles/ChallengeTopBar.css";
import currencyIcon from "../assets/icons/currency.svg";
import infoButton from "../assets/images/info_button.png";
import storytellerImg from "../assets/images/storyteller.png";
import backIcon from "../assets/icons/backarrow.svg";

const ChallengeTopBar = ({ onBack, currency, onCurrencyClick, currencyGlow }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [page, setPage] = useState(0);
  const handleNext = () => setPage((prev) => (prev + 1) % 3);

  return (
    <>
      <div className="challenge-topbar-container">
        <div className="challenge-topbar-arrow" onClick={onBack}>
          <img src={backIcon} alt="Back" className="arrow-icon" />
        </div>

        <div className="challenge-topbar-row">
          <div className={`currency-section ${currencyGlow ? "currency-glow" : ""}`} onClick={onCurrencyClick}>
            <img src={currencyIcon} alt="Currency" className="currency-icon" />
            <span className="currency-amount">{currency}</span>
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

      {showInfo && (
        <div className="info-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-popup" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
            {page === 0 && (
              <>
                <h2>Welcome to the Daily Challenge!</h2>
                <p>Your task is to guess the creature with the help of the Storyteller.</p>
                <p>Ask him questions to help you narrow down your options.</p>
                <img src={storytellerImg} alt="Storyteller" className="popup-image" />
              </>
            )}
            {page === 1 && (
              <>
                <h2>Each dawn you start with 1000 points</h2>
                <p>Every question you ask costs 100 points, so choose your words wisely.</p>
                <img src={storytellerImg} alt="Storyteller" className="popup-image" />
              </>
            )}
            {page === 2 && (
              <>
                <h2>If you hit 0, the game ends.</h2>
                <p>You can buy more points to keep going.</p>
                <p>Guess the creature before your points run out to keep your remaining points as your score!</p>
                <img src={storytellerImg} alt="Storyteller" className="popup-image" />
              </>
            )}
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
