// src/app/pages/Error404.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Error404.css";
import "../styles/app.css";
import { ROUTES } from "../routes/routes";

const Error404 = () => {
  return (
    <div className="error404">
      <div className="error404__overlay">
        <div className="error404__content">
          <div className="error404__code">404</div>

          <p className="error404__text">
            Oop it looks like the fire went out, tap the magic arrow
            to go back
          </p>

          {/* Magic arrow → HOME */}
          <Link
            to={ROUTES.HOME}   // this is "/"
            className="error404__arrow-btn"
            aria-label="Go to home"
          >
            <span className="error404__arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error404;
