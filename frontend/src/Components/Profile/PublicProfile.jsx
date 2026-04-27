import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../../Actions/UserActions";
import { UserCircleIcon } from "@heroicons/react/24/outline";

// Reuse the exact same tab components — just pass userId to flip them to public mode
import LoggedMoviesTab from "./Tabs/LoggedMoviesTab";
import WatchlistTab from "./Tabs/WatchlistTab";
import ListsTab from "./Tabs/ListsTab/ListsTab";
import ReviewsTab from "./Tabs/ReviewsTab";

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("logged");

  useEffect(() => {
    if (!username) return;
    const fetch = async () => {
      setLoading(true);
      const data = await getPublicProfile(username);
      data ? setProfile(data) : setError("User not found.");
      setLoading(false);
    };
    fetch();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-sky-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">{error || "Profile not found."}</p>
      </div>
    );
  }

  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    profile.username;

  // Same tab structure as Profile.jsx — no Settings tab, userId passed to each
  const tabs = [
    { id: "logged",    label: "Logged Movies", component: <LoggedMoviesTab userId={profile.id} /> },
    { id: "watchlist", label: "Watchlist",      component: <WatchlistTab   userId={profile.id} /> },
    { id: "lists",     label: "Lists",          component: <ListsTab       userId={profile.id} /> },
    { id: "reviews",   label: "Reviews",        component: <ReviewsTab     userId={profile.id} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">

        <div className="border-l-4 border-sky-500 pl-4 mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Public Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Viewing @{username}</p>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-8 bg-slate-800/40 p-5 rounded-2xl border border-white/5">
          {profile.profilePicturePath ? (
            <img
              src={profile.profilePicturePath}
              alt={displayName}
              className="size-20 rounded-full object-cover ring-2 ring-sky-500 shadow-lg shrink-0"
            />
          ) : (
            <UserCircleIcon className="size-20 text-slate-500 bg-slate-800 p-2 rounded-full ring-1 ring-white/10 shrink-0" />
          )}
          <div>
            <p className="text-2xl font-bold">{displayName}</p>
            <p className="text-gray-400 text-sm mt-0.5">@{profile.username}</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="border-b border-white/10 mb-6 sm:mb-8 w-full">
          <div className="flex overflow-x-auto w-full gap-2 pb-[1px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {tabs.map((t) => (
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

        {/* Tab content */}
        <div className="bg-slate-900/50 p-4 sm:p-6 rounded-2xl backdrop-blur-sm border border-white/5 min-h-[50vh]">
          {tabs.find((t) => t.id === active)?.component}
        </div>

      </div>
    </div>
  );
}
