import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, createTask, updateTask } from "../features/tasks/tasksSlice"; // Adjust the path based on your structure
import UserSearch from "./UserSearch";
import { IoIosClose } from "react-icons/io";
import Loader from "./Loader";

const TaskForm = ({
  setIsCreatingTask,
  editing,
  setIsEditingTask,
  selectedTask,
  setSelectedTask,
}) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("to-do");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  console.log(selectedTask);

  useEffect(() => {
    if (editing) {
      setTaskName(selectedTask?.taskName);
      setDescription(selectedTask?.description);
      setAssignee(selectedTask?.assignee);
      setPriority(selectedTask?.priority);
      setStatus(selectedTask?.status);
      setDueDate(selectedTask?.dueDate?.split("T")[0]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let newTask = {
      taskName,
      description,
      assignee,
      priority,
      status,
      dueDate,
    };

    if (!editing) dispatch(createTask(newTask));
    else {
      newTask["taskId"] = selectedTask._id;
      dispatch(updateTask(newTask)).then((action) => {
        if (updateTask.fulfilled.match(action)) {
          // console.log(action.payload);
          setSelectedTask(action.payload.updatedTask);
        }
      });
    }
    // Clear form fields
    setTaskName("");
    setDescription("");
    setAssignee("");
    setPriority("medium");
    setStatus("to-do");
    editing ? setIsEditingTask(false) : setIsCreatingTask(false);
    setLoading(false);
  };

  const onUserSelect = (assigneeId) => {
    setAssignee(assigneeId);
  };

  return (
    <div className="w-full h-full fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
      {loading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow w-96 relative"
      >
        <h2 className="text-lg font-bold mb-4">
          {editing ? "Edit Task" : "Add New Task"}
        </h2>
        <IoIosClose
          onClick={() =>
            editing ? setIsEditingTask(false) : setIsCreatingTask(false)
          }
          className="absolute top-2 right-2 text-3xl cursor-pointer hover:text-purple-800"
        />
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <UserSearch
          onUserSelect={onUserSelect}
          editing={editing}
          selectedTask={selectedTask}
        />
        <input
          type="date"
          placeholder="Due date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full mb-4"
        >
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          className="bg-purple-500 text-white p-2 rounded w-full"
        >
          {editing ? "Update task" : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
