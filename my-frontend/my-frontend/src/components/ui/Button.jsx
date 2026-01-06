import React from 'react';

const Button = ({ children, onClick, variant = "primary", disabled = false, className = "", type = "button" }) => {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200",
    secondary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200",
    outline: "border-2 border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200",
    admin: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;