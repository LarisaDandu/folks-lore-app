import React, { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/supabaseClient";
import StoryBanner from "../components/StoryBanner.jsx";
import "../styles/Library.css"; 
import StoryCard from "../components/StoryCard.jsx"


export default function Library() {
      const [stories, setStories] = useState([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("Folklore Stories")
        .select("id, name, picture")
        .order("id", { ascending: true });

      if (error) console.error(error);
      else setStories(data || []);
    })();
  }, []);

  return (
    <div className="library-page">
      <h1 className="library-title">Library</h1>

      <section className="new-stories">
              <h3>New!</h3>
              <div className="stories-scroll">
                <StoryCard id={1} />
                <StoryCard id={2} />
                <StoryCard id={3} />
                <StoryCard id={4} />
              </div>
        </section>

      {/* === Story List Section === */}
      <section className="stories-list">
        <h3 className="stories-list-title">Explore stories</h3>
        <div className="stories-list-container">
          {stories.length > 0 ? (
            stories.map((story) => (
              <StoryBanner key={story.id} id={story.id} />
            ))
          ) : (
            <p className="stories-empty">No stories found.</p>
          )}
        </div>
      </section>
    </div>
  );
}