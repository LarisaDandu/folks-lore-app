import React from "react";
import "../styles/app.css";
import storytellerImg from "../assets/images/storytelerr.png"; // your image file
import bgShape from "../assets/images/bg-shape.png";
import mapCard from "../assets/images/map-card.png";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (
    <>
    <div
      className="home-card"
      style={{
        backgroundImage: `url(${bgShape})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      <div className="home-content">
        <div className="home-text">
          <h2>
            Question the storyteller,<br />uncover the legend.
          </h2>
          <p className="home-progress">80% already guessed.</p>
        </div>
        <img src={storytellerImg} alt="Storyteller" className="home-image" />
      </div>
      <button
            className="home-play-btn"
            onClick={() => navigate("/daily-challenge")}
          >
            Play
          </button>
    </div>

    
    <div
      className="home-card"
      style={{
        backgroundImage: `url(${bgShape})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      <div className="home-content" 
      style={{
        backgroundImage: `url(${mapCard})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}>
        <div className="home-text">
          <h2>
            Explore the map and <br />discover stories.
          </h2>
        </div>
      </div>
      <button
            className="home-discover-btn"
            onClick={() => navigate("/map")}
          >
            Discover
          </button>
    </div>
    </>
  );
}