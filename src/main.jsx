import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Home from "./pages/Home.jsx";
import FormelEscapeRoom from "./pages/formel-escape-room/FormelEscapeRoom.jsx";
import IntroPirates from "./pages/intro-pirates/IntroPirates.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formel-escape-room" element={<FormelEscapeRoom />} />
        <Route path="/intro-pirates" element={<IntroPirates />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
