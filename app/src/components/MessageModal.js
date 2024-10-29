import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function MessageModal({ heading, message }) {
  return (
    <div className=" w-screen h-screen fixed flex items-center justify-center bg-black bg-opacity-50">
      <div className=" w-96 h-44  p-7 m-5 rounded-lg shadow-lg bg-white text-center flex flex-col items-center justify-center">
        <h1 className={`font-bold text-lg text-green-500`}>{heading}</h1>
        <p>{message}</p>
        <FaCheckCircle className={`text-green-500 text-center text-2xl mt-4`} />
      </div>
    </div>
  );
}
