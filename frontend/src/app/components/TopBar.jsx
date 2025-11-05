// src/app/components/TopBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/topbar.css";

/*
  NOTE:
  - Replace the placeholder SVG imports below with your own files if you have them,
    e.g. import searchSvg from "../../assets/icons/search.svg";
  - For now we use inline SVG data URL fallbacks for ease of testing.
*/

// simple inline SVG data URL placeholders (replace with file imports if available)
const SEARCH_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='11' cy='11' r='7'></circle><line x1='21' y1='21' x2='16.65' y2='16.65'></line></svg>";
const SEND_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><line x1='22' y1='2' x2='11' y2='13'></line><polygon points='22 2 15 22 11 13 2 9 22 2'></polygon></svg>";
const USER_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path><circle cx='12' cy='7' r='4'></circle></svg>";
const FLAG_US =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='12'><rect width='18' height='12' fill='%23b22234'/></svg>";
const FLAG_DK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='12'><rect width='18' height='12' fill='%23c60c30'/></svg>";

// Mock user: toggle loggedIn to preview both states.
// Replace with your real user from Supabase Auth (or context) later.
const MOCK_USER = {
  loggedIn: false,
  username: "_AL3X_",
  email: "alexthegnome@gmail.com",
  avatarUrl: null, // or a URL string
};

export default function TopBar() {
  const navigate = useNavigate();
  const [userState, setUserState] = useState(MOCK_USER); // replace with real auth
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // nested menu expansions
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // toggles
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark"); // dark, light, low-sat-dark, low-sat-light
  const [lang, setLang] = useState("en"); // 'en' or 'da'
  const [notifPrefs, setNotifPrefs] = useState({
    dailyChallenge: true,
    posts: true,
    newStories: true,
  });

  // refs to handle outside clicks
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    // apply theme class to body
    document.body.classList.remove("light-mode", "low-sat-dark", "low-sat-light");
    if (theme === "light") document.body.classList.add("light-mode");
    if (theme === "low-sat-dark") document.body.classList.add("low-sat-dark");
    if (theme === "low-sat-light") document.body.classList.add("low-sat-light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // close menu/search when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setLangOpen(false);
        setNotifOpen(false);
        setAccountOpen(false);
      }
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen, searchOpen]);

  // simple handlers (replace navigation / actions with real ones)
  function onSendSearch() {
    // just navigate to a search results page, or console.log for now
    console.log("search:", searchValue);
    // example: navigate(`/search?q=${encodeURIComponent(searchValue)}`);
  }

  function onToggleLogin() {
    // quick toggle for preview: switch between logged in/out
    setUserState((u) => ({ ...u, loggedIn: !u.loggedIn }));
    setMenuOpen(false);
  }

  function onLogout() {
    // placeholder: implement real supabase signOut later
    setUserState({ loggedIn: false, username: "", email: "", avatarUrl: null });
    setMenuOpen(false);
  }

  return (
    <div className="topbar-root" role="banner">
      <div className="topbar-clip">
        {/* Left: user icon */}
        <div
          className={`topbar-user ${menuOpen ? "menu-open" : ""}`}
          style={{ left: 16 }}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((s) => !s);
          }}
          ref={menuRef}
        >
          {userState.loggedIn && userState.avatarUrl ? (
            <img src={userState.avatarUrl} alt="avatar" className="topbar-avatar" />
          ) : (
            <img src={USER_SVG} alt="user" className="topbar-user-icon" />
          )}
        </div>

        {/* Right: search icon (expands leftwards) */}
        <div className="topbar-search-wrap" ref={searchRef}>
          <div className={`search-container ${searchOpen ? "open" : ""}`}>
            <button
              className="search-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSearchOpen((s) => !s);
                // focus input when opening
                setTimeout(() => {
                  const el = document.querySelector(".topbar-search-input");
                  if (el) el.focus();
                }, 80);
              }}
              aria-label="Open search"
            >
              <img src={SEARCH_SVG} alt="search" />
            </button>

            {/* input shown when open */}
            <div className="search-input-wrapper" onClick={(e) => e.stopPropagation()}>
              <input
                className="topbar-search-input"
                placeholder="Search folklore..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSendSearch();
                }}
              />
              <button
                className="search-send-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSendSearch();
                }}
                aria-label="Send search"
              >
                <img src={SEND_SVG} alt="send" />
              </button>
            </div>
          </div>
        </div>

        {/* Sliding menu panel (appears when menuOpen) */}
        <div className={`topbar-menu-panel ${menuOpen ? "visible" : ""}`} style={{ right: 0 }}>
          <div className="menu-inner">
            {/* Logged-out view */}
            {!userState.loggedIn && (
              <>
                <div className="menu-header">
                  <div className="menu-avatar-row">
                    <img src={USER_SVG} alt="user" className="menu-avatar" />
                  </div>
                </div>

                <div className="menu-item-row">
                  <button className="menu-btn primary" onClick={() => navigate("/signin")}>
                    Sign in
                  </button>
                  <button className="menu-btn" onClick={() => navigate("/signup")}>
                    Sign up
                  </button>
                </div>

                <div className="menu-divider" />

                <div className="menu-group">
                  <div className="menu-row with-icon" onClick={() => setLangOpen((s) => !s)}>
                    <div className="menu-row-left">
                      <img src={FLAG_US} alt="en" className="menu-icon-flag" />
                      <span>Language</span>
                    </div>
                    <div className="menu-row-right">▾</div>
                  </div>

                  {langOpen && (
                    <div className="menu-sublist">
                      <label className="menu-subitem">
                        <div className="menu-sub-left">
                          <img src={FLAG_US} alt="en" className="menu-icon-flag" />
                          <span>English</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={lang === "en"}
                          onChange={() => setLang("en")}
                        />
                      </label>
                      <label className="menu-subitem">
                        <div className="menu-sub-left">
                          <img src={FLAG_DK} alt="da" className="menu-icon-flag" />
                          <span>Danish</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={lang === "da"}
                          onChange={() => setLang("da")}
                        />
                      </label>
                    </div>
                  )}

                  <div
                    className="menu-row with-icon"
                    onClick={() => navigate("/report")}
                    role="button"
                  >
                    <div className="menu-row-left">
                      <span className="menu-icon">!</span>
                      <span>Report an issue</span>
                    </div>
                  </div>
                </div>

                <div className="menu-divider" />

                <div className="menu-group">
                  <div className="menu-row">
                    <div className="menu-row-left">
                      <span className="menu-icon">☀️</span>
                      <span>Light mode</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={theme === "light"}
                      onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                    />
                  </div>

                  <div className="menu-row">
                    <div className="menu-row-left">
                      <span className="menu-icon">🎨</span>
                      <span>Low saturation</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={theme === "low-sat-dark" || theme === "low-sat-light"}
                      onChange={() =>
                        setTheme((t) => (t.includes("low-sat") ? "dark" : "low-sat-dark"))
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {/* Logged-in view */}
            {userState.loggedIn && (
              <>
                <div className="menu-header">
                  <div className="menu-avatar-row">
                    <img
                      src={userState.avatarUrl || USER_SVG}
                      alt="avatar"
                      className="menu-avatar"
                    />
                    <div className="menu-user-info">
                      <div className="menu-username">{userState.username}</div>
                      <div className="menu-email">{userState.email}</div>
                    </div>
                  </div>
                </div>

                <div className="menu-list">
                  <button className="menu-row with-icon" onClick={() => navigate("/profile")}>
                    <div className="menu-row-left">
                      <span className="menu-icon">👤</span>
                      <span>Your profile</span>
                    </div>
                  </button>

                  <div className="menu-row with-icon" onClick={() => setNotifOpen((s) => !s)}>
                    <div className="menu-row-left">
                      <span className="menu-icon">🔔</span>
                      <span>Notification settings</span>
                    </div>
                    <div className="menu-row-right">▾</div>
                  </div>

                  {notifOpen && (
                    <div className="menu-sublist">
                      <label className="menu-subitem">
                        <span>Daily challenge</span>
                        <input
                          type="checkbox"
                          checked={notifPrefs.dailyChallenge}
                          onChange={() =>
                            setNotifPrefs((p) => ({ ...p, dailyChallenge: !p.dailyChallenge }))
                          }
                        />
                      </label>
                      <label className="menu-subitem">
                        <span>Posts</span>
                        <input
                          type="checkbox"
                          checked={notifPrefs.posts}
                          onChange={() => setNotifPrefs((p) => ({ ...p, posts: !p.posts }))}
                        />
                      </label>
                      <label className="menu-subitem">
                        <span>New stories</span>
                        <input
                          type="checkbox"
                          checked={notifPrefs.newStories}
                          onChange={() =>
                            setNotifPrefs((p) => ({ ...p, newStories: !p.newStories }))
                          }
                        />
                      </label>
                    </div>
                  )}

                  <div className="menu-row with-icon" onClick={() => setLangOpen((s) => !s)}>
                    <div className="menu-row-left">
                      <img src={FLAG_US} alt="lang" className="menu-icon-flag" />
                      <span>Language</span>
                    </div>
                    <div className="menu-row-right">▾</div>
                  </div>

                  {langOpen && (
                    <div className="menu-sublist">
                      <label className="menu-subitem">
                        <div className="menu-sub-left">
                          <img src={FLAG_US} alt="en" className="menu-icon-flag" />
                          <span>English</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={lang === "en"}
                          onChange={() => setLang("en")}
                        />
                      </label>
                      <label className="menu-subitem">
                        <div className="menu-sub-left">
                          <img src={FLAG_DK} alt="da" className="menu-icon-flag" />
                          <span>Danish</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={lang === "da"}
                          onChange={() => setLang("da")}
                        />
                      </label>
                    </div>
                  )}

                  <div className="menu-row with-icon" onClick={() => navigate("/payments")}>
                    <div className="menu-row-left">
                      <span className="menu-icon">💳</span>
                      <span>Payment methods</span>
                    </div>
                  </div>

                  <div className="menu-row with-icon" onClick={() => navigate("/activity")}>
                    <div className="menu-row-left">
                      <span className="menu-icon">📜</span>
                      <span>Your activity</span>
                    </div>
                  </div>

                  <div className="menu-row with-icon" onClick={() => navigate("/report")}>
                    <div className="menu-row-left">
                      <span className="menu-icon">!</span>
                      <span>Report an issue</span>
                    </div>
                  </div>

                  <div className="menu-divider" />

                  <div className="menu-row with-icon" onClick={() => setAccountOpen((s) => !s)}>
                    <div className="menu-row-left">
                      <span className="menu-icon">🔐</span>
                      <span>Account & security</span>
                    </div>
                    <div className="menu-row-right">▾</div>
                  </div>

                  {accountOpen && (
                    <div className="menu-sublist">
                      <button className="menu-subitem" onClick={() => navigate("/profile/password")}>
                        Change password
                      </button>
                      <button className="menu-subitem" onClick={() => navigate("/profile/email")}>
                        Change email
                      </button>
                      <button className="menu-subitem" onClick={onLogout}>
                        Log out
                      </button>
                      <button className="menu-subitem" onClick={() => navigate("/profile/delete")}>
                        Delete account
                      </button>
                    </div>
                  )}

                  <div className="menu-divider" />

                  <div className="menu-group">
                    <div className="menu-row">
                      <div className="menu-row-left">
                        <span className="menu-icon">☀️</span>
                        <span>Light mode</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={theme === "light"}
                        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                      />
                    </div>

                    <div className="menu-row">
                      <div className="menu-row-left">
                        <span className="menu-icon">🎨</span>
                        <span>Low saturation</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={theme === "low-sat-dark" || theme === "low-sat-light"}
                        onChange={() =>
                          setTheme((t) => (t.includes("low-sat") ? "dark" : "low-sat-dark"))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="menu-footer">
                  <button className="menu-btn" onClick={() => setUserState({ loggedIn: false })}>
                    Switch to logged-out (dev)
                  </button>
                </div>
              </>
            )}

            {/* dev toggle for preview */}
            <div style={{ padding: 8 }}>
              <button className="menu-btn" onClick={() => onToggleLogin()}>
                Toggle logged in (dev)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

console.log("TopBar rendered");