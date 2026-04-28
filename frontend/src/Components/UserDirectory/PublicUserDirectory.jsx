import React from "react";
import {useUsers} from "./useUsers";  
import UserListBase from "./UserListBase";     


const PublicUserDirectory = () => {
  const userState = useUsers("top");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <UserListBase 
        userState={userState} 
        title="Our Communiy's Top Users" 
      />
    </div>
  );
};

export default PublicUserDirectory;