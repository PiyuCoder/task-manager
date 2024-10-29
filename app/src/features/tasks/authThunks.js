import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/axios";

//Signup thunk
export const signupUser = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/users/signup", userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to sign up. Please try again later.");
    }
  }
);

// Login thunk
export const loginUser = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/users/login", loginData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to login. Please check your credentials.");
    }
  }
);
