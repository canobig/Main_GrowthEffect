// material-ui
import { Box, Stack, Button, Skeleton } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'

import React, { useState } from "react";
import logo from "@/assets/images/growtheffect-logo-big-Black-300x129.png";
import logoDark from "@/assets/images/growtheffect-logo-big-White-300x129.png";
import "./login.css";

const Login = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`background ${isDarkMode ? "night-mode" : "day-mode"}`}>
      <div className="mode-toggle">
        <label className="switch">
          <input type="checkbox" onChange={toggleTheme} checked={isDarkMode} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="login-container">
        <h2>Welcome</h2>
        <div className="logo">
          <img src={isDarkMode ? logoDark : logo} alt="GrowthEffect Logo" />
        </div>
        <form>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login