import React from 'react';

const Button = ({ children, onClick, variant = "primary", disabled = false, className = "", type = "button", style = {} }) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200";
      case "secondary":
        return "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200";
      case "outline":
        return "border-2 border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm";
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200";
      case "admin":
        return "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200";
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 ${getVariantStyle()} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;