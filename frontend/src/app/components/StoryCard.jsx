import React, { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/supabaseClient.js";
import "../styles/StoryCard.css";

import bgOne from "../assets/images/bgOne.png";        // single bubble
import bgTwo from "../assets/images/bgTwo.png";

// Example SVG imports — replace with your actual paths
import menuIcon from "../assets/icons/dotsdots.svg";
import saveIcon from "../assets/icons/save.svg";
import readIcon from "../assets/icons/read.svg";

export default function FolkloreCard({ id }) {
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data, error } = await supabase
        .from("Folklore Stories")                // ← your table
        .select("name, short_description, picture")
        .eq("id", Number(id))
        .maybeSingle();

      if (!ignore) {
        if (error) console.error(error);
        setData(data);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  if (!data) return null;

  return (
    <div className={`folklore-card ${expanded ? "is-expanded" : ""}`}>
      {/* background layers for smooth fade */}
      <div className="bg bg--one" style={{ backgroundImage: `url(${bgOne})` }} />
      <div className="bg bg--two" style={{ backgroundImage: `url(${bgTwo})` }} />

      {/* corner menu */}
      <div className="menu-area">
        {!expanded ? (
          <button className="menu-btn" onClick={() => setExpanded(true)} aria-label="open menu">
            <img src={menuIcon} alt="" />
          </button>
        ) : (
          <div className="menu-expanded">
            <button className="icon-btn1" onClick={() => setExpanded(false)} aria-label="save">
              <img src={saveIcon} alt="" />
            </button>
            <button className="icon-btn2" aria-label="read">
              <img src={readIcon} alt="" />
            </button>
          </div>
        )}
      </div>

      <div className="text-content">
        <h2>{data.name}</h2>
        <p>{data.short_description}</p>
      </div>

      {data.picture && <img className="character" src={data.picture} alt={data.name} />}
    </div>
  );
}