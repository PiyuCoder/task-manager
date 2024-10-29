import React, { useState } from "react";
import SignupForm from "../components/SignupForm";
import MessageModal from "../components/MessageModal";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

export default function SignUp() {
  const [success, setSuccess] = useState(false);
  const { loading } = useSelector((state) => state.user);
  return (
    <div className=" w-full h-full flex items-center justify-center">
      {success && (
        <MessageModal
          heading="Registered Successfully"
          message=""
          color="green"
        />
      )}
      {loading && <Loader />}
      <SignupForm setSuccess={setSuccess} />
    </div>
  );
}
