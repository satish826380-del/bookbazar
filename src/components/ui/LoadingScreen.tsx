import { useEffect, useState } from 'react';

export const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a]">
            <style>
                {`
          .loader {
            width: 60px;
            height: 50px;
            position: relative;
          }

          .loader-book {
            width: 100%;
            height: 100%;
            border: 3px solid #fef3c7;
            border-radius: 4px;
            position: relative;
            background: transparent;
          }

          .loader-page {
            width: 50%;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            background: #fef3c7;
            border-left: 2px solid #0f172a;
            transform-origin: left center;
            animation: page-flip 1.5s infinite ease-in-out;
            border-radius: 0 2px 2px 0;
          }

          @keyframes page-flip {
            0% {
              transform: rotateY(0deg);
              background: #fef3c7;
            }
            50% {
              transform: rotateY(-180deg);
              background: #d97706; /* shade effect */
            }
            100% {
              transform: rotateY(-180deg);
              background: #fef3c7;
            }
          }

          .loader-center {
            position: absolute;
            left: 50%;
            top: 0;
            width: 2px;
            height: 100%;
            background: #fef3c7;
            transform: translateX(-50%);
          }

          .loader-text {
            margin-top: 24px;
            color: #fef3c7;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            letter-spacing: 0.1em;
            opacity: 0.8;
            animation: pulse-text 2s infinite ease-in-out;
          }

          @keyframes pulse-text {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}
            </style>

            <div className="loader">
                <div className="loader-book">
                    <div className="loader-center"></div>
                    <div className="loader-page"></div>
                </div>
            </div>

            <p className="loader-text">Opening knowledge...</p>
        </div>
    );
};
