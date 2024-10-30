import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { differenceInDays, parseISO } from "date-fns";
import { deleteTask, fetchTasks } from "../features/tasks/tasksSlice";
import Loader from "../components/Loader";
import TaskForm from "../components/TaskForm";
import ActionMenu from "../components/ActionMenu";
import TaskDetailsModal from "../components/TaskDetailsModal";
import { logout } from "../features/tasks/userSlice";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import TaskSearch from "../components/TaskSearch";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks(user?._id)).then((action) => {
      if (fetchTasks.fulfilled.match(action)) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [dispatch]);

  const filteredTasks = tasks?.filter((task) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesQuery =
      task.taskName.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      task.assignee?.name.toLowerCase().includes(lowerQuery);

    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter
      ? task.priority === priorityFilter
      : true;

    const matchesDueDate = dueDateFilter
      ? new Date(task.dueDate).toLocaleDateString() ===
        new Date(dueDateFilter).toLocaleDateString()
      : true;

    return matchesQuery && matchesStatus && matchesPriority && matchesDueDate;
  });
  // Filter tasks with due dates within the next 2 days
  const upcomingTasks = useMemo(() => {
    const today = new Date();
    return tasks.filter((task) => {
      const dueDate = parseISO(task.dueDate);
      const daysLeft = differenceInDays(dueDate, today);
      return daysLeft <= 2 && daysLeft >= 0;
    });
  }, [tasks]);

  const isExpired = (dueDate) => {
    const today = new Date();
    const daysLeft = differenceInDays(dueDate, today);
    return daysLeft <= 0;
  };

  // Handle edit and delete actions
  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditingTask(true);
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = (taskId) => {
    setSelectedTaskId(taskId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setLoading(true);
    dispatch(deleteTask(selectedTaskId));
    setSelectedTaskId("");
    setDeleteModalOpen(false);
    if (selectedTask) {
      setSelectedTask(null);
    }
    setLoading(false);
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className=" w-full h-full py-8 p-2 md:p-8">
      {!loading && (
        <div className=" flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold ">
            Hi, {user?.name?.split(" ")[0]}!
          </h1>

          <IoPowerSharp
            className=" text-2xl text-red-500 hover:text-red-700 cursor-pointer"
            onClick={logoutHandler}
          />
          {/* <TaskSearch /> */}
        </div>
      )}

      {isCreatingTask && <TaskForm setIsCreatingTask={setIsCreatingTask} />}
      {isEditingTask && (
        <TaskForm
          editing
          setSelectedTask={setSelectedTask}
          selectedTask={selectedTask}
          setIsEditingTask={setIsEditingTask}
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="flex w-full lg:gap-9">
          <div className=" w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-700">
                Task List
              </h2>
              <button
                onClick={() => setIsCreatingTask(true)}
                className="bg-purple-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-purple-600 transition duration-300"
              >
                Add Task <span className=" font-bold text-lg">+</span>
              </button>
            </div>
            <div className=" w-full ">
              <div className=" flex lg:items-center  justify-between flex-col-reverse lg:flex-row  gap-2">
                <input
                  type="text"
                  placeholder="Search tasks by name, description, or assignee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded p-2 w-full sm:w-96  mb-4 outline-purple-500"
                />
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <div>
                    <label className=" text-xs sm:text-sm">Due Date: </label>
                    <input
                      type="date"
                      value={dueDateFilter}
                      onChange={(e) => setDueDateFilter(e.target.value)}
                      className="border rounded p-2 mb-4 outline-purple-500 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm">Status: </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border rounded p-2 mb-4 outline-purple-500 text-xs sm:text-sm"
                    >
                      <option value="">All</option>
                      <option value="to-do">To-Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm">Priority: </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="border rounded p-2 mb-4 text-xs sm:text-sm"
                    >
                      <option value="">All</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-3 h-8 gap-2">
                {/* <label>Filters:</label> */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs bg-gray-200 text-gray-700 rounded px-2 py-1 hover:bg-gray-300"
                  >
                    Clear Search
                  </button>
                )}
                {statusFilter && (
                  <button
                    onClick={() => setStatusFilter("")}
                    className="text-xs bg-gray-200 text-gray-700 rounded px-2 py-1 hover:bg-gray-300"
                  >
                    Clear Status
                  </button>
                )}
                {priorityFilter && (
                  <button
                    onClick={() => setPriorityFilter("")}
                    className="text-xs bg-gray-200 text-gray-700 rounded px-2 py-1 hover:bg-gray-300"
                  >
                    Clear Priority
                  </button>
                )}
                {dueDateFilter && (
                  <button
                    onClick={() => setDueDateFilter("")}
                    className="text-xs bg-gray-200 text-gray-700 rounded px-2 py-1 hover:bg-gray-300"
                  >
                    Clear Due Date
                  </button>
                )}
              </div>
            </div>
            <div className=" overflow-x-auto min-h-screen w-full">
              <table className="w-full border-collapse rounded-lg  shadow-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-sm font-semibold">
                    <th className="border-b border-gray-300 px-4 py-3 text-left">
                      Task Name
                    </th>
                    <th className="border-b border-gray-300 px-4 py-3 text-left">
                      Description
                    </th>
                    <th className="border-b border-gray-300 px-4 py-3 text-center">
                      Priority
                    </th>
                    <th className="border-b border-gray-300 px-4 py-3 text-center">
                      Due Date
                    </th>
                    <th className="border-b border-gray-300 px-4 py-3 text-center">
                      Status
                    </th>
                    <th className="border-b border-gray-300 px-4 py-3 text-center">
                      Assigned To
                    </th>
                    <th className="border-b border-gray-300 px-4 py-3 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredTasks?.map((task, index) => (
                    <tr
                      key={task._id}
                      className={`text-gray-600 text-sm  ${
                        isExpired(task?.dueDate)
                          ? "bg-red-300"
                          : " hover:bg-gray-100"
                      } ${index % 2 === 0 ? "bg-gray-50" : ""} `}
                    >
                      <td
                        onClick={() => openModal(task)}
                        className="border-b border-gray-300 px-4 truncate max-w-36 cursor-pointer py-3 font-medium hover:underline"
                      >
                        {task.taskName}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 truncate max-w-36">
                        {task.description}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center capitalize">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-600"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center">
                        {isExpired(task?.dueDate)
                          ? `Overdue`
                          : new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center">
                        <span
                          className={`${
                            task.status === "to-do"
                              ? "bg-yellow-500"
                              : task.status === "in-progress"
                              ? "bg-green-500"
                              : "bg-purple-500"
                          } inline-block px-2 py-1 capitalize rounded-full text-xs font-semibold text-white`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td
                        title={task.assignee?.email}
                        className="border-b border-gray-300 px-4 py-3 text-center cursor-pointer"
                      >
                        <div className=" flex items-center justify-center gap-1">
                          <span className="border-2 border-purple-500 rounded-full h-5 w-5 flex items-center justify-center text-xs font-semibold bg-orange-400 text-purple-600">
                            {task.assignee?.name[0]}
                          </span>
                          {task.assignee?.name || "N/A"}
                        </div>
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center">
                        <ActionMenu
                          onView={() => openModal(task)}
                          onEdit={() => handleEdit(task)}
                          onDelete={() => handleDelete(task._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-96 hidden xl:block h-[500px] border rounded-lg shadow-lg bg-white p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Upcoming Deadlines (Next 2 Days)
            </h3>
            {upcomingTasks.length > 0 ? (
              <ul className="space-y-3">
                {upcomingTasks.map((task) => (
                  <li
                    onClick={() => openModal(task)}
                    key={task._id}
                    className="p-3 border rounded-lg shadow-sm bg-gray-50 cursor-pointer hover:bg-gray-100"
                  >
                    <p className="text-md font-medium text-gray-700">
                      {task.taskName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-2 py-1 px-2 capitalize rounded-full text-xs font-semibold ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">
                No tasks due within the next 2 days.
              </p>
            )}
          </div>
        </div>
      )}
      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={closeModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
