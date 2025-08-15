import React from "react";

const Spinner = ({
  size = "md",
  color = "blue-500",
  thickness = "2",
  className = "",
}) => {
  // Size classes
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  // Border thickness classes
  const borderClasses = {
    1: "border",
    2: "border-2",
    3: "border-[3px]",
    4: "border-4",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className={`inline-block ${sizeClasses[size]} animate-spin rounded-full ${borderClasses[thickness]} border-solid border-${color} border-t-transparent ${className}`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
