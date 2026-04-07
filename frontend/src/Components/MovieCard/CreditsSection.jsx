import { useState } from "react";

export default function CreditsSection({ cast, crew }) {
  const [activeTab, setActiveTab] = useState("cast");
  const members = activeTab === "cast" ? cast : crew;

  return (
    <div className="mt-8">
      <div className="flex gap-4 mb-6 border-b border-slate-800 pb-4">
        {["cast", "crew"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full capitalize transition-all font-medium ${
              activeTab === tab ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-400 cursor-pointer"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {members?.map((person, index) => (
          <div key={index} className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-full hover:scale-105 transition-transform">
            <span className="text-sm font-medium">{person.name}</span>
            <span className="text-xs text-pink-500 ml-2 opacity-80">
              {activeTab === "cast" ? person.character : person.job}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}