import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";
import userReducer from "../features/tasks/userSlice";

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    user: userReducer,
  },
});

export default store;
