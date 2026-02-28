import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import "./assets/css/bootstrap.css";
import "./assets/css/style.css";
import "./components/global.js";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <div className="spinner-container" id="loading">
      <div className="loading-spinner"></div>
      {/* <img src={require("./assets/images/logo.png")} alt="Loading..." width={100} /> */}
    </div>
    <Routes />
  </BrowserRouter>
);
