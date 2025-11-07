import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";

export default function BottomNav(){
  return (
    <nav className="bottom-nav">
      <Link to={ROUTES.HOME}>Home</Link>
      <Link to={ROUTES.MAP}>Map</Link>
      <Link to={ROUTES.LIBRARY}>Library</Link>
      <Link to={ROUTES.NOTIFICATIONS}>Notifications</Link>
            <Link
        to={ROUTES.DAILY_CHALLENGE}
        className={location.pathname === ROUTES.DAILY_CHALLENGE ? "active" : ""}
      >
        Daily Challenge
      </Link>
    </nav>
  );
}
