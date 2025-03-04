import React from "react";
import "./Loading.css"; // Import file CSS cho hiệu ứng

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
