import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/tasks/authThunks";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = ({ setSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    if (formData.password !== formData.confirmPassword) {
      setMsg("Passwords don't match.");
      return;
    }
    dispatch(signupUser(formData)).then((action) => {
      if (signupUser.fulfilled.match(action)) {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 1300);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" bg-slate-200 m-5 w-full sm:w-96 flex flex-col p-8 gap-7 rounded-lg shadow-lg"
    >
      <h1 className=" text-center font-bold text-purple-500 text-xl">
        Signup here
      </h1>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className=" p-4 rounded-md outline-purple-500"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className=" p-4 rounded-md outline-purple-500"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className=" p-4 rounded-md outline-purple-500"
      />
      <input
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
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
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        {error && <p className=" text-red-500">{error}</p>}
        {msg && <p className=" text-red-500">{msg}</p>}
      </div>
      <p className=" text-sm text-gray-500">
        Already have an account?{" "}
        <Link to={"/login"} className=" text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
