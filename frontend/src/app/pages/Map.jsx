import React from "react";

import { useRef, useState, useEffect } from "react";
import "../styles/map.css";

import mapImage from "../assets/images/map.png";
import europeFolklore from "../assets/images/Europefolklore.png";
import africaFolklore from "../assets/images/AfricaFolklore.png";
import asiaFolklore from "../assets/images/AsiaFolklore.png";
import americaFolklore from "../assets/images/AmericaFolklore.png";

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

export default function Map() {
    const mapRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [start, setStart] = useState({ x: 0, y: 0 });
    const [showHint, setShowHint] = useState(true);
    const [popupVisible, setPopupVisible] = useState(false);
  
    const SCALE_X = 4; 
    const SCALE_Y = 4 / 2.13;
    const PADDING = 100;
  
    // helper to center the map on load
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
  
    const [offset, setOffset] = useState(getCenteredOffset);

    useEffect(() => {
      const onResize = () => setOffset(getCenteredOffset());
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);

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
        const padding = PADDING;
      
        const minX = -(mapW - vw) + 50;
        const maxX = 50;
      
        const clampedX = Math.max(minX, Math.min(newX, maxX));
      
        setOffset((prev) => ({
          x: clampedX,
          y: prev.y,
        }));
      };
    
    const handleTouchEnd = () => setDragging(false);

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
            <p className="map-hint-text">Click and drag to interact with the map!</p>
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
  
        {popupVisible && (
            <div className="popup">
                <button className="close-btn" onClick={() => setPopupVisible(false)}>
                ✕
                </button>
                <h2>{popupVisible.name}</h2>
                <img src={popupVisible.image} alt={popupVisible.name} />
                <p>{popupVisible.description}</p>
                <button className="read-more-btn">Read More</button>
            </div>
        )}
      </div>
    );
  }