import "../styles/BottomNav.css";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import homeIcon from "../assets/icons/home.svg";
import libraryIcon from "../assets/icons/library.svg";
import mapIcon from "../assets/icons/map.svg";
import notificationIcon from "../assets/icons/notification.svg";

export default function BottomNav() {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const navItems = [
    { path: "/", icon: homeIcon, name: "Home" },
    { path: "/library", icon: libraryIcon, name: "Library" },
    { path: "/map", icon: mapIcon, name: "Map" },
    { path: "/notifications", icon: notificationIcon, name: "Notifications" },
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-inner">
        {navItems.map((item) => {
          const isActive = active === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActive(item.path)}
            >
              {isActive ? (
                <motion.div
                  layoutId="activeBubble"
                  className="active-bubble"
                  transition={{
                    type: "spring",
                    stiffness: 280, // smoother, less bouncy
                    damping: 32,
                    mass: 0.6,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Instantly switch icon — no grow animation */}
                  <img src={item.icon} alt={item.name} className="nav-icon" />
                </motion.div>
              ) : (
                <motion.img
                  src={item.icon}
                  alt={item.name}
                  className="nav-icon"
                  initial={false}
                  animate={{ opacity: 0.7 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.1,
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
