import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/tasks/authThunks";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginData)).then((action) => {
      if (loginUser.fulfilled.match(action)) {
        setLoginData({
          email: "",
          password: "",
        });
        navigate("/dashboard");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" bg-slate-200 m-5 w-full sm:w-96 flex flex-col p-8 gap-7 mx-auto rounded-lg shadow-lg"
    >
      <h1 className=" text-center font-bold text-purple-500 text-xl">
        Login here
      </h1>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={loginData.email}
        onChange={handleChange}
        required
        className=" p-4 rounded-md outline-purple-500"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={loginData.password}
        onChange={handleChange}
        required
        className=" p-4 rounded-md outline-purple-500"
      />
      <div>
        <button
          className=" w-full p-4 bg-purple-500 rounded-lg text-white font-semibold hover:bg-purple-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
      <p className=" text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to={"/signup"} className=" text-blue-500 hover:underline">
          Signup
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
