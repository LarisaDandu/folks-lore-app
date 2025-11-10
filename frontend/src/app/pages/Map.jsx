import React, { useRef, useState, useEffect } from "react";
import "../styles/Map.css";
import { useNavigate } from "react-router-dom";

// --- Imported assets ---
import mapImage from "../assets/images/map.png";
import europeFolklore from "../assets/images/EuropeFolklore.png";
import africaFolklore from "../assets/images/AfricaFolklore.png";
import asiaFolklore from "../assets/images/AsiaFolklore.png";
import americaFolklore from "../assets/images/AmericaFolklore.png";
import closeIcon from "../assets/icons/x.svg";
import backIcon from "../assets/icons/backarrow.svg";

// --- Data: Folklore regions and map markers ---
const creatures = [
  {
    id: 1,
    name: "Eastern European Folklore",
    image: europeFolklore,
    position: { top: "18%", left: "56%" },
  },
  {
    id: 2,
    name: "African Folklore",
    image: africaFolklore,
    position: { top: "52%", left: "52%" },
  },
  {
    id: 3,
    name: "Asian Folklore",
    image: asiaFolklore,
    position: { top: "34%", left: "70%" },
  },
  {
    id: 4,
    name: "American Folklore",
    image: americaFolklore,
    position: { top: "28%", left: "20%" },
  },
];

// --- Main Component ---
export default function Map() {
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // --- Interactive state ---
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  // --- Map scale and movement boundaries ---
  const SCALE_X = 4;
  const SCALE_Y = 4 / 2.13;
  const PADDING = 100;

  // --- Helper: Calculate initial centered map offset ---
  const getCenteredOffset = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mapW = vw * SCALE_X;
    const mapH = vh * SCALE_Y;

    return {
      x: -((mapW - vw) / 2),
      y: -((mapH - vh) / 2) + 400,
    };
  };

  // --- Set map offset when screen resizes (responsive design) ---
  useEffect(() => {
    setOffset(getCenteredOffset());
    const onResize = () => setOffset(getCenteredOffset());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // --- Touch / drag logic for mobile map movement ---
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragging(true);
    setStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    if (showHint) setShowHint(false);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];

    const newX = touch.clientX - start.x;
    const vw = window.innerWidth;
    const mapW = vw * SCALE_X;

    // --- Define horizontal drag boundaries ---
    const minX = -(mapW - vw) + 50;
    const maxX = 50;

    const clampedX = Math.max(minX, Math.min(newX, maxX));

    // --- Update map position ---
    setOffset((prev) => ({
      x: clampedX,
      y: prev.y,
    }));
  };

  const handleTouchEnd = () => setDragging(false);

  // --- Hide tutorial hint when interacting ---
  const handleHideHint = () => setShowHint(false);

  return (
    <div
      className="map-page"
      onClick={handleHideHint}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* --- Back navigation button --- */}
      <button className="back-btn" onClick={() => navigate("/")}>
        <img src={backIcon} alt="Back" className="back-icon" />
      </button>

      {/* --- Hint overlay (shown on first load) --- */}
      {showHint && (
        <div className="map-hint">
          <p className="map-hint-text">Click and drag to interact with the map!</p>
        </div>
      )}

      {/* --- Map container (draggable) --- */}
      <div
        ref={mapRef}
        className="map-container"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <img src={mapImage} alt="World map" className="map-image" />

        {/* --- Folklore markers placed on the map --- */}
        {creatures.map((creature) => (
          <img
            key={creature.id}
            src={creature.image}
            alt={creature.name}
            className="creature-icon"
            style={creature.position}
            onClick={(e) => {
              e.stopPropagation();
              setPopupVisible(creature);
            }}
          />
        ))}
      </div>

      {/* --- Popup modal (appears when a region is selected) --- */}
      {popupVisible && (
        <div className="popup-layer">
          <div className="popup-outer">
            <div className="popup-card">
              {/* Close popup */}
              <button
                className="close-btn"
                onClick={() => setPopupVisible(false)}
              >
                <img src={closeIcon} alt="Close" className="close-icon" />
              </button>

              {/* Region info */}
              <h2 className="popup-title">{popupVisible.name}</h2>
              <img
                src={popupVisible.image}
                alt={popupVisible.name}
                className="popup-creature"
              />
            </div>
          </div>

          {/* Read more button placeholder (future link to story) */}
          <div className="read-more-wrap">
            <button className="read-more-btn">Read More</button>
          </div>
        </div>
      )}
    </div>
  );
}
