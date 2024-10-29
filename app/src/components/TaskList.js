import React from "react";
import { useSelector } from "react-redux";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.tasks);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border-b py-2">
            <p>{task.taskName}</p>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
