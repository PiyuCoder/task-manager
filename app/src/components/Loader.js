import React from "react";
import { ImSpinner8 } from "react-icons/im";

export default function Loader() {
  return (
    <div className=" w-screen h-screen fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <ImSpinner8 className=" animate-spin text-4xl sm:text-5xl text-purple-900 " />
    </div>
  );
}
