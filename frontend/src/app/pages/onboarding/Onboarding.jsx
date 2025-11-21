import { useState } from "react";
import "../../styles/Onboarding.css";

import WelcomeImg from "../../assets/onboarding/welcome.svg";
import LivingImg from "../../assets/onboarding/living_archive.svg";
import MapImg from "../../assets/onboarding/onboarding_map.svg";
import MysteryImg from "../../assets/onboarding/daily_mystery.svg";
import Logo from "../../assets/onboarding/logo_onboarding.svg";

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState([]);

  const [signup, setSignup] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [signin, setSignin] = useState({
    email: "",
    password: "",
  });

  const genres = [
    "Old", "Modern", "Horror", "Mythology", "Fairy Tale",
    "East Europe", "Africa", "America", "Asia", "Oceania"
  ];

  // FINISH
  const finishOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    window.location.href = "/";
  };

  // SKIP LOGIC
  const skip = () => {
    if (step < 4) {
      goToStep(4);
    } else {
      finishOnboarding();
    }
  };

  // Fade transition
  const goToStep = (newStep) => {
    setFade(true);
    setTimeout(() => {
      setStep(newStep);
      setFade(false);
    }, 220);
  };

  const next = () => {
    if (step === 4) {
      if (!signup.username || !signup.email || !signup.password) return;
      return goToStep(5);
    }

    if (step === 5) return finishOnboarding();

    if (step < 3) return goToStep(step + 1);

    if (step === 3) return goToStep(4);
  };

  const back = () => {
    if (step === 4) return goToStep(3);
    if (step === 6) return goToStep(4);
    if (step > 0) return goToStep(step - 1);
  };

  const toggleGenre = (g) => {
    setSelectedGenres((prev) =>
      prev.includes(g)
        ? prev.filter((x) => x !== g)
        : [...prev, g]
    );
  };

  // All steps
  const steps = [
    {
      title: "WELCOME",
      text: "Stay for a story?",
      image: WelcomeImg,
      glow: true,
      custom: null,
    },
    {
      title: "Living Archive",
      text: "Explore a digital folklore book and discuss myths with others.",
      image: LivingImg,
      custom: null,
    },
    {
      title: "World Map",
      text: "Travel an interactive map to uncover legends from every region.",
      image: MapImg,
      custom: null,
    },
    {
      title: "Daily Mystery",
      text: "Ask the Storyteller questions to guess the hidden creature.",
      image: MysteryImg,
      imageScale: "small",
      custom: null,
    },
    {
      title: "Join The Campfire",
      text: "Create an account to join discussions, save your stories, and track your scores.",
      custom: (
        <div className="signup-box">
          <input
            placeholder="username"
            maxLength={10}
            value={signup.username}
            onChange={(e) => setSignup({ ...signup, username: e.target.value })}
          />
          <input
            placeholder="email or phone"
            value={signup.email}
            onChange={(e) => setSignup({ ...signup, email: e.target.value })}
          />
          <input
            placeholder="password"
            type="password"
            value={signup.password}
            onChange={(e) => setSignup({ ...signup, password: e.target.value })}
          />

          <button
            className={`signup-button ${
              signup.username && signup.email && signup.password ? "" : "disabled"
            }`}
            disabled={!signup.username || !signup.email || !signup.password}
            onClick={next}
          >
            Sign Up
          </button>

          <p className="swap-auth">
            Already have an account?
            <span className="swap-link" onClick={() => goToStep(6)}> Sign in</span>
          </p>
        </div>
      ),
    },
    {
      title: "One last step",
      text: "Let’s get you settled in! What genres are you interested in?",
      custom: (
        <div className="genre-grid">
          {genres.map((g) => (
            <button
              key={g}
              className={`genre-btn ${selectedGenres.includes(g) ? "selected" : ""}`}
              onClick={() => toggleGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Sign in",
      text: "Please enter your details to sign in.",
      custom: (
        <div className="signup-box">
          <input
            placeholder="email or phone"
            value={signin.email}
            onChange={(e) => setSignin({ ...signin, email: e.target.value })}
          />
          <input
            placeholder="password"
            type="password"
            value={signin.password}
            onChange={(e) =>
              setSignin({ ...signin, password: e.target.value })
            }
          />

          <button
            className={`signup-button ${
              signin.email && signin.password ? "" : "disabled"
            }`}
            disabled={!signin.email || !signin.password}
            onClick={finishOnboarding}
          >
            Sign In
          </button>

          <p className="swap-auth">
            Don’t have an account?
            <span className="swap-link" onClick={() => goToStep(4)}> Sign up</span>
          </p>
        </div>
      ),
    }
  ];

  const current = steps[step];
  const dotsToShow = [0, 1, 2, 3, 4, 5];

  return (
    <div className="onboarding-wrapper">

      <div className="top-row">
        <img src={Logo} alt="Folkslore Logo" className="onboard-logo" />
        <span className="skip" onClick={skip}>SKIP</span>
      </div>

      <div className={`content fade-container ${fade ? "fade-out" : "fade-in"}`}>
        <h1 className="title">{current.title}</h1>
        <p className="text">{current.text}</p>

{current.image && (
  <div className="fire-wrapper">
    <img
      src={current.image}
      alt="step"
      className={
        step === 0 ? "onboard-image fire-first" : "onboard-image"
      }
    />

    {/* Always show initial glow immediately on step 0 */}
    {step === 0 && <div className="fire-glow-welcome always-show"></div>}

    {/* And show glow for any screen that uses glow:true */}
    {step !== 0 && current.glow && (
      <div className="fire-glow-welcome"></div>
    )}
  </div>
)}


        {current.custom}
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="bottom-row">

        {step !== 0 ? (
          <button className="back-btn" onClick={back}>Back</button>
        ) : (
          <div></div>
        )}

        {step !== 4 && step !== 6 ? (
          <button className="next-btn" onClick={next}>Next →</button>
        ) : (
          <div></div>
        )}
      </div>

      <div className="dots">
        {dotsToShow.map((i) => (
          <span key={i} className={`dot ${i === step ? "active" : ""}`}></span>
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
