// src/app/components/TopBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../app/styles/topbar.css"; // adjust path if needed

// import images (no SVGR)
import userSvg from "../assets/icons/user.svg";
import searchSvg from "../assets/icons/search.svg";
import sendSvg from "../assets/icons/send.svg";
import flagEn from "../assets/icons/flag-uk.svg";
import flagDa from "../assets/icons/flag-dk.svg";
import iconBell from "../assets/icons/send.svg";
import iconProfile from "../assets/icons/send.svg";
import iconReport from "../assets/icons/send.svg";
import iconCard from "../assets/icons/send.svg";
import iconActivity from "../assets/icons/send.svg";
import iconLight from "../assets/icons/send.svg";
import iconDrop from "../assets/icons/send.svg";

const INITIAL_USER = {
  loggedIn: false,
  username: "Eliza",
  email: "eliza@example.com",
  avatarUrl: null,
};

export default function TopBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(INITIAL_USER);

  // search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // menu & nested states
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // toggles
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [lowSat, setLowSat] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [notifPrefs, setNotifPrefs] = useState({
    dailyChallenge: true,
    posts: false,
    newStories: true,
  });

  // refs
  const menuPanelRef = useRef(null);
  const searchRef = useRef(null);
  const topbarUserRef = useRef(null);

  // calc menu width (to move the user icon with it)
  const [menuWidthPx, setMenuWidthPx] = useState(0);
  useEffect(() => {
    function calc() {
      const w = Math.min(900, Math.round(window.innerWidth * 0.75)); // max 900px or 75vw
      setMenuWidthPx(w);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // outside clicks: close menu or search
  useEffect(() => {
    function onDocClick(e) {
      if (menuOpen) {
        // if click outside panel close menu
        if (menuPanelRef.current && !menuPanelRef.current.contains(e.target)) {
          setMenuOpen(false);
          setLangOpen(false);
          setNotifOpen(false);
          setAccountOpen(false);
        }
      }
      if (searchOpen) {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
          setSearchOpen(false);
        }
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen, searchOpen]);

  // apply theme classes
  useEffect(() => {
    document.body.classList.remove("light-mode", "low-sat");
    if (theme === "light") document.body.classList.add("light-mode");
    if (lowSat) document.body.classList.add("low-sat");
    localStorage.setItem("theme", theme);
  }, [theme, lowSat]);

  // handlers
  const handleSendSearch = () => {
    console.log("Search for:", searchValue);
  };

  const handleToggleLoginMock = () => {
    setUser((u) => ({ ...u, loggedIn: !u.loggedIn }));
    setMenuOpen(false);
  };

  const handleLogoutMock = () => {
    setUser({ loggedIn: false, username: "", email: "", avatarUrl: null });
    setMenuOpen(false);
  };

  // menu panel transform for user icon
  const userTranslate = menuOpen ? `translateX(${menuWidthPx - 72}px)` : "translateX(0)"; 
  // 72 is approximate offset so icon moves roughly with panel; tweak if needed

  return (
    <>
      <header className="folk-topbar" >
        <div className="folk-topbar-inner">
          {/* left user icon (slightly larger) */}
          <div
            className="folk-user-wrap"
            ref={topbarUserRef}
            onClick={(e) => { e.stopPropagation(); setMenuOpen((s) => !s); }}
            style={{ transform: userTranslate }}
          >
            <img
              src={user.loggedIn && user.avatarUrl ? user.avatarUrl : userSvg}
              alt="user"
              className="folk-user-icon"
            />
          </div>

          {/* right search icon / expanding input */}
          <div className="folk-search-wrap" ref={searchRef}>
            {!searchOpen ? (
              <button
                className="folk-search-btn"
                onClick={(e) => { e.stopPropagation(); setSearchOpen(true); setTimeout(()=>{ const el = document.querySelector(".folk-search-input"); if(el) el.focus(); }, 70); }}
                aria-label="Open search"
              >
                <img src={searchSvg} alt="search" />
              </button>
            ) : (
              <div className="folk-search-bar" role="search">
                <img src={searchSvg} alt="search" className="folk-search-left-icon" />
                <input
                  className="folk-search-input"
                  placeholder="Search folklore..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendSearch()}
                />
                <button className="folk-search-send" onClick={handleSendSearch} aria-label="Send search">
                  <img src={sendSvg} alt="send" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* sliding menu: covers ~75% from right, but not whole screen; overlay clickable to close */}
      <div className={`folk-menu-overlay ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div
          className="folk-menu-panel"
          ref={menuPanelRef}
          style={{ width: `${menuWidthPx}px` }}
        >
          {/* header area */}
          <div className="menu-head">
            {!user.loggedIn ? (
              <>
                <div className="menu-auth-buttons">
                  <button className="btn-signin" onClick={() => navigate("/signin")}>Sign in</button>
                  <button className="btn-signup" onClick={() => navigate("/signup")}>Sign up</button>
                </div>
              </>
            ) : (
              <div className="menu-user-info">
                <div className="menu-user-meta">
                  <div className="menu-username">{user.username}</div>
                  <div className="menu-email">{user.email}</div>
                </div>
              </div>
            )}
          </div>

          <div className="menu-body">
            {/* Logged-out or logged-in common items */}
            {!user.loggedIn ? (
              <>
                {/* Language selector */}
                <div className="menu-row" onClick={() => setLangOpen(s => !s)}>
                  <div className="menu-row-left">
                    <img src={flagEn} alt="lang" className="menu-icon" />
                    <span>Language</span>
                  </div>
                  <div className="menu-row-right">{langOpen ? "▴" : "▾"}</div>
                </div>
                {langOpen && (
                  <div className="menu-sublist">
                    <label className="menu-subitem">
                      <div className="menu-sub-left">
                        <img src={flagEn} alt="en" className="flag" />
                        <span>English</span>
                      </div>
                      <div className="menu-sub-right">
                        <input type="checkbox" checked={lang === "en"} readOnly onClick={() => setLang("en")} />
                      </div>
                    </label>
                    <label className="menu-subitem">
                      <div className="menu-sub-left">
                        <img src={flagDa} alt="da" className="flag" />
                        <span>Danish</span>
                      </div>
                      <div className="menu-sub-right">
                        <input type="checkbox" checked={lang === "da"} readOnly onClick={() => setLang("da")} />
                      </div>
                    </label>
                  </div>
                )}

                <div className="menu-row" onClick={() => { navigate("/report"); }}>
                  <div className="menu-row-left">
                    <img src={iconReport} alt="report" className="menu-icon" />
                    <span>Report an issue</span>
                  </div>
                </div>

                <hr className="menu-divider" />

                <div className="menu-section-title">Customization</div>
                <div className="menu-row toggle-row">
                  <div className="menu-row-left">
                    <img src={iconLight} alt="light" className="menu-icon" />
                    <span>Light mode</span>
                  </div>
                  <div className="menu-row-right">
                    <label className="switch">
                      <input type="checkbox" checked={theme === "light"} onChange={() => setTheme(t => t === "light" ? "dark" : "light")} />
                      <span className="slider" />
                    </label>
                  </div>
                </div>

                <div className="menu-row toggle-row">
                  <div className="menu-row-left">
                    <img src={iconDrop} alt="low" className="menu-icon" />
                    <span>Low saturation</span>
                  </div>
                  <div className="menu-row-right">
                    <label className="switch">
                      <input type="checkbox" checked={lowSat} onChange={() => setLowSat(s => !s)} />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* LOGGED-IN */}
                <div className="menu-row" onClick={() => navigate("/profile")}>
                  <div className="menu-row-left">
                    <img src={iconProfile} alt="profile" className="menu-icon" />
                    <span>Your profile</span>
                  </div>
                </div>

                <div className="menu-row" onClick={() => setNotifOpen(s => !s)}>
                  <div className="menu-row-left">
                    <img src={iconBell} alt="notif" className="menu-icon" />
                    <span>Notification settings</span>
                  </div>
                  <div className="menu-row-right">{notifOpen ? "▴" : "▾"}</div>
                </div>
                {notifOpen && (
                  <div className="menu-sublist">
                    <label className="menu-subitem">
                      <span>Daily challenge</span>
                      <input type="checkbox" checked={notifPrefs.dailyChallenge} onChange={() => setNotifPrefs(p => ({ ...p, dailyChallenge: !p.dailyChallenge }))} />
                    </label>
                    <label className="menu-subitem">
                      <span>Posts</span>
                      <input type="checkbox" checked={notifPrefs.posts} onChange={() => setNotifPrefs(p => ({ ...p, posts: !p.posts }))} />
                    </label>
                    <label className="menu-subitem">
                      <span>New stories</span>
                      <input type="checkbox" checked={notifPrefs.newStories} onChange={() => setNotifPrefs(p => ({ ...p, newStories: !p.newStories }))} />
                    </label>
                  </div>
                )}

                {/* Language */}
                <div className="menu-row" onClick={() => setLangOpen(s => !s)}>
                  <div className="menu-row-left">
                    <img src={flagEn} alt="lang" className="menu-icon" />
                    <span>Language</span>
                  </div>
                  <div className="menu-row-right">{langOpen ? "▴" : "▾"}</div>
                </div>
                {langOpen && (
                  <div className="menu-sublist">
                    <label className="menu-subitem">
                      <div className="menu-sub-left"><img src={flagEn} className="flag" />English</div>
                      <input type="checkbox" checked={lang === "en"} readOnly onClick={() => setLang("en")} />
                    </label>
                    <label className="menu-subitem">
                      <div className="menu-sub-left"><img src={flagDa} className="flag" />Danish</div>
                      <input type="checkbox" checked={lang === "da"} readOnly onClick={() => setLang("da")} />
                    </label>
                  </div>
                )}

                                <div className="menu-row" onClick={() => setAccountOpen(s => !s)}>
                  <div className="menu-row-left">
                    <span className="menu-icon">🔐</span>
                    <span>Account & security</span>
                  </div>
                  <div className="menu-row-right">{accountOpen ? "▴" : "▾"}</div>
                </div>

                {accountOpen && (
                  <div className="menu-sublist">
                    <button className="menu-subitem" onClick={() => navigate("/profile/password")}>Change password</button>
                    <button className="menu-subitem" onClick={() => navigate("/profile/email")}>Change email</button>
                    <button className="menu-subitem" onClick={handleLogoutMock}>Log out</button>
                    <button className="menu-subitem" onClick={() => navigate("/profile/delete")}>Delete account</button>
                  </div>
                )}

                <div className="menu-row" onClick={() => navigate("/payments")}>
                  <div className="menu-row-left">
                    <img src={iconCard} className="menu-icon" />
                    <span>Payment methods</span>
                  </div>
                </div>

                <div className="menu-row" onClick={() => navigate("/activity")}>
                  <div className="menu-row-left">
                    <img src={iconActivity} className="menu-icon" />
                    <span>Your activity</span>
                  </div>
                </div>

                <div className="menu-row" onClick={() => navigate("/report")}>
                  <div className="menu-row-left">
                    <img src={iconReport} className="menu-icon" />
                    <span>Report an issue</span>
                  </div>
                </div>

                <hr className="menu-divider" /> 

                {/* Customization (same toggles) */}
                <div className="menu-section-title">Customization</div>
                <div className="menu-row toggle-row">
                  <div className="menu-row-left">
                    <img src={iconLight} className="menu-icon" />
                    <span>Light mode</span>
                  </div>
                  <div className="menu-row-right">
                    <label className="switch"><input type="checkbox" checked={theme === "light"} onChange={() => setTheme(t => t === "light" ? "dark" : "light")} /><span className="slider" /></label>
                  </div>
                </div>
                <div className="menu-row toggle-row">
                  <div className="menu-row-left"><img src={iconDrop} className="menu-icon" /><span>Low saturation</span></div>
                  <div className="menu-row-right"><label className="switch"><input type="checkbox" checked={lowSat} onChange={() => setLowSat(s => !s)} /><span className="slider" /></label></div>
                </div>
              </>
            )}
          </div>

          {/* small dev-footer */}
          <div className="menu-footer">
            <button className="dev-toggle" onClick={handleToggleLoginMock}>Toggle logged in (dev)</button>
            <div style={{ height: 20 }} />
          </div>
        </div>
      </div>
    </>
  );
}
