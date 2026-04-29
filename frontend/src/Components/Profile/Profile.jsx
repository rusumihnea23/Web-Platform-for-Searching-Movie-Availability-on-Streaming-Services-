import { useState } from "react";
import SettingsTab from "./Tabs/SettingsTab";
import LoggedMoviesTab from "./Tabs/LoggedMoviesTab";
import WatchlistTab from "./Tabs/WatchlistTab";
import ListsTab from "./Tabs/ListsTab/ListsTab"; 
import ReviewsTab from "./Tabs/ReviewsTab";
import LikedListsTab from "./Tabs/ListsTab/LikedListsTab"; // same folder as ListsTab

const tabs = [
  { id: "logged",      label: "Logged Movies", component: <LoggedMoviesTab /> },
  { id: "watchlist",   label: "Watchlist",      component: <WatchlistTab /> },
  { id: "lists",       label: "Lists",          component: <ListsTab /> },
  { id: "liked-lists", label: "Liked Lists",    component: <LikedListsTab /> }, // 👈
  { id: "reviews",     label: "Reviews",        component: <ReviewsTab /> },
  { id: "settings",    label: "Settings",       component: <SettingsTab /> },
];

export default function Profile() {
  const [active, setActive] = useState("logged");

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        
        <div className="border-l-4 border-sky-500 pl-4 mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your activity, lists, and settings</p>
        </div>

        {/* Added w-full to container, ensuring it bounds the scroll area properly */}
        <div className="border-b border-white/10 mb-6 sm:mb-8 w-full">
          <div className="flex overflow-x-auto w-full gap-2 pb-[1px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
     
                className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 rounded-t-md cursor-pointer ${
                  active === t.id
                    ? "text-sky-400 border-sky-400 bg-sky-900/20"
                    : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 p-4 sm:p-6 rounded-2xl backdrop-blur-sm border border-white/5 min-h-[50vh]">
          {tabs.find(t => t.id === active)?.component}
        </div>

      </div>
    </div>
  );
}