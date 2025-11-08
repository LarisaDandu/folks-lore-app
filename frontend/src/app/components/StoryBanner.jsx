import React, { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/supabaseClient";
import "../styles/StoryBanner.css";
import { useNavigate } from "react-router-dom";

export default function StoryBanner({ id }) {
  const [story, setStory] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("Folklore Stories")
        .select("name, picture")
        .eq("id", id)
        .maybeSingle();

      if (error) console.error(error);
      else setStory(data);
    })();
  }, [id]);

  if (!story) return null;

 return (
    <div
      className="story-banner"
      onClick={() => navigate(`/story/${id}`)}   // ⬅️ navigate to story page
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/story/${id}`)} // accessibility
    >
      <h2 className="story-banner-title">{story.name}</h2>
      {story.picture && (
        <img
          src={story.picture}
          alt={story.name}
          className="story-banner-image"
        />
      )}
    </div>
  );
}
