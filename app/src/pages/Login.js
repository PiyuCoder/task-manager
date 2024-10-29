import React from "react";
import LoginForm from "../components/LoginForm";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

export default function Login() {
  const { loading } = useSelector((state) => state.user);
  return (
    <div className=" w-full h-full flex items-center justify-center">
      {loading && <Loader />}
      <div>
        <Link to={"/"} className=" text-purple-600 font-bold text-3xl px-5">
          <span className="text-lime-500">Task</span>Manager
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
