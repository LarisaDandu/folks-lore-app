import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/story.css";
import { supabase } from "../../../../supabase/supabaseClient.js";
import backIcon from "../assets/icons/backarrow.svg";


export default function Story() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");

  // Fetch story from Supabase when id changes
useEffect(() => {
  async function fetchStory() {
    setLoading(true);
    const numericId = Number(id); // convert URL param (string) to number
    const { data, error } = await supabase
      .from("Folklore Stories")
      .select("*")
      .eq("id", numericId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching story:", error);
      setStory(null);
    } else {
      setStory(data);
    }
    setLoading(false);
    console.log("Fetching story id:", id);
  }

  if (id) fetchStory();
}, [id]);

  if (loading) return <p className="story-page">Loading story...</p>;
  if (!story)
    return (
      <div className="story-page not-found">
        <h2>Story not found</h2>
        <button className="btn" onClick={() => navigate("/")}>
          Go back home
        </button>
      </div>
    );

  return (
    <>
    <button className="back-btn" onClick={() => navigate(-1)}>
        <img src={backIcon} alt="Back" className="back-icon" />
      </button>
    <div className="story-page">
      {/* ===== HERO / STATS CARD ===== */}
      <section id={story.id} className="stats-card">
        <div className="stats-header">
          <h1>{story.name}</h1>

          {/* Save toggle button */}
          <button
            className={`save-btn ${saved ? "is-saved" : ""}`}
            aria-pressed={saved}
            onClick={() => setSaved((v) => !v)}
            title={saved ? "Unsave" : "Save"}
          >
            {saved ? "Saved" : "Save"}
          </button>
        </div>

        <div className="stats-hero">
          <div className="stats-box">
            <h3>STATS</h3>
            <p><strong>Location:</strong> {story.location || "Unknown"}</p>
            <p><strong>Type:</strong> {story.type || "—"}</p>
            <p><strong>Power:</strong> {story.power || "—"}</p>
          </div>
          <div className="hero-wrap">
            {story.picture && (
              <img className="hero-img" src={story.picture} alt={story.name} />
            )}
          </div>
        </div>

        <div className="accent-strip" />
        <button
          className="chip"
          onClick={() => {
            const el = document.getElementById("forum");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            else navigate("#forum");
          }}
        >
          Forum
        </button>
      </section>

      {/* ===== STORY TEXT ===== */}
      <section className="story-section">
        <h2>Story</h2>
        <p>{story.story}</p>
      </section>

      {/* ===== FORUM ===== */}
      <section id="forum" className="forum-section">
        <div className="forum-top">
          <h3>Forum</h3>
          <div className="forum-controls">
            <button className="filter-btn" title="Filter">Filter</button>
            <button className="add-btn" title="Add" onClick={() => setShowPopup(true)}>+</button>
          </div>
        </div>

        <div className="forum-card">
          <div className="post">
            <div className="avatar" />
            <div className="bubble">
              <h4>@samsung_lover</h4>
              <p>SMASH!!!</p>
              <div className="post-icons">💙 💬 🔗</div>
            </div>
          </div>

          <div className="reply">
            <div className="avatar small" />
            <div className="bubble small">
              <h5>@gabspol</h5>
              <p>the what now?!</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPUP ===== */}
      {showPopup && (
        <div className="popup-overlay" role="dialog" aria-modal="true">
          <div className="popup-card">
            <button className="close-btn" onClick={() => setShowPopup(false)} aria-label="close">✕</button>
            <h3>Create Post</h3>
            <input
              type="text"
              placeholder="Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <textarea
              placeholder="body text (optional)"
              maxLength={200}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            <div className="bottom-bar">
              <button
                className="post-btn"
                onClick={() => {
                  alert(`(demo) Posted: ${postTitle || "(no title)"}`);
                  setPostTitle("");
                  setPostText("");
                  setShowPopup(false);
                }}
              >
                Post
              </button>
              <p>{postText.length}/200</p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
