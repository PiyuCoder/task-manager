const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { taskName, description, priority, dueDate, status, assignee } =
    req.body;

  console.log(taskName, description, priority, dueDate, status, assignee);

  try {
    const newTask = new Task({
      taskName,
      description,
      priority,
      status,
      assignee,
      dueDate,
      createdBy: req.user.id,
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask?._id)
      .populate({
        path: "assignee",
        select: "name email",
      })
      .populate({
        path: "createdBy",
        select: "name email",
      });
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.fetchTasks = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    // Fetch tasks assigned to the user or created by the user
    const tasks = await Task.find({
      $or: [{ assignee: userId }, { createdBy: userId }],
    })
      .populate({
        path: "assignee",
        select: "name email",
      })
      .populate({
        path: "createdBy",
        select: "name email",
      })
      .populate({
        path: "comments.createdBy",
        select: "name email",
      })
      .exec();

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this user." });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskName, description, priority, dueDate, status, assignee } =
      req.body;
    const { taskId } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        taskName,
        description,
        priority,
        dueDate,
        status,
        assignee,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(400).json({ message: "Task not found" });
    }

    const populatedTask = await Task.findById(taskId)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .populate({
        path: "comments.createdBy",
        select: "name email",
      });

    return res.status(200).json({
      success: true,
      message: "Updated task successfully",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Add the new comment
    task.comments.push({ text, createdBy: userId });
    await task.save();

    // Now populate the comments
    const updatedTask = await Task.findById(taskId).populate({
      path: "comments.createdBy",
      select: "name email",
    });

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.searchTask = async (req, res) => {
  try {
    const { search } = req.query;
    const tasks = await Task.find({
      $or: [
        { taskName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
