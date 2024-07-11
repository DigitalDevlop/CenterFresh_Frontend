import React from "react";
import LoadingSVG from "../assets/loading.svg";
import LoadingSVGDark from "../assets/loading.svg";

function LoadingFullscreen({
  loading,
  message = "Loading...",
  fulscreen = true,
  dark = false,
  height = 200,
  textSize = "2em"
}) {
  return (
    <div
    style={{zIndex: 500}}
      className={`${fulscreen ? "fullscreen-overlay" : ""} ${
        loading ? "visible" : ""
      }`}
    >
      <div
        className="loading-cont animate__animated animate__flipInY"
        style={{ textAlign: "center" }}
      >
        <img src={dark ? LoadingSVGDark : LoadingSVG} height={height}></img>
        <p
          style={{
            fontSize: textSize,
            textAlign: "center",
            color: dark ? "black" : "white",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default LoadingFullscreen;
