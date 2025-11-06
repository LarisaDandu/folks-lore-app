import React, { useState } from "react";
import "../../styles/Profile.css";
import backIcon from "../../assets/icons/backarrow.svg"; 
import editButton from "../../assets/icons/edit.svg";
import Tails from "../../assets/images/Tails.png";
import Kitty from "../../assets/images/Kitty.jpeg";

export default function Profile() {
  const [interests, setInterests] = useState([
    "Mythology",
    "Horror",
    "Fairy Tale",
    "Old",
    "Modern",
    "Family Friendly",
    "Urban",
    "Asia",
    "Europe",
    "Africa",
    "South America",
    "North America",
    "Australia and Oceania",
  ]);

  const [selected, setSelected] = useState([]);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="profile-container">
      <div className="hero-section">
        <img
          src={Tails}
          alt="background"
          className="hero-bg"
        />
         <button className="hero-edit-btn">
          <img src={editButton} alt="Edit background" />
        </button>

        {/* Back button */}
        <button className="back-btn">
          <img src={backIcon} alt="Back" className="icon" />
        </button>

        {/* Avatar */}
        <div className="avatar-wrapper">
          <img
            src={Kitty}
            alt="avatar"
            className="avatar-img"
          />
        </div>
      </div>

      <div className="profile-info">
        <div className="username-row">
          <h1 className="username">_Al3x_</h1>
          <button className="username-edit-btn">
            <img src={editButton} alt="Edit username" />
          </button>
        </div>
        <p className="user-handle">Joined 20.10.2025</p>

        <div className="stats">
          <div className="stat">
            <span className="stat-value">26</span>
            <span className="stat-label">Creatures Guessed</span>
          </div>
          <div className="divider" />
          <div className="stat">
            <span className="stat-value">Lvl 5</span>
            <span className="stat-label">1200/2000 exp</span>
          </div>
        </div>

        <h2 className="interests-title">Interests</h2>
        <div className="interests-grid">
          {interests.map((interest, index) => (
            <button
              key={index}
              onClick={() => toggleInterest(interest)}
              className={`interest-btn ${
                selected.includes(interest) ? "selected" : ""
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

