import React from "react";

function VideoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      fill="none"
      viewBox="0 0 25 24"
      className={className}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M22.5 8.931c0-.605 0-.908-.12-1.049a.5.5 0 00-.42-.173c-.183.014-.397.228-.826.657L17.5 12l3.634 3.634c.429.429.643.643.827.657a.5.5 0 00.42-.173c.119-.14.119-.444.119-1.05V8.932zM2.5 9.8c0-1.68 0-2.52.327-3.162a3 3 0 011.311-1.311C4.78 5 5.62 5 7.3 5h5.4c1.68 0 2.52 0 3.162.327a3 3 0 011.311 1.311c.327.642.327 1.482.327 3.162v4.4c0 1.68 0 2.52-.327 3.162a3 3 0 01-1.311 1.311C15.22 19 14.38 19 12.7 19H7.3c-1.68 0-2.52 0-3.162-.327a3 3 0 01-1.311-1.311C2.5 16.72 2.5 15.88 2.5 14.2V9.8z"
      ></path>
    </svg>
  );
}

export default VideoIcon;
