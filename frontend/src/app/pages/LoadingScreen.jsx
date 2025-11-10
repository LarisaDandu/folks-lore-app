// src/pages/LoadingScreen.jsx
import React from "react";
import "../styles/LoadingScreen.css";
import loadingVideo from "../assets/images/BOMBO.mp4";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <video
        className="loading-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={loadingVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default LoadingScreen;
