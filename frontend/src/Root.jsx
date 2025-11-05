import React from "react";
import AppRouter from "./app/routes/AppRouter";
import { BrowserRouter as Router} from "react-router-dom";

export default function Root() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

console.log("Root loaded");