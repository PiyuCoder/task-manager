import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { token } = useSelector((state) => state.user);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-400 to-purple-600 text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Welcome to TaskManager</h1>
        <p className="mt-4 text-lg">
          Your ultimate task management tool to organize, prioritize, and
          achieve more.
        </p>
      </header>

      <div className="flex flex-col md:flex-row md:space-x-4">
        <Link to={token ? `/dashboard` : "/login"}>
          <button className="bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-purple-200 transition duration-300">
            Get Started
          </button>
        </Link>
      </div>

      <footer className="absolute bottom-5 text-center text-sm">
        <p>© 2024 TaskManager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
