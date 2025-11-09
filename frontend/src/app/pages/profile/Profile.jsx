import React, { useRef, useState, useEffect } from "react";
import "../../styles/profile.css";
import { useNavigate } from "react-router-dom";

import backIcon from "../../assets/icons/backarrow.svg";
import editButton from "../../assets/icons/edit.svg";
import Forest from "../../assets/images/Forestback.png";
import Explorer from "../../assets/images/Explorer.png";

export default function Profile() {
  const navigate = useNavigate();

  const [coverSrc, setCoverSrc] = useState(
    () => localStorage.getItem("profile.coverSrc") || Forest
  );
  const [avatarSrc, setAvatarSrc] = useState(
    () => localStorage.getItem("profile.avatarSrc") || Explorer
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem("profile.username") || "Explorer"
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

  // New dropdown menu state
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  // close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsideCoverMenu = e.target.closest(".edit-menu.cover-menu");
      const clickedInsideAvatarMenu = e.target.closest(".edit-menu.avatar-menu");
      const clickedEditButton = e.target.closest(".hero-edit-btn, .avatar-wrapper");
  
      // If click is not inside any active area → close both
      if (!clickedInsideCoverMenu && !clickedInsideAvatarMenu && !clickedEditButton) {
        setShowCoverMenu(false);
        setShowAvatarMenu(false);
      }
    };
  
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // hidden inputs to open phone gallery
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
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
    if (file.size > 2.5 * 1024 * 1024) {
      alert("That image is a bit large. Try one under ~2.5MB.");
      return;
    }
    const dataUrl = await fileToDataURL(file);

    if (kind === "cover") {
      setCoverSrc(dataUrl);
      localStorage.setItem("profile.coverSrc", dataUrl);
      setShowCoverMenu(false);
    } else {
      setAvatarSrc(dataUrl);
      localStorage.setItem("profile.avatarSrc", dataUrl);
      setShowAvatarMenu(false);
    }
    e.target.value = "";
  };

  // Reset handlers
  const resetCover = () => {
    setCoverSrc(Forest);
    localStorage.removeItem("profile.coverSrc");
    setTimeout(() => {
      setShowCoverMenu(false);
      setShowAvatarMenu(false);
    }, 0);
  };
  const resetAvatar = () => {
    setAvatarSrc(Explorer);
    localStorage.removeItem("profile.avatarSrc");
    setTimeout(() => {
      setShowAvatarMenu(false);
      setShowCoverMenu(false);
    }, 0);
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
        hidden
        onChange={(e) => handlePick(e, "cover")}
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handlePick(e, "avatar")}
      />

      <div className="hero-section">
        <img src={coverSrc} alt="background" className="hero-bg" />

        {/* Back button */}
        <button className="back-btn" onClick={() => navigate("/")}>
          <img src={backIcon} alt="Back" className="icon" />
        </button>

        {/* Edit background image */}
        <div
          className="edit-wrapper"
          onClick={(e) => {
            e.stopPropagation();
            setShowAvatarMenu(false);
            setShowCoverMenu((p) => !p);
          }}
        >
          <button className="hero-edit-btn">
            <img src={editButton} alt="edit" />
          </button>

          {showCoverMenu && (
            <div className="edit-menu">
              <button onClick={() => coverInputRef.current?.click()}>
                Choose New Image
              </button>
              <button onClick={resetCover}>Reset to Default</button>
            </div>
          )}
        </div>

        {/* Avatar + edit */}
        <div className="avatar-section">
          <div
            className="avatar-wrapper"
            onClick={(e) => {
              e.stopPropagation();
              setShowCoverMenu(false);
              setShowAvatarMenu((p) => !p);
            }}
          >
            <img src={avatarSrc} alt="avatar" className="avatar-img" />
          </div>

          {showAvatarMenu && (
            <div className="edit-menu avatar-menu">
              <button onClick={() => avatarInputRef.current?.click()}>
                Choose New Avatar
              </button>
              <button onClick={resetAvatar}>Reset to Default</button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        <div className="username-row">
          {isEditingName ? (
            <div className="username-edit-container">
              <input
                autoFocus
                defaultValue={username}
                className="username-input"
                onChange={(e) => setUsername(e.target.value.slice(0, 15))}
                onKeyDown={onNameKeyDown}
                aria-label="Edit username"
                maxLength={12}
              />
              <button
                className="username-confirm-btn"
                onClick={() => {
                  localStorage.setItem("profile.username", username);
                  setIsEditingName(false);
                  document.activeElement.blur();
                }}
              >
                Confirm
              </button>
            </div>
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
