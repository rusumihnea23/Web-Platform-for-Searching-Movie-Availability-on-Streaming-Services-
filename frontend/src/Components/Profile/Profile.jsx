import { useState } from "react";
import SettingsTab from "./SettingsTab";
import LoggedMoviesTab from "./LoggedMoviesTab";
import WatchlistTab from "./WatchlistTab";
const baseStyle = "cursor-pointer rounded-md px-3 py-2 text-sm font-medium";

const activeStyle = "text-blue-500 border-b-2 border-blue-500";

const inactiveStyle = "text-gray-300 hover:bg-white/5 hover:text-white";
const tabs = [
  
  { id: "logged", label: "Logged Movies", component: <LoggedMoviesTab /> },
  { id: "watchlist", label: "Watchlist", component: <WatchlistTab /> },
  { id: "settings", label: "Settings", component: <SettingsTab /> },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("logged");

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="w-full h-screen flex flex-col items-center">
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {tabs.map(tab => (
        <button
  key={tab.id}
  onClick={() => setActiveTab(tab.id)}
  className={`${baseStyle} ${
    activeTab === tab.id ? activeStyle : inactiveStyle
  }`}
>
  
          
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full flex justify-center">
        {activeComponent}
      </div>
    </div>
  );
}