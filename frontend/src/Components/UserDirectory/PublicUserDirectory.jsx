import React from "react";
import {useUsers} from "../../Hooks/useUsers";  
import UserList from "./UserList";     


const PublicUserDirectory = () => {
  const userState = useUsers("top");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <UserList 
        userState={userState} 
        title="Our Communiy's Top Users" 
      />
    </div>
  );
};

export default PublicUserDirectory;