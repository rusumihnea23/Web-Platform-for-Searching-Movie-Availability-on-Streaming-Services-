import React from "react";
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteUser } from "../../Actions/GeneralAdminDashboardActions";
import { useUsers } from "../../Hooks/useUsers";
import UserList from "./UserList";

const AdminUserManagement = () => {
  const userState = useUsers();

  const handleDelete = async (id) => {
    if (window.confirm("Delete user?")) {
      try { 
        await deleteUser(id); 
        userState.refresh(); // Refresh list after delete
      } catch { 
        alert("Error deleting user"); 
      }
    }
  };

  return (
    <UserList 
      userState={userState}
      title="Admin Management"
      isAdmin={true}
      renderActions={(user) => (
        <button 
          onClick={() => handleDelete(user.id)} 
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
    />
  );
};

export default AdminUserManagement;