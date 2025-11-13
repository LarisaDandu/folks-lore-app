import React from "react";
import "../styles/app.css";
import storytellerImg from "../assets/images/storytelerr.png";
import bgShape from "../assets/images/bg-shape.png";
import mapCard from "../assets/images/map-card.png";
import { useNavigate } from "react-router-dom";
import StoryCard from "../components/StoryCard"

export default function Home() {

  const navigate = useNavigate();

  return (
    <section className="home-main">
      <h1>Hello</h1>
      <section className="home-sectiondif">
        <h3>Top stories</h3>
        <div className="stories-scroll">
          <StoryCard id={1} />
          <StoryCard id={2} />
          <StoryCard id={3} />
          <StoryCard id={4} />
        </div>
      </section>
      <section className="home-section">
        <h3>Today's challenge</h3>
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
      </section>

      <section className="home-section">
        <h3>Explore</h3>
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
      </section>
    </section>
  );
}