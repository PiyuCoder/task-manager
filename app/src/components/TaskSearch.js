import React, { useState, useEffect } from "react";
import { axiosInstance } from "../api/axios";

const TaskSearch = () => {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/tasks/search`, {
        params: { search: searchQuery },
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) {
        fetchTasks(query);
      } else {
        setTasks([]); // Clear tasks if query is empty
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className=" relative h-20 mt-4 p-4 w-96 bg-purple-800 rounded-lg shadow-lg">
      {/* <h2 className="text-lg font-semibold text-white mb-3">Search Tasks</h2> */}
      <input
        type="text"
        placeholder="Search tasks by name, description..."
        value={query}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-800"
      />
      {loading && <p className="text-white ">Searching...</p>}
      <ul className="mt-4 max-h-64 overflow-y-auto absolute scrollbar-custom">
        {tasks.length === 0 && query && !loading && (
          <li className="text-gray-400 mt-4">No tasks found.</li>
        )}
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-3 mb-2 w-64 cursor-pointer bg-gray-700 rounded-lg shadow-sm text-white hover:bg-gray-600 transition-all"
          >
            <h3 className="font-semibold">{task.taskName}</h3>
            <p className="text-sm text-gray-300">{task.description}</p>
            <p className="text-xs text-gray-400">Priority: {task.priority}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskSearch;
