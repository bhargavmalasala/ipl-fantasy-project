import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <Wrapper>
      <div className="loader">

        {/* VS Icon */}
        <div className="vs">⚔️</div>

        {/* Text */}
        <div className="text">
          Loading<span>.</span><span>.</span><span>.</span>
        </div>

        {/* Bar */}
        <div className="bar">
          <div className="fill" />
        </div>

      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
  }

  /* ⚔️ Icon */
  .vs {
    font-size: 36px;
    animation: pulse 1.5s infinite ease-in-out;
    color: #f97316;
    text-shadow: 0 0 12px rgba(249, 115, 22, 0.8);
  }

  /* Text */
  .text {
    color: white;
    font-size: 16px;
    font-weight: 600;
  }

  .text span {
    animation: blink 1.4s infinite;
  }

  .text span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .text span:nth-child(3) {
    animation-delay: 0.4s;
  }

  /* Bar */
  .bar {
    width: 220px;
    height: 8px;
    background: #1e293b;
    border-radius: 999px;
    overflow: hidden;
    position: relative;
  }

  .fill {
    height: 100%;
    width: 40%;
    background: linear-gradient(90deg, #f97316, #fb923c);
    border-radius: 999px;
    animation: loading 4s ease-out infinite;
    box-shadow: 0 0 12px rgba(249, 115, 22, 0.7);
  }

  /* Animations */

  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(120%);
    }
    100% {
      transform: translateX(120%);
    }
  }

  @keyframes blink {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }
`;

export default Loader;