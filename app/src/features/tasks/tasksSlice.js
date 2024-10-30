import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/axios";
import { logout } from "./userSlice";

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/tasks`, taskData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/tasks/${taskData.taskId}`,
        taskData
      );
      return { id: taskData.taskId, updatedTask: response.data.task };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/tasks/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

export const addCommentToTask = createAsyncThunk(
  "tasks/addCommentToTask",
  async ({ taskId, text }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/tasks/${taskId}/comments`,
        { text }
      );
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/tasks/${taskId}`);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const initialState = {
  tasks: [],
  status: "idle",
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.tasks = [];
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        // console.log(action.payload);
        const { id, updatedTask } = action.payload;
        const taskIndex = state.tasks.findIndex((task) => task._id === id);
        if (taskIndex >= 0) {
          state.tasks[taskIndex] = {
            ...state.tasks[taskIndex],
            ...updatedTask,
          };
        }
      })
      .addCase(addCommentToTask.fulfilled, (state, action) => {
        // console.log(action.payload);
        const { _id, comments } = action.payload;
        const taskIndex = state.tasks.findIndex((task) => task._id === _id);
        if (taskIndex >= 0) {
          state.tasks[taskIndex].comments = comments;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task?._id !== action.payload
        );
      });
  },
});

export default tasksSlice.reducer;
