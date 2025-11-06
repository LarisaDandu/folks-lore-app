import React, { useRef, useState } from "react";
import "../../styles/Profile.css";

import backIcon from "../../assets/icons/backarrow.svg";
import editButton from "../../assets/icons/edit.svg";
import Tails from "../../assets/images/Tails.png";
import Kitty from "../../assets/images/Kitty.jpeg";

export default function Profile() {
  // --- defaults + localStorage restore ---
  const [coverSrc, setCoverSrc] = useState(
    () => localStorage.getItem("profile.coverSrc") || Tails
  );
  const [avatarSrc, setAvatarSrc] = useState(
    () => localStorage.getItem("profile.avatarSrc") || Kitty
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem("profile.username") || "_Al3x_"
  );
  const [isEditingName, setIsEditingName] = useState(false);

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

  // hidden inputs to open phone gallery
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // helpers
  const fileToDataURL = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const handlePick = async (e, kind) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    // (optional) basic size guard so localStorage doesn't overflow too fast
    if (file.size > 2.5 * 1024 * 1024) {
      alert("That image is a bit large. Try one under ~2.5MB.");
      return;
    }
    const dataUrl = await fileToDataURL(file);

    if (kind === "cover") {
      setCoverSrc(dataUrl);
      localStorage.setItem("profile.coverSrc", dataUrl);
    } else {
      setAvatarSrc(dataUrl);
      localStorage.setItem("profile.avatarSrc", dataUrl);
    }
    e.target.value = ""; // allow re-selecting the same file later
  };

  const startEditName = () => setIsEditingName(true);
  const commitName = (value) => {
    const v = value.trim() || username;
    setUsername(v);
    localStorage.setItem("profile.username", v);
    setIsEditingName(false);
  };
  const onNameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitName(e.currentTarget.value);
    } else if (e.key === "Escape") {
      setIsEditingName(false);
    }
  };

  return (
    <div className="profile-container">
      {/* Hidden inputs for gallery */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handlePick(e, "cover")}
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        capture="user"
        hidden
        onChange={(e) => handlePick(e, "avatar")}
      />

      <div className="hero-section">
        {/* background image (default Tails, user can replace) */}
        <img src={coverSrc} alt="background" className="hero-bg" />

        {/* edit pencil in top-right of hero */}
        <button
          className="hero-edit-btn"
          onClick={() => coverInputRef.current?.click()}
          aria-label="Change background image"
          title="Change background image"
        >
          <img src={editButton} alt="" />
        </button>

        {/* Back button */}
        <button className="back-btn">
          <img src={backIcon} alt="Back" className="icon" />
        </button>

        {/* Avatar (whole circle tappable to change) */}
        <div
          className="avatar-wrapper"
          onClick={() => avatarInputRef.current?.click()}
          role="button"
          aria-label="Change avatar"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" ? avatarInputRef.current?.click() : null)}
        >
          <img src={avatarSrc} alt="avatar" className="avatar-img" />
        </div>
      </div>

      <div className="profile-info">
        <div className="username-row">
          {isEditingName ? (
            <input
              autoFocus
              defaultValue={username}
              className="username-input"
              onBlur={(e) => commitName(e.target.value)}
              onKeyDown={onNameKeyDown}
              aria-label="Edit username"
            />
          ) : (
            <>
              <h1 className="username">{username}</h1>
              <button
                className="username-edit-btn"
                onClick={startEditName}
                aria-label="Edit username"
                title="Edit username"
              >
                <img src={editButton} alt="" />
              </button>
            </>
          )}
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
              className={`interest-btn ${selected.includes(interest) ? "selected" : ""}`}
            >
              
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
