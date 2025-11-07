import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/story.css";
import goblinbg from "../assets/images/goblinbg.jpg"; // ensure this exists

// Example stories with IDs used in the URL (/story/story-001, /story/story-002)
const EXAMPLE_STORIES = [
  {
    id: "story-001",
    title: "Dokkaebi",
    image: goblinbg,
    content: `Long ago, in a quiet mountain village surrounded by mist and pine trees, there lived a humble farmer named Minho. He was known for his honesty and hard work, though his life was filled with poverty. Every morning, he would go deep into the forest to gather firewood, humming to himself to ward off the loneliness of the woods.

One evening, as the sun dipped below the mountains, Minho stumbled upon a strange, moss-covered old club lying beneath a fallen tree. It looked ancient—its surface cracked, its handle carved with symbols he couldn’t understand. Thinking it might fetch a few coins, he picked it up and began to walk home.

Suddenly, the forest air grew cold. The trees shuddered without wind, and a low laughter echoed all around him. Out of the shadows stepped a Dokkaebi — a creature with a single horn, dressed in tattered robes, and eyes that glowed like embers. His grin was mischievous but not cruel.

“Ah, human,” the Dokkaebi rumbled, his voice deep as the earth. “You’ve found my club. But since you are brave enough to touch it, I shall not curse you… yet.”

Terrified, Minho bowed low. “I—I meant no harm, great spirit! I was only trying to survive.”

The Dokkaebi tilted his head, amused. “Survive, you say? Then perhaps you deserve a gift. Speak your wish, farmer.”

Minho, trembling, thought of his hungry family. “Please… I wish for food to fill our bellies.”

The Dokkaebi laughed and slammed his club to the ground. Instantly, the air shimmered—and before Minho appeared heaps of rice, fruits, and steaming bowls of soup. Overjoyed, he bowed again and carried the food home. From that night on, he used the Dokkaebi’s club to help his village—sharing food, rebuilding houses, and caring for the old and sick.

But not all were as kind-hearted as Minho. His neighbor, a greedy man named Jangsu, heard of his sudden fortune and grew envious. One night, he crept to Minho’s house and stole the magic club. He ran into the forest, laughing, and shouted, “Dokkaebi! Give me gold! Mountains of gold!”

The ground trembled, and a cloud of smoke burst forth. The same Dokkaebi appeared—but this time, his grin was wider and darker. “You dare command me so rudely?” he said. With a flick of his wrist, the club glowed and, instead of gold, poured out hot coals that chased Jangsu through the woods. He ran screaming into the night, never to be seen again.

When the Dokkaebi returned to Minho, he found the farmer praying by his fire. The spirit chuckled softly. “Your heart is good, human. Keep the club no longer—such power tempts even the purest soul.”

Minho nodded sadly and returned the club. The Dokkaebi smiled, his body flickering like a flame. “Then I grant you a different gift: good fortune earned by your own hands.” With that, he vanished into the mist, leaving behind the faint scent of pine and smoke.

From that day on, Minho’s fields flourished. His crops grew thick and golden, and his village prospered. Though the Dokkaebi was never seen again, villagers often spoke of him—sometimes with fear, sometimes with laughter—when strange things happened at night. A jug of rice wine would vanish from a table, or the sound of drumming would echo through the trees.

And so, the people learned what the old tales always warned:
Dokkaebi are neither good nor evil—they are mirrors of the human heart.
To the kind, they bring fortune.
To the greedy, they bring folly.
And to those who respect the mysteries of the forest, they bring wonder.`,
  },
  {
    id: "story-002",
    title: "Manangal",
    image: "/assets/story2.jpg",
    content: `On the coldest winter evenings, a pale creature was said to roam
the wide fields beyond the village. Nobody knew if it was friend or foe.`,
  },
];

// For quick lookup by id
const STORIES_BY_ID = EXAMPLE_STORIES.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {});

export default function Story() {
  const { id } = useParams();
  const navigate = useNavigate();

  // If you visit /story (no :id), show the first story
  const storyId = id || EXAMPLE_STORIES[0].id;
  const story = STORIES_BY_ID[storyId];

  const [showPopup, setShowPopup] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");

  // NEW: Save toggle
  const [saved, setSaved] = useState(false);

  if (!story) {
    return (
      <div className="story-page not-found">
        <h2>Story not found</h2>
        <button className="btn" onClick={() => navigate(`/story/${EXAMPLE_STORIES[0].id}`)}>
          Go to first story
        </button>
      </div>
    );
  }

  return (
    <div className="story-page">
      {/* ===== HERO / STATS CARD ===== */}
      <section id={story.id} className="stats-card">
        <div className="stats-header">
          <h1>{story.title}</h1>

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
            <p><strong>Location:</strong> Korea</p>
            <p><strong>Type:</strong> Spirit</p>
            <p><strong>Power:</strong> —</p>
          </div>
          <div className="hero-wrap">
            {story.image && (
              <img className="hero-img" src={story.image} alt={story.title} />
            )}
          </div>
        </div>

        <div className="accent-strip" />
        <button
          className="chip"
          onClick={() => {
            // smooth scroll to forum
            const el = document.getElementById("forum");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            else navigate("#forum");
          }}
        >
          Forum
        </button>
      </section>

      {/* ===== STORY TEXT ===== */}
      <section className="story-section">
        <h2>Story</h2>
        <p>{story.content}</p>
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

            <select defaultValue={story.id}>
              {EXAMPLE_STORIES.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>

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
  );
}
