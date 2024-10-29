import React, { useState, useEffect } from "react";
import { axiosInstance } from "../api/axios";

const UserSearch = ({ onUserSelect, selectedTask, editing }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    // Display the current assignee's name and email in editing mode
    if (editing && selectedTask?.assignee) {
      setSelectedUser(
        `${selectedTask.assignee.name} (${selectedTask.assignee.email})`
      );
    }
  }, [editing, selectedTask]);

  // Debouncing logic to reduce API calls while typing
  useEffect(() => {
    if (!query) return;

    const handler = setTimeout(() => {
      fetchUsers(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const fetchUsers = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/users/searchUser?search=${searchQuery}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setQuery("");
    setSelectedUser(`${user.name} (${user.email})`);
    onUserSelect(user._id);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedUser(""); // Clear selected user display when typing new input
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a user..."
        value={query || selectedUser}
        onChange={handleInputChange}
        className="border p-2 w-full mb-2 truncate"
      />
      {loading && <p>Loading...</p>}
      {users.length > 0 && query && (
        <ul className="border max-h-60 overflow-auto">
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className="p-2 hover:bg-gray-200 cursor-pointer flex flex-col font-semibold text-sm"
            >
              {user.name}
              <span className="text-xs font-thin">{user.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
