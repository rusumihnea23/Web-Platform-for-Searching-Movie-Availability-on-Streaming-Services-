import { useState, useEffect } from "react";
import { getUserDetails, updateFirstName, updateLastName,updateUsername } from "../../../Actions/UserActions";
import ProfileField from "./ProfileFIeld";
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function SettingsTab() {
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "", profilePicturePath: "" });

  useEffect(() => { getUserDetails().then(setUser); }, []);

  const handleChange = (e) => setUser(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (field) => {
    try {
      if (field === "firstName") await updateFirstName(user.firstName);
      if (field === "lastName") await updateLastName(user.lastName);
      if (field === "username") await updateUsername(user.username);
    } catch (err) { 
      console.error("Update failed:", err); 
    }
  };

  return (
    <div className="flex flex-col items-center py-6 sm:py-10 gap-6 sm:gap-8">
      
      {/* Responsive Avatar: Uses image if available, falls back to UserCircleIcon */}
      {user.profilePicturePath ? (
        <img src={user.profilePicturePath} alt="Profile" className="size-24 sm:size-32 rounded-full object-cover ring-2 ring-sky-500 shadow-lg" />
      ) : (
        <UserCircleIcon className="size-24 sm:size-32 text-slate-500 rounded-full bg-slate-800 p-2 ring-1 ring-white/10" />
      )}

      {/* Form Container: Max width prevents stretching on desktop, w-full fills mobile */}
      <div className="w-full max-w-md flex flex-col gap-4 sm:gap-6">
        <ProfileField label="Username" name="username" value={user.username} onChange={handleChange} onSave={handleSave} />
        <ProfileField label="First Name" name="firstName" value={user.firstName} onChange={handleChange} onSave={handleSave} />
        <ProfileField label="Last Name" name="lastName" value={user.lastName} onChange={handleChange} onSave={handleSave} />
        <ProfileField label="Email Address" name="email" value={user.email} readOnly />
      </div>
      
    </div>
  );
}