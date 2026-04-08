import { useState } from "react";
import SettingsTab from "./SettingsTab";
import LoggedMoviesTab from "./LoggedMoviesTab";
import WatchlistTab from "./WatchlistTab";
import ListsTab from "./ListsTab"; // New import
import ReviewsTab from "./ReviewsTab";

const baseStyle = "cursor-pointer rounded-md px-3 py-2 text-sm font-medium";
const activeStyle = "text-blue-500 border-b-2 border-blue-500";
const inactiveStyle = "text-gray-300 hover:bg-white/5 hover:text-white";

const tabs = [
  { id: "logged", label: "Logged Movies", component: <LoggedMoviesTab /> },
  { id: "watchlist", label: "Watchlist", component: <WatchlistTab /> },
  { id: "lists", label: "My Lists", component: <ListsTab /> }, 
  { id: "reviews", label: "My Reviews", component: <ReviewsTab /> },
  { id: "settings", label: "Settings", component: <SettingsTab /> },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("logged");
  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 pb-20">
      <div className="flex gap-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${baseStyle} ${activeTab === tab.id ? activeStyle : inactiveStyle}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl">
        {activeComponent}
      </div>
    </div>
  );
}