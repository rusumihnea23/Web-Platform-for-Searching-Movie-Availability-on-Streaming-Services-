import React from 'react';

export default function ProfileField({ 
  label, 
  name, 
  value, 
  onChange, 
  readOnly = false,
  onSave 
}) {
  return (
    <div className="flex flex-col gap-1 w-full max-w-md">
      
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
        {label}
      </label>
      
      <div className="flex items-center gap-2">
        <input
          name={name}
          type="text"
          value={value || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full px-4 py-2 rounded-lg border transition-all outline-none
            ${readOnly 
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
              : "bg-white border-gray-300 focus:ring-2 focus:ring-slate-800 focus:border-transparent"
            }`}
        />
        
        {!readOnly && (
          <button 
            onClick={() => onSave?.(name)}
            className="cursor-pointer rounded-md bg-slate-800 py-2 px-4 text-sm text-white transition-all shadow-sm hover:bg-slate-700 active:scale-95"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}