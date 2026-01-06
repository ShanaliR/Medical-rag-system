import React from 'react';

const Card = ({ children, title, subtitle, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full ${className}`}>
    {(title || subtitle) && (
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
        {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default Card;