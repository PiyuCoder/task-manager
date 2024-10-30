import React, { useState } from "react";
import { addCommentToTask } from "../features/tasks/tasksSlice";
import { useDispatch } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";

export default function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(task?.comments || []);
  const dispatch = useDispatch();

  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch(addCommentToTask({ taskId: task._id, text: newComment })).then(
        (action) => {
          if (addCommentToTask.fulfilled.match(action)) {
            console.log(action.payload);
            setComments(action.payload.comments);
          }
        }
      );
      setNewComment("");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex h-screen w-full justify-center items-center z-10 p-1 sm:p-0 ">
        <div className="bg-purple-900 text-white rounded-lg p-6  relative w-full sm:w-1/2 overflow-y-auto h-full shadow-xl scrollbar-custom">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-3xl text-gray-300 hover:text-white transition-colors"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">Task Details</h2>

          {/* Task Details */}
          <div className="bg-purple-800 p-6 rounded-lg mb-6 shadow-lg space-y-4 overflow-hidden">
            <div className=" flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Task Details</h3>
              <div className=" flex items-center justify-center gap-2">
                <MdEdit
                  onClick={() => onEdit(task)}
                  className=" hover:text-gray-300 cursor-pointer"
                />
                <MdDelete
                  onClick={() => onDelete(task?._id)}
                  className=" hover:text-gray-300 cursor-pointer"
                />
              </div>
            </div>

            <div className="text-gray-300">
              <div className="mb-4">
                <span className="block text-sm font-bold text-white truncate">
                  Task Name
                </span>
                <p className="text-lg whitespace-pre-line">{task.taskName}</p>
              </div>

              <div className="mb-4">
                <span className="block text-sm font-bold text-white">
                  Description
                </span>
                <p className="text-md whitespace-pre-line">
                  {task.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-bold text-white">
                    Priority
                  </span>
                  <p
                    className={`capitalize inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-600"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {task.priority}
                  </p>
                </div>

                <div>
                  <span className="block text-sm font-bold text-white">
                    Status
                  </span>
                  <p
                    className={`${
                      task.status === "to-do"
                        ? "bg-yellow-500"
                        : task.status === "in-progress"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    } inline-block px-3 py-1 capitalize rounded-full text-xs font-semibold text-white`}
                  >
                    {task.status}
                  </p>
                </div>

                <div>
                  <span className="block text-sm font-bold text-white">
                    Due Date
                  </span>
                  <p>{new Date(task.dueDate).toLocaleDateString()}</p>
                </div>

                <div>
                  <span className="block text-sm font-bold text-white ">
                    Assigned To
                  </span>
                  <p className="truncate">
                    {task.assignee?.name} ({task.assignee?.email})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6 bg-purple-800 p-6 rounded-lg shadow-lg scrollbar-custom">
            <h3 className="font-semibold text-xl mb-4 text-white">Comments</h3>
            <ul className="max-h-40 overflow-y-auto mb-4 border-b border-gray-600 pb-4 space-y-3">
              {comments?.map((comment, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 text-gray-200 shadow-md border border-purple-700 p-2 rounded-lg"
                >
                  <div className="bg-purple-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
                    {comment?.createdBy?.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">
                        {comment?.createdBy?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment?.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment?.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Add Comment Section */}
            <div className="flex mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="border-none rounded-l p-2 w-full bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={handleAddComment}
                className="bg-purple-600 text-white px-4 rounded-r hover:bg-purple-500 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
