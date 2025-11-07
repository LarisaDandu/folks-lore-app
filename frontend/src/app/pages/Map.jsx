import React from "react";

import { useRef, useState, useEffect } from "react";
import "../styles/map.css";

import mapImage from "../assets/icons/map.svg";
import babaYaga from "../assets/images/BabaYaga.png";

export default function Map() {
    const mapRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [start, setStart] = useState({ x: 0, y: 0 });
    const [showHint, setShowHint] = useState(true);
    const [popupVisible, setPopupVisible] = useState(false);
  
    // constants for scale and padding
    const SCALE_X = 3; // 300vw
    const SCALE_Y = 4; // 400vh
    const PADDING = 100; // pixels of soft border
  
    // helper to center the map on load
    const getCenteredOffset = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mapW = vw * SCALE_X;
      const mapH = vh * SCALE_Y;
      return {
        x: -((mapW - vw) / 2),
        y: -((mapH - vh) / 2),
      };
    };
  
    const [offset, setOffset] = useState(getCenteredOffset);
  
    // recenter if screen orientation changes
    useEffect(() => {
      const onResize = () => setOffset(getCenteredOffset());
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);
  
    // Start dragging
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      setDragging(true);
      setStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
      if (showHint) setShowHint(false);
    };
  
    // Move map (with boundaries)
    const handleTouchMove = (e) => {
        if (!dragging) return;
        const touch = e.touches[0];
        const newX = touch.clientX - start.x;
        const newY = touch.clientY - start.y;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const mapW = vw * SCALE_X;
        const mapH = vh * SCALE_Y;
        const padding = PADDING;
        const minX = -(mapW - vw) + padding;
        const maxX = -padding;
        const minY = -(mapH - vh) + padding;
        const maxY = -padding;
      
        const clampedX = Math.max(minX, Math.min(newX, maxX));
        const clampedY = Math.max(minY, Math.min(newY, maxY));
      
        setOffset({ x: clampedX, y: clampedY });
      };
      
    // Stop dragging
    const handleTouchEnd = () => setDragging(false);
  
    // Hide the "click and drag" hint
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
  
        {/* Draggable map container */}
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
              top: "28%",
              left: "63%",
            }}
          />
        </div>
  
        {/* Popup card */}
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