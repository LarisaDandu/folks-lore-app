import React from "react";

import { useRef, useState } from "react";
import "../styles/map.css";

import mapImage from "../assets/icons/map.svg";
import babaYaga from "../assets/images/Tails.png";

export default function Map() {
  const mapRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  // Start dragging
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragging(true);
    setStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  // Move map
  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - start.x,
      y: touch.clientY - start.y,
    });
  };

  // Stop dragging
  const handleTouchEnd = () => setDragging(false);

  // Hide hint on any tap
  const handleHideHint = () => setShowHint(false);

  return (
    <div
      className="map-page"
      onClick={handleHideHint}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hint overlay */}
      {showHint && (
        <div className="map-hint">
          <p>Click and drag to interact with the map!</p>
        </div>
      )}

      {/* Map image (draggable) */}
      <div
        ref={mapRef}
        className="map-container"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <img src={mapImage} alt="World map" className="map-image" />

        {/* Example creature marker */}
        <img
          src={babaYaga}
          alt="Baba Yaga"
          className="creature-icon"
          onClick={(e) => {
            e.stopPropagation();
            setPopupVisible(true);
          }}
          style={{
            top: "35%", // adjust to your coordinates
            left: "60%",
          }}
        />
      </div>

      {/* Popup */}
      {popupVisible && (
        <div className="popup">
          <button className="close-btn" onClick={() => setPopupVisible(false)}>
            ✕
          </button>
          <h2>Eastern European Folklore</h2>
          <img src={babaYaga} alt="Baba Yaga" />
          <button className="read-more-btn">Read More</button>
        </div>
      )}
    </div>
  );
}
