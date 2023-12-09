import React from "react";

function WickycdLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="298"
      height="251"
      fill="none"
      viewBox="0 0 298 251"
      className={className}
    >
      <path
        fill="#000"
        d="M146.022 8.985c.95-2.866 5.006-2.866 5.956 0l15.864 47.874a78.421 78.421 0 0049.772 49.772l47.874 15.865c2.867.95 2.867 5.005 0 5.955l-47.874 15.865a78.422 78.422 0 00-49.772 49.772l-15.864 47.874c-.95 2.867-5.006 2.867-5.956 0l-15.864-47.874a78.422 78.422 0 00-49.772-49.772l-47.874-15.865c-2.867-.95-2.867-5.005 0-5.955l47.874-15.865a78.421 78.421 0 0049.772-49.772l15.864-47.874z"
      ></path>
      <path
        fill="#000"
        d="M298 129.395c0 36.814-66.71 66.658-149 66.658S0 166.209 0 129.395s66.71-66.658 149-66.658 149 29.844 149 66.658zm-271.876 0c0 30.359 55.013 54.971 122.876 54.971s122.876-24.612 122.876-54.971c0-30.36-55.013-54.971-122.876-54.971S26.124 99.035 26.124 129.395z"
      ></path>
    </svg>
  );
}

export default WickycdLogo;