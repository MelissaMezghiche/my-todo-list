'use client';  

import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { TbBellRinging } from "react-icons/tb";

export default function ThemeToggle() {
  
  const [theme, setTheme] = useState("light");

  function toggleTheme(selectedTheme: string) {
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="Notif-L-D-mode">
      <TbBellRinging className="Icons"/>
      <FiMoon
        className={`Icons ${theme === "dark" ? "active" : ""}`}
        onClick={() => toggleTheme("dark")}
      />
      <FiSun
        className={`Icons ${theme === "light" ? "active" : ""}`}
        onClick={() => toggleTheme("light")}
      />
    </div>
  );
}
